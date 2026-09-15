import { ScanText, GitMerge, Waypoints, Share2, FileSearch, ShieldCheck } from "lucide-react";
import { Container, Section, Reveal, RevealGroup, RevealItem, Label } from "@/components/ui";
import net from "@/data/network.json";

const iconClass = "text-[#ff3d00]";
const titleClass = "mt-5 text-xl font-semibold track-tight text-[#0a0a0a]";
const bodyClass = "mt-3 text-[15px] leading-relaxed text-[#737373]";
const monoClass = "font-[family-name:var(--font-jetbrains)]";
const cellBase = "flex h-full flex-col border border-[#d4d4d4] p-6 sm:p-8 transition-colors duration-150 hover:border-[#a3a3a3]";

export default function Capabilities() {
  const extractionPatterns = [
    { label: "Person", pattern: "Arjun Singh", wide: false },
    { label: "Phone", pattern: "+91 98765 43210", wide: false },
    { label: "Vehicle", pattern: "MH 12 AB 3456", wide: false },
    { label: "Account", pattern: "50100123456789", wide: false },
  ];

  const aliasBase = { id: "P040", city: "Mumbai", occupation: "Driver", community: "C04" };
  const aliasTwin = { id: "P060", city: "Mumbai", occupation: "Unknown", community: "C05" };
  const aliasCluster = { name: "Vivek Iyer" };
  const aliasMatchedOn = ["name", "city"];

  const broker = {
    label: "P005",
    betweenness: 0.1245,
    degree: 4,
    community: "C01",
    id: "P005",
  };

  const relTypes = Object.entries(
    net.graph.links.reduce((acc, link) => {
      acc[link.rel] = (acc[link.rel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);
  const relMax = relTypes.length > 0 ? relTypes[0][1] : 1;

  const traceEdge = net.graph.links[0];
  const nodeLabel = (id: string) => net.graph.nodes.find((n) => n.id === id)?.label || id;

  const ledgerFields = ["index", "timestamp", "action", "officer", "details", "prev_hash"];

  return (
    <Section id="capabilities" className="border-t border-[#d4d4d4]">
      <Container>
        <Reveal>
          <h2 className="text-3xl font-bold track-tighter md:text-4xl lg:text-5xl">
            Features
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#737373]">
            A powerful set of tools built specifically for government and law enforcement. Everything is designed to make investigation faster and more reliable.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 md:gap-5 lg:grid-cols-6">
          <RevealItem className="md:col-span-2 lg:col-span-4">
            <article className={`${cellBase} bg-transparent`}>
              <ScanText size={24} strokeWidth={1.5} aria-hidden="true" className={iconClass} />
              <h3 className={titleClass}>Find important details</h3>
              <p className={bodyClass}>
                The system reads through case files, reports, and messages to automatically identify people, vehicles, bank accounts, and phone numbers.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {extractionPatterns.map((p) => (
                  <div
                    key={p.label}
                    className={`border border-[#d4d4d4] bg-[#f5f5f5] p-4 ${
                      p.wide ? "sm:col-span-2" : ""
                    }`}
                  >
                    <Label>{p.label}</Label>
                    <div className="mt-2 overflow-x-auto">
                      <code
                        className={`${monoClass} block whitespace-pre text-[13px] leading-relaxed text-[#ff3d00]`}
                      >
                        {p.pattern}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </RevealItem>

          <RevealItem className="lg:col-span-2">
            <article className={`${cellBase} bg-[#f5f5f5]`}>
              <GitMerge size={24} strokeWidth={1.5} aria-hidden="true" className={iconClass} />
              <h3 className={titleClass}>Match related records</h3>
              <p className={bodyClass}>
                The system suggests when two different records might actually be the same person. An investigator reviews the reasons and approves the match.
              </p>

              <div className="mt-7 border-t border-[#d4d4d4] pt-5">
                <Label>Suggested match</Label>
                <dl className="mt-3 space-y-3">
                  {[aliasBase, aliasTwin].map((r) => (
                    <div key={r.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <dt className={`${monoClass} text-sm text-[#0a0a0a]`}>{r.id}</dt>
                      <dd className={`${monoClass} text-[13px] text-[#737373]`}>
                        {aliasCluster.name}, {r.city}, {r.occupation}, group {r.community}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className={`${monoClass} mt-4 text-[13px] leading-relaxed text-[#737373]`}>
                  <span className="text-[#ff3d00]">Matched on </span>
                  {aliasMatchedOn.join(" + ")}
                  {aliasBase.community !== aliasTwin.community
                    ? ", different groups"
                    : ""}
                </p>
              </div>
            </article>
          </RevealItem>

          <RevealItem className="lg:col-span-2">
            <article className={`${cellBase} bg-[#f5f5f5]`}>
              <Waypoints size={24} strokeWidth={1.5} aria-hidden="true" className={iconClass} />
              <h3 className={titleClass}>Identify key players</h3>
              <p className={bodyClass}>
                The network view highlights people or items that act as bridges between different criminal groups, helping you spot the most important targets.
              </p>

              <div className="mt-7 border-t border-[#d4d4d4] pt-5">
                <Label>Flagged in this case</Label>
                <p className="mt-3 text-lg track-tight font-semibold">{broker.label}</p>
                <dl className="mt-4 grid grid-cols-2 gap-4">
                  {[
                    ["Connection score", broker.betweenness.toFixed(4)],
                    ["Direct links", String(broker.degree)],
                    ["Group", broker.community ?? "none"],
                    ["Record ID", broker.id],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt>
                        <Label>{k}</Label>
                      </dt>
                      <dd className={`${monoClass} mt-1 text-base text-[#0a0a0a]`}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          </RevealItem>

          <RevealItem className="md:col-span-2 lg:col-span-4">
            <article className={`${cellBase} bg-[#f5f5f5]`}>
              <Share2 size={24} strokeWidth={1.5} aria-hidden="true" className={iconClass} />
              <h3 className={titleClass}>Find links between cases</h3>
              <p className={bodyClass}>
                If a phone number, vehicle, or bank account appears in two completely different cases, the system creates an alert for investigators to review.
              </p>

              <div className="mt-7 border-t border-[#d4d4d4] pt-5">
                <Label>
                  {net.stats.edges} connections found by type
                </Label>
                <ul className="mt-4 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
                  {relTypes.map(([rel, count]) => (
                    <li key={rel} className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
                      <div className="min-w-0">
                        <span
                          className={`${monoClass} block truncate text-[11px] uppercase track-wider text-[#737373]`}
                        >
                          {rel}
                        </span>
                        <span className="mt-2 block h-0.5 w-full">
                          <span
                            className="block h-0.5 bg-[#ff3d00]"
                            style={{ width: `${(count / relMax) * 100}%` }}
                          />
                        </span>
                      </div>
                      <span className={`${monoClass} text-sm tabular-nums text-[#0a0a0a]`}>
                        {count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </RevealItem>

          <RevealItem className="lg:col-span-3">
            <article className={`${cellBase} bg-transparent`}>
              <FileSearch size={24} strokeWidth={1.5} aria-hidden="true" className={iconClass} />
              <h3 className={titleClass}>Know where information came from</h3>
              <p className={bodyClass}>
                Every connection on the map stores the original record it came from. You can trace any link directly back to the original document.
              </p>

              <div className="mt-7 border-l-2 border-[#ff3d00] bg-[#f5f5f5] p-4">
                <p className={`${monoClass} text-sm leading-relaxed text-[#0a0a0a]`}>
                  {nodeLabel(traceEdge.source)} {"->"} {nodeLabel(traceEdge.target)}
                </p>
                <p className={`${monoClass} mt-2 text-[13px] leading-relaxed text-[#737373]`}>
                  {traceEdge.rel}, Match confidence {traceEdge.conf.toFixed(2)}, Source record{" "}
                  <span className="text-[#0a0a0a]">{traceEdge.rec}</span>
                </p>
              </div>
            </article>
          </RevealItem>

          <RevealItem className="lg:col-span-3">
            <article className={`${cellBase} bg-[#e5e5e5]`}>
              <ShieldCheck size={24} strokeWidth={1.5} aria-hidden="true" className={iconClass} />
              <h3 className={titleClass}>Secure evidence trail</h3>
              <p className={bodyClass}>
                Every time a record is uploaded, matched, or exported, it is securely logged. The system checks this trail to guarantee evidence has not been altered.
              </p>

              <div className="mt-7 border-t border-[#d4d4d4] pt-5">
                <Label>Information saved in the security log</Label>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {ledgerFields.map((f) => (
                    <li
                      key={f}
                      className={`${monoClass} border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] text-[#737373]`}
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </RevealItem>
        </RevealGroup>
      </Container>
    </Section>
  );
}
