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

const monoClass = "font-[family-name:var(--font-jetbrains)]";

const T0: string[] = [
  "Upload CSV and text files for FIRs, call records, and transactions",
  "Automatically find names, phones, vehicles, and locations",
  "Suggest matches with human review and approval",
  "Build and explore network connections visually",
  "Highlight highly connected people and bridge connections",
  "Click any connection to see the original document it came from",
  "Create a secure, tamper-proof record of every uploaded file",
  "Two user roles (Investigator and Admin) for basic access control",
  "Export basic summary reports with connections and evidence lists",
];

const T1: string[] = [
  "Read text from scanned documents and images",
  "Match records across multiple sources with confidence scores",
  "Automatically detect unusual patterns in communication and transactions",
  "View connections on a timeline and save important views",
  "Advanced permissions based on specific cases",
  "Full data encryption for maximum security",
  "Connect the security trail to a full, multi-department secure network",
];

const T2: string[] = [
  "Full support for multiple languages and mixed text",
  "Automatically suggest similar cases from different jurisdictions",
  "Find complex financial anomalies at a very large scale",
  "Monitor for suspicious internal access to case data",
  "Deploy across multiple agencies with full legal review",
  "Connect directly to official CCTNS and ICJS databases",
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
            Phase 1 is currently active. Phases 2 and 3 are future plans.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 md:mt-16 lg:grid-cols-3">
          <RevealItem>
            <div className="h-full border-t-2 border-[#ff3d00] pt-6">
              <p
                className={`${monoClass} text-4xl font-bold tabular-nums track-tighter text-[#0a0a0a] md:text-5xl`}
              >
                Phase 1
              </p>
              <h3 className="mt-4 text-xl track-tight font-semibold text-[#0a0a0a] md:text-2xl">
                Active now
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
                    <span className="text-base leading-relaxed text-[#0a0a0a]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>

          <RevealItem>
            <div className="h-full border-t border-[#d4d4d4] pt-6">
              <p
                className={`${monoClass} text-4xl font-bold tabular-nums track-tighter text-[#737373] md:text-5xl`}
              >
                Phase 2
              </p>
              <h3 className="mt-4 text-xl track-tight font-semibold text-[#737373] md:text-2xl">
                Next steps
              </h3>
              <p className="mt-3">
                <Label>Planned</Label>
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

          <RevealItem>
            <div className="h-full border-t border-[#d4d4d4] pt-6">
              <p
                className={`${monoClass} text-4xl font-light tabular-nums track-tighter text-[#737373] md:text-5xl`}
              >
                Phase 3
              </p>
              <h3 className="mt-4 text-xl track-tight font-normal text-[#737373] md:text-2xl">
                Production vision
              </h3>
              <p className="mt-3">
                <Label>Planned</Label>
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

        <Reveal className="mt-16 border-t border-[#d4d4d4] pt-6 md:mt-20">
          <p
            className={`${monoClass} max-w-3xl text-[13px] leading-relaxed text-[#737373]`}
          >
            The current security trail runs securely on local hardware. Connecting it to a multi-agency secure network is a Phase 2 step.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
