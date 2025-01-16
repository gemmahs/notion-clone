"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useCreateBlockNote } from "@blocknote/react";
// import { BlockNoteView } from "@blocknote/shadcn";//上传图片的弹窗很丑
// import "@blocknote/shadcn/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css"; //颜色都得改
import "./styles.css"; //自定义主题色，因为mantine的颜色和shadcn不一样
import { PartialBlock } from "@blocknote/core";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";

export default function Editor({ document }: { document: Doc<"documents"> }) {
  const { resolvedTheme } = useTheme();

  const { edgestore } = useEdgeStore();
  async function handleUpload(file: File) {
    const response = await edgestore.publicFiles.upload({ file });
    return response.url;
  }

  const update = useMutation(api.documents.update);
  function onChange(content: string) {
    update({
      id: document._id,
      content,
    });
  }

  const editor = useCreateBlockNote({
    initialContent: document.content
      ? (JSON.parse(document.content) as PartialBlock[])
      : [
          {
            type: "paragraph", //You can't pass an empty array.
          },
        ],
    uploadFile: handleUpload, //图片尺寸调节不了，很奇怪
  });

  return (
    <BlockNoteView
      editor={editor}
      onChange={() => onChange(JSON.stringify(editor.document))}
      theme={resolvedTheme === "light" ? "light" : "dark"}
      data-theming-css-demo
      data-changing-font-demo
      className="min-h-[170px]"
    />
  );
}
