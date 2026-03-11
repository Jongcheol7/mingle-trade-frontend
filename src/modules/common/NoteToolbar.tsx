"use client";

import {
  Bold,
  List,
  Smile,
  ImagePlus,
  Paintbrush,
  AlignLeft,
  AlignCenter,
  AlignRight,
  SquareCheckBig,
  Type,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Editor as TiptapEditor } from "@tiptap/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useFileHandler } from "@/hooks/common/useFileHandler";

type Prop = {
  editor: TiptapEditor;
};

const FONT_SIZES = ["14px", "16px", "20px", "24px", "28px", "32px"];
const COLOR_PALETTE = [
  "#000000", // black
  "#e11d48", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#10b981", // green
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#6b7280", // gray
];

export default function NoteToolbar({ editor }: Prop) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const [isAlignOpen, setIsAlignOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const { handleImageSelect } = useFileHandler(editor);

  // 바깥 클릭 감지 → 모든 팝업 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node)
      ) {
        setIsFontSizeOpen(false);
        setIsAlignOpen(false);
        setIsColorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 파일 핸들러
  const handerFile = async (
    type: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (type === "image") {
        await handleImageSelect(file);
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      e.target.value = "";
    }
  };

  return (
    <>
      {/* 기본 툴바 */}
      <div
        ref={toolbarRef}
        className={
          "w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto bg-white border border-border rounded-xl px-4 py-2 flex justify-around items-center"
        }
      >
        {/* 글자크기 토글 */}
        <div className="relative">
          <Type
            className="w-5 h-5 cursor-pointer hover:text-primary"
            onClick={() => {
              setIsFontSizeOpen((prev) => !prev);
              setIsAlignOpen(false);
              setIsColorOpen(false);
            }}
          />

          {isFontSizeOpen && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-border rounded shadow-md flex flex-col z-50 text-sm">
              {FONT_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setTimeout(() => {
                      editor.chain().focus().setFontSize(size).run();
                    }, 0);
                    setIsFontSizeOpen(false);
                  }}
                  className="px-3 py-1 hover:bg-muted"
                >
                  {size.replace("px", "")}px
                </button>
              ))}
            </div>
          )}
        </div>
        {/* 두껍게 버튼 */}
        <Bold
          className="w-5 h-5  cursor-pointer hover:text-primary"
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        {/* ✅ 정렬 토글 */}
        <div className="relative">
          <AlignCenter
            className="w-5 h-5 cursor-pointer hover:text-primary"
            onClick={() => {
              setIsFontSizeOpen(false);
              setIsAlignOpen((prev) => !prev);
              setIsColorOpen(false);
            }}
          />

          {isAlignOpen && (
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white border border-border rounded shadow-md flex gap-2 p-3 z-50">
              <AlignLeft
                className="w-5 h-5 cursor-pointer hover:text-blue-600"
                onClick={() => {
                  setTimeout(() => {
                    editor.chain().focus().setTextAlign("left").run();
                  }, 0);
                  setIsAlignOpen(false);
                }}
              />
              <AlignCenter
                className="w-5 h-5 cursor-pointer hover:text-blue-600"
                onClick={() => {
                  setTimeout(() => {
                    editor.chain().focus().setTextAlign("center").run();
                  }, 0);
                  setIsAlignOpen(false);
                }}
              />
              <AlignRight
                className="w-5 h-5 cursor-pointer hover:text-blue-600"
                onClick={() => {
                  setTimeout(() => {
                    editor.chain().focus().setTextAlign("right").run();
                  }, 0);
                  setIsAlignOpen(false);
                }}
              />
            </div>
          )}
        </div>
        {/* 이미지 업로드 버튼 */}
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={(e) => handerFile("image", e)}
        />
        <ImagePlus
          className="w-5 h-5 cursor-pointer hover:text-primary"
          onClick={() => fileInputRef.current?.click()}
        />
        {/* 비디오 업로드 버튼 */}
        <input
          type="file"
          accept="video/*"
          hidden
          ref={videoInputRef}
          onChange={(e) => handerFile("video", e)}
        />
        <Video
          className="w-5 h-5 cursor-pointer hover:text-primary"
          onClick={() => videoInputRef.current?.click()}
        />
        {/* 리스트 버튼 */}
        <List
          className="w-5 h-5  cursor-pointer hover:text-primary"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        {/* To-Do 버튼 */}
        <SquareCheckBig
          className="w-5 h-5  cursor-pointer hover:text-primary"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        />
        {/* 이모티콘 버튼 */}
        <Smile
          className={`w-5 h-5 cursor-pointer hover:text-primary`}
          onClick={() => editor.chain().focus().insertContent("📝").run()}
        />
        {/* 글자색 버튼 */}
        <div className="relative">
          {/* 색상 토글 아이콘 */}
          <Paintbrush
            className={`w-5 h-5 cursor-pointer hover:text-primary ${
              isColorOpen ? "text-primary" : ""
            }`}
            onClick={() => {
              setIsFontSizeOpen(false);
              setIsAlignOpen(false);
              setIsColorOpen((prev) => !prev);
            }}
          />

          {/* 색상 팔레트 */}
          {isColorOpen && (
            <div className="absolute bottom-full mb-2 right-[-20px] bg-white border border-border rounded shadow-md p-2 z-50 flex gap-1">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setTimeout(() => {
                      editor.chain().focus().setColor(color).run();
                    }, 0);
                    setIsColorOpen(false);
                  }}
                  className="w-6 h-6 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
