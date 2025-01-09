"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModeToggle } from "@/components/ToggleTheme";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function SettingsModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <Settings />
          <span>Settings</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="z-[3000] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>My Settings</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex justify-between gap-2">
          <div className="flex flex-col">
            <span>Appearance</span>
            <span className="text-sm text-muted-foreground">
              Customize how Jotion looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsModal;
