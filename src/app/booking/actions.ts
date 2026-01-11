"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateBookingPrice } from "@/lib/pricing";
import { bookingSchema } from "@/schemas/booking";
import { addMinutes } from "date-fns";
import { content } from "@/constants/content";
import crypto from "crypto";

// Helper to Hash Contact (HMAC)
function hashContact(contact: string) {
  const secret = process.env.CONTACT_PEPPER || "default-pepper-secret"; // User should set this env
  return crypto.createHmac("sha256", secret).update(contact).digest("hex");
}

function normalizeContact(contact: string) {
  return contact.replace(/[^0-9]/g, ""); // Remove non-digits
}

export async function calculatePriceAction(formData: any) {
  // Simple wrapper to expose pricing logic to client securely
  // In a real app, validate formData with Zod first
  try {
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const result = calculateBookingPrice({
      checkIn,
      checkOut,
      guests: Number(formData.guests),
      roomId: formData.roomId,
      selectedOptions: formData.selectedOptions || [],
    });
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Direct import for Service Role usage
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";

export async function createPendingBooking(data: any) {
  // 1. Get Current User (for user_id) using standard client
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Initialize Admin Client for INSERT (Bypass RLS)
  const adminClient = createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // 1. Validate Input
  const parsed = bookingSchema.safeParse({
    ...data,
    checkIn: new Date(data.checkIn),
    checkOut: new Date(data.checkOut),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid booking data" };
  }

  const { roomId, checkIn, checkOut, guests, guestName, guestContact, selectedOptions } = parsed.data;

  // 2. Overlap Check (Strict DB constraint exists, but nice to check here too for early exit)
  // const { data: overlaps } = await supabase.from('bookings').select('id')... 
  // Skipping manual overlap check relying on DB Exclusion Constraint handling the error

  // 3. Calculate Final Price (Server Side)
  const priceResult = calculateBookingPrice({
    roomId,
    checkIn,
    checkOut,
    guests,
    selectedOptions: selectedOptions || [],
  });

  // 4. Generate Lookup Code
  const lookupCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  // 5. Insert PENDING Booking (using adminClient)
  const { data: booking, error } = await adminClient.from("bookings").insert({ // user_id handling added
    user_id: user?.id || null, // Link to user if logged in
    room_id: roomId,
    check_in: checkIn.toISOString(),
    check_out: checkOut.toISOString(),
    nights: priceResult.nights,
    guests,
    status: "PENDING",
    total_amount: priceResult.totalAmount,

    // Guest Info
    lookup_code: lookupCode,
    guest_name: guestName,
    guest_contact_norm: normalizeContact(guestContact),
    guest_contact_hash: hashContact(normalizeContact(guestContact)),

    // Meta
    options_json: selectedOptions ? JSON.stringify(selectedOptions) : "[]",
    quote_breakdown: JSON.stringify(priceResult),

    // 10 minute hold
    expires_at: addMinutes(new Date(), 10).toISOString(),
  }).select().single();

  if (error) {
    console.error("Booking Creation Error:", error);
    if (error.code === '23P01') { // Exclusion violation
      return { success: false, error: "해당 날짜에 이미 예약이 존재합니다." };
    }
    return { success: false, error: error.message || "예약 생성 중 오류가 발생했습니다." };
  }

  return { success: true, bookingId: booking.id, amount: booking.total_amount, lookupCode };
}

export async function getBookingForPayment(bookingId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, rooms(name)")
    .eq("id", bookingId)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    room_name: data.rooms?.name || "객실",
  };
}
