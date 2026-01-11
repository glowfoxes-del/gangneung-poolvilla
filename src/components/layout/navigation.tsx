"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { content } from "@/constants/content";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetDescription,
} from "@/components/ui/sheet";

export function Navigation() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = content.navigation.main;

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled || pathname !== "/"
                    ? "bg-white/80 backdrop-blur-md shadow-sm py-4 border-b border-gray-100"
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className={cn(
                        "text-2xl font-bold tracking-tighter transition-colors",
                        isScrolled || pathname !== "/" ? "text-primary" : "text-white"
                    )}
                >
                    {content.siteConfig.name}
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary/80",
                                isScrolled || pathname !== "/" ? "text-gray-900" : "text-white/90"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Button
                        asChild
                        variant={isScrolled || pathname !== "/" ? "default" : "secondary"}
                        className="rounded-full px-6"
                    >
                        <Link href="/booking">예약하기</Link>
                    </Button>
                </nav>

                {/* Mobile Navigation */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "md:hidden",
                                isScrolled || pathname !== "/" ? "text-gray-900" : "text-white"
                            )}
                        >
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">메뉴 열기</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                        <SheetHeader className="text-left border-b pb-4 mb-4">
                            <SheetTitle className="text-primary font-bold">{content.siteConfig.name}</SheetTitle>
                            <SheetDescription className="text-xs text-muted-foreground">
                                Premium Private Poolvilla
                            </SheetDescription>
                        </SheetHeader>
                        <nav className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-gray-900 hover:text-primary transition-colors py-2 border-b border-gray-100 last:border-0"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="mt-8">
                                <Button asChild className="w-full rounded-full" size="lg">
                                    <Link href="/booking" onClick={() => setIsOpen(false)}>
                                        실시간 예약하기
                                    </Link>
                                </Button>
                            </div>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
