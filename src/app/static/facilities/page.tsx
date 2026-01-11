import { Card, CardContent } from "@/components/ui/card";
import { content } from "@/constants/content";
import Image from "next/image";

// Placeholder images mapping (since we don't have real files, we use placeholders or room images)
const facilityImages = [
    { name: "인피니티 풀", desc: "바다와 이어진 듯한 환상적인 뷰", src: "/images/rooms/suite-b-1.jpg" }, // Reuse
    { name: "개별 바비큐장", desc: "프라이빗한 공간에서의 맛있는 추억", src: "/images/rooms/garden-d-1.jpg" },
    { name: "루프탑 라운지", desc: "쏟아지는 별과 함께하는 낭만", src: "/images/rooms/rooftop-e-1.jpg" },
    { name: "실내 자쿠지", desc: "사계절 따뜻한 힐링 스파", src: "/images/rooms/spa-f-1.jpg" },
];

export default function FacilitiesPage() {
    return (
        <div className="container mx-auto py-16 px-4">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">부대시설</h1>
                <p className="text-gray-600 text-lg">
                    강릉 풀빌라라에서만 누릴 수 있는 특별한 시설들을 소개합니다.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {facilityImages.map((item, idx) => (
                    <Card key={idx} className="overflow-hidden border-none shadow-lg">
                        <div className="relative h-64 w-full">
                            {/* Use a placeholder component or simple div if Image fails, but Image is standard */}
                            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center text-gray-400">
                                이미지 준비중
                            </div>
                            {/* <Image 
                 src={item.src} 
                 alt={item.name} 
                 fill 
                 className="object-cover hover:scale-105 transition-transform duration-500"
               /> */}
                            {/* Since images don't exist, I'll keep the placeholder div above visible or use a colored block */}
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
                                <span className="text-teal-800/20 text-6xl font-bold">Facility {idx + 1}</span>
                            </div>
                        </div>
                        <CardContent className="p-6">
                            <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
