"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useFreeBoardDetails,
  useFreeBoardSave,
} from "@/hooks/crypto/freeboard/useFreeBoardReactQuery";
import Editor from "@/modules/common/Editor";
import { useUserStore } from "@/store/useUserStore";
import { FreeBoard } from "@/types/freeboard";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type Editor as TiptapEditor } from "@tiptap/react";
import FileToS3 from "@/modules/common/FileToS3";
import axios from "axios";

type Props = {
  id: number;
};

export default function FreeBoardForm({ id }: Props) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const { register, handleSubmit, setFocus, reset } = useForm<FreeBoard>();
  const { mutate: saveMutate } = useFreeBoardSave();
  const { nickname, email } = useUserStore();
  const { data, isFetching, isLoading } = useFreeBoardDetails(id);
  const [editor, setEditor] = useState<TiptapEditor | null>(null);

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

  const handleSave = async (val: FreeBoard) => {
    if (!val.title) {
      toast.error("제목을 입력하세요.");
      setFocus("title");
      return false;
    }
    const html = editor?.getHTML();
    if (!html || html?.trim() === "") {
      toast.error("내용을 입력하세요.");
      setFocus("content");
      return false;
    }

    val.id = id;
    val.nickname = nickname!;
    val.email = email!;
    val.content = html;

    //이미지들을 추출해서 S3에 저장하기 위해 presigned-url 발급
    const matches = [
      ...html.matchAll(/<img[^>]+src="(data:image\/[^"]+|blob:[^"]+)"[^>]*>/g),
    ];
    let uploadHTML = html;
    console.log("html : ", html);
    console.log("matches : ", matches);

    for (let i = 0; i < matches.length; i++) {
      const fullTag = matches[i][0];
      const base64 = matches[i][1];

      //base64 -> blob -> File 변환
      const res = await fetch(base64);
      const blob = await res.blob();
      const file = new File([blob], `image${i}.jpeg`, { type: blob.type });

      try {
        const url = await FileToS3(file, "freeboard");
        const uploadRes = await axios.put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        console.log("uploadRes : ", uploadRes);

        if (uploadRes.status !== 200 && uploadRes.status !== 204) {
          throw new Error("S3 업로드 실패");
        }

        const fileUrl = url
          .split("?")[0]
          .replace(
            process.env.NEXT_PUBLIC_S3_BASE_URL,
            process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN
          );

        //스타일 속성 유지하기
        const styleMatch = fullTag.match(/style="([^"]*)"/);
        const styleAttr = styleMatch ? ` style="${styleMatch[1]}"` : "";
        // base64 태그 → 실제 S3 URL로 바꾸기 (해당 <img> 전체 태그 교체)
        const s3ImgTag = `<img src="${fileUrl}"${styleAttr} />`;
        uploadHTML = uploadHTML.replace(fullTag, s3ImgTag);
        val.content = uploadHTML;
      } catch (err) {
        console.error("이미지 S3 업로드 실패:", err);
        toast.error("이미지 S3 업로드 실패: " + err);
      }
    }

    saveMutate(val);
    router.push("/crypto/freeboard");
  };

  return (
    <Card className=" h-[calc(100vh-200px)]">
      <form onSubmit={handleSubmit(handleSave)}>
        <CardHeader className="flex gap-2">
          <Input type="text" {...register("title")} />
          <Button variant={"secondary"} className="cursor-pointer">
            저장
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              router.back();
            }}
            variant={"destructive"}
            className="cursor-pointer"
          >
            취소
          </Button>
        </CardHeader>

        <CardContent className="py-0 my-0">
          <Editor
            setEditor={setEditor}
            content={data?.content ?? ""}
            readOnly={false}
          />
        </CardContent>
      </form>
    </Card>
  );
}
