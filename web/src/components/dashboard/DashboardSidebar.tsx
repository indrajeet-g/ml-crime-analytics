"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Upload, 
  ScanText, 
  GitMerge, 
  Waypoints, 
  ShieldCheck, 
  FileBarChart,
  ArrowLeft,
  X
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Upload Records", href: "/dashboard/ingest", icon: Upload },
  { label: "Find Details", href: "/dashboard/extract", icon: ScanText },
  { label: "Match Records", href: "/dashboard/resolve", icon: GitMerge },
  { label: "Network View", href: "/dashboard/network", icon: Waypoints },
  { label: "Evidence Trail", href: "/dashboard/evidence", icon: ShieldCheck },
  { label: "Reports", href: "/dashboard/reports", icon: FileBarChart },
];

export default function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 lg:hidden" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar. Same dark rail as the public nav (#0a0a0a / #262626 / #a3a3a3),
          so the black frame reads as one identity from the landing page into
          the dashboard rather than switching palette at the login wall. */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#262626] bg-[#0a0a0a] transition-transform duration-300 ease-[cubic-bezier(0.25,0,0,1)] lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#262626] px-6">
          <Link
            href="/dashboard"
            className="font-[family-name:var(--font-mono)] text-xl font-bold uppercase tracking-widest text-[#ff3d00]"
          >
            NEXUS
          </Link>
          <button
            type="button"
            className="lg:hidden text-[#a3a3a3] hover:text-white"
            onClick={onClose}
          >
            <X size={20} />
            <span className="sr-only">Close sidebar</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => onClose()}
                    className={`group flex items-center gap-3 border-l-2 px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-[#ff3d00] bg-white/5 text-white"
                        : "border-transparent text-[#a3a3a3] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={isActive ? "text-[#ff3d00]" : "text-[#a3a3a3] group-hover:text-white"}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-[#262626] p-4">
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 border border-[#262626] bg-transparent px-4 py-2.5 text-sm font-semibold uppercase tracking-wider text-[#a3a3a3] transition-colors hover:border-white/30 hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Site
          </Link>
        </div>
      </aside>
    </>
  );
}
