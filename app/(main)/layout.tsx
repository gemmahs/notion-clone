"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavigationSidebar } from "./_components/NavigationSidebar";
import { Button } from "@/components/ui/button";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <AuthLoading>
        <div className="flex min-h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AuthLoading>

      <Unauthenticated>
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-y-2">
            <p className="text-lg font-semibold">You have to log in first</p>
            <Link href="/">
              <Button>Back to homepage</Button>
            </Link>
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <SidebarProvider>
          <NavigationSidebar />

          <SidebarInset>
            <SidebarTrigger className="absolute left-2 top-2 z-10" />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </Authenticated>
    </div>
  );
}

export default MainLayout;
