import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ResizableImageComponent from "./ResizableImageComponent";

export const ResizableImage = Node.create({
  name: "resizableImage",
  group: "block",
  inline: false,
  draggable: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: "auto" },
      height: { default: "auto" },
    };
  },

  // HTML->에디터 구조로 바꿀때 img태그를 감지해서 속성을 추출
  parseHTML() {
    return [
      {
        tag: "img[src]",
        getAttrs: (dom) => {
          const element = dom;

          // style 속성 문자열 직접 추출해서 정규식으로 파싱
          const style = element.getAttribute("style") || "";
          const widthMatch = style.match(/width:\s*([^;]+);?/);
          const heightMatch = style.match(/height:\s*([^;]+);?/);

          return {
            src: element.getAttribute("src"),
            width: widthMatch ? widthMatch[1] : "auto",
            height: heightMatch ? heightMatch[1] : "auto",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      {
        src: HTMLAttributes.src,
        style: `width: ${HTMLAttributes.width}; height: ${HTMLAttributes.height};`,
        "data-type": "resizable-image",
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});
