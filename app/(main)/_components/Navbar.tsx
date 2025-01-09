"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Title from "./Title";
import { toast } from "sonner";
import PublishPopover from "./PublishPopover";

function Navbar({ document }: { document: Doc<"documents"> }) {
  const archive = useMutation(api.documents.archive);
  const { user } = useUser();

  //软删除
  function handleDelete() {
    const promise = archive({ id: document._id });
    toast.promise(promise, {
      loading: "Deleting the note...",
      success: "Note deleted!",
      error: "Failed to delete the note...",
    });
  }

  return (
    <div className="flex flex-1 items-center p-2">
      <Title document={document} />
      <div className="ml-auto flex gap-x-2">
        <PublishPopover document={document} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm hover:bg-accent">
              <MoreHorizontal size={16} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[1600] w-auto">
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleDelete}
              >
                <Trash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {/* <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <div className="px-1 text-sm text-muted-foreground">
                {`Last edited by ${user?.fullName}`}
              </div>
            </DropdownMenuGroup> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default Navbar;
