import Link from "next/link";
import { User, Maximize, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { content } from "@/constants/content";

export default function RoomListPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4">Rooms</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    강릉 풀빌라라의 모든 객실은 프라이빗한 휴식을 위해 설계되었습니다.
                    <br />
                    당신의 여행 스타일에 맞는 완벽한 객실을 선택하세요.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {content.rooms.map((room) => (
                    <Card key={room.id} className="overflow-hidden flex flex-col h-full group transition-all hover:shadow-lg">
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                            <div
                                className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url('${room.images[0]}')` }}
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                                ₩{room.basePrice.toLocaleString()}~
                            </div>
                        </div>

                        <CardHeader>
                            <CardTitle className="flex justify-between items-start">
                                <span>{room.name}</span>
                            </CardTitle>
                            <CardDescription className="line-clamp-2 mt-2">
                                {room.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {room.features.slice(0, 3).map((feature, idx) => (
                                    <span key={idx} className="bg-primary/5 text-primary text-xs px-2 py-1 rounded">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>기준 {room.capacity.standard} / 최대 {room.capacity.max}인</span>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button asChild className="w-full" size="lg">
                                <Link href={`/rooms/${room.id}`}>
                                    객실 상세보기 <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
