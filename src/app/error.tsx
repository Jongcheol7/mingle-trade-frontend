"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
      <AlertCircle className="w-12 h-12 text-destructive opacity-60" />
      <h2 className="text-lg font-semibold text-foreground">
        오류가 발생했습니다
      </h2>
      <p className="text-sm text-muted-foreground max-w-md">
        {error.message || "알 수 없는 오류가 발생했습니다."}
      </p>
      <Button onClick={reset} variant="outline" className="cursor-pointer">
        다시 시도
      </Button>
    </div>
  );
}
