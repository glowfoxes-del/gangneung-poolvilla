"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { lookupBookingAction } from "@/app/lookup/actions";
import { Loader2, Search } from "lucide-react";

export default function LookupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ lookupCode: "", contact: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await lookupBookingAction(formData);
            if (res.success) {
                toast.success("예약 정보를 찾았습니다.");
                // Store simple session info in storage or URL? URL for MVP.
                // Warning: Sensitive info in URL is bad. 
                // Better: Use Server Action to set a Cookie?
                // For MVP, passing result via state or just showing it here?
                // Let's redirect to `/lookup/result?code=...&contact=...` (Bad practice but fast)
                // OR better: Render result conditionally in this page or use a layout?
                // Let's use sessionStorage to pass data to result page to keep URL clean?
                // Actually, let's just use query params but maybe encoded?

                sessionStorage.setItem("currentBooking", JSON.stringify(res.booking));
                router.push("/lookup/result");
            } else {
                toast.error(res.error);
            }
        } catch (err) {
            toast.error("오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-20 px-4 flex justify-center items-center min-h-[60vh]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" /> 예약 조회
                    </CardTitle>
                    <CardDescription>
                        예약 번호와 예약자 연락처를 입력해주세요.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="lookupCode">예약 번호 (6자리)</Label>
                            <Input
                                id="lookupCode"
                                placeholder="예: ABCDEF"
                                value={formData.lookupCode}
                                onChange={(e) => setFormData(p => ({ ...p, lookupCode: e.target.value.toUpperCase() }))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact">연락처</Label>
                            <Input
                                id="contact"
                                placeholder="예: 01012345678"
                                value={formData.contact}
                                onChange={(e) => setFormData(p => ({ ...p, contact: e.target.value }))}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : "조회하기"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
