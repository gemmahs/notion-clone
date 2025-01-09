"use client";

import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Banner({ document }: { document: Doc<"documents"> }) {
  const router = useRouter();
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  function onRestore() {
    const promise = restore({ id: document._id });
    toast.promise(promise, {
      loading: "Restoring the note...",
      success: "Note restored!",
      error: "Failed to restore the  note...",
    });
  }
  function onRemove() {
    const promise = remove({ id: document._id });
    router.push("/documents"); //必须马上跳转，不然刷新页面的时候重新调用getById函数，然后报错
    toast.promise(promise, {
      loading: "Deleting the note...",
      success: "Note deleted!",
      error: "Failed to delete the  note...",
    });
  }
  return (
    <div className="flex flex-1 items-center justify-center gap-2 bg-red-500 p-2 text-white">
      <span>This page is in the Trash.</span>
      <Button
        size="sm"
        variant="outline"
        className="border-white bg-transparent hover:bg-white hover:text-red-500"
        onClick={onRestore}
      >
        Restore
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-white hover:text-red-500"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
}

export default Banner;
