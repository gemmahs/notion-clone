"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

function DocumentsPage() {
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  function onCreate() {
    const promise = create({ title: "Untitled" });
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-center">
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

export default DocumentsPage;
