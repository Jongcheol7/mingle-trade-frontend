"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Editor from "@/modules/common/Editor";
import { useRouter } from "next/navigation";

export default function FreeBoardForm() {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col gap-2 max-w-[795px]">
        <div className="flex gap-2">
          <Input />
          <Button variant={"secondary"}>저장</Button>
          <Button onClick={router.back} variant={"destructive"}>
            취소
          </Button>
        </div>
        <Editor />
      </div>
    </div>
  );
}
