"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function LookupResultPage() {
    const router = useRouter();
    const [booking, setBooking] = useState<any>(null);

    useEffect(() => {
        const data = sessionStorage.getItem("currentBooking");
        if (!data) {
            router.replace("/lookup");
            return;
        }
        setBooking(JSON.parse(data));
    }, [router]);

    if (!booking) return null;

    const getStatusBadge = (status: string) => {
        const map: Record<string, string> = {
            PENDING: "대기중",
            CONFIRMED: "예약확정",
            CANCEL_REQUESTED: "취소요청",
            CANCELLED: "취소됨",
            COMPLETED: "이용완료",
        };
        return <Badge variant={status === 'CONFIRMED' ? 'default' : 'secondary'}>{map[status] || status}</Badge>;
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-8">나의 예약 정보</h1>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl">{booking.rooms?.name || "객실 정보 없음"}</CardTitle>
                    {getStatusBadge(booking.status)}
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm bg-zinc-50 p-4 rounded-md">
                        <div>
                            <span className="text-gray-500 block mb-1">체크인</span>
                            <span className="font-semibold">{format(new Date(booking.check_in), "PPP", { locale: ko })} 15:00</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block mb-1">체크아웃</span>
                            <span className="font-semibold">{format(new Date(booking.check_out), "PPP", { locale: ko })} 11:00</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block mb-1">예약번호</span>
                            <span className="font-mono">{booking.lookup_code}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block mb-1">인원</span>
                            <span>{booking.guests}명</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <h3 className="font-medium">결제 정보</h3>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">결제 상태</span>
                            <span>{booking.payments?.[0]?.status || "정보 없음"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">총 결제금액</span>
                            <span className="font-bold text-lg">{booking.total_amount.toLocaleString()}원</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-zinc-50/50 p-6">
                    <Button variant="outline" onClick={() => router.push("/")}>메인으로</Button>
                    {booking.status === 'CONFIRMED' && (
                        <Button variant="destructive" onClick={() => alert("취소 요청 기능 준비중입니다. 고객센터로 문의해주세요.")}>
                            예약 취소 요청
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
