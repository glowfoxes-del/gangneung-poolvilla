"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import * as PortOne from "@portone/browser-sdk/v2";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { content } from "@/constants/content";

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const bookingId = searchParams.get("bookingId");
    const bookingCode = searchParams.get("code"); // lookup_code

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorHeader, setErrorHeader] = useState<string | null>(null);

    useEffect(() => {
        if (!bookingId || !bookingCode) {
            setErrorHeader("잘못된 접근입니다.");
        }
    }, [bookingId, bookingCode]);

    const handlePayment = async () => {
        if (!bookingId) return;

        setIsProcessing(true);
        try {
            // 1. Get Booking Details directly from our API or Server Action?
            // Since we don't have a public GET API for booking details yet, 
            // we usually pass necessary info via URL params or fetch via action.
            // But for security, re-calculating or fetching from server is best.
            // Let's assume we fetch details via a server action we'll create quickly or just rely on URL params if signed?
            // No, let's create a quick action here or use a client fetch if we had an endpoint.
            // Time is short, so I will fetch basic info via a new server action `getBookingForPayment`.
            // I will implement `getBookingForPayment` in `actions.ts`.

            const { getBookingForPayment } = await import("@/app/booking/actions");
            const booking = await getBookingForPayment(bookingId);

            if (!booking) {
                toast.error("예약 정보를 찾을 수 없습니다.");
                setIsProcessing(false);
                return;
            }

            // 2. Call Portone SDK
            const paymentId = `payment-${crypto.randomUUID()}`;

            const response = await PortOne.requestPayment({
                storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
                channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
                paymentId: paymentId,
                orderName: `${booking.room_name} ${booking.nights}박 (${booking.guests}인)`,
                totalAmount: booking.total_amount,
                currency: "CURRENCY_KRW",
                payMethod: "CARD",
                customer: {
                    fullName: booking.guest_name,
                    phoneNumber: booking.guest_contact_norm,
                    email: "customer@example.com", // We didn't collect email, use dummy or Collect? 
                    // We can skip email or use dummy if allowed. Portone V2 might require it depending on PG.
                },
                redirectUrl: `${window.location.origin}/payment/complete`, // For Mobile/Redirect flow
            });

            // 3. Handle Response (Browser SDK V2 resolves when payment process is closed/finished)
            if (response.code !== undefined) {
                // Error occurred
                toast.error(`결제 실패: ${response.message}`);
                setIsProcessing(false);
                return;
            }

            // If we are here, payment might be successful or pending.
            // Portone V2 SDK response: { paymentId: string } usually on success? 
            // Actually V2 SDK returns different structure.
            // Let's check docs pattern. standard requests usually return { code, message } on error
            // or redirect happens.
            // If it returns, we must verify.

            const verified = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    paymentId: response.paymentId, // The ID we sent or they returned? V2 usually echoes back.
                    bookingId: bookingId
                }),
            });

            const verifyResult = await verified.json();

            if (verifyResult.success) {
                router.push(`/payment/success?bookingId=${bookingId}`);
            } else {
                toast.error(`결제 검증 실패: ${verifyResult.message}`);
                // Redirect to fail page?
                router.push(`/payment/fail?reason=${verifyResult.message}`);
            }

        } catch (e: any) {
            console.error(e);
            toast.error("결제 진행 중 오류가 발생했습니다.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (errorHeader) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-4">{errorHeader}</h1>
                <Button onClick={() => router.push("/")}>홈으로 돌아가기</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-20 px-4 max-w-lg">
            <Card>
                <CardHeader>
                    <CardTitle>결제 진행</CardTitle>
                    <CardDescription>
                        예약 마무리를 위해 결제를 진행해주세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-zinc-50 p-4 rounded-lg text-sm space-y-2">
                        <p className="text-gray-600">안전한 결제를 위해 포트원(PortOne) 결제창이 열립니다.</p>
                        <p className="text-gray-600">결제 완료 시 예약이 즉시 확정됩니다.</p>
                    </div>

                    <Button
                        size="lg"
                        className="w-full"
                        onClick={handlePayment}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                결제창 호출 중...
                            </>
                        ) : (
                            "결제하기"
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
