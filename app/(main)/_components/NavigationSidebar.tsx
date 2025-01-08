"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import UserNav from "./UserNav";
import SidebarList from "./SidebarList";

export function NavigationSidebar() {
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null); //侧边栏宽度
  const railRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      e.preventDefault();
      e.stopPropagation();
      if (isResizing && railRef.current && sidebarRef.current) {
        let width = e.clientX;
        if (width < 240) width = 240;
        else if (width > 480) width = 480;
        sidebarRef.current.style.setProperty("--sidebar-width", `${width}px`);
      }
    }

    function handleMouseUp() {
      setIsResizing(false);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <Sidebar ref={sidebarRef}>
      <SidebarHeader>
        <UserNav />
      </SidebarHeader>

      <SidebarContent>
        <SidebarList />
      </SidebarContent>

      <SidebarRail ref={railRef} onMouseDown={() => setIsResizing(true)} />
      {/*用来resize整个sidebar，需要自行添加resize功能*/}
    </Sidebar>
  );
}
