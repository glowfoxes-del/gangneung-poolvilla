import Image from "next/image";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
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

export function RoomPreview() {
    const featuredRooms = content.rooms.slice(0, 3); // Show top 3 rooms

    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="max-w-2xl">
                        <span className="text-primary font-medium tracking-wider text-sm uppercase mb-2 block">Our Rooms</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            안락함이 깃든 객실
                        </h2>
                        <p className="text-gray-600">
                            다양한 컨셉의 객실에서 당신에게 딱 맞는 휴식을 찾아보세요.
                        </p>
                    </div>
                    <Button asChild variant="outline" className="hidden md:flex">
                        <Link href="/rooms" className="group">
                            모든 객실 보기
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredRooms.map((room) => (
                        <Card key={room.id} className="overflow-hidden group border-0 shadow-lg block">
                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                {/* Image Placeholder if generic */}
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${room.images[0]}')` }} // Note: These are local paths from content.ts
                                />
                                {/* Fallback for dev if image missing */}
                                {
                                    /* Fallback for dev if image missing - Removed to show real image */
                                }
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                                    ₩{room.basePrice.toLocaleString()}~
                                </div>
                            </div>

                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-bold">{room.name}</CardTitle>
                                <CardDescription className="line-clamp-1">{room.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="pb-4">
                                <div className="flex gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        <span>기준 {room.capacity.standard}인 (최대 {room.capacity.max}인)</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-0">
                                <Button asChild className="w-full" variant="secondary">
                                    <Link href={`/rooms/${room.id}`}>자세히 보기</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/rooms">모든 객실 보기</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
