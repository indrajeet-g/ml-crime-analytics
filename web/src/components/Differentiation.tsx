import { Container, Section, Reveal, RevealGroup, RevealItem, Label, SpotlightCard } from "@/components/ui";

const mono = "font-[family-name:var(--font-jetbrains)]";

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
    title: "Built for Indian records",
    body:
      "The system is trained to read Indian names, addresses, phone numbers, and vehicle formats correctly from the start. It understands mixed languages and different spellings of the same name.",
    note: "Reads Indian phone, vehicle, and bank account formats natively",
  },
  {
    title: "Clear evidence for every link",
    body:
      "Every connection shows exactly which record it came from. The platform is designed to produce evidence that holds up in court, not just helpful hints for analysts.",
    note: "Every connection stores its source record ID and match confidence",
  },
  {
    title: "Built-in security trail",
    body:
      "Security tracking happens the second a file is uploaded. It creates an unbroken record of who uploaded the file, what changes were made, and which matches were approved.",
    note: "Automatically logs every action to a secure, tamper-proof record",
  },
  {
    title: "Runs completely offline",
    body:
      "The software can run entirely on your own secure servers without an internet connection. It does not send your sensitive case data to outside companies.",
    note: "Can run locally on secure department hardware without internet access",
  },
];

export default function Differentiation() {
  return (
    <Section id="different">
      <Container>
        <Reveal>
          <h2 className="max-w-4xl text-3xl track-tighter md:text-4xl lg:text-5xl">
            How this compares to existing tools.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[--color-foreground]">
            IBM i2, Palantir Gotham, and Maltego are well-known investigation tools. NEXUS is built specifically for the needs, data formats, and security rules of Indian law enforcement.
          </p>
        </Reveal>

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

        <RevealGroup className="mt-16 grid grid-cols-1 pt-px pl-px md:mt-20 md:grid-cols-2">
          {EDGES.map((edge, i) => (
            <RevealItem key={edge.title} className="-mt-px -ml-px">
              <SpotlightCard className="h-full z-0 hover:z-10 bg-white">
                <article className="group relative flex h-full flex-col border border-[--color-border] bg-transparent p-6 transition-colors duration-150 ease-[cubic-bezier(0.25,0,0,1)] hover:border-[#a3a3a3] md:p-10">
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
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal>
          <p className="mt-16 max-w-2xl text-base leading-relaxed text-[--color-muted-foreground] md:mt-20">
            These tools are highly capable. However, NEXUS is designed specifically for the data formats, budgets, and security rules of Indian state and district police units.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
