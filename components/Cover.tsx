"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import Image from "next/image";
import { X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCoverImage } from "@/hooks/stores";
import { useEdgeStore } from "@/lib/edgestore";

export default function Cover({
  document,
  preview,
}: {
  document: Doc<"documents">;
  preview?: boolean;
}) {
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();

  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  async function onRemove() {
    if (!document.coverImage) return;
    const url = document.coverImage;
    await removeCoverImage({ id: document._id }); //返回的是null
    await edgestore.publicFiles.delete({
      url,
    });
  }

  if (!document.coverImage) return <div className="h-16 bg-transparent"></div>;

  return (
    <div className="group/cover relative h-[30svh] w-full">
      <Image
        src={document.coverImage}
        alt="Cover Image"
        fill //上级元素必须要有position property
        priority
        className="object-cover"
      />
      {!preview && !document.isArchived && (
        <div className="absolute bottom-2 right-2 z-10 flex gap-x-2 opacity-0 transition-opacity group-hover/cover:opacity-100">
          <Button
            variant="outline"
            size="sm"
            className="h-6 gap-1 border-0 p-1 text-xs font-normal text-muted-foreground shadow-none hover:bg-accent hover:text-muted-foreground"
            onClick={coverImage.onOpen}
          >
            <ImageIcon size={16} />
            <span>Change cover</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-6 gap-1 border-0 p-1 text-xs font-normal text-muted-foreground shadow-none hover:bg-accent hover:text-muted-foreground"
            onClick={onRemove}
          >
            <X size={16} />
            <span>Remove</span>
          </Button>
        </div>
      )}
    </div>
  );
}
