import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-primary">404</h2>
            <p className="text-xl font-medium">페이지를 찾을 수 없습니다.</p>
            <p className="text-muted-foreground text-sm max-w-[400px]">
                요청하신 페이지가 존재하지 않거나, 주소가 변경되었을 수 있습니다.
            </p>
            <div className="mt-4">
                <Button asChild>
                    <Link href="/">홈으로 돌아가기</Link>
                </Button>
            </div>
        </div>
    );
}
