import { Star, Wifi, Coffee, Palmtree } from "lucide-react";
import { content } from "@/constants/content";

const FEATURES = [
    {
        icon: Palmtree,
        title: "프라이빗 풀",
        description: "전 객실 사계절 내내 즐길 수 있는 개별 수영장"
    },
    {
        icon: Star,
        title: "럭셔리 어메니티",
        description: "최고급 호텔 침구와 이솝 어메니티 제공"
    },
    {
        icon: Coffee,
        title: "오션뷰 테라스",
        description: "동해 바다가 한눈에 들어오는 탁 트인 전망"
    },
    {
        icon: Wifi,
        title: "스마트 스테이",
        description: "기가 와이파이와 OTT 무료 시청"
    }
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-zinc-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-primary font-medium tracking-wider text-sm uppercase mb-2 block">Special Features</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        특별함이 머무는 공간
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {content.siteConfig.name}에서만 누릴 수 있는 특별한 경험들을 소개합니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {FEATURES.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group text-center"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
