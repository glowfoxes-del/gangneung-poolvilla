-- Enable UUID extension
create extension if not exists "uuid-ossp";
-- Enable GIST extension for overlap constraints
create extension if not exists btree_gist;

-- --------------------------------------------------------
-- 1. ENUMS
-- --------------------------------------------------------
create type public.user_role as enum ('member', 'admin');
create type public.booking_status as enum ('PENDING', 'CONFIRMED', 'CANCEL_REQUESTED', 'CANCELLED', 'COMPLETED');
create type public.payment_status as enum ('READY', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');
create type public.failure_reason as enum ('USER_CLOSED', 'TIMEOUT', 'GATEWAY_FAILED', 'AMOUNT_MISMATCH');


-- --------------------------------------------------------
-- 2. TABLES
-- --------------------------------------------------------

-- PROFILES
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text, -- patched: nullable
  role public.user_role not null default 'member',
  name text,
  phone text,
  created_at timestamptz default now()
);

-- ROOMS
create table public.rooms (
  id text primary key,
  name text not null,
  base_price integer not null,
  created_at timestamptz default now()
);

-- BOOKINGS
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null,
  room_id text references public.rooms(id) not null,
  
  -- Schedule
  check_in date not null,
  check_out date not null,
  nights integer not null,
  guests integer not null default 2,
  
  -- Status & Money
  status public.booking_status not null default 'PENDING',
  total_amount integer not null,
  
  -- Guest Info
  lookup_code text unique,
  guest_contact_norm text,
  guest_contact_hash text,
  guest_name text,
  
  -- Meta
  options_json jsonb default '{}'::jsonb,
  quote_breakdown jsonb default '{}'::jsonb,
  failure_reason public.failure_reason,
  cancel_reason text, 
  
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- BOOKINGS CONSTRAINTS
alter table public.bookings
  add constraint bookings_date_ok check (check_out > check_in),
  add constraint bookings_nights_ok check (nights = (check_out - check_in)),
  add constraint bookings_guests_ok check (guests >= 1),
  add constraint bookings_amount_ok check (total_amount >= 0),
  add constraint bookings_guest_required check (
    (user_id is null and lookup_code is not null and guest_contact_norm is not null and guest_contact_hash is not null)
    or 
    (user_id is not null)
  );

-- STRICT OVERLAP PREVENTION
alter table public.bookings
add constraint bookings_no_overlap_active
exclude using gist (
  room_id with =,
  daterange(check_in, check_out, '[)') with &&
)
where (status in ('PENDING','CONFIRMED','CANCEL_REQUESTED'));

-- OPTIONAL LOGIC CONSTRAINTS
alter table public.bookings
    add constraint bookings_pending_requires_expires
    check (status <> 'PENDING' or expires_at is not null);


-- PAYMENTS
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) on delete restrict not null,
  
  merchant_uid text unique not null,
  pg_tid text unique,
  
  amount integer not null,
  status public.payment_status not null default 'READY',
  
  refund_reason text,
  refunded_at timestamptz,
  provider_payload jsonb default '{}'::jsonb,
  
  created_at timestamptz default now()
);

-- PAYMENTS CHECK
alter table public.payments
  add constraint payments_amount_ok check (amount >= 0);


-- --------------------------------------------------------
-- 3. HELPER FUNCTIONS & TRIGGERS
-- --------------------------------------------------------

-- 3.1 Admin Check Helper
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- 3.2 New User Handler (Auto-create Profile)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name', 
    'member'
  )
  on conflict (id) do nothing; -- idempotent

  return new;
end;
$$;

-- Trigger to create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- --------------------------------------------------------
-- 4. INDEXES
-- --------------------------------------------------------
create index idx_bookings_active_schedule 
  on public.bookings (room_id, check_in, check_out)
  where status in ('PENDING', 'CONFIRMED', 'CANCEL_REQUESTED');

create index idx_bookings_pending_expires
  on public.bookings (expires_at)
  where status = 'PENDING';

create index idx_bookings_lookup_code on public.bookings (lookup_code);
create index idx_bookings_user_id on public.bookings (user_id);

create index idx_payments_booking_id on public.payments (booking_id);
create index idx_payments_merchant_uid on public.payments (merchant_uid);


-- --------------------------------------------------------
-- 5. PRIVILEGES (Core Security Layer)
-- --------------------------------------------------------

-- 1. Base Revoke (Zero Trust)
revoke all on table public.rooms from anon, authenticated;
revoke all on table public.bookings from anon, authenticated;
revoke all on table public.payments from anon, authenticated;
revoke all on table public.profiles from anon, authenticated;

-- 2. Grant Minimum Necessary
-- ROOMS: Public Read
grant select on table public.rooms to anon, authenticated;

-- PROFILES: Auth Read + Narrow Update
grant select on table public.profiles to authenticated;
grant update (name, phone) on table public.profiles to authenticated;

-- BOOKINGS: Auth Read + Status Update Only (Cancel Request)
-- Note: INSERT is NOT granted. Creating bookings MUST be done via Service Role (Server Action).
grant select on table public.bookings to authenticated;
grant update (status) on table public.bookings to authenticated;

-- PAYMENTS: Auth Read Only
-- Note: Updates/Inserts are Service Role only.
grant select on table public.payments to authenticated;


-- --------------------------------------------------------
-- 6. RLS POLICIES (Row Level Filtering)
-- --------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;

-- [PROFILES]
create policy "Users can view own profile" 
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update using (auth.uid() = id);


-- [ROOMS]
create policy "Rooms are viewable by everyone" 
  on public.rooms for select using (true);


-- [BOOKINGS]
-- 1. Admin Access (Client Side)
create policy "Admins can view all bookings"
  on public.bookings for select
  using (public.is_admin());

create policy "Admins can update booking status"
  on public.bookings for update
  using (public.is_admin());

-- 2. Member Access
create policy "Members can view own bookings" 
  on public.bookings for select 
  using (auth.uid() = user_id);

create policy "Members can request cancellation"
  on public.bookings for update
  using ((select auth.uid()) = user_id and status in ('CONFIRMED'))
  with check (status = 'CANCEL_REQUESTED');


-- [PAYMENTS]
-- 1. Admin Access
create policy "Admins can view all payments"
  on public.payments for select
  using (public.is_admin());

create policy "Admins can update payments"
  on public.payments for update
  using (public.is_admin());

-- 2. Member Access
create policy "Members can view own payments" 
  on public.payments for select 
  using (
    exists (
      select 1 from public.bookings 
      where bookings.id = payments.booking_id 
      and bookings.user_id = auth.uid()
    )
  );


-- --------------------------------------------------------
-- 7. STORAGE
-- --------------------------------------------------------
insert into storage.buckets (id, name, public) 
values 
  ('rooms', 'rooms', true), 
  ('gallery', 'gallery', true),
  ('private_assets', 'private_assets', false) 
on conflict (id) do nothing;

create policy "Public Room Images" 
  on storage.objects for select 
  using ( bucket_id = 'rooms' );
  
create policy "Public Gallery Images" 
  on storage.objects for select 
  using ( bucket_id = 'gallery' );

create policy "Admin can view private assets"
  on storage.objects for select
  using (bucket_id = 'private_assets' and public.is_admin());
