import { content } from "@/constants/content";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
    const { contact } = content;

    return (
        <div className="container mx-auto py-16 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-center">문의하기 / 오시는 길</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Helper Info */}
                <Card>
                    <CardContent className="p-8 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-primary" /> 고객센터 운영시간
                            </h3>
                            <p className="text-gray-600 pl-7">09:00 ~ 21:00 (연중무휴)</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                                <Phone className="w-5 h-5 text-primary" /> 전화번호
                            </h3>
                            <p className="text-gray-600 pl-7">{contact.phone}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                                <Mail className="w-5 h-5 text-primary" /> 이메일
                            </h3>
                            <p className="text-gray-600 pl-7">{contact.email}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                                <MapPin className="w-5 h-5 text-primary" /> 주소
                            </h3>
                            <p className="text-gray-600 pl-7">{contact.address} {contact.addressDetail}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Banking Info */}
                <Card className="bg-zinc-50 border-zinc-200">
                    <CardContent className="p-8 flex flex-col justify-center h-full">
                        <h3 className="text-xl font-bold mb-4">입금 계좌 안내</h3>
                        <p className="text-3xl font-bold text-primary mb-2">{contact.bankName}</p>
                        <div className="text-2xl font-mono mb-4">{contact.accountNumber}</div>
                        <p className="text-gray-600">예금주: {contact.accountHolder}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-[400px] bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                    네이버/카카오 지도 API 영역
                </div>
                <p className="relative z-10 text-gray-500 font-medium bg-white/80 px-4 py-2 rounded-full backdrop-blur">
                    {contact.address}
                </p>
            </div>
        </div>
    );
}
