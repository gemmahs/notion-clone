"use client";

import { useCoverImage } from "@/hooks/stores";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SingleImageDropzone } from "../SingleImageDropzone";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

export function CoverImageModal({ document }: { document: Doc<"documents"> }) {
  const id = document._id;
  const coverImage = useCoverImage();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { edgestore } = useEdgeStore();

  const update = useMutation(api.documents.update);

  function onClose() {
    setIsSubmitting(false);
    setFile(undefined);
    coverImage.onClose(); //关闭上传图片的弹窗
  }

  //上传图片
  async function onChange(file?: File) {
    if (!file) return;
    setIsSubmitting(true);
    setFile(file);
    const res = await edgestore.publicFiles.upload({
      file,
      options: {
        replaceTargetUrl: document?.coverImage,
      },
    });
    await update({ id, coverImage: res.url });
    onClose();
  }

  return (
    //不用组件自带的DialogTrigger是为了更好地控制Dialog
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent className="border-0 outline-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Cover image</DialogTitle>
        </DialogHeader>
        <SingleImageDropzone
          value={file}
          onChange={onChange}
          disabled={isSubmitting}
          className="h-full w-full outline-none"
        />
      </DialogContent>
    </Dialog>
  );
}
