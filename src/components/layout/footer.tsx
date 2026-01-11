import Link from "next/link";
import { content } from "@/constants/content";
import { Separator } from "@/components/ui/separator"; // Ensure this exists or use <hr>

export function Footer() {
    const { contact, navigation, siteConfig } = content;

    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-2xl font-bold text-primary mb-4 block">
                            {siteConfig.name}
                        </Link>
                        <p className="text-gray-600 mb-6 max-w-sm leading-relaxed text-sm">
                            {siteConfig.description}
                        </p>
                        <div className="flex flex-col gap-1 text-sm text-gray-500">
                            <p>대표: {contact.representative} | 사업자번호: {contact.businessId}</p>
                            <p>주소: {contact.address} {contact.addressDetail}</p>
                            <p>Tel: {contact.phone} | Email: {contact.email}</p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-6">바로가기</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            {navigation.main.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="hover:text-primary transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-6">고객센터</h4>
                        <p className="text-2xl font-bold text-primary mb-2">{contact.phone}</p>
                        <p className="text-sm text-gray-500 mb-6">
                            09:00 ~ 21:00 (연중무휴)
                        </p>
                        <div className="space-y-2">
                            <p className="text-xs text-gray-400 font-medium">계좌안내</p>
                            <p className="text-sm text-gray-600">
                                {contact.bankName} <br />
                                {contact.accountNumber} <br />
                                예금주: {contact.accountHolder}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
                    <div className="flex gap-6">
                        {navigation.footer.map((item) => (
                            <Link key={item.href} href={item.href} className="hover:text-gray-900 transition-colors">
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
