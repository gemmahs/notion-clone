"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { PartialBlock } from "@blocknote/core";
import "./styles.css";
import { useTheme } from "next-themes";

export default function Editor({ document }: { document: Doc<"documents"> }) {
  const { resolvedTheme } = useTheme();
  const editor = useCreateBlockNote({
    initialContent: document.content
      ? (JSON.parse(document.content) as PartialBlock[])
      : [
          {
            type: "paragraph",
          },
        ],
  });

  return (
    <BlockNoteView
      editor={editor}
      editable={false}
      theme={resolvedTheme === "light" ? "light" : "dark"}
      sideMenu={false}
      data-theming-css-demo
      data-changing-font-demo
      className="min-h-[170px]"
      style={
        {
          "--editor-padding": "25px",
        } as React.CSSProperties
      }
    />
  );
}
