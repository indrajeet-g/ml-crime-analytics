"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Upload,
  ScanText,
  GitMerge,
  Waypoints,
  ShieldCheck,
  FileBarChart,
  ArrowRight,
} from "lucide-react";
import { Reveal, Label, entityColor } from "@/components/ui";
import { StatFigure, DistributionBar, RankedBars, StatusTag, STATUS } from "@/components/dashboard/Viz";
import netData from "@/data/network.json";
import type { GraphNode } from "@/lib/types";

const QUICK_ACTIONS = [
  { title: "Upload Records", desc: "Case files, FIRs and transaction exports", icon: Upload, href: "/dashboard/ingest" },
  { title: "Find Details", desc: "Read documents for people, phones and vehicles", icon: ScanText, href: "/dashboard/extract" },
  { title: "Match Records", desc: "Review and approve suggested matches", icon: GitMerge, href: "/dashboard/resolve" },
  { title: "Network View", desc: "Follow connections between cases and people", icon: Waypoints, href: "/dashboard/network" },
  { title: "Evidence Trail", desc: "Check the append only log of every action", icon: ShieldCheck, href: "/dashboard/evidence" },
  { title: "Reports", desc: "Generate a case summary with its sources", icon: FileBarChart, href: "/dashboard/reports" },
];

const TYPE_ORDER = ["PERSON", "PHONE", "ACCOUNT", "VEHICLE", "CASE", "LOCATION"];

export default function DashboardOverviewPage() {
  const { segments, relRows, brokers, topEntity } = useMemo(() => {
    const counts = new Map<string, number>();
    (netData.graph.nodes as GraphNode[]).forEach((n) => {
      counts.set(n.type, (counts.get(n.type) ?? 0) + 1);
    });
    return {
      segments: TYPE_ORDER.filter((t) => counts.has(t)).map((t) => ({
        key: t,
        label: t,
        value: counts.get(t) ?? 0,
      })),
      relRows: (netData.relTypes as [string, number][])
        .slice(0, 6)
        .map(([label, value]) => ({ label, value })),
      brokers: (netData.brokers as GraphNode[]).length,
      topEntity: (netData.topEntities as GraphNode[])[0],
    };
  }, []);

  const s = netData.stats;

  return (
    <div className="p-6 md:p-8 lg:p-12">
      <Reveal>
        <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">Platform Overview</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-[#737373]">
          Everything below is measured from the working dataset currently loaded
          into the graph. Upload new records or pick up an existing case.
        </p>
      </Reveal>

      {/* Figures on a divided row, not four floating boxes. The only colour
          is the annotation under each number, and it means something. */}
      <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 border-y border-[#d4d4d4] py-8 lg:grid-cols-4 lg:divide-x lg:divide-[#d4d4d4] lg:gap-x-0">
        <div className="lg:pr-8">
          <StatFigure value={s.sourceRecords} label="Records processed" note="Across 8 source files" />
        </div>
        <div className="lg:px-8">
          <StatFigure
            value={s.nodes}
            label="Entities resolved"
            note={`${s.persons} people identified`}
            noteColor={entityColor("PERSON")}
            delay={0.06}
          />
        </div>
        <div className="lg:px-8">
          <StatFigure
            value={s.edges}
            label="Connections found"
            note={`Average ${s.avgDegree} per entity`}
            delay={0.12}
          />
        </div>
        <div className="lg:pl-8">
          <StatFigure
            value={s.communities}
            label="Groups identified"
            note={`${s.components} separate clusters`}
            noteColor={STATUS.attention}
            delay={0.18}
          />
        </div>
      </div>

      {/* Two analytical panels side by side. Composition differs from the
          figures above and from the action list below. */}
      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <Reveal>
          <Label>What the graph contains</Label>
          <h3 className="mt-3 text-xl font-semibold tracking-tight">
            {s.nodes} entities by type
          </h3>
          <div className="mt-6">
            <DistributionBar
              segments={segments}
              total={s.nodes}
              caption="Colour here matches the network view and the exported report, so an entity type reads the same everywhere in NEXUS."
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Label>How they connect</Label>
          <h3 className="mt-3 text-xl font-semibold tracking-tight">
            {s.edges} relationships
          </h3>
          <div className="mt-6">
            <RankedBars rows={relRows} />
          </div>
        </Reveal>
      </div>

      {/* One flagged finding, given real weight because it is the thing an
          investigator would act on first. */}
      <Reveal delay={0.05} className="mt-14">
        <div className="border-l-2 border-[#ff3d00] bg-[#f5f5f5] p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusTag status="attention">Needs attention</StatusTag>
            <span className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.1em] text-[#737373]">
              {brokers === 1 ? "1 bridge entity" : `${brokers} bridge entities`} flagged
            </span>
          </div>
          <p className="mt-4 max-w-3xl leading-relaxed text-[#0a0a0a]">
            <span className="font-[family-name:var(--font-jetbrains)] font-bold">
              {topEntity.label}
            </span>{" "}
            has the highest brokerage score in the graph at{" "}
            <span className="font-[family-name:var(--font-jetbrains)] font-bold text-[#ff3d00]">
              {topEntity.betweenness}
            </span>{" "}
            across {topEntity.degree} connections. High brokerage means it sits on
            the path between groups that are otherwise unconnected.
          </p>
          <Link
            href="/dashboard/network"
            className="group mt-5 inline-flex items-center gap-2 font-[family-name:var(--font-jetbrains)] text-xs font-bold uppercase tracking-[0.1em] text-[#ff3d00]"
          >
            Open in network view
            <ArrowRight
              size={14}
              strokeWidth={2}
              className="transition-transform duration-150 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </Reveal>

      {/* Actions as a divided list. Six identical bordered cards was the
          thing that made this page read as a template. */}
      <Reveal delay={0.1} className="mt-16">
        <h3 className="text-xl font-semibold tracking-tight">Quick actions</h3>

        <ul className="mt-6 grid grid-cols-1 border-t border-[#d4d4d4] md:grid-cols-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <li key={action.href} className="border-b border-[#d4d4d4] md:even:border-l">
                <Link
                  href={action.href}
                  className="group flex items-start gap-4 p-5 transition-colors duration-150 hover:bg-[#f5f5f5]"
                >
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-[#737373] transition-colors duration-150 group-hover:text-[#ff3d00]"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block font-medium tracking-tight text-[#0a0a0a]">
                      {action.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-[#737373]">
                      {action.desc}
                    </span>
                  </span>
                  <ArrowRight
                    size={16}
                    strokeWidth={1.5}
                    className="ml-auto mt-0.5 shrink-0 text-[#d4d4d4] transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-[#ff3d00]"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </div>
  );
}
