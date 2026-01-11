import { Suspense } from "react";
import { BookingForm } from "@/components/booking/booking-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookingPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="mb-10 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">객실 예약하기</h1>
                <p className="text-gray-600">
                    원하시는 날짜와 객실을 선택하여 예약을 진행해 주세요.
                </p>
            </div>

            <Suspense fallback={<Skeleton className="w-full h-[600px] rounded-xl" />}>
                <BookingFormWrapper />
            </Suspense>
        </div>
    );
}

// Suspense wrapper to handle useSearchParams (if needed in client component)
// For now, Booking form handles params logic or we pass it down
function BookingFormWrapper() {
    return <BookingForm />;
}
