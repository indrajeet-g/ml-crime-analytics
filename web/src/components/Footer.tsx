import { ArrowUpRight, Github } from "lucide-react";

import { Container, Label, PrimaryLink } from "@/components/ui";

/* Four column footer. The repo intent is expressed once, with the same
   "View source" label the nav already uses. The bottom bar carries the
   synthetic data statement, which is required and must not be softened. */

const REPO = "https://github.com/indrajeet-g/ml-crime-analytics";
const REPO_TEXT = "github.com/indrajeet-g/ml-crime-analytics";

const SECTIONS: { href: string; label: string }[] = [
  { href: "#problem", label: "Problem" },
  { href: "#pipeline", label: "Pipeline" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#extract", label: "Extraction" },
  { href: "#explorer", label: "Explorer" },
  { href: "#custody", label: "Chain of custody" },
  { href: "#different", label: "Differentiation" },
  { href: "#roadmap", label: "Scope" },
];

const PROJECT: string[] = [
  "Problem Statement 26189",
  "Ministry of Home Affairs",
  "National Crime Records Bureau, Women Safety Division",
  "Smart India Hackathon 2026",
];

const STACK: string[] = ["spaCy", "NetworkX", "thefuzz", "PyVis", "Next.js"];

const monoClass = "font-[family-name:var(--font-jetbrains)]";

const linkClass =
  "inline-flex min-h-[44px] items-center text-base leading-relaxed text-[#fafafa] transition-colors duration-150 ease-[cubic-bezier(0.25,0,0,1)] hover:text-[#ff3d00]";

export default function Footer() {
  return (
    <footer className="border-t border-[#262626]">
      {/* Closing call to action. One link, one intent. */}
      <Container>
        <div className="py-20 md:py-24 lg:py-28">
          <h2 className="max-w-3xl text-3xl font-semibold track-tight md:text-4xl">
            Every claim on this page traces back to the code.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#737373]">
            The extraction rules, the synthetic dataset, the graph build and the
            SHA-256 hash chain are all in one repository. Read them, run them, and
            check the figures shown here against the output.
          </p>
          <div className="mt-8">
            <PrimaryLink href={REPO} size="lg">
              <Github className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              View source
              <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            </PrimaryLink>
          </div>
        </div>
      </Container>

      {/* Columns: 1 on mobile, 2 at sm, 4 at lg. */}
      <div className="border-t border-[#262626]">
        <Container>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 py-14 sm:grid-cols-2 md:py-16 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-2xl font-bold track-tighter text-[#fafafa] md:text-3xl">
                NEXUS
              </p>
              <span aria-hidden="true" className="mt-3 block h-0.5 w-10 bg-[#ff3d00]" />
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#737373]">
                AI-powered criminal network intelligence and evidence audit platform
                for Indian-context crime data.
              </p>
            </div>

            <nav aria-label="Sections">
              <Label>Sections</Label>
              <ul className="mt-3 grid grid-cols-1">
                {SECTIONS.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} className={linkClass}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <Label>Project</Label>
              <ul className="mt-4 grid grid-cols-1 gap-3">
                {PROJECT.map((fact) => (
                  <li key={fact} className="text-base leading-relaxed text-[#fafafa]">
                    {fact}
                  </li>
                ))}
                <li>
                  <a
                    href={REPO}
                    target="_blank"
                    rel="noreferrer"
                    className={`${monoClass} inline-flex min-h-[44px] items-center gap-2 break-all text-[15px] leading-relaxed text-[#737373] transition-colors duration-150 ease-[cubic-bezier(0.25,0,0,1)] hover:text-[#ff3d00]`}
                  >
                    <Github className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                    {REPO_TEXT}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <Label>Stack</Label>
              <ul className="mt-4 grid grid-cols-1 gap-3">
                {STACK.map((tool) => (
                  <li
                    key={tool}
                    className={`${monoClass} text-base leading-relaxed text-[#fafafa]`}
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom bar. The synthetic data statement is not optional copy. */}
      <div className="border-t border-[#262626]">
        <Container>
          <p className="max-w-3xl py-8 text-base leading-relaxed text-[#fafafa]">
            Every record, name, phone number, account and case shown on this site is
            synthetic and was generated for evaluation. No real case data and no real
            personal data is present anywhere in this demonstration.
          </p>
        </Container>
      </div>
    </footer>
  );
}
