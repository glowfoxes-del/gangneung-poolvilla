"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import crypto from "crypto";

// Helper: Consistent Hash
function hashContact(contact: string) {
    const secret = process.env.CONTACT_PEPPER || "default-pepper-secret";
    return crypto.createHmac("sha256", secret).update(contact.replace(/[^0-9]/g, "")).digest("hex");
}

export async function lookupBookingAction(formData: any) {
    const supabase = await createClient();
    const { lookupCode, contact } = formData;

    if (!lookupCode || !contact) {
        return { success: false, error: "예약 번호와 연락처를 모두 입력해주세요." };
    }

    // 1. Rate Limit Check (Basic) 
    // For production, use Redis or dedicated Rate table.
    // Here we just proceed for MVP.

    // 2. Hash Contact
    const hashedContact = hashContact(contact);

    // 3. Find Booking
    const { data: booking, error } = await supabase
        .from("bookings")
        .select("*, rooms(name), payments(*)")
        .eq("lookup_code", lookupCode.toUpperCase())
        .eq("guest_contact_hash", hashedContact)
        .single();

    if (error || !booking) {
        // Should log failure for rate limiting
        return { success: false, error: "일치하는 예약 정보를 찾을 수 없습니다." };
    }

    // 4. Return Data (Sanitized is better, but this is server action return)
    return { success: true, booking };
}

export async function requestCancellationAction(bookingId: string, reason: string) {
    const supabase = await createClient();

    // 1. Validate Booking Owner (We need to re-verify lookup or session? 
    // Since this is a server action called from client, we don't have implicit owner session for guest.
    // We should pass a token or verify again? 
    // Simpler for MVP: Verification is done by the page showing this button?
    // NO, Server Actions must be secure.
    // We can't trust the client just sending ID. 
    // WE NEED A SESSION or Signed Token for Guest Dashboard.

    // Alternative: Require lookup_code + contact again for cancellation?
    // Let's implement that pattern: "Cancel requires re-entry or strictly validated context".
    // Or we create a temporary cookie session upon lookup?

    // Let's go with "Cookie Session" pattern for Lookup.
    // But for speed, let's assume we pass the sensitive info again or use a signed JWT in cookie.
    // I will skip complex auth for now and require "lookupCode" in payload to verify ownership again.
    return { success: false, error: "취소 기능 구현 중입니다." };
}
