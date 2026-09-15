import { Container, Section, Reveal, RevealGroup, RevealItem, Label } from "@/components/ui";
import { Check, Ban } from "lucide-react";

const BY_DESIGN: string[] = [
  "Every suggested connection can be reviewed and rejected by an investigator before it is added to the case.",
  "Every suggestion shows exactly where the information came from, so an investigator can easily check the original document.",
  "The system uses facts, not assumptions. It highlights highly connected people, but never labels someone as a 'likely criminal'.",
  "Common names need multiple matching details (like location and occupation) before the system suggests they are the same person.",
  "Victim identities are protected and masked by default.",
];

const NEVER: string[] = [
  "Never declares guilt or recommends an arrest.",
  "No live tracking, interception, or surveillance.",
  "No predicting who might commit a crime.",
  "No automatic decisions without human approval.",
  "The security log tracks actions and history, not raw personal data.",
  "Never uses caste, religion, or gender to match records.",
  "Being connected to a suspect is never treated as proof of involvement.",
];

export default function Responsible() {
  return (
    <Section id="responsible">
      <Container>
        <Reveal>
          <h2 className="max-w-4xl text-3xl track-tight md:text-4xl lg:text-5xl">
            It supports investigators. It never replaces them.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[--color-foreground]">
            The system suggests. A human decides. Restraint is built directly into how the platform works.
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-16 md:mt-24 lg:grid-cols-2 lg:gap-0">
          <RevealGroup className="lg:pr-16">
            <RevealItem>
              <div className="border-b border-[--color-border] pb-4">
                <Label>By design</Label>
              </div>
            </RevealItem>

            <ul className="mt-10 space-y-9">
              {BY_DESIGN.map((line) => (
                <RevealItem key={line}>
                  <li className="flex items-start gap-4">
                    <Check
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="mt-1 h-4 w-4 shrink-0 text-[--color-accent]"
                    />
                    <span className="max-w-2xl text-base leading-relaxed text-[--color-foreground]">
                      {line}
                    </span>
                  </li>
                </RevealItem>
              ))}
            </ul>
          </RevealGroup>

          <RevealGroup className="lg:border-l lg:border-[--color-border] lg:pl-16">
            <RevealItem>
              <div className="border-b border-[--color-border] pb-4">
                <Label>Never</Label>
              </div>
            </RevealItem>

            <ul className="mt-10 space-y-9">
              {NEVER.map((line) => (
                <RevealItem key={line}>
                  <li className="flex items-start gap-4">
                    <Ban
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="mt-1 h-4 w-4 shrink-0 text-[#737373]"
                    />
                    <span className="max-w-2xl text-base leading-relaxed text-[--color-foreground]">
                      {line}
                    </span>
                  </li>
                </RevealItem>
              ))}
            </ul>
          </RevealGroup>
        </div>

        <Reveal>
          <p className="mt-20 max-w-2xl border-t border-[--color-border] pt-12 text-base leading-relaxed text-[--color-foreground] md:mt-24">
            An investigator reviews every connection the system suggests. The security log permanently records who approved what, so there is always a clear trail of accountability.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
