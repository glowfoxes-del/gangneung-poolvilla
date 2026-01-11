import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailPage({ searchParams }: { searchParams: { reason: string } }) {
    return (
        <div className="container mx-auto py-24 px-4 text-center max-w-lg">
            <div className="flex justify-center mb-6">
                <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">결제에 실패했습니다</h1>
            <p className="text-gray-600 mb-8">
                {searchParams.reason || "알 수 없는 오류가 발생했습니다."}<br />
                다시 시도해 주시기 바랍니다.
            </p>

            <div className="flex gap-4 justify-center">
                <Button asChild variant="outline">
                    <Link href="/">홈으로</Link>
                </Button>
                <Button asChild>
                    <Link href="/booking">다시 예약하기</Link>
                </Button>
            </div>
        </div>
    );
}
