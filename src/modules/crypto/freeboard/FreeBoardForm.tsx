"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFreeBoardSave } from "@/hooks/crypto/freeboard/useFreeBoardReactQuery";
import Editor from "@/modules/common/Editor";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function FreeBoardForm() {
  const router = useRouter();
  const { register, setValue, handleSubmit } = useForm();
  const { mutate: saveMutate } = useFreeBoardSave();

  const handleSave = (data) => {
    console.log(data);
    data.writer = "이종철";
    saveMutate(data);
    router.back();
  };

  return (
    <div className="flex justify-center w-full items-center">
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="flex flex-col gap-2 max-w-[795px]">
          <div className="flex gap-2">
            <Input type="text" {...register("title")} />
            <Button variant={"secondary"}>저장</Button>
            <Button onClick={router.back} variant={"destructive"}>
              취소
            </Button>
          </div>
          <input type="hidden" {...register("content")} />
          <Editor onChange={(data) => setValue("content", data)} />
        </div>
      </form>
    </div>
  );
}
