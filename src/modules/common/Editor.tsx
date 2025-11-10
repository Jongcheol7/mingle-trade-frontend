"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import DOMPurify from "isomorphic-dompurify";
import { ResizableImage } from "./ResizableImage";
import { toast } from "sonner";
import { Color, FontSize, TextStyle } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import NoteToolbar from "./NoteToolbar";
import imageCompression from "browser-image-compression";
import DeleteFromS3 from "./DeleteFromS3";

export default function Editor({ setEditor, content, readOnly }: EditorType) {
  const safeHTML = DOMPurify.sanitize(content); // content 안에 <img src="data:..." />가 포함됨
  const prevImgsRef = useRef<string[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        //history: false, // ✅ undo/redo 자체를 끔
        codeBlock: false, // 기본 codeBlock 비활성화 (Lowlight로 대체)
      }),
      Placeholder.configure({
        placeholder: "여기에 메모를 입력하세요...",
      }),
      ResizableImage,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    immediatelyRender: false,
    content: "",
    editable: !readOnly,
    autofocus: false,
    async onUpdate({ editor }) {
      const html = editor.getHTML();

      const currentImgs = [
        ...html.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/g),
      ].map((m) => m[1]);
      console.log("currentImgs :", currentImgs);

      // 2. 직전 이미지 리스트와 비교해서 삭제된 이미지가 있는지 확인
      const deletedImgs = prevImgsRef.current.filter(
        (src) => !currentImgs.includes(src)
      );
      // 추가된 이미지를 판별하자.
      const addedImgs = currentImgs.filter(
        (src) => !prevImgsRef.current.includes(src)
      );

      console.log("deletedImgs :", deletedImgs);
      // 3. 삭제된 이미지가 CloudFront라면 S3 삭제 요청
      deletedImgs.forEach(async (src: string) => {
        if (src.startsWith(process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN ?? "")) {
          console.log("삭제 실행 전");
          DeleteFromS3(src);
        }
      });

      // 4. 현재 이미지 리스트를 저장
      prevImgsRef.current = currentImgs;

      // 새로 들어온 base64 이미지만 압축
      for (let i = 0; i < addedImgs.length; i++) {
        if (
          addedImgs[i].startsWith("data:") &&
          !addedImgs[i].includes("compressed")
        ) {
          try {
            // addedImgs[i] : base64
            // base64 -> base -> file (압축을 위해)
            const res = await fetch(addedImgs[i]);
            const blob = await res.blob();
            const file = new File([blob], `image${i}.jpeg`, {
              type: blob.type,
            });
            // 압축 옵션
            const compressionOption = {
              maxSizeMB: 2,
              maxWidthOrHeight: 1024,
              useWebWorker: true,
            };
            const compressed = await imageCompression(file, compressionOption);
            // File -> base64 문자열로 다시 바꾸기.
            const compressedUrl = URL.createObjectURL(compressed);
            const newHtml = html.replace(
              addedImgs[i],
              `${compressedUrl}" data-compressed="true`
            );
            editor.commands.setContent(newHtml, { emitUpdate: false });

            const replacedImgs = [
              ...newHtml.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/g),
            ].map((m) => m[1]);
            prevImgsRef.current = replacedImgs;
          } catch (err) {
            console.error("이미지 압축 실패 :", err);
            toast.error("이미지 압축 중 오류가 발생했습니다.");
          }
        }
      }
    },
  });

  useEffect(() => {
    if (editor && setEditor) {
      setEditor(editor);

      // ✅ content 안의 base64 <img>를 커스텀 노드로 처리
      Promise.resolve().then(() => {
        editor.commands.setContent(safeHTML);
      });

      const initImgs = [
        ...safeHTML.matchAll(/src="([^"]+\.(jpeg|jpg|png|webp|gif))"/gi),
      ].map((m) => m[1]);
      prevImgsRef.current = initImgs;
    }
  }, [editor, setEditor, safeHTML]);

  if (!editor) return null;

  console.log("editor.getHTML(); :", editor.getHTML());
  return (
    <div>
      <EditorContent
        editor={editor}
        className={`tiptap w-full overflow-y-auto scrollbar-none my-2 rounded-md ${
          readOnly ? "h-full" : "h-[460px]"
        }`}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "y")) {
            e.preventDefault();
            toast.error("컨트롤z 혹은 y는 사용 불가합니다.");
          }
        }}
      />
      {!readOnly && (
        <div className="">
          <NoteToolbar editor={editor} />
        </div>
      )}
    </div>
  );
}
