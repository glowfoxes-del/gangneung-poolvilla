import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
    const supabase = await createClient();

    // 1. Check Admin Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect("/login"); // Admin login page needed? or just use Supabase Auth UI?

    // We rely on RLS is_admin(), so if query returns error or empty, they aren't admin.
    // But strictly, we should check role. 
    // For MVP, we just try to fetch.

    const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*, rooms(name), payments(status)")
        .order("created_at", { ascending: false })
        .limit(20);

    if (error) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-xl font-bold text-red-500">접근 권한이 없거나 오류가 발생했습니다.</h1>
                <p className="text-gray-500 mt-2">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">관리자 대시보드</h1>
                    <p className="text-gray-500">최근 예약 및 결제 현황을 확인합니다.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/">메인으로 돌아가기</Link>
                </Button>
            </div>

            <div className="grid gap-4">
                {bookings?.map((booking) => (
                    <Card key={booking.id}>
                        <CardContent className="p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                                        {booking.status}
                                    </Badge>
                                    <span className="text-sm text-gray-400 font-mono">#{booking.lookup_code}</span>
                                </div>
                                <h3 className="font-bold text-lg">{booking.rooms?.name}</h3>
                                <p className="text-gray-600 text-sm">
                                    {format(new Date(booking.check_in), "PPP", { locale: ko })} ~ {format(new Date(booking.check_out), "PPP", { locale: ko })}
                                </p>
                                <p className="text-sm mt-1">예약자: {booking.guest_name} ({booking.guest_contact_norm})</p>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-lg mb-1">{booking.total_amount.toLocaleString()}원</p>
                                {booking.payments?.[0] ? (
                                    <Badge variant="outline" className="text-xs">
                                        결제: {booking.payments[0].status}
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="text-xs">미결제</Badge>
                                )}
                                <div className="mt-2 text-xs text-gray-400">
                                    {format(new Date(booking.created_at), "M월 d일 a h:mm", { locale: ko })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {bookings?.length === 0 && (
                    <p className="text-center text-gray-500 py-10">예약 내역이 없습니다.</p>
                )}
            </div>
        </div>
    );
}
