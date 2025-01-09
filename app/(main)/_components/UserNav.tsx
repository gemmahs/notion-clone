"use client";

import { ChevronsUpDown, LogOut, ChevronsRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser, SignOutButton } from "@clerk/nextjs";

export default function UserNav() {
  const { user } = useUser();
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="rounded-lg">NC</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.fullName}</span>
                <span className="truncate text-xs">
                  {user?.primaryEmailAddress?.emailAddress}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <UserMenu />
        </DropdownMenu>

        <SidebarTrigger className="shrink-0" />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function UserMenu() {
  const { user } = useUser();
  const { isMobile } = useSidebar();
  return (
    <DropdownMenuContent
      className="z-[3000] w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      side={isMobile ? "bottom" : "right"}
      align="start"
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="rounded-lg">J</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user?.fullName}</span>
            <span className="truncate text-xs">{user?.firstName}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <SignOutButton>
        <DropdownMenuItem>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </SignOutButton>
    </DropdownMenuContent>
  );
}
