"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SyntheticDataBanner from "@/components/dashboard/SyntheticDataBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    /* lg:h-screen, not just min-h-screen. The shell pairs overflow-hidden
       with an inner <main overflow-y-auto>, and that only scrolls when the
       parent height is actually fixed. With min-h-screen the shell grows
       past the viewport instead and overflow-hidden clips the overflow
       with nothing able to scroll to it. Below lg the page scrolls normally. */
    <div className="flex min-h-screen flex-col bg-[#fafafa] text-[#0a0a0a] lg:h-screen lg:flex-row lg:overflow-hidden">
      <DashboardSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex flex-1 flex-col lg:min-w-0 lg:overflow-hidden">
        <DashboardHeader onOpenSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <SyntheticDataBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
