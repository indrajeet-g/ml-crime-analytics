import { Container, Section, Reveal, RevealGroup, RevealItem } from "@/components/ui";
import net from "@/data/network.json";
import { FileText, Car, PhoneCall, CornerDownRight } from "lucide-react";

type Fragment = {
  source: string;
  kind: string;
  raw: string;
  rawIsMono: boolean;
  reads: string;
  icon: typeof FileText;
};

const FRAGMENTS: Fragment[] = [
  {
    source: "FIR / CASE016",
    kind: "Full name",
    raw: "Vivek Iyer",
    rawIsMono: false,
    reads: "Written out in full. Appears as a new person in the system.",
    icon: FileText,
  },
  {
    source: "FIELD REPORT / EVT001",
    kind: "Vehicle only",
    raw: "VH027",
    rawIsMono: true,
    reads: "No name on the page, only a registration. Appears as a completely separate person.",
    icon: Car,
  },
  {
    source: "CALL RECORD / CALL0087",
    kind: "Number only",
    raw: "PH060",
    rawIsMono: true,
    reads: "A phone number with no name attached. Appears as a third unknown person.",
    icon: PhoneCall,
  },
];

export default function Problem() {
  return (
    <Section id="problem">
      <Container>
        <Reveal>
          <h2 className="max-w-4xl text-3xl track-tight md:text-4xl lg:text-5xl">
            The same person, three times, never connected.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-[--color-foreground] md:text-xl">
            Important information is already in your files. FIRs, call records, financial transactions, and criminal histories sit in different formats and systems. They rarely match up perfectly. As a result, important connections stay hidden even when you already have the evidence.
          </p>
        </Reveal>

        <RevealGroup className="mt-16 md:mt-20">
          <RevealItem>
            <p className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider text-[#737373]">
              3 of {net.stats.sourceRecords} records
            </p>
          </RevealItem>

          {FRAGMENTS.map((f, i) => {
            const Icon = f.icon;
            const isResolved = false;
            return (
              <RevealItem key={f.source}>
                <div className="grid grid-cols-1 gap-3 border-t border-[--color-border] py-7 md:grid-cols-12 md:gap-8 md:py-9">
                  <div className="flex items-center gap-2.5 md:col-span-3">
                    <Icon
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className={`h-4 w-4 shrink-0 ${isResolved ? "text-[--color-accent]" : "text-[#737373]"}`}
                    />
                    <span
                      className={`font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider ${
                        isResolved ? "text-[--color-accent]" : "text-[#737373]"
                      }`}
                    >
                      {f.source}
                    </span>
                  </div>

                  <div className="md:col-span-5">
                    <span
                      className={`inline-block text-2xl track-tight md:text-3xl ${
                        f.rawIsMono ? "font-[family-name:var(--font-jetbrains)]" : ""
                      } ${
                        isResolved
                          ? "border-b-2 border-[--color-accent] pb-1 text-[--color-accent]"
                          : "text-[--color-foreground]"
                      }`}
                    >
                      {f.raw}
                    </span>
                    <span className="mt-2 block font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider text-[#737373]">
                      {f.kind}
                    </span>
                  </div>

                  <p className="max-w-md text-base leading-relaxed text-[--color-foreground] md:col-span-4">
                    {f.reads}
                  </p>
                </div>
              </RevealItem>
            );
          })}

          <RevealItem>
            <div className="flex items-start gap-3 border-t border-[--color-border] py-7 md:py-9">
              <CornerDownRight
                aria-hidden="true"
                strokeWidth={1.5}
                className="mt-1 h-4 w-4 shrink-0 text-[--color-accent]"
              />
              <p className="max-w-3xl text-base leading-relaxed text-[--color-foreground] md:text-lg">
                Three pieces of information, one actual person. Because these details were never connected, this person appears as four different individuals across the system. The records were not wrong, they were just never brought together.
              </p>
            </div>
          </RevealItem>
        </RevealGroup>

        <Reveal>
          <blockquote className="mt-16 max-w-3xl border-t border-[--color-border] pt-12 md:mt-20">
            <p className="pb-1 font-[family-name:var(--font-playfair)] text-2xl italic leading-[1.15] track-tight text-[--color-foreground] md:text-3xl">
              Checking links by hand takes too much time. The amount of information grows faster than anyone can read it.
            </p>
          </blockquote>
        </Reveal>
      </Container>
    </Section>
  );
}
