import { Container, Section, Reveal, RevealGroup, RevealItem, Label } from "@/components/ui";

/* Differentiation. Named-comparison strip over an asymmetric claim grid.
   Judges always ask why an existing link-analysis tool is not enough, so
   the section names the incumbents in plain mono text and answers directly.

   Deliberately not the Capabilities bento: the four cells share their
   dividing lines instead of floating in a gap grid, there are no icons,
   and the claim titles are set in mono rather than sans.

   Every line below is a stated design position from the PRD. There is no
   benchmark, no score and no comparison figure here, because none exists. */

const mono = "font-[family-name:var(--font-jetbrains)]";

/* Text references to real products, not a logo wall. */
const INCUMBENTS: string[] = [
  "IBM i2 Analyst's Notebook",
  "Palantir Gotham",
  "Maltego",
];

type Edge = {
  title: string;
  body: string;
  note: string;
};

const EDGES: Edge[] = [
  {
    title: "Indian-context by default",
    body:
      "Name and alias variation, transliteration and code-mixed Hinglish text are handled in the extraction rules themselves, not bolted onto an English-only pipeline afterward.",
    note: "spacy en_core_web_sm + regex for Indian phone, vehicle and account formats",
  },
  {
    title: "Explainability is structural",
    body:
      "Every edge and every score carries its source record and reasoning by design, because the output is built to survive evidentiary scrutiny, not only analyst convenience.",
    note: "edge attrs: relation, weight, timestamps, source record id, confidence",
  },
  {
    title: "Chain of custody is native",
    body:
      "Evidence hashing runs inside the ingestion pipeline itself rather than in a separate module, so integrity metadata exists from the moment a file arrives.",
    note: "sha256 at ingestion, block: index, action, officer id, payload hash, prev hash",
  },
  {
    title: "On-prem and air-gapped",
    body:
      "Designed to run on-premise or air-gapped at state and district level, so a deployment does not depend on an enterprise licence or on external connectivity.",
    note: "local python stack, no runtime dependency on an external service",
  },
];

export default function Differentiation() {
  return (
    <Section id="different">
      <Container>
        <Reveal>
          <h2 className="max-w-4xl text-3xl track-tighter md:text-4xl lg:text-5xl">
            Why not just use IBM i2 or Palantir.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[--color-foreground]">
            IBM i2, Palantir Gotham and Maltego already do link analysis well. These four are
            design positions NEXUS is built around, not benchmark claims against them.
          </p>
        </Reveal>

        {/* Quiet named strip. Mono, muted, hairline separated. */}
        <Reveal delay={0.08}>
          <div className="mt-12 md:mt-16">
            <Label>Existing tools in this space</Label>
            <ul className="mt-5 grid grid-cols-1 border-t border-b border-[--color-border] sm:grid-cols-3">
              {INCUMBENTS.map((name, i) => (
                <li
                  key={name}
                  className={`flex min-h-[44px] items-center py-6 ${
                    i > 0
                      ? "border-t border-[--color-border] sm:border-t-0 sm:border-l sm:pl-10"
                      : ""
                  } ${i < INCUMBENTS.length - 1 ? "sm:pr-10" : ""}`}
                >
                  <span
                    className={`${mono} text-[11px] uppercase track-wider text-[--color-muted-foreground]`}
                  >
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Claim grid. One column on mobile, two from md. Cells collapse
            their borders into a single shared 1px rule via negative margins,
            and the container padding gives that 1px back at the outer edge. */}
        <RevealGroup className="mt-16 grid grid-cols-1 pt-px pl-px md:mt-20 md:grid-cols-2">
          {EDGES.map((edge, i) => (
            <RevealItem key={edge.title} className="-mt-px -ml-px">
              <article className="group relative z-0 flex h-full flex-col border border-[--color-border] bg-transparent p-6 transition-colors duration-150 ease-[cubic-bezier(0.25,0,0,1)] hover:z-10 hover:border-[#a3a3a3] md:p-10">
                {i === 0 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -top-px right-0 left-0 h-0.5 bg-[--color-accent]"
                  />
                ) : null}

                <h3 className={`${mono} text-xl track-tight text-[--color-foreground] md:text-2xl`}>
                  {edge.title}
                </h3>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-[--color-foreground]">
                  {edge.body}
                </p>

                <div className="mt-auto pt-10">
                  <p
                    className={`${mono} border-t border-[--color-border] pt-5 text-[13px] leading-relaxed text-[--color-muted-foreground]`}
                  >
                    {edge.note}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal>
          <p className="mt-16 max-w-2xl text-base leading-relaxed text-[--color-muted-foreground] md:mt-20">
            These are positions, not verdicts. The established tools are mature and capable. NEXUS
            is built for the data, the budget and the deployment constraints of an Indian state or
            district unit.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
