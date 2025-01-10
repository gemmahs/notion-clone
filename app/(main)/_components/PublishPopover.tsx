"use client";

import {
  Upload,
  Check,
  CircleCheckBig,
  ClipboardCheck,
  Copy,
  ExternalLink,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useOrigin } from "@/hooks/useOrigin";
import { useState } from "react";
import Link from "next/link";

export default function PublishPopover({
  document,
}: {
  document: Doc<"documents">;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false); //更改图标
  const isPublished = document.isPublished;

  const update = useMutation(api.documents.update);
  async function onPublish() {
    setIsSubmitting(true);
    await update({ id: document._id, isPublished: true });
    setIsSubmitting(false);
  }

  function onUnpublish() {
    setIsSubmitting(true);
    update({ id: document._id, isPublished: false }).then(() => {
      setIsSubmitting(false);
    });
  }

  const origin = useOrigin();
  const url = `${origin}/preview/${document._id}`;
  async function onCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {isPublished ? (
          <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm hover:bg-accent">
            <Check size={16} />
          </div>
        ) : (
          <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm hover:bg-accent">
            <Upload size={16} />
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex w-80 flex-col items-center justify-center gap-y-4 text-sm"
      >
        {isPublished ? (
          <>
            <div className="flex items-center justify-center gap-x-2 font-medium">
              <CircleCheckBig size={16} />
              <p>This page is now active on web</p>
            </div>

            <div className="flex w-full flex-col">
              <div className="flex items-center justify-center">
                <Input
                  readOnly
                  defaultValue={url}
                  className="h-8 truncate rounded-r-none focus-visible:ring-transparent"
                />

                <Button
                  size="sm"
                  className="rounded-l-none"
                  disabled={copied}
                  onClick={onCopy}
                >
                  {copied ? <ClipboardCheck /> : <Copy />}
                </Button>
              </div>
              <div className="mt-3 grid grid-cols-2 content-center gap-x-2">
                <Button
                  size="sm"
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={onUnpublish}
                >
                  {isSubmitting ? (
                    <Spinner size="sm" />
                  ) : (
                    <span>Unpublish</span>
                  )}
                </Button>

                <Link href={url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="w-full">
                    Go to page
                    <ExternalLink />
                  </Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1 text-center">
              <p className="font-medium">Publish this page</p>
              <p className="text-xs text-muted-foreground">
                Share your work with others
              </p>
            </div>
            <Button
              size="sm"
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-16"
            >
              {isSubmitting ? <Spinner size="sm" /> : <span>Publish</span>}
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
