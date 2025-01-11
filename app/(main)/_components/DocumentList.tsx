"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSkeleton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, MoreHorizontal, File, Plus, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

//DocumentList应该只在网址里的documentId变化的时候re-render
//只要点击不同文件，侧边栏都会经历一个空白阶段（也就是skeleton）!--找到原因了，是由于在return里加了条件expandedDocs&&，以至于每次re-render都要从0开始生成DOM
export default function DocumentList() {
  console.log("DocumentList rendering...");
  const { documentId: activeId } = useParams();
  //expandedDocs是一个Id列表，只跟网址里的documentId（即activeId）有关系
  const expandedDocs = useQuery(api.documents.getAllParentDocs, {
    id: activeId as Id<"documents">,
  });
  console.log(expandedDocs);
  const router = useRouter();
  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };
  //以下这句会导致侧边栏反复清零后重新生成，严重影响reconciliation效率
  // if (expandedDocs === undefined) return "Loading all parent Docs"
  return (
    <>
      <SidebarMenuItem className="hidden p-2 text-muted-foreground/50 last:block">
        No documents
      </SidebarMenuItem>
      <DocumentTree
        activeId={activeId as Id<"documents">}
        expandedDocs={expandedDocs}
        onRedirect={onRedirect}
      />
    </>
  );
}

//必须理解一个DocumentTree对应于同一parentDoc、同一层级的所有文件
function DocumentTree({
  parentId,
  activeId,
  expandedDocs,
  onRedirect,
}: {
  parentId?: Id<"documents">; //一开始是undefined
  activeId?: Id<"documents">;
  expandedDocs?: Id<"documents">[];
  onRedirect: (documentId: string) => void;
}) {
  console.log("DocumentTree rendering...");
  //根据上级文件查找直属子文件，这里用不了useCallback
  //上级文件可以是undefined
  //只要数据库有改动，useQuery按理说会自动调用，导致整个DocumentTree re-render
  const childDocuments = useQuery(api.documents.getDocumentList, {
    parentDocument: parentId,
  });
  //如果一个文件的documentId显示在网址中，那么其所有上级文件必须全部自动展开
  //每一个文件本身对应一个expanded状态，跟parentId没有关系
  //问题是DocumentTree不单单render一个document，而是一组同层级同parent的文件。因此expanded应该改成一个列表
  const [expanded, setExpanded] = useState<Record<Id<"documents">, boolean>>(
    {},
  );
  //等待childDocuments加载完成后更新各个document的expanded状态
  useEffect(() => {
    console.log("childDocuments changed, useEffect() invoked.");
    if (childDocuments && expandedDocs && expandedDocs.length > 0) {
      const expandedState = childDocuments.reduce<
        Record<Id<"documents">, boolean>
      >((acc, doc) => {
        acc[doc._id] = expandedDocs.includes(doc._id);
        return acc;
      }, {});
      setExpanded(expandedState);
      console.log(`${childDocuments.map((doc) => doc.title)}`);
    }
  }, [childDocuments]);

  const onExpand = useCallback(
    (id: Id<"documents">) =>
      setExpanded((prev) => ({ ...prev, [id]: !prev[id] })),
    [],
  );
  //新建文件函数
  //用useCallback()避免重复创建函数
  const createChildDocument = useMutation(api.documents.create);
  const onCreateChildDoc = useCallback((id: Id<"documents">) => {
    if (!id) return;
    const promise = createChildDocument({
      title: "Untitled",
      parentDocument: id,
    }).then((childDocId) => {
      setExpanded((prev) => ({ ...prev, [id]: true }));
      onRedirect(childDocId);
    });
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  }, []);
  //删除
  const archive = useMutation(api.documents.archive); // custom hook
  const onArchive = useCallback((id: Id<"documents">) => {
    if (!id) return;
    const promise = archive({
      id,
    });
    toast.promise(promise, {
      loading: "Deleting notes...",
      success: "Notes deleted!",
      error: "Failed to delete the note...",
    });
  }, []);

  if (childDocuments === undefined)
    return (
      <SidebarMenuItem>
        <SidebarMenuSkeleton />
      </SidebarMenuItem>
    );

  return (
    <>
      {childDocuments?.map((childDoc) => (
        <SidebarMenuItem key={childDoc._id}>
          <SidebarMenuButton
            isActive={activeId === childDoc._id}
            className="data-[active=true]:bg-transparent"
          >
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-transform hover:bg-sidebar-foreground/10 ${expanded[childDoc._id] ? "rotate-90" : ""}`}
              onClick={() => onExpand(childDoc._id)}
            >
              <ChevronRight size={16} />
            </div>

            <div
              className="flex items-center gap-1 overflow-hidden"
              onClick={() => onRedirect(childDoc._id)}
            >
              {childDoc.icon ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {childDoc.icon}
                </span>
              ) : (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                  <File size={16} />
                </div>
              )}
              <span className="truncate">{childDoc.title}</span>
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
                  className="z-[3000]"
                >
                  <DropdownMenuItem onClick={() => onArchive(childDoc._id)}>
                    <span className="w-4">
                      <Trash size={16} />
                    </span>
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <SidebarMenuAction
                showOnHover={true}
                onClick={() => onCreateChildDoc(childDoc._id)}
              >
                <Plus />
              </SidebarMenuAction>
            </div>
          </SidebarMenuButton>

          {expanded[childDoc._id] && (
            <SidebarMenuSub>
              <SidebarMenuSubItem className="hidden pl-3 text-muted-foreground/50 last:block">
                No page inside
              </SidebarMenuSubItem>
              <DocumentTree
                parentId={childDoc._id}
                activeId={activeId}
                expandedDocs={expandedDocs}
                onRedirect={onRedirect}
              />
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      ))}
    </>
  );
}
