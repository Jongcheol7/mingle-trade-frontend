"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useFreeBoardDetails,
  useFreeBoardSave,
} from "@/hooks/crypto/freeboard/useFreeBoardReactQuery";
import Editor from "@/modules/common/Editor";
import { useUserStore } from "@/store/useUserStore";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  id: number;
};

export default function FreeBoardForm({ id }: Props) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const { register, setValue, handleSubmit, setFocus, reset } = useForm();
  const { mutate: saveMutate } = useFreeBoardSave();
  const { nickname } = useUserStore();
  const { data, isFetching, isLoading } = useFreeBoardDetails(id, id !== 0);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        content: data.content,
      });
    }
  }, [data, reset]);

  if (!hydrated) {
    return null;
  }

  if (isFetching || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
      </div>
    );
  }

  const handleSave = (data) => {
    if (!data.title) {
      toast.error("제목을 입력하세요.");
      setFocus("title");
      return false;
    }
    if (data.content.trim() === "") {
      toast.error("내용을 입력하세요.");
      setFocus("content");
      return false;
    }
    data.id = id;
    data.writer = nickname;
    saveMutate(data);
    router.push("/crypto/freeboard");
  };

  return (
    <div className="flex justify-center w-full items-center">
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="flex flex-col gap-2 max-w-[795px]">
          <div className="flex gap-2">
            <Input type="text" {...register("title")} />
            <Button variant={"secondary"} className="cursor-pointer">
              저장
            </Button>
            <Button
              onClick={router.back}
              variant={"destructive"}
              className="cursor-pointer"
            >
              취소
            </Button>
          </div>
          <input type="hidden" {...register("content")} />
          <Editor
            onChange={(data) => setValue("content", data)}
            content={data?.content || ""}
          />
        </div>
      </form>
    </div>
  );
}
