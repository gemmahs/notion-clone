"use client";

import { CirclePlus } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DocumentList from "./DocumentList";
import TrashPopover from "./TrashPopover";
import SearchModal from "./SearchModal";
import SettingsModal from "./SettingsModal";
import DocumentList2 from "./DocumentList2";

export default function SidebarList() {
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
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SearchModal />
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SettingsModal />
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton onClick={onCreate}>
                <CirclePlus />
                <span>New Page</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <DocumentList2 />
            {/* <DocumentList /> */}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <TrashPopover />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
