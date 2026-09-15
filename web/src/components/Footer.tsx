import { ShieldAlert } from "lucide-react";
import { Container, Reveal } from "@/components/ui";

const REPO = "https://github.com/indrajeet-g/ml-crime-analytics";

/* Anchors are checked against the ids the sections actually render.
   Adding a link here without the matching id is how footers rot. */
const SECTIONS = [
  { label: "The problem", href: "#problem" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "In practice", href: "#showcases" },
  { label: "Differentiation", href: "#different" },
  { label: "Responsible use", href: "#responsible" },
  { label: "Scope", href: "#roadmap" },
];

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot__glow" aria-hidden="true" />

      <Container>
        <Reveal>
          <div className="foot__grid">
            <div className="foot__brand">
              <span className="inline-flex items-center gap-2.5">
                <ShieldAlert
                  className="h-5 w-5 text-[#ff3d00]"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="font-[family-name:var(--font-jetbrains)] text-sm font-bold uppercase tracking-[0.1em] text-[#fafafa]">
                  NEXUS
                </span>
              </span>

              <p className="foot__tagline">
                Explainable criminal network intelligence. Every link it draws
                carries the source record it was extracted from.
              </p>

              <p className="foot__est">Smart India Hackathon 2026</p>

              <div className="foot__meta">
                <span>Problem Statement 26189</span>
                <span>Ministry of Home Affairs</span>
                <span>National Crime Records Bureau, Women Safety Division</span>
              </div>
            </div>

            <nav className="foot__col" aria-labelledby="foot-sections">
              <h2 className="foot__label" id="foot-sections">
                Sections
              </h2>
              <div className="foot__list">
                {SECTIONS.map((s) => (
                  <a key={s.href} href={s.href}>
                    {s.label}
                  </a>
                ))}
              </div>
            </nav>

            <div className="foot__col">
              <h2 className="foot__label" id="foot-source">
                Source
              </h2>
              <a
                className="foot__url"
                href={REPO}
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/indrajeet-g/ml-crime-analytics
              </a>

              <div className="foot__meta">
                <span>spaCy</span>
                <span>NetworkX</span>
                <span>thefuzz</span>
                <span>PyVis</span>
                <span>Next.js</span>
              </div>
            </div>
          </div>

          <p className="foot__base">
            Every record, name, phone number, account and case shown on this
            site is synthetic and was generated for evaluation. No real case
            data and no real personal data is present anywhere in this
            demonstration.
          </p>
        </Reveal>
      </Container>
    </footer>
  );
}
