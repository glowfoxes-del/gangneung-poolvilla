import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { content } from "@/constants/content";

export function Location() {
    const { address, addressDetail, phone, email } = content.contact;

    return (
        <section id="location" className="py-24 bg-zinc-900 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-primary font-medium tracking-wider text-sm uppercase mb-2 block">Location</span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">오시는 길</h2>
                        <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                            강릉의 푸른 바다와 솔향기가 머무는 곳.<br />
                            {content.siteConfig.name}에서 잊지 못할 추억을 만드세요.
                        </p>

                        <div className="space-y-6 mb-10">
                            <div className="flex items-start gap-4">
                                <div className="bg-white/10 p-3 rounded-full shrink-0">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Address</h4>
                                    <p className="text-gray-400">{address} {addressDetail}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-white/10 p-3 rounded-full shrink-0">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Contact</h4>
                                    <p className="text-gray-400">{phone}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-white/10 p-3 rounded-full shrink-0">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Email</h4>
                                    <p className="text-gray-400">{email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button asChild variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white hover:text-gray-900 transition-colors">
                                <a href={`https://map.naver.com/v5/search/${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer">
                                    네이버 지도
                                </a>
                            </Button>
                            <Button asChild variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white hover:text-gray-900 transition-colors">
                                <a href={`https://map.kakao.com/link/search/${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer">
                                    카카오맵
                                </a>
                            </Button>
                        </div>
                    </div>

                    <div className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-2xl overflow-hidden bg-gray-800">
                        {/* Simple static map placeholder or Frame using Google Maps Embed API if key available. 
                Using a sterile gray box with text for dev to avoid API key requirements for now. 
            */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                            <p className="text-gray-500">Map Area (Embed needed)</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
