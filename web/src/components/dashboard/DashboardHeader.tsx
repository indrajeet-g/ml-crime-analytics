"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowRight } from "lucide-react";

interface HeaderProps {
  onOpenSidebar: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/ingest": "Ingest Data",
  "/dashboard/extract": "Entity Extraction",
  "/dashboard/resolve": "Entity Resolution",
  "/dashboard/network": "Network Explorer",
  "/dashboard/evidence": "Evidence & Custody",
  "/dashboard/reports": "Reports",
};

export default function DashboardHeader({ onOpenSidebar }: HeaderProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-[#d4d4d4] bg-[#fafafa] px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden flex h-10 w-10 items-center justify-center text-[#737373] hover:text-[#0a0a0a]"
        >
          <Menu size={20} />
          <span className="sr-only">Open sidebar</span>
        </button>
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="lg:hidden font-[family-name:var(--font-mono)] text-lg font-bold tracking-widest text-[#ff3d00]"
          >
            NEXUS
          </Link>
          <div className="hidden h-6 w-px bg-[#d4d4d4] lg:block" />
          <h1 className="text-lg font-semibold tracking-tight text-[#0a0a0a]">
            {title}
          </h1>
        </div>
      </div>
      
      <Link
        href="/"
        className="group flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[#737373] transition-colors hover:text-[#0a0a0a]"
      >
        Back to Site
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </header>
  );
}
