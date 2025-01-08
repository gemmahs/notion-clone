"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { ChevronRight, MoreHorizontal, File, Plus, Trash } from "lucide-react";
import { useState } from "react";

type DocumentListProps = {
  parentDocumentId?: Id<"documents">;
};
export default function DocumentList({ parentDocumentId }: DocumentListProps) {
  const documents = useQuery(api.documents.getDocumentList, {
    parentDocument: parentDocumentId,
  });
  const params = useParams();
  const expandedDocs = useQuery(api.documents.getAllParentDocs, {
    id: params.documentId as Id<"documents">,
  });

  if (documents === undefined)
    return (
      <div className="flex h-32 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  if (documents.length === 0)
    return <div className="p-2">No documents yet</div>;

  return (
    <>
      {documents.map((document) => (
        <DocumentTree
          key={document._id}
          doc={document}
          activeId={params.documentId as Id<"documents">}
          expandedDocs={expandedDocs}
        />
      ))}
    </>
  );
}

function DocumentTree({
  doc,
  activeId,
  expandedDocs,
}: {
  doc: Doc<"documents">;
  activeId?: Id<"documents">;
  expandedDocs?: Id<"documents">[];
}) {
  const [expanded, setExpanded] = useState(expandedDocs?.includes(doc._id));
  const { user } = useUser();
  const router = useRouter();
  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };
  //查找
  const childDocuments = useQuery(api.documents.getDocumentList, {
    parentDocument: doc._id,
  });

  //新建
  const createChildDoc = useMutation(api.documents.create);
  function onCreateChildDoc(event: React.MouseEvent) {
    event.stopPropagation();
    if (!doc._id) return;
    const promise = createChildDoc({
      title: "Untitled",
      parentDocument: doc._id,
    }).then((childDocId) => {
      setExpanded(true);
      onRedirect(childDocId);
    });

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  }

  //删除
  const archive = useMutation(api.documents.archive);
  function onArchive(event: React.MouseEvent) {
    event.stopPropagation();
    if (!doc._id) return;
    const promise = archive({
      id: doc._id,
    }).then(() => {
      setExpanded(true);
    });

    toast.promise(promise, {
      loading: "Deleting notes...",
      success: "Notes deleted!",
      error: "Failed to delete the note...",
    });
  }

  if (childDocuments === undefined)
    return (
      <SidebarMenuItem>
        <SidebarMenuSkeleton />
      </SidebarMenuItem>
    );

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={activeId === doc._id}
          className="data-[active=true]:bg-transparent"
        >
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-transform hover:bg-sidebar-foreground/10 ${expanded ? "rotate-90" : ""}`}
            onClick={() => setExpanded((prev) => !prev)}
          >
            <ChevronRight size={16} />
          </div>

          <div
            className="flex items-center gap-1 overflow-hidden"
            onClick={() => onRedirect(doc._id)}
          >
            {doc.icon ? (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                {doc.icon}
              </span>
            ) : (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                <File size={16} />
              </div>
            )}
            <span className="truncate">{doc.title}</span>
          </div>

          <div className="ml-auto flex items-center gap-[2px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover={true}>
                  <MoreHorizontal />
                </SidebarMenuAction>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="right"
                align="start"
                className="z-[9999]"
              >
                <DropdownMenuItem onClick={onArchive}>
                  <span className="w-4">
                    <Trash size={16} />
                  </span>
                  <span>Delete</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="font-medium text-muted-foreground">
                  Last edited by {user?.fullName}
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>

            <SidebarMenuAction
              showOnHover={true}
              onClick={(e) => onCreateChildDoc(e)}
            >
              <Plus />
            </SidebarMenuAction>
          </div>
        </SidebarMenuButton>

        {expanded && (
          <SidebarMenuSub>
            {childDocuments.length > 0 &&
              childDocuments.map((childDocument) => (
                <DocumentTree
                  key={childDocument._id}
                  doc={childDocument}
                  activeId={activeId}
                  expandedDocs={expandedDocs}
                />
              ))}

            {childDocuments.length === 0 && (
              <div className="pl-3 text-muted-foreground/50">
                No page inside
              </div>
            )}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    </>
  );
}
