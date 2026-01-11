import type { Metadata } from "next";
import "./globals.css";
import { content } from "@/constants/content";
import { Toaster } from "@/components/ui/sonner";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: {
    default: content.siteConfig.name,
    template: `%s | ${content.siteConfig.name}`,
  },
  description: content.siteConfig.description,
  keywords: [...content.siteConfig.keywords],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: content.siteConfig.url,
    title: content.siteConfig.name,
    description: content.siteConfig.description,
    siteName: content.siteConfig.name,
    images: [
      {
        url: content.siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: content.siteConfig.name,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Pretendard CDN for optimal performance & no local file dependency */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        <Navigation />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
