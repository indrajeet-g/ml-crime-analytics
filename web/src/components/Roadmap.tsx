import { Check } from "lucide-react";

import {
  Container,
  Section,
  Reveal,
  RevealGroup,
  RevealItem,
  Eyebrow,
  Label,
} from "@/components/ui";

/* Three-column tier ladder. The item lists below are the scope tiers
   exactly as written in the PRD, unmoved. T0 is the only column that
   describes the current build: the tick marks, the heading and the
   status line all say so in text, never by colour alone. */

const monoClass = "font-[family-name:var(--font-jetbrains)]";

const T0: string[] = [
  "CSV and text ingestion of FIR, CDR and transaction data",
  "Rules plus basic NER entity extraction for person, phone, vehicle, location",
  "Naive entity resolution (exact plus fuzzy) with a manual confirm and reject step",
  "Graph construction and visualisation",
  "Degree and betweenness centrality to flag highly connected and bridge nodes",
  "Click a node to see the source records justifying every edge",
  "SHA-256 hash per uploaded file written to an append-only demo log",
  "Two-role login concept (investigator and admin) showing RBAC intent",
  "Basic summary export with entities, graph image and evidence list",
];

const T1: string[] = [
  "OCR for scanned FIRs (Tesseract or PaddleOCR)",
  "Multi-source entity resolution with confidence scoring",
  "Rule-based anomaly detection for communication bursts and circular transactions",
  "Timeline view and saved graph views",
  "Real RBAC with case-level permissions",
  "Encryption at rest and in transit with proper key management",
  "A genuine permissioned ledger (Hyperledger Fabric) rather than a demo hash log",
];

const T2: string[] = [
  "Full multilingual and code-mixed NLP",
  "Cross-jurisdiction case-similarity matching",
  "Financial and communication anomaly detection at scale",
  "Insider-threat monitoring",
  "Federated cross-agency deployment with legal and security review",
  "Integration with real CCTNS and ICJS class systems",
];

export default function Roadmap() {
  return (
    <Section id="roadmap">
      <Container>
        <Reveal>
          <Eyebrow>Scope</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl track-tighter font-semibold md:text-4xl lg:text-5xl">
            Built now, and what comes after.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#737373]">
            T0 runs in the current build. T1 and T2 are stated as plans, never
            presented as working features.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 md:mt-16 lg:grid-cols-3">
          {/* T0. The only column describing software that exists today. */}
          <RevealItem>
            <div className="h-full border-t-2 border-[#ff3d00] pt-6">
              <p
                className={`${monoClass} text-4xl font-bold tabular-nums track-tighter text-[#fafafa] md:text-5xl`}
              >
                T0
              </p>
              <h3 className="mt-4 text-xl track-tight font-semibold text-[#fafafa] md:text-2xl">
                Built and demoable
              </h3>
              <p
                className={`${monoClass} mt-3 text-[11px] uppercase track-wider text-[#ff3d00]`}
              >
                Running in the current build
              </p>

              <ul className="mt-8 space-y-5">
                {T0.map((item) => (
                  <li
                    key={item}
                    className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-x-3"
                  >
                    <Check
                      size={18}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-[#ff3d00]"
                    />
                    <span className="text-base leading-relaxed text-[#fafafa]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>

          {/* T1. Planned, not built. No ticks, hairline rule. */}
          <RevealItem>
            <div className="h-full border-t border-[#262626] pt-6">
              <p
                className={`${monoClass} text-4xl font-bold tabular-nums track-tighter text-[#737373] md:text-5xl`}
              >
                T1
              </p>
              <h3 className="mt-4 text-xl track-tight font-semibold text-[#737373] md:text-2xl">
                Next, weeks not hours
              </h3>
              <p className="mt-3">
                <Label>Not built yet</Label>
              </p>

              <ul className="mt-8 space-y-5">
                {T1.map((item) => (
                  <li key={item} className="text-base leading-relaxed text-[#737373]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>

          {/* T2. Longer horizon, needs real government data access. */}
          <RevealItem>
            <div className="h-full border-t border-[#262626] pt-6">
              <p
                className={`${monoClass} text-4xl font-light tabular-nums track-tighter text-[#737373] md:text-5xl`}
              >
                T2
              </p>
              <h3 className="mt-4 text-xl track-tight font-normal text-[#737373] md:text-2xl">
                Production vision
              </h3>
              <p className="mt-3">
                <Label>Not built yet</Label>
              </p>

              <ul className="mt-8 space-y-5">
                {T2.map((item) => (
                  <li
                    key={item}
                    className="text-base font-light leading-relaxed text-[#737373]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>
        </RevealGroup>

        <Reveal className="mt-16 border-t border-[#262626] pt-6 md:mt-20">
          <p
            className={`${monoClass} max-w-3xl text-[13px] leading-relaxed text-[#737373]`}
          >
            The current ledger is a demo-scale SHA-256 hash chain that demonstrates
            the tamper-evidence model, and a permissioned ledger is the T1 step.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
