import {
  Container,
  Section,
  Reveal,
  RevealGroup,
  RevealItem,
  Eyebrow,
  Label,
} from "@/components/ui";
import net from "@/data/network.json";
import {
  ScanText,
  GitMerge,
  Waypoints,
  Share2,
  FileSearch,
  ShieldCheck,
} from "lucide-react";

/* Every figure and every record id rendered below is read out of
   src/data/network.json. Nothing here is illustrative. */

const relTypes = net.relTypes as [string, number][];
const relMax = Math.max(...relTypes.map(([, count]) => count));

/* Alias resolution sample: the first real cluster in the dataset,
   and the record inside it that duplicates the base record. */
const aliasCluster = net.aliasClusters[0];
const aliasBase = aliasCluster.records[0];
const aliasTwin =
  aliasCluster.records.find(
    (r) =>
      r.id !== aliasBase.id &&
      r.city === aliasBase.city &&
      r.occupation === aliasBase.occupation,
  ) ?? aliasCluster.records[1];
const aliasMatchedOn = [
  "name",
  aliasBase.city === aliasTwin.city ? "city" : null,
  aliasBase.occupation === aliasTwin.occupation ? "occupation" : null,
].filter((f): f is string => f !== null);

/* Bridge detection sample: the entity the stealth-broker rule flagged. */
const broker = net.brokers[0];

/* Evidence sample: a real call edge, resolved back to its source record. */
const nodeLabel = (id: string) =>
  net.graph.nodes.find((n) => n.id === id)?.label ?? id;
const traceEdge =
  net.graph.links.find((l) => l.rel === "CALLS") ?? net.graph.links[0];

const extractionPatterns: { label: string; pattern: string; wide?: boolean }[] = [
  { label: "Phone", pattern: "(?:\\+91[-\\s]?)?[6-9]\\d{9}" },
  { label: "Bank account", pattern: "\\d{9,18}" },
  {
    label: "Vehicle",
    pattern: "[A-Z]{2}[-\\s]?\\d{1,2}[-\\s]?[A-Z]{1,3}[-\\s]?\\d{4}",
    wide: true,
  },
];

const ledgerFields = [
  "index",
  "timestamp",
  "action",
  "officer id",
  "payload hash",
  "prev hash",
];

const cellBase =
  "group flex h-full flex-col border border-[#262626] p-6 transition-colors duration-150 ease-[cubic-bezier(0.25,0,0,1)] hover:border-[#3d3d3d] md:p-8";

const iconClass =
  "text-[#737373] transition-colors duration-150 ease-[cubic-bezier(0.25,0,0,1)] group-hover:text-[#fafafa]";

const titleClass = "mt-5 text-xl track-tight font-semibold md:text-2xl";

const bodyClass = "mt-3 max-w-2xl text-base leading-relaxed text-[#737373]";

const monoClass = "font-[family-name:var(--font-jetbrains)]";

export default function Capabilities() {
  return (
    <Section id="capabilities">
      <Container>
        <Reveal>
          <Eyebrow>Capabilities</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl track-tighter font-semibold md:text-4xl lg:text-5xl">
            What the system actually does.
          </h2>
          <p className={`${bodyClass} mt-6`}>
            Six capabilities, all of them running in the current build against the
            {" "}
            {net.stats.sourceRecords} source records in the demo dataset. Each one
            produces something an investigator can open, question and reject.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 md:gap-5 lg:grid-cols-6">
          {/* 1. Entity extraction. Wide: 4 of 6 at lg. */}
          <RevealItem className="md:col-span-2 lg:col-span-4">
            <article className={`${cellBase} bg-transparent`}>
              <ScanText size={24} strokeWidth={1.5} aria-hidden="true" className={iconClass} />
              <h3 className={titleClass}>Entity extraction</h3>
              <p className={bodyClass}>
                spaCy en_core_web_sm NER plus regex tuned for Indian records pulls
                persons, phones, vehicles, accounts, locations and organizations out
                of unstructured FIR narratives.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {extractionPatterns.map((p) => (
                  <div
                    key={p.label}
                    className={`border border-[#262626] bg-[#0f0f0f] p-4 ${
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

          {/* 2. Alias resolution. 2 of 6 at lg. */}
          <RevealItem className="lg:col-span-2">
            <article className={`${cellBase} bg-[#0f0f0f]`}>
              <GitMerge size={24} strokeWidth={1.5} aria-hidden="true" className={iconClass} />
              <h3 className={titleClass}>Alias resolution</h3>
              <p className={bodyClass}>
                Fuzzy token_sort_ratio matching at threshold 85 proposes that two
                records are the same person, and shows the reason. A human confirms
                or rejects.
              </p>

              <div className="mt-7 border-t border-[#262626] pt-5">
                <Label>Suggested merge</Label>
                <dl className="mt-3 space-y-3">
                  {[aliasBase, aliasTwin].map((r) => (
                    <div key={r.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <dt className={`${monoClass} text-sm text-[#fafafa]`}>{r.id}</dt>
                      <dd className={`${monoClass} text-[13px] text-[#737373]`}>
                        {aliasCluster.name}, {r.city}, {r.occupation}, {r.community}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className={`${monoClass} mt-4 text-[13px] leading-relaxed text-[#737373]`}>
                  <span className="text-[#ff3d00]">match on </span>
                  {aliasMatchedOn.join(" + ")}
                  {aliasBase.community !== aliasTwin.community
                    ? ", communities differ"
                    : ""}
                </p>
              </div>
            </article>
          </RevealItem>

          {/* 3. Bridge detection. 2 of 6 at lg. */}
          <RevealItem className="lg:col-span-2">
            <article className={`${cellBase} bg-[#0f0f0f]`}>
              <Waypoints size={24} strokeWidth={1.5} aria-hidden="true" className={iconClass} />
              <h3 className={titleClass}>Bridge detection</h3>
              <p className={bodyClass}>
                High betweenness with low direct degree flags an entity bridging two
                clusters while looking unimportant inside its own.
              </p>

              <div className="mt-7 border-t border-[#262626] pt-5">
                <Label>Flagged in this dataset</Label>
                <p className="mt-3 text-lg track-tight font-semibold">{broker.label}</p>
                <dl className="mt-4 grid grid-cols-2 gap-4">
                  {[
                    ["Betweenness", broker.betweenness.toFixed(4)],
                    ["Degree", String(broker.degree)],
                    ["Community", broker.community ?? "none"],
                    ["Record", broker.id],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt>
                        <Label>{k}</Label>
                      </dt>
                      <dd className={`${monoClass} mt-1 text-base text-[#fafafa]`}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          </RevealItem>

          {/* 4. Cross-case linking. Wide: 4 of 6 at lg. */}
          <RevealItem className="md:col-span-2 lg:col-span-4">
            <article className={`${cellBase} bg-[#0f0f0f]`}>
              <Share2 size={24} strokeWidth={1.5} aria-hidden="true" className={iconClass} />
              <h3 className={titleClass}>Cross-case linking</h3>
              <p className={bodyClass}>
                A phone, vehicle or account shared by two otherwise unrelated cases is
                raised as a reviewable alert, not an automatic conclusion.
              </p>

              <div className="mt-7 border-t border-[#262626] pt-5">
                <Label>
                  {net.stats.edges} edges by relation type
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
                      <span className={`${monoClass} text-sm tabular-nums text-[#fafafa]`}>
                        {count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </RevealItem>

          {/* 5. Evidence traceability. 3 of 6 at lg. */}
          <RevealItem className="lg:col-span-3">
            <article className={`${cellBase} bg-transparent`}>
              <FileSearch size={24} strokeWidth={1.5} aria-hidden="true" className={iconClass} />
              <h3 className={titleClass}>Evidence traceability</h3>
              <p className={bodyClass}>
                Every edge stores the source record id and extraction confidence, so
                any link can be walked back to the document behind it.
              </p>

              <div className="mt-7 border-l-2 border-[#ff3d00] bg-[#0f0f0f] p-4">
                <p className={`${monoClass} text-sm leading-relaxed text-[#fafafa]`}>
                  {nodeLabel(traceEdge.source)} {"->"} {nodeLabel(traceEdge.target)}
                </p>
                <p className={`${monoClass} mt-2 text-[13px] leading-relaxed text-[#737373]`}>
                  {traceEdge.rel}, confidence {traceEdge.conf.toFixed(2)}, source record{" "}
                  <span className="text-[#fafafa]">{traceEdge.rec}</span>
                </p>
              </div>
            </article>
          </RevealItem>

          {/* 6. Chain of custody. 3 of 6 at lg. */}
          <RevealItem className="lg:col-span-3">
            <article className={`${cellBase} bg-[#1a1a1a]`}>
              <ShieldCheck size={24} strokeWidth={1.5} aria-hidden="true" className={iconClass} />
              <h3 className={titleClass}>Chain of custody</h3>
              <p className={bodyClass}>
                Every ingest, merge and export is SHA-256 hash-chained.
                verify_integrity walks the chain and fails on any tampering. Only
                hashes, never case content.
              </p>

              <div className="mt-7 border-t border-[#262626] pt-5">
                <Label>Fields held in each block</Label>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {ledgerFields.map((f) => (
                    <li
                      key={f}
                      className={`${monoClass} border border-[#262626] px-2.5 py-1.5 text-[13px] text-[#737373]`}
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
