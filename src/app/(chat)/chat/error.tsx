"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
      <AlertCircle className="w-12 h-12 text-destructive opacity-60" />
      <h2 className="text-lg font-semibold text-foreground">
        채팅을 불러오지 못했습니다
      </h2>
      <p className="text-sm text-muted-foreground max-w-md">
        {error.message || "잠시 후 다시 시도해주세요."}
      </p>
      <Button onClick={reset} variant="outline" className="cursor-pointer">
        다시 시도
      </Button>
    </div>
  );
}
