"use client";

import { Button } from "@/components/ui/button";
import { ConvexError } from "convex/values";
import Link from "next/link";

export default function PreviewError({ error }: { error: ConvexError<any> }) {
  // console.error(typeof error);
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-y-4 p-4">
      <img src="/error.svg" alt="error" className="max-w-40" />

      <p className="text-lg">Something went wrong...</p>
      <p>{error?.data}</p>
      <Link href="/documents">
        <Button>Back to document list page</Button>
      </Link>
    </div>
  );
}
