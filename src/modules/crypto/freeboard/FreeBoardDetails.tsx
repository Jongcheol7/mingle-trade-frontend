"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFreeBoardDetails } from "@/hooks/crypto/freeboard/useFreeBoardReactQuery";
import Editor from "@/modules/common/Editor";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Editor as TiptapEditor } from "@tiptap/react";

type Props = {
  id: number;
};

export default function FreeBoardDetails({ id }: Props) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const { data, isFetching, isLoading } = useFreeBoardDetails(id);
  const [editor, setEditor] = useState<TiptapEditor | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
      </div>
    );
  }

  console.log("ddd : ", data);

  return (
    <Card className="h-full">
      <CardHeader className="flex gap-2">
        <Input type="text" value={data.title} readOnly />
        <Button
          className=" cursor-pointer"
          variant={"secondary"}
          onClick={() => router.push(`/crypto/freeboard/write/${data.id}`)}
        >
          수정
        </Button>
        <Button
          className=" cursor-pointer"
          onClick={router.back}
          variant={"destructive"}
        >
          뒤로가기
        </Button>
      </CardHeader>

      <CardContent>
        <Editor
          setEditor={setEditor}
          content={data?.content ?? ""}
          readOnly={true}
        />
      </CardContent>
    </Card>
  );
}
