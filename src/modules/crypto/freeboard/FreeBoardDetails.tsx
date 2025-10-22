"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFreeBoardDetails } from "@/hooks/crypto/freeboard/useFreeBoardReactQuery";
import Editor from "@/modules/common/Editor";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  id: number;
};

export default function FreeBoardDetails({ id }: Props) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const { data, isFetching, isLoading } = useFreeBoardDetails(id, id !== 0);

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
    <div className="flex justify-center w-full items-center">
      <div className="flex flex-col gap-2 max-w-[795px]">
        <div className="flex gap-2">
          <Input type="text" value={data.title} readOnly />
          <Button
            variant={"secondary"}
            onClick={() => router.push(`/crypto/freeboard/write/${data.id}`)}
          >
            수정
          </Button>
          <Button onClick={router.back} variant={"destructive"}>
            취소
          </Button>
        </div>
        <Editor readOnly={true} content={data.content} />
      </div>
    </div>
  );
}
