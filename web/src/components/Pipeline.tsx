import {
  Inbox,
  ScanText,
  GitMerge,
  Waypoints,
  Activity,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { Container, Section, Reveal, RevealGroup, RevealItem } from "@/components/ui";

/* Vertical numbered rail. The six stages below are the real pipeline
   implemented in Python in this repo, in execution order. Footnotes name
   the actual library or method so the claim is checkable, not decorative. */

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
    title: "Ingest",
    body: "CSV, JSON and plain-text records, tagged by source type, hashed on arrival.",
    note: "csv / json / txt loaders, source type on every record",
    Icon: Inbox,
  },
  {
    n: "02",
    title: "Extract",
    body:
      "spaCy NER plus regex tuned for Indian phone, vehicle and account formats.",
    note: "spacy en_core_web_sm + regex (phone, vehicle, bank account)",
    Icon: ScanText,
  },
  {
    n: "03",
    title: "Resolve",
    body:
      "Fuzzy name matching proposes merges. A human confirms or rejects. Nothing auto-merges.",
    note: "thefuzz token_sort_ratio, threshold 85, merge suggested only",
    Icon: GitMerge,
  },
  {
    n: "04",
    title: "Build",
    body: "A NetworkX graph where every edge carries its source record and confidence.",
    note: "networkx, edge attrs: relation, weight, timestamps, record id",
    Icon: Waypoints,
  },
  {
    n: "05",
    title: "Analyse",
    body:
      "Betweenness, PageRank and degree surface bridges that look unimportant locally.",
    note: "networkx betweenness_centrality, pagerank, degree",
    Icon: Activity,
  },
  {
    n: "06",
    title: "Attest",
    body: "Every ingest, merge and export is written to a SHA-256 hash chain.",
    note: "hashlib sha256, block: index, action, officer id, prev hash",
    Icon: ShieldCheck,
  },
];

export default function Pipeline() {
  return (
    <Section id="pipeline">
      <Container>
        <Reveal>
          <h2 className="max-w-3xl text-3xl font-bold track-tighter md:text-4xl lg:text-5xl">
            From raw record to reviewable lead.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[--color-muted-foreground]">
            Six stages. Each one keeps its source record, and every proposed link
            stays a proposal until an officer confirms it.
          </p>
        </Reveal>

        <div className="relative mt-16 md:mt-20">
          {/* The rail itself. Hidden on mobile, where the number stacks above
              the title instead. Sits at the centre of the number column. */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-12 hidden w-px bg-[--color-border] md:block"
          />

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
