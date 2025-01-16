"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error() {
  // console.error(typeof error);
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-y-4 p-4">
      <img src="/error.svg" alt="error" className="max-w-40" />

      <p className="text-lg">Something went wrong...</p>

      <Link href="/">
        <Button>Back to homepage</Button>
      </Link>
    </div>
  );
}
