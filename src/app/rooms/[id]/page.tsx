import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Users, Layout, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { content } from "@/constants/content";

// Static Params for SSG
export function generateStaticParams() {
    return content.rooms.map((room) => ({
        id: room.id,
    }));
}

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Await params in Next.js 15+ (and 14 in some configs)
    const { id } = await params;
    const room = content.rooms.find((r) => r.id === id);

    if (!room) {
        notFound();
    }

    return (
        <div className="bg-zinc-50 min-h-screen pb-24">
            {/* Hero Image */}
            <div className="relative h-[60vh] w-full bg-gray-900">
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${room.images[0]}')` }}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white container mx-auto">
                    <Link
                        href="/rooms"
                        className="inline-flex items-center text-sm mb-4 hover:text-primary transition-colors text-white/80"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        목록으로 돌아가기
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{room.name}</h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl font-light">
                        {room.description}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center gap-2">
                                <Users className="w-6 h-6 text-primary" />
                                <span className="text-sm text-gray-500">인원</span>
                                <span className="font-semibold">기준 {room.capacity.standard}명 / 최대 {room.capacity.max}명</span>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center gap-2">
                                <Layout className="w-6 h-6 text-primary" />
                                <span className="text-sm text-gray-500">구조</span>
                                <span className="font-semibold">{room.composition}</span>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center gap-2">
                                <Star className="w-6 h-6 text-primary" />
                                <span className="text-sm text-gray-500">크기</span>
                                <span className="font-semibold">{room.features[0]}</span>
                            </div>
                        </div>

                        {/* Features/Amenities */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <h3 className="text-xl font-bold mb-6">Room Features</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {room.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-1.5 rounded-full">
                                            <Check className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gallery (Placeholder Grid) */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <h3 className="text-xl font-bold mb-6">Gallery</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {/* Just repeating the main image for demo as content.ts usually has 1 in this stage */}
                                {[1, 2, 3, 4, 5, 6].map((_, i) => (
                                    <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                        <div
                                            className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform"
                                            style={{ backgroundImage: `url('${room.images[0]}')` }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Pricing & CTA) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-24 border border-gray-100">
                            <h3 className="text-xl font-bold mb-6">요금 안내</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                    <span className="text-gray-600">주중 (일~목)</span>
                                    <span className="font-semibold text-lg">₩{room.prices.weekday.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                    <span className="text-gray-600">금요일</span>
                                    <span className="font-semibold text-lg">₩{room.prices.friday.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                    <span className="text-gray-600 text-primary font-medium">주말 (토/공휴일)</span>
                                    <span className="font-bold text-xl text-primary">₩{room.prices.weekend.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button asChild className="w-full text-lg h-12" size="lg">
                                    <Link href={`/booking?roomId=${room.id}`}>
                                        예약하기
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/static/facilities">자세히 문의하기</Link>
                                </Button>
                            </div>

                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    * 기준 인원 초과 시 추가 요금이 발생합니다.<br />
                                    * 성수기/비성수기에 따라 요금이 변동될 수 있습니다.<br />
                                    * 자세한 사항은 공지사항을 참고해주세요.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
