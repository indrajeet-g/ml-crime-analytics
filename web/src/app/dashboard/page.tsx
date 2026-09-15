"use client";

import Link from "next/link";
import { Upload, ScanText, GitMerge, Waypoints, ShieldCheck, FileBarChart } from "lucide-react";
import { Reveal, RevealGroup, RevealItem, Label } from "@/components/ui";
import netData from "@/data/network.json";

const QUICK_ACTIONS = [
  { title: "Upload Records", desc: "Upload case files, FIRs, and reports", icon: Upload, href: "/dashboard/ingest" },
  { title: "Find Details", desc: "Automatically read documents to find important people and items", icon: ScanText, href: "/dashboard/extract" },
  { title: "Match Records", desc: "Review and approve suggested matches", icon: GitMerge, href: "/dashboard/resolve" },
  { title: "Network View", desc: "See connections between cases and people", icon: Waypoints, href: "/dashboard/network" },
  { title: "Evidence Trail", desc: "Check the secure log of all actions", icon: ShieldCheck, href: "/dashboard/evidence" },
  { title: "Reports", desc: "Generate simple case summaries", icon: FileBarChart, href: "/dashboard/reports" },
];

export default function DashboardOverviewPage() {
  const stats = [
    { label: "RECORDS PROCESSED", value: 500 },
    { label: "PROFILES MATCHED", value: netData.stats.nodes || 287 },
    { label: "CONNECTIONS FOUND", value: netData.stats.edges || 480 },
    { label: "GROUPS IDENTIFIED", value: netData.stats.communities || 8 },
  ];

  return (
    <div className="p-6 md:p-8 lg:p-12">
      <Reveal>
        <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">Platform Overview</h2>
        <p className="mt-4 max-w-2xl text-[#737373] leading-relaxed">
          Welcome to the NEXUS dashboard. Start by uploading new records or exploring connections in existing cases.
        </p>
      </Reveal>

      <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <RevealItem key={stat.label}>
            <div className="flex h-full flex-col justify-between border border-[#d4d4d4] bg-[#f5f5f5] p-6">
              <span className="font-[family-name:var(--font-mono)] text-4xl tracking-tight text-[#0a0a0a]">
                {stat.value}
              </span>
              <div className="mt-4">
                <Label>{stat.label}</Label>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.2} className="mt-16">
        <h3 className="text-xl font-semibold tracking-tight">Quick Actions</h3>
        
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link 
                key={action.href}
                href={action.href}
                className="group flex flex-col border border-[#d4d4d4] bg-[#f5f5f5] p-6 transition-colors duration-200 hover:border-[#ff3d00]"
              >
                <div className="flex h-12 w-12 items-center justify-center border border-[#d4d4d4] bg-[#e5e5e5] text-[#737373] transition-colors group-hover:text-[#ff3d00]">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h4 className="mt-5 text-lg font-medium tracking-tight text-[#0a0a0a] group-hover:text-[#ff3d00]">
                  {action.title}
                </h4>
                <p className="mt-2 text-sm text-[#737373]">
                  {action.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}
