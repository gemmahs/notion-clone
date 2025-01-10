"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";

export default function DocumentsPage() {
  const { open, isMobile } = useSidebar();
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);

  function onCreate() {
    const promise = create({ title: "Untitled" }).then((id) =>
      router.push(`/documents/${id}`),
    );
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-center">
      {(isMobile || !open) && (
        <SidebarTrigger className="absolute left-2 top-2" />
      )}

      <div className="max-w-40">
        <img src="/empty.svg" alt="empty" />
      </div>
      <h1 className="font-semibold">Hi {user?.firstName}, welcome to Jotion</h1>

      <Button onClick={onCreate}>
        <span>
          <CirclePlus />
        </span>
        <span>Create a project</span>
      </Button>
    </div>
  );
}
