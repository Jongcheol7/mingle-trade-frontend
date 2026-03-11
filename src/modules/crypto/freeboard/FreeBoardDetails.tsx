"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFreeBoardDetails } from "@/hooks/crypto/freeboard/useFreeBoardReactQuery";
import Editor from "@/modules/common/Editor";
import { Loader2, ArrowLeft, Pencil } from "lucide-react";
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
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center gap-2 border-b border-border">
        <h2 className="flex-1 text-lg font-semibold text-foreground truncate">
          {data.title}
        </h2>
        <Button
          size="sm"
          className="cursor-pointer gap-1.5"
          variant={"secondary"}
          onClick={() => router.push(`/crypto/freeboard/write/${data.id}`)}
        >
          <Pencil className="w-3.5 h-3.5" />
          수정
        </Button>
        <Button
          size="sm"
          className="cursor-pointer gap-1.5"
          onClick={router.back}
          variant={"outline"}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          뒤로
        </Button>
      </CardHeader>

      <CardContent className="pt-4">
        <Editor
          setEditor={setEditor}
          content={data?.content ?? ""}
          readOnly={true}
        />
      </CardContent>
    </Card>
  );
}
