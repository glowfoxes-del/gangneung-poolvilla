import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js"; // Using direct service client creation
import { portone } from "@/lib/portone";

// Service Client Creator (for Admin tasks)
function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentId, bookingId } = body;
    // V2 usually works with 'paymentId' (failed or success uuid from portone)

    if (!paymentId || !bookingId) {
      return NextResponse.json({ success: false, message: "Missing paymentId or bookingId" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // 1. Get Booking & Payment Requirements
    // We need to know how much *should* have been paid.
    // Fetch the booking first.
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    // 2. Verify with Portone V2
    const paymentData = await portone.getPayment(paymentId);

    if (!paymentData) {
      return NextResponse.json({ success: false, message: "Payment info not found in Portone" }, { status: 404 });
    }

    // Portone V2 Response Structure (Simplified Assumption based on V2 API)
    // { status: "PAID", amount: { total: 1000, ... }, id: "..." }
    // We check `status` ("PAID") and `amount.total`.

    const { status, amount, id: verifiedPaymentId } = paymentData;
    const paidAmount = amount?.total || 0;

    // 3. Amount Check
    if (paidAmount !== booking.total_amount) {
      // FORGERY ATTEMPT or MISTAKE
      // Cancel Booking immediately
      await supabase.from("bookings").update({
        status: "CANCELLED",
        failure_reason: "AMOUNT_MISMATCH",
        cancel_reason: `System: Amount Mismatch (Expected ${booking.total_amount}, Got ${paidAmount})`
      }).eq("id", bookingId);

      // Create a Failed Payment Record
      await supabase.from("payments").insert({
        booking_id: bookingId,
        merchant_uid: `failed_${Date.now()}`, // Temporary ID for failed attempts
        amount: paidAmount,
        status: "FAILED",
        refund_reason: "Amount Mismatch detected during verification",
        provider_payload: paymentData // Save full log
      });

      return NextResponse.json({ success: false, message: "결제 금액 불일치" }, { status: 400 });
    }

    // 4. Status Check
    if (status === "PAID") {
      // SUCCESS!

      // Update Booking
      await supabase.from("bookings").update({
        status: "CONFIRMED",
        // remove expiration if needed, or leave it as record
      }).eq("id", bookingId);

      // Create Payment Record (Official)
      // We use the booking's lookup_code or a UUID as merchant_uid usually, 
      // but here we can just use the Portone paymentId as unique REF or generate our own.
      // Let's use the booking info.
      const { error: payError } = await supabase.from("payments").insert({
        booking_id: bookingId,
        merchant_uid: paymentId, // V2 uses this ID primarily
        pg_tid: paymentId,
        amount: paidAmount,
        status: "PAID",
        provider_payload: paymentData
      });

      if (payError) {
        console.error("Payment Insert Error:", payError);
        // Even if insert fails, booking is CONFIRMED. We should try to log this.
        // But critically, the User paid and Booking is Confirmed.
      }

      return NextResponse.json({ success: true });
    } else {
      // Payment status is not PAID (e.g. FAILED, VIRTUAL_ACCOUNT_ISSUED, etc.)
      return NextResponse.json({ success: false, message: `Payment Status: ${status}` }, { status: 400 });
    }

  } catch (e: any) {
    console.error("Verification Handler Error:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
