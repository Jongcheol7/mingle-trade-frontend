import React, { useRef } from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";

export default function ResizableImageComponent({
  node,
  updateAttributes,
  selected,
}: NodeViewProps) {
  const { src, width, height } = node.attrs as {
    src: string;
    width?: string;
    height?: string;
  };

  const imgRef = useRef<HTMLImageElement | null>(null);

  const startResize = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    const isTouch = e.type === "touchstart";
    const startX = isTouch
      ? (e as React.TouchEvent).touches[0].clientX
      : (e as React.MouseEvent).clientX;

    const startWidth = imgRef.current?.offsetWidth ?? 0;

    const doResize = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX =
        moveEvent.type === "touchmove"
          ? (moveEvent as TouchEvent).touches[0].clientX
          : (moveEvent as MouseEvent).clientX;

      const newWidth = startWidth + (clientX - startX);
      updateAttributes({ width: `${newWidth}px` });
    };

    const stopResize = () => {
      window.removeEventListener("mousemove", doResize);
      window.removeEventListener("mouseup", stopResize);
      window.removeEventListener("touchmove", doResize);
      window.removeEventListener("touchend", stopResize);
    };

    window.addEventListener("mousemove", doResize);
    window.addEventListener("mouseup", stopResize);
    window.addEventListener("touchmove", doResize);
    window.addEventListener("touchend", stopResize);
  };

  return (
    <NodeViewWrapper
      as="div"
      data-type="resizable-image"
      className="relative inline-block"
    >
      <img
        ref={imgRef}
        src={src}
        alt="resizable"
        style={{
          width: width || "auto",
          height: height || "auto",
          display: "block",
        }}
      />
      {selected && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
          onMouseDown={startResize}
          onTouchStart={startResize}
        ></div>
      )}
    </NodeViewWrapper>
  );
}
