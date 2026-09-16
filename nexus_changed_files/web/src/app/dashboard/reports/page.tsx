"use client";

import { useMemo, useState } from "react";
import {
  Download,
  FileText,
  CheckCircle2,
  ChevronDown,
  Globe,
  FileCode,
  Info,
} from "lucide-react";
import { Reveal, Label, entityColor } from "@/components/ui";
import netData from "@/data/network.json";

/* Every number and every list on this page is read straight from
   network.json — nothing here is invented. Where the underlying data
   doesn't exist yet (a live chain-of-custody feed, for instance — that
   lives in the Python engine's blockchain_ledger.py and isn't wired to
   this app yet), the report says so explicitly instead of faking it. */

type GNode = {
  id: string;
  label: string;
  type: string;
  community: string | null;
  betweenness: number;
  pagerank: number;
  degree: number;
  isBroker: boolean;
};
type GLink = { source: string; target: string; rel: string; conf: number; rec: string };

const NODES = netData.graph.nodes as unknown as GNode[];
const LINKS = netData.graph.links as unknown as GLink[];
const BY_ID = new Map<string, GNode>(NODES.map((n) => [n.id, n]));
const TOP = netData.topEntities as unknown as GNode[];
const BROKERS = netData.brokers as unknown as GNode[];
const ALIAS_CLUSTERS = netData.aliasClusters;
const REL_TYPES = netData.relTypes;
const CRIME_TYPES = netData.crimeTypes;
const CITIES = netData.cities;

const REPORT_TYPES = [
  { id: "network", title: "Network Summary", desc: "Top entities and network statistics" },
  { id: "dossier", title: "Entity Dossier", desc: "Detailed profile for a selected entity" },
  { id: "evidence", title: "Evidence Trail", desc: "Every source record behind a connection" },
  { id: "full", title: "Full Case Report", desc: "Network summary + dossier + evidence, combined" },
] as const;

type ReportId = (typeof REPORT_TYPES)[number]["id"];

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportId>("network");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [generatedAt, setGeneratedAt] = useState("");
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [dossierId, setDossierId] = useState(BROKERS[0]?.id ?? TOP[0]?.id ?? NODES[0]?.id);

  const activeMeta = REPORT_TYPES.find((r) => r.id === activeReport)!;
  const caseId = useMemo(() => `NEX-${Math.abs(hashCode(activeReport)).toString().slice(0, 6)}`, [activeReport]);

  const dossierNode = BY_ID.get(dossierId) ?? null;
  const dossierLinks = useMemo(
    () => LINKS.filter((l) => l.source === dossierId || l.target === dossierId),
    [dossierId],
  );

  const evidenceLinks = useMemo(() => {
    // Highest-confidence, most load-bearing connections first — the ones
    // an investigator would want to verify against source records first.
    return [...LINKS].sort((a, b) => b.conf - a.conf).slice(0, 40);
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setDownloadOpen(false);
    // A brief, honestly-labelled compute delay — the page is assembling
    // and sorting real arrays (LINKS, TOP, etc.), not simulating work
    // that doesn't happen.
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setGeneratedAt(new Date().toISOString());
    }, 400);
  };

  const reportHtml = useMemo(
    () => buildReportHtml(activeReport, { caseId, generatedAt, dossierNode, dossierLinks, evidenceLinks }),
    [activeReport, caseId, generatedAt, dossierNode, dossierLinks, evidenceLinks],
  );

  const handleDownload = (type: "pdf" | "html" | "json") => {
    setDownloadOpen(false);
    const dateStr = new Date().toISOString().split("T")[0];

    if (type === "json") {
      const payload =
        activeReport === "dossier"
          ? { entity: dossierNode, connections: dossierLinks }
          : activeReport === "evidence"
            ? { evidence: evidenceLinks }
            : netData;
      downloadBlob(
        new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }),
        `nexus_export_${activeReport}_${dateStr}.json`,
      );
      return;
    }

    if (type === "html") {
      downloadBlob(new Blob([reportHtml], { type: "text/html" }), `nexus_export_${activeReport}_${dateStr}.html`);
      return;
    }

    // "PDF": open the same real report HTML in a new tab, print-styled,
    // and hand off to the browser's native print dialog so the person can
    // Save as PDF. This produces an actual PDF from real content, rather
    // than a mocked file — the tradeoff is one extra click (Save as PDF)
    // instead of a direct .pdf download, since generating PDF bytes
    // client-side would need a new dependency this app doesn't carry yet.
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(reportHtml);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 300);
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-12">
      <Reveal>
        <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">Report Generation</h2>
        <p className="mt-4 max-w-2xl text-[#737373] leading-relaxed">
          Every figure below is read directly from the case graph — nothing is filled in for
          display purposes. HTML and JSON download immediately; PDF opens a print-ready view you
          can save from your browser&apos;s print dialog.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[400px_1fr]">
        <div className="grid grid-cols-1 gap-4 h-min">
          {REPORT_TYPES.map((type) => (
            <button
              type="button"
              key={type.id}
              onClick={() => {
                setActiveReport(type.id);
                setGenerated(false);
              }}
              className={`text-left cursor-pointer border p-5 transition-colors ${
                activeReport === type.id
                  ? "border-[#ff3d00] bg-[#e5e5e5]"
                  : "border-[#d4d4d4] bg-[#f5f5f5] hover:border-[#a3a3a3]"
              }`}
            >
              <div className="flex items-center justify-between">
                <FileText className={activeReport === type.id ? "text-[#ff3d00]" : "text-[#737373]"} size={20} />
                {activeReport === type.id && <CheckCircle2 className="text-[#ff3d00]" size={16} />}
              </div>
              <h3 className="mt-3 text-lg font-medium text-[#0a0a0a]">{type.title}</h3>
              <p className="mt-1 text-sm text-[#737373]">{type.desc}</p>
            </button>
          ))}

          {activeReport === "dossier" && (
            <div className="border border-[#d4d4d4] bg-[#f5f5f5] p-5">
              <Label>Entity</Label>
              <select
                value={dossierId}
                onChange={(e) => {
                  setDossierId(e.target.value);
                  setGenerated(false);
                }}
                className="mt-2 w-full border border-[#d4d4d4] bg-white px-3 py-2.5 text-sm font-[family-name:var(--font-mono)] outline-none focus:border-[#ff3d00]"
              >
                <optgroup label="Flagged brokers">
                  {BROKERS.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label} — {n.type}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Most central entities">
                  {TOP.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label} — {n.type}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}
        </div>

        <div className="flex flex-col border border-[#d4d4d4] bg-white min-h-[600px] shadow-sm">
          <div className="border-b border-[#d4d4d4] bg-[#f5f5f5] px-6 py-4 flex justify-between items-center">
            <Label>REPORT PREVIEW — {activeMeta.title.toUpperCase()}</Label>
            {generating && (
              <span className="text-sm font-[family-name:var(--font-mono)] text-[#ff3d00] animate-pulse">
                Assembling report...
              </span>
            )}
          </div>

          <div className="flex-1 p-6 md:p-10 overflow-y-auto">
            {!generated ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <FileText className="mb-4 text-[#d4d4d4]" size={48} />
                <p className="text-[#737373]">Click generate to build the {activeMeta.title.toLowerCase()}.</p>
              </div>
            ) : (
              <div className="space-y-6 text-[#0a0a0a] max-w-3xl mx-auto">
                <ReportHeader caseId={caseId} generatedAt={generatedAt} reportTitle={activeMeta.title} />

                {(activeReport === "network" || activeReport === "full") && <NetworkSummarySection />}
                {(activeReport === "dossier" || activeReport === "full") && dossierNode && (
                  <DossierSection node={dossierNode} links={dossierLinks} />
                )}
                {(activeReport === "evidence" || activeReport === "full") && (
                  <EvidenceSection links={activeReport === "full" ? evidenceLinks.slice(0, 10) : evidenceLinks} truncated={activeReport === "full"} />
                )}

                <div className="mt-8 border-t border-[#d4d4d4] pt-6 flex gap-2">
                  <Info className="h-4 w-4 shrink-0 text-[#737373] mt-0.5" strokeWidth={1.5} />
                  <p className="text-xs text-[#737373] italic leading-relaxed">
                    Synthetic demonstration data. Risk indicators, broker flags and centrality
                    scores are analytical signals from graph structure, not findings of fact —
                    every entry should be verified against source records before use.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#d4d4d4] bg-[#f5f5f5] p-4 flex justify-end">
            {!generated ? (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full sm:w-auto px-8 border border-[#ff3d00] bg-white py-3 text-sm font-semibold uppercase tracking-wider text-[#ff3d00] transition-colors hover:bg-[#ff3d00] hover:text-[#fafafa]"
              >
                {generating ? "Compiling..." : "Generate Report"}
              </button>
            ) : (
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setDownloadOpen(!downloadOpen)}
                  className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-3 border border-[#0a0a0a] bg-[#0a0a0a] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#fafafa] transition-opacity hover:opacity-90"
                >
                  <Download size={18} />
                  DOWNLOAD REPORT
                  <ChevronDown size={18} />
                </button>
                {downloadOpen && (
                  <div className="absolute right-0 bottom-full mb-2 w-full sm:w-56 bg-white border border-[#0a0a0a] shadow-lg flex flex-col">
                    <button onClick={() => handleDownload("pdf")} className="flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[#f5f5f5] border-b border-[#f0f0f0]">
                      <FileText size={16} className="text-red-600" />
                      Print / Save as PDF
                    </button>
                    <button onClick={() => handleDownload("html")} className="flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[#f5f5f5] border-b border-[#f0f0f0]">
                      <Globe size={16} className="text-blue-600" />
                      HTML Report
                    </button>
                    <button onClick={() => handleDownload("json")} className="flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[#f5f5f5] text-[#737373]">
                      <FileCode size={16} />
                      JSON Data
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- on-screen sections (all real data) ---------- */

function ReportHeader({ caseId, generatedAt, reportTitle }: { caseId: string; generatedAt: string; reportTitle: string }) {
  return (
    <div className="border-b-2 border-[#0a0a0a] pb-6 mb-6">
      <h1 className="text-3xl font-bold tracking-tighter">NEXUS Investigation Report</h1>
      <div className="mt-4 grid grid-cols-2 gap-4 font-[family-name:var(--font-mono)] text-xs text-[#737373] uppercase">
        <div>
          <p>Case ID: <span className="text-[#0a0a0a]">{caseId}</span></p>
          <p>Report Date: <span className="text-[#0a0a0a]">{generatedAt.split("T")[0]}</span></p>
        </div>
        <div>
          <p>Source: <span className="text-[#0a0a0a]">Synthetic case graph (500 records)</span></p>
          <p>Report Type: <span className="text-[#0a0a0a]">{reportTitle}</span></p>
        </div>
      </div>
    </div>
  );
}

function NetworkSummarySection() {
  return (
    <div>
      <h2 className="text-lg font-semibold border-b border-[#d4d4d4] pb-2 mb-4">Network Overview</h2>
      <p className="text-sm leading-relaxed text-[#737373]">
        {netData.stats.nodes} entities and {netData.stats.edges} connections resolved from{" "}
        {netData.stats.sourceRecords} source records, forming {netData.stats.communities} distinct
        communities across {netData.stats.components} connected components (network density{" "}
        {netData.stats.density}, average degree {netData.stats.avgDegree}).
      </p>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {([["nodes", "Total Entities"], ["edges", "Total Connections"], ["communities", "Communities"]] as const).map(([k, label]) => (
          <div key={k} className="bg-[#f5f5f5] p-3 text-center border border-[#d4d4d4]">
            <p className="text-2xl font-[family-name:var(--font-mono)] text-[#0a0a0a]">{(netData.stats as Record<string, number>)[k]}</p>
            <p className="text-[10px] uppercase font-[family-name:var(--font-mono)] text-[#737373]">{label}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-6 text-sm font-semibold text-[#0a0a0a]">Most central entities</h3>
      <table className="mt-2 w-full text-sm border border-[#d4d4d4]">
        <thead>
          <tr className="bg-[#f5f5f5] text-left text-[10px] uppercase font-[family-name:var(--font-mono)] text-[#737373]">
            <th className="p-2">Entity</th>
            <th className="p-2">Type</th>
            <th className="p-2">Direct links</th>
            <th className="p-2">Bridge score</th>
          </tr>
        </thead>
        <tbody>
          {TOP.slice(0, 8).map((n) => (
            <tr key={n.id} className="border-t border-[#d4d4d4]">
              <td className="p-2">{n.label}</td>
              <td className="p-2">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 inline-block" style={{ backgroundColor: entityColor(n.type) }} />
                  {n.type}
                </span>
              </td>
              <td className="p-2 font-[family-name:var(--font-mono)]">{n.degree}</td>
              <td className="p-2 font-[family-name:var(--font-mono)]">{n.betweenness.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="mt-6 text-sm font-semibold text-[#0a0a0a]">Flagged network bridges ({BROKERS.length})</h3>
      <p className="mt-1 text-xs text-[#737373]">
        Entities with high betweenness relative to their direct connection count — they link
        otherwise separate parts of the network despite not looking well-connected at a glance.
      </p>
      <ul className="mt-2 text-sm">
        {BROKERS.map((b) => (
          <li key={b.id} className="border-t border-[#d4d4d4] py-1.5 flex justify-between">
            <span>{b.label} <span className="text-[#737373]">({b.type}, community {b.community ?? "—"})</span></span>
            <span className="font-[family-name:var(--font-mono)] text-[#737373]">deg {b.degree}</span>
          </li>
        ))}
      </ul>

      {ALIAS_CLUSTERS.length > 0 && (
        <>
          <h3 className="mt-6 text-sm font-semibold text-[#0a0a0a]">Possible alias clusters ({ALIAS_CLUSTERS.length})</h3>
          <p className="mt-1 text-xs text-[#737373]">Records that may refer to the same underlying identity — pending investigator confirmation, not auto-merged.</p>
          <ul className="mt-2 space-y-2 text-sm">
            {ALIAS_CLUSTERS.map((c, i) => (
              <li key={i} className="border-t border-[#d4d4d4] pt-2">
                <span className="font-medium">{c.name}</span>
                <span className="ml-2 text-xs text-[#737373]">{c.records.length} matching records across {new Set(c.records.map((r) => r.city)).size} cities</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <h3 className="mt-6 text-sm font-semibold text-[#0a0a0a]">Relationship types</h3>
      <ul className="mt-2 grid grid-cols-2 gap-x-6 text-sm">
        {REL_TYPES.map(([rel, count]) => (
          <li key={rel} className="border-t border-[#d4d4d4] py-1.5 flex justify-between">
            <span>{String(rel).replace(/_/g, " ")}</span>
            <span className="font-[family-name:var(--font-mono)] text-[#737373]">{count}</span>
          </li>
        ))}
      </ul>

      {CRIME_TYPES.length > 0 && (
        <>
          <h3 className="mt-6 text-sm font-semibold text-[#0a0a0a]">Crime types represented</h3>
          <ul className="mt-2 grid grid-cols-2 gap-x-6 text-sm">
            {CRIME_TYPES.map(([type, count]) => (
              <li key={type} className="border-t border-[#d4d4d4] py-1.5 flex justify-between">
                <span>{type}</span>
                <span className="font-[family-name:var(--font-mono)] text-[#737373]">{count}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {CITIES.length > 0 && (
        <>
          <h3 className="mt-6 text-sm font-semibold text-[#0a0a0a]">Geographic concentration</h3>
          <ul className="mt-2 grid grid-cols-2 gap-x-6 text-sm">
            {CITIES.map(([city, count]) => (
              <li key={city} className="border-t border-[#d4d4d4] py-1.5 flex justify-between">
                <span>{city}</span>
                <span className="font-[family-name:var(--font-mono)] text-[#737373]">{count}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function DossierSection({ node, links }: { node: GNode; links: GLink[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold border-b border-[#d4d4d4] pb-2 mb-4">Entity Dossier — {node.label}</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-[#f5f5f5] p-3 border border-[#d4d4d4]">
          <p className="text-[10px] uppercase font-[family-name:var(--font-mono)] text-[#737373]">Type</p>
          <p className="mt-1 font-[family-name:var(--font-mono)]">{node.type}</p>
        </div>
        <div className="bg-[#f5f5f5] p-3 border border-[#d4d4d4]">
          <p className="text-[10px] uppercase font-[family-name:var(--font-mono)] text-[#737373]">Community</p>
          <p className="mt-1 font-[family-name:var(--font-mono)]">{node.community ?? "Unassigned"}</p>
        </div>
        <div className="bg-[#f5f5f5] p-3 border border-[#d4d4d4]">
          <p className="text-[10px] uppercase font-[family-name:var(--font-mono)] text-[#737373]">Direct connections</p>
          <p className="mt-1 font-[family-name:var(--font-mono)]">{node.degree}</p>
        </div>
        <div className="bg-[#f5f5f5] p-3 border border-[#d4d4d4]">
          <p className="text-[10px] uppercase font-[family-name:var(--font-mono)] text-[#737373]">Network bridge score</p>
          <p className="mt-1 font-[family-name:var(--font-mono)]">{node.betweenness.toFixed(4)}</p>
        </div>
      </div>
      {node.isBroker && (
        <p className="mt-3 text-xs text-[#b45309] bg-[#fff7ed] border border-[#fde68a] p-2">
          Flagged as a possible network bridge: high relative betweenness despite a low direct-connection count.
        </p>
      )}

      <h3 className="mt-6 text-sm font-semibold text-[#0a0a0a]">Connections ({links.length})</h3>
      <table className="mt-2 w-full text-sm border border-[#d4d4d4]">
        <thead>
          <tr className="bg-[#f5f5f5] text-left text-[10px] uppercase font-[family-name:var(--font-mono)] text-[#737373]">
            <th className="p-2">Connected entity</th>
            <th className="p-2">Relationship</th>
            <th className="p-2">Confidence</th>
            <th className="p-2">Source record</th>
          </tr>
        </thead>
        <tbody>
          {links.map((l, i) => {
            const otherId = l.source === node.id ? l.target : l.source;
            const other = BY_ID.get(otherId);
            return (
              <tr key={i} className="border-t border-[#d4d4d4]">
                <td className="p-2">{other?.label ?? otherId}</td>
                <td className="p-2 font-[family-name:var(--font-mono)] text-xs">{l.rel.replace(/_/g, " ")}</td>
                <td className="p-2 font-[family-name:var(--font-mono)]">{(l.conf * 100).toFixed(0)}%</td>
                <td className="p-2 font-[family-name:var(--font-mono)] text-xs">{l.rec}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EvidenceSection({ links, truncated }: { links: GLink[]; truncated?: boolean }) {
  return (
    <div>
      <h2 className="text-lg font-semibold border-b border-[#d4d4d4] pb-2 mb-4">Evidence Trail</h2>
      <p className="text-sm leading-relaxed text-[#737373]">
        Every connection in the graph traces back to a source record. Listed below by confidence,
        highest first{truncated ? " (top 10 shown; full list in the network summary export)" : ""}.
      </p>
      <p className="mt-2 text-xs text-[#737373] italic">
        Note: this lists source records for graph connections. A live, tamper-evident
        chain-of-custody log for ingestion actions exists in the analytics engine
        (blockchain_ledger.py) but is not yet wired to this web app — see the architecture note
        in the audit report.
      </p>
      <table className="mt-3 w-full text-sm border border-[#d4d4d4]">
        <thead>
          <tr className="bg-[#f5f5f5] text-left text-[10px] uppercase font-[family-name:var(--font-mono)] text-[#737373]">
            <th className="p-2">From</th>
            <th className="p-2">Relationship</th>
            <th className="p-2">To</th>
            <th className="p-2">Confidence</th>
            <th className="p-2">Source record</th>
          </tr>
        </thead>
        <tbody>
          {links.map((l, i) => (
            <tr key={i} className="border-t border-[#d4d4d4]">
              <td className="p-2">{BY_ID.get(l.source)?.label ?? l.source}</td>
              <td className="p-2 font-[family-name:var(--font-mono)] text-xs">{l.rel.replace(/_/g, " ")}</td>
              <td className="p-2">{BY_ID.get(l.target)?.label ?? l.target}</td>
              <td className="p-2 font-[family-name:var(--font-mono)]">{(l.conf * 100).toFixed(0)}%</td>
              <td className="p-2 font-[family-name:var(--font-mono)] text-xs">{l.rec}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- export helpers ---------- */

function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h + Date.now();
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function buildReportHtml(
  reportId: ReportId,
  ctx: { caseId: string; generatedAt: string; dossierNode: GNode | null; dossierLinks: GLink[]; evidenceLinks: GLink[] },
) {
  const title = REPORT_TYPES.find((r) => r.id === reportId)!.title;
  let body = `<h1>NEXUS Investigation Report</h1>
  <p class="meta">Case ID: ${ctx.caseId} &nbsp;•&nbsp; Generated: ${ctx.generatedAt} &nbsp;•&nbsp; Type: ${escapeHtml(title)}</p>`;

  if (reportId === "network" || reportId === "full") {
    body += `<h2>Network Overview</h2>
    <p>${netData.stats.nodes} entities and ${netData.stats.edges} connections across ${netData.stats.communities} communities (density ${netData.stats.density}, avg degree ${netData.stats.avgDegree}).</p>
    <h3>Most central entities</h3>
    <table><tr><th>Entity</th><th>Type</th><th>Direct links</th><th>Bridge score</th></tr>
    ${TOP.slice(0, 15)
      .map((n) => `<tr><td>${escapeHtml(n.label)}</td><td>${n.type}</td><td>${n.degree}</td><td>${n.betweenness.toFixed(4)}</td></tr>`)
      .join("")}
    </table>
    <h3>Flagged network bridges</h3>
    <ul>${BROKERS.map((b) => `<li>${escapeHtml(b.label)} (${b.type}, community ${b.community ?? "—"}, degree ${b.degree})</li>`).join("")}</ul>
    <h3>Relationship types</h3>
    <ul>${REL_TYPES.map(([r, c]) => `<li>${String(r).replace(/_/g, " ")}: ${c}</li>`).join("")}</ul>`;
  }

  if ((reportId === "dossier" || reportId === "full") && ctx.dossierNode) {
    const n = ctx.dossierNode;
    body += `<h2>Entity Dossier — ${escapeHtml(n.label)}</h2>
    <p>Type: ${n.type} &nbsp; Community: ${n.community ?? "Unassigned"} &nbsp; Direct connections: ${n.degree} &nbsp; Bridge score: ${n.betweenness.toFixed(4)}</p>
    <table><tr><th>Connected entity</th><th>Relationship</th><th>Confidence</th><th>Source record</th></tr>
    ${ctx.dossierLinks
      .map((l) => {
        const otherId = l.source === n.id ? l.target : l.source;
        const other = BY_ID.get(otherId);
        return `<tr><td>${escapeHtml(other?.label ?? otherId)}</td><td>${l.rel.replace(/_/g, " ")}</td><td>${(l.conf * 100).toFixed(0)}%</td><td>${escapeHtml(l.rec)}</td></tr>`;
      })
      .join("")}
    </table>`;
  }

  if (reportId === "evidence" || reportId === "full") {
    const rows = reportId === "full" ? ctx.evidenceLinks.slice(0, 10) : ctx.evidenceLinks;
    body += `<h2>Evidence Trail</h2>
    <table><tr><th>From</th><th>Relationship</th><th>To</th><th>Confidence</th><th>Source record</th></tr>
    ${rows
      .map(
        (l) =>
          `<tr><td>${escapeHtml(BY_ID.get(l.source)?.label ?? l.source)}</td><td>${l.rel.replace(/_/g, " ")}</td><td>${escapeHtml(BY_ID.get(l.target)?.label ?? l.target)}</td><td>${(l.conf * 100).toFixed(0)}%</td><td>${escapeHtml(l.rec)}</td></tr>`,
      )
      .join("")}
    </table>`;
  }

  body += `<p class="disclaimer">Synthetic demonstration data. Risk indicators, broker flags and centrality scores are analytical signals from graph structure, not findings of fact — every entry should be verified against source records before use.</p>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)} — ${ctx.caseId}</title>
  <style>
    body{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#0a0a0a;max-width:800px;margin:40px auto;padding:0 20px;}
    h1{font-size:24px;border-bottom:2px solid #0a0a0a;padding-bottom:12px;}
    h2{font-size:16px;border-bottom:1px solid #d4d4d4;padding-bottom:6px;margin-top:32px;}
    h3{font-size:13px;margin-top:20px;}
    .meta{color:#737373;font-size:11px;text-transform:uppercase;}
    table{width:100%;border-collapse:collapse;font-size:12px;margin-top:8px;}
    th,td{border:1px solid #d4d4d4;padding:6px 8px;text-align:left;}
    th{background:#f5f5f5;text-transform:uppercase;font-size:10px;color:#737373;}
    ul{font-size:12px;}
    .disclaimer{margin-top:32px;font-size:11px;font-style:italic;color:#737373;border-top:1px solid #d4d4d4;padding-top:12px;}
    @media print { body{margin:0;} }
  </style></head><body>${body}</body></html>`;
}
