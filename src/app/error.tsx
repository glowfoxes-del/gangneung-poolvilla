"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Something went wrong!</h2>
            <p className="text-muted-foreground">
                알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
            </p>
            <Button onClick={() => reset()} variant="default">
                다시 시도
            </Button>
        </div>
    );
}
