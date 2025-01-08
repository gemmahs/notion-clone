"use client";

import Header from "../../../../../components/Header";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Cover from "@/components/Cover";
import { Editor } from "@/components/DynamicEditor";

export default function PreviewPage() {
  const params = useParams();
  const document = useQuery(api.documents.getForPreview, {
    id: params.documentId as Id<"documents">,
  });

  if (document === undefined) {
    return (
      <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col gap-y-2 px-[54px]">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-6 w-72" />
        <Skeleton className="h-6 w-56" />
      </div>
    );
  }

  if (!document) return <span>Not found</span>;

  return (
    <>
      <Cover document={document} preview />
      {/* Toolbar加上preview后的逻辑太复杂，不如重写一个组件 */}
      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-y-2">
        <Header document={document} />
        <Editor document={document} preview />
      </div>
    </>
  );
}
