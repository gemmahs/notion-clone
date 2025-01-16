"use client";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Banner from "@/app/(main)/_components/Banner";
import Cover from "@/components/Cover";
import Navbar from "@/app/(main)/_components/Navbar";
import Toolbar from "@/components/Toolbar";
import Header from "@/components/Header";
import { Editor } from "@/components/DynamicEditor";
import { CoverImageModal } from "@/components/modals/CoverImageModal";
import NotFound from "./not-found";
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import PreviewEditor from "@/components/PreviewEditor";

export default function DocumentPage() {
  const router = useRouter(); //主要是为了避免删除文件后，route改变不及时导致再次调用getById获取被删除Id
  //侧边栏是否打开
  const { open, isMobile } = useSidebar();
  // const params = useParams();
  const { documentId } = useParams();
  const document = useQuery(api.documents.getById, {
    id: documentId as Id<"documents">,
  });

  //skeleton of a document
  if (document === undefined) {
    return (
      <>
        <div className="flex h-9 items-center gap-x-2 p-2">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="ml-auto h-5 w-7" />
          <Skeleton className="h-5 w-7" />
        </div>
        <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col gap-y-2 px-[54px]">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-72" />
          <Skeleton className="h-6 w-56" />
        </div>
      </>
    );
  }

  if (!document) return <NotFound />;

  return (
    <>
      {document.isArchived ? (
        <>
          <div className="sticky top-0 z-[1500] w-full">
            {(isMobile || !open) && (
              <SidebarTrigger className="absolute top-2 ml-2" />
            )}
            <Banner document={document} router={router} />
          </div>
          <Cover document={document} />
          <div className="mx-auto grid w-full max-w-[800px] grid-cols-1 gap-y-2">
            <div className="px-[25px] pt-2">
              <Header document={document} />
            </div>
            <PreviewEditor document={document} />
          </div>
        </>
      ) : (
        <>
          <div className="sticky top-0 z-[1500] flex w-full items-center bg-background/90">
            {(isMobile || !open) && <SidebarTrigger className="ml-2" />}
            <Navbar document={document} />
          </div>
          <Cover document={document} />
          <div className="mx-auto grid w-full max-w-[858px] grid-cols-1 gap-y-2">
            <Toolbar document={document} />
            <Editor document={document} />
          </div>
          <CoverImageModal document={document} />
        </>
      )}
    </>
  );
}
