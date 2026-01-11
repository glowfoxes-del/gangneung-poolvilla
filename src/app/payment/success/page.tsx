import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage({ searchParams }: { searchParams: { bookingId: string } }) {
    return (
        <div className="container mx-auto py-24 px-4 text-center max-w-lg">
            <div className="flex justify-center mb-6">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">예약이 확정되었습니다!</h1>
            <p className="text-gray-600 mb-8">
                결제가 성공적으로 완료되었습니다.<br />
                예약 번호: <span className="font-mono font-bold">{searchParams.bookingId}</span>
            </p>

            <div className="flex gap-4 justify-center">
                <Button asChild variant="outline">
                    <Link href="/">홈으로</Link>
                </Button>
                <Button asChild>
                    <Link href="/lookup">예약 조회하기</Link>
                </Button>
            </div>
        </div>
    );
}
