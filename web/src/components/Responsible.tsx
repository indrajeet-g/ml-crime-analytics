import { Container, Section, Reveal, RevealGroup, RevealItem, Label } from "@/components/ui";
import { Check, Ban } from "lucide-react";

/* Responsible. Two-column ledger: guarantees on the left, refusals on
   the right, split by a single hairline at lg. This section is about
   restraint, so it carries the most whitespace on the page: no cards,
   no row borders, no accent beyond the five check marks. Every line
   below is a stated product principle from the PRD, nothing invented. */

const BY_DESIGN: string[] = [
  "Every suggested link is reviewable, and rejectable, by a human before it enters the case.",
  "Confidence and source record travel with every suggestion, so an officer can go back to the page it came from.",
  "Labels stay conservative. The system reports high network centrality or cross-case connector, never likely criminal.",
  "Common names need multiple corroborating signals before a merge is even proposed.",
  "Victim fields are masked by default.",
];

const NEVER: string[] = [
  "Never declares guilt or recommends an arrest.",
  "No live interception and no surveillance.",
  "No predictive-policing scores.",
  "No autonomous action without a human.",
  "No raw personal data on the ledger, only hashes and action metadata.",
  "Never uses caste, religion or gender as a scoring signal.",
  "Association is never treated as proof of involvement.",
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
            The system proposes. A human decides. Restraint is not a setting here, it is written
            into how the pipeline works.
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-16 md:mt-24 lg:grid-cols-2 lg:gap-0">
          {/* Left ledger: what the platform guarantees. */}
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

          {/* Right ledger: the stated non-goals. */}
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
            A supervisor approves or rejects every link the model suggests, and the access log is
            there to be read back when someone asks who looked at what.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
