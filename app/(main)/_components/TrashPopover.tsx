"use client";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Undo, Trash, Search } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { useState } from "react";

function TrashPopover() {
  const [searchInput, setSearchInput] = useState("");
  const isMobile = useIsMobile({ breakpoint: 576 });
  const router = useRouter();
  //查找
  const trashDocs = useQuery(api.documents.getTrash);
  const filteredTrashDocs = trashDocs?.filter((doc) =>
    doc.title.toLowerCase().includes(searchInput.toLowerCase()),
  );
  //复原
  const restore = useMutation(api.documents.restore);
  //彻底删除
  const remove = useMutation(api.documents.remove);

  function onRestore(id: Id<"documents">) {
    const promise = restore({ id });
    toast.promise(promise, {
      loading: "Restoring the note...",
      success: "Note restored!",
      error: "Failed to restore the note...",
    });
  }

  function onRemove(id: Id<"documents">) {
    const promise = remove({ id });
    toast.promise(promise, {
      loading: "Deleting the note...",
      success: "Note deleted!",
      error: "Failed to delete the note...",
    });
  }

  //跳转
  function onRedirect(documentId: string) {
    router.push(`/documents/${documentId}`);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
  }

  if (trashDocs === undefined)
    return (
      <div className="flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  return (
    <SidebarMenuItem>
      <Popover>
        <PopoverTrigger asChild>
          <SidebarMenuButton>
            <Trash />
            <span>Trash</span>
          </SidebarMenuButton>
        </PopoverTrigger>

        <PopoverContent
          side={`${isMobile ? "top" : "right"}`}
          align="start"
          className="z-[3000] text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Search />
            <Input
              placeholder="Filter by page title..."
              className="border-none bg-secondary text-primary focus-visible:ring-transparent"
              value={searchInput}
              onChange={handleInput}
            />
          </div>
          <div className="mt-3">
            <div className="hidden px-2 py-1 text-center last:block">
              No document found
            </div>
            {filteredTrashDocs?.map((doc) => (
              <div
                key={doc._id}
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1 hover:bg-accent"
              >
                <span
                  className="cursor-pointer truncate text-sm text-primary"
                  onClick={() => onRedirect(doc._id)}
                >
                  {doc.title}
                </span>
                <span
                  role="button"
                  className="ml-auto flex h-5 w-5 cursor-pointer items-center justify-center rounded-md hover:bg-primary/10"
                  onClick={() => onRestore(doc._id)}
                >
                  <Undo size={16} />
                </span>
                <ConfirmModal onConfirm={() => onRemove(doc._id)}>
                  <span
                    role="button"
                    className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md hover:hover:bg-primary/10"
                  >
                    <Trash size={16} />
                  </span>
                </ConfirmModal>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </SidebarMenuItem>
  );
}

export default TrashPopover;
