"use client";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Banner from "@/app/(main)/_components/Banner";
import Cover from "@/components/Cover";
import Navbar from "@/app/(main)/_components/Navbar";
import Toolbar from "@/components/Toolbar";
import Header from "@/components/Header";
import { Editor } from "@/components/DynamicEditor";
import { CoverImageModal } from "@/components/modals/CoverImageModal";
import NotFound from "./not-found";

export default function DocumentPage() {
  const params = useParams();
  const document = useQuery(api.documents.getById, {
    id: params.documentId as Id<"documents">,
  });
  // const document = null;

  //skeleton of a document
  if (document === undefined) {
    return (
      <>
        <div className="flex items-center gap-x-2 p-2 pl-9">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="ml-auto h-7 w-7" />
          <Skeleton className="h-7 w-7" />
        </div>
        <div className="mx-auto mt-8 flex w-full px-[54px] max-w-4xl flex-col gap-y-2">
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
          <Banner document={document} />
          <Cover document={document} />
          <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-y-2">
            <Header document={document} />
            <Editor document={document} preview />
          </div>
        </>
      ) : (
        <>
          <Navbar document={document} />
          <Cover document={document} />
          <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-y-2">
            <Toolbar document={document} />
            <Editor document={document} />
          </div>
          <CoverImageModal document={document} />
        </>
      )}
    </>
  );
}
