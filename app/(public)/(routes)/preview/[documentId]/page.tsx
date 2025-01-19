// "use client";

import Header from "@/components/Header";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
// import { useQuery } from "convex/react";
import { fetchQuery } from "convex/nextjs";
// import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
// import Cover from "@/components/Cover";
import PreviewEditor from "@/components/PreviewEditor";
import Image from "next/image";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  // const params = useParams();
  const documentId = (await params).documentId;
  const document = await fetchQuery(api.documents.getForPreview, {
    id: documentId as Id<"documents">,
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

  if (!document)
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-y-3 p-4">
        <img src="/404.svg" alt="404" className="max-w-40" />
        <p className="text-lg">Page not found</p>
      </div>
    );

  return (
    <>
      {/* <Cover document={document} preview /> */}
      {document.coverImage ? (
        <div className="relative h-[30svh] w-full">
          <Image
            src={document.coverImage}
            alt="Cover Image"
            fill
            priority
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-16 bg-transparent"></div>
      )}

      {/* Toolbar加上preview后的逻辑太复杂，不如重写一个组件Header */}
      <div className="mx-auto grid w-full max-w-[800px] grid-cols-1 gap-y-2">
        <div className="px-[25px] pt-2">
          <Header document={document} />
        </div>
        <PreviewEditor document={document} />
      </div>
    </>
  );
}
