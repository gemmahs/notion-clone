"use client";

import { Authenticated, AuthLoading } from "convex/react";
import { Spinner } from "@/components/ui/spinner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { NavigationSidebar } from "./_components/NavigationSidebar";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <AuthLoading>
        <div className="flex min-h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AuthLoading>

      {/* 不加用户验证的原因是上一级page已经添加了Unauthenticated的UI，这里再加上会导致两次跳转 */}
      {/* <Unauthenticated>
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-y-2">
            <p className="text-lg font-semibold">You have to log in first</p>
            <Link href="/">
              <Button>Back to homepage</Button>
            </Link>
          </div>
        </div>
      </Unauthenticated> */}

      <Authenticated>
        <SidebarProvider>
          {/* 把Navigationbar注释掉，编辑器里的图片就可以缩放。但还是没弄清楚到底哪里出问题了 */}
          <NavigationSidebar />

          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </Authenticated>
    </div>
  );
}

export default MainLayout;
