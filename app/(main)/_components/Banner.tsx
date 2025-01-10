"use client";

import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Banner({
  document,
  router,
}: {
  document: Doc<"documents">;
  router: ReturnType<typeof useRouter>;
}) {
  // const router = useRouter();
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
    router.replace("/documents"); //即便马上跳转，但还是会偶发性地报错(getById错误)，不知道为什么
    toast.promise(promise, {
      loading: "Deleting the note...",
      success: "Note deleted!",
      error: "Failed to delete the  note...",
    });
  }
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 bg-red-500 px-9 py-[6px] text-white">
      <span>This page is in the Trash</span>
      <div className="flex gap-x-2">
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
    </div>
  );
}

export default Banner;
