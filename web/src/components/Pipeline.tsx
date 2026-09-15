"use client";

import {
  Inbox,
  ScanText,
  GitMerge,
  Waypoints,
  Activity,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Container, Section, Reveal, RevealGroup, RevealItem } from "@/components/ui";

type Stage = {
  n: string;
  title: string;
  body: string;
  note: string;
  Icon: LucideIcon;
};

const STAGES: Stage[] = [
  {
    n: "01",
    title: "Upload Records",
    body: "Upload case files and reports. The system securely records exactly when they arrive and where they came from.",
    note: "Supports standard text and data formats",
    Icon: Inbox,
  },
  {
    n: "02",
    title: "Find Details",
    body: "The system automatically reads the text to find people, phone numbers, vehicles, and bank accounts.",
    note: "Detects Indian phone, vehicle and account formats",
    Icon: ScanText,
  },
  {
    n: "03",
    title: "Match Records",
    body: "The system suggests records that might belong to the same person. An investigator must review and approve these matches.",
    note: "Suggests possible matches for human review",
    Icon: GitMerge,
  },
  {
    n: "04",
    title: "Build the Network",
    body: "Connections are drawn between records, creating a full network map. Every connection shows the source record it came from.",
    note: "Connects records across different cases",
    Icon: Waypoints,
  },
  {
    n: "05",
    title: "Find Connections",
    body: "The system highlights people or items that act as bridges between different groups, helping you spot key players.",
    note: "Identifies the most connected items in the network",
    Icon: Activity,
  },
  {
    n: "06",
    title: "Verify Evidence",
    body: "Every uploaded record and approved match is securely logged, creating a permanent trail of who changed what, and when.",
    note: "Creates a tamper-proof record of every action",
    Icon: ShieldCheck,
  },
];

export default function Pipeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <Section id="pipeline">
      <Container>
        <Reveal>
          <h2 className="max-w-3xl text-3xl font-bold track-tighter md:text-4xl lg:text-5xl">
            How NEXUS processes information.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[--color-muted-foreground]">
            Six steps. Each step keeps track of the original source record, and every suggested connection stays a proposal until an investigator confirms it.
          </p>
        </Reveal>

        <div className="relative mt-16 md:mt-20">
          <div
            ref={containerRef}
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-12 hidden w-px bg-[--color-border] md:block"
          >
            <motion.div 
              style={{ height }} 
              className="w-full bg-[--color-accent] origin-top" 
            />
          </div>

          <RevealGroup className="relative">
            {STAGES.map(({ n, title, body, note, Icon }) => (
              <RevealItem key={n}>
                <div className="group grid grid-cols-1 gap-y-4 py-8 md:grid-cols-[6rem_1fr] md:items-start md:gap-x-8 md:py-10">
                  <div className="md:flex md:justify-center">
                    <span
                      className="inline-block bg-[--color-background] font-[family-name:var(--font-jetbrains)] text-3xl font-bold tabular-nums track-tight text-[#a3a3a3] transition-colors duration-150 ease-[cubic-bezier(0.25,0,0,1)] group-hover:text-[--color-accent] md:px-2 md:py-1 md:text-4xl"
                    >
                      {n}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="shrink-0 text-[--color-foreground]"
                      />
                      <h3 className="text-xl font-bold track-tight md:text-2xl">
                        {title}
                      </h3>
                    </div>
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-[--color-foreground]">
                      {body}
                    </p>
                                        <p className="mt-3 font-[family-name:var(--font-jetbrains)] text-[13px] leading-relaxed text-[--color-muted-foreground]">
                      {note}
                    </p>
                  </div>
                </div>
                </RevealItem>
            ))}
          </RevealGroup>
        </div>
        </Container>
      </Section>
  );
}
