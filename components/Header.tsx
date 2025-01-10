// "use client";

import { Doc } from "@/convex/_generated/dataModel";

export default function Header({ document }: { document: Doc<"documents"> }) {
  return (
    <div className="px-[54px] pt-2">
      <div>
        {document.icon && (
          <div className="relative z-10 -mt-[52px] mb-1 flex h-20 w-20 items-center">
            <span className="text-6xl">{document.icon}</span>
          </div>
        )}
        <div className="h-7"></div>

        <div className="mb-10 whitespace-pre-wrap break-words text-4xl font-semibold sm:text-5xl">
          {document.title}
        </div>
      </div>
    </div>
  );
}
