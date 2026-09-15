import { Container, Section, Reveal, RevealGroup, RevealItem } from "@/components/ui";
import net from "@/data/network.json";
import { FileText, Car, PhoneCall, CornerDownRight } from "lucide-react";

/* Problem. Editorial manifesto: full-width type, no card grid.
   The emotional core is the three-fragment illustration, which uses the
   real planted alias in the dataset (Vivek Iyer, person records P020,
   P040, P060 and P080 across four communities). Every id below is a
   literal record id from network.json. */

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
    reads: "Written out in full. Becomes person record P040 in community C04.",
    icon: FileText,
  },
  {
    source: "FIELD REPORT / EVT001",
    kind: "Vehicle only",
    raw: "VH027",
    rawIsMono: true,
    reads: "No name on the page, only a registration. Becomes P080 in community C07.",
    icon: Car,
  },
  {
    source: "CALL RECORD / CALL0087",
    kind: "Number only",
    raw: "PH060",
    rawIsMono: true,
    reads: "A subscriber with no name attached. Becomes P060 in community C05.",
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
            Law enforcement already holds the evidence. FIRs, call detail records, financial
            transactions, criminal history. It sits in different formats, in different systems,
            in different jurisdictions, and none of it agrees on who anyone is. So the network
            stays invisible while every piece of it is already on file.
          </p>
        </Reveal>

        {/* Three source records, one person. Stacked rows, hairline between. */}
        <RevealGroup className="mt-16 md:mt-20">
          <RevealItem>
            <p className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider text-[#737373]">
              3 of {net.stats.sourceRecords} source records
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
                Three fragments, one person. Across the full dataset this name carries four
                separate person records, P020, P040, P060 and P080, sitting in four different
                communities with no edge between them. Nobody wrote it wrong. The records were
                simply never introduced to each other.
              </p>
            </div>
          </RevealItem>
        </RevealGroup>

        <Reveal>
          <blockquote className="mt-16 max-w-3xl border-t border-[--color-border] pt-12 md:mt-20">
            <p className="pb-1 font-[family-name:var(--font-playfair)] text-2xl italic leading-[1.15] track-tight text-[--color-foreground] md:text-3xl">
              Manual link analysis does not scale. The network grows faster than anyone can
              read it.
            </p>
          </blockquote>
        </Reveal>
      </Container>
    </Section>
  );
}
