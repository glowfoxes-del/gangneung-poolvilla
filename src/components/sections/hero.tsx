"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { content } from "@/constants/content";

export function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Image Placeholder */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop')",
                    filter: "brightness(0.7)"
                }}
            />

            <div className="relative z-10 container mx-auto px-4 text-center text-white">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
                    {content.siteConfig.name}
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl font-light mb-10 max-w-2xl mx-auto opacity-90 animate-fade-in-up delay-100">
                    {content.siteConfig.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
                    <Button asChild size="lg" className="rounded-full px-8 text-lg h-14 bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300 text-white border-0 shadow-lg">
                        <Link href="/booking">실시간 예약하기</Link>
                    </Button>
                    <Button asChild size="lg" className="rounded-full px-8 text-lg h-14 bg-white text-primary hover:bg-gray-100 transition-all border-0 shadow-lg">
                        <Link href="/rooms">객실 둘러보기</Link>
                    </Button>
                </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                <Link href="#features" className="text-white opacity-70 hover:opacity-100 transition-opacity">
                    <span className="sr-only">Scroll Down</span>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </Link>
            </div>
        </section>
    );
}
