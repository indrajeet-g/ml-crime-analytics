"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, CheckCircle2, ArrowRight, AlertTriangle } from "lucide-react";
import { Reveal, Label } from "@/components/ui";

const SOURCE_TYPES = ["FIR", "CDR", "Transaction", "Vehicle Registry", "Field Report"] as const;

/* One short, realistic record per source type. These stand in for a real
   upload so the "Load Sample Record" path has something honest to load —
   they are not dressed up as a live database, and each one actually runs
   through the same regex extractor as a real uploaded file would. */
const SAMPLE_RECORDS: Record<(typeof SOURCE_TYPES)[number], { id: string; date: string; text: string }> = {
  FIR: {
    id: "FIR-2026-042",
    date: "2026-03-14",
    text: "FIR 2026/042: Complainant Rohan Joshi of Sanganer reported a consignment diverted before delivery. Booking arranged by Vivek Iyer, recorded elsewhere as V. Iyer, mobile +91 98111 00001.",
  },
  CDR: {
    id: "CDR-98111-X",
    date: "2026-03-14",
    text: "CDR extract: 9811100001 -> 9876543210, duration 124s, 21:40 hrs. Same number 9811100001 also contacted 9822200002 twice the same evening.",
  },
  Transaction: {
    id: "TRX-40217",
    date: "2026-03-15",
    text: "Transaction record: INR 45,000.00 credited to account 402177889012 from a linked account, memo references booking FIR-2026-042.",
  },
  "Vehicle Registry": {
    id: "VEH-DL01AB1234",
    date: "2026-03-14",
    text: "Vehicle registry lookup: DL-01-AB-1234 logged at the loading bay gate register on two separate nights by gate staff Aarav Mehta.",
  },
  "Field Report": {
    id: "FLD-2026-011",
    date: "2026-03-16",
    text: "Field report: Officer notes Sunil Verma present at the same address as Ramesh Kumar, phone 98222 00002, vehicle DL-01-AB-1234 seen parked outside.",
  },
};

const ACCEPTED_EXT = [".txt", ".csv", ".json", ".md"];

export default function IngestPage() {
  const router = useRouter();
  const [activeType, setActiveType] = useState<(typeof SOURCE_TYPES)[number]>(SOURCE_TYPES[0]);
  const [reading, setReading] = useState(false);
  const [loaded, setLoaded] = useState<{ id: string; date: string; text: string; source: "upload" | "sample"; fileName?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSample = () => {
    const sample = SAMPLE_RECORDS[activeType];
    setError(null);
    setLoaded({ ...sample, source: "sample" });
  };

  const handleFile = (file: File) => {
    setError(null);
    const isTextLike = ACCEPTED_EXT.some((ext) => file.name.toLowerCase().endsWith(ext)) || file.type.startsWith("text/");
    if (!isTextLike) {
      setError(`"${file.name}" isn't a plain-text format this demo can read in the browser (.txt, .csv, .json, .md). Try one of those, or use a sample record.`);
      return;
    }
    setReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setReading(false);
      setLoaded({
        id: file.name,
        date: new Date(file.lastModified).toISOString().split("T")[0],
        text: text.slice(0, 20000), // cap what we carry forward; this is a demo reader, not a bulk ingest pipeline
        source: "upload",
        fileName: file.name,
      });
    };
    reader.onerror = () => {
      setReading(false);
      setError(`Couldn't read "${file.name}" in the browser.`);
    };
    reader.readAsText(file);
  };

  const beginExtraction = () => {
    if (!loaded) return;
    try {
      window.sessionStorage.setItem("nexus_ingest_text", loaded.text);
    } catch {
      // sessionStorage unavailable — the extractor still works, it'll
      // just open with its own default sample instead of this record.
    }
    router.push("/dashboard/extract");
  };

  const lineCount = loaded ? loaded.text.split(/\r?\n/).filter((l) => l.trim().length > 0).length : 0;

  return (
    <div className="p-6 md:p-8 lg:p-12">
      <Reveal>
        <div className="mb-8">
          <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">Data Ingestion</h2>
          <p className="mt-4 max-w-2xl text-[#737373] leading-relaxed">
            Upload a plain-text record, or load a sample, to send through the entity extractor.
            Files are read in your browser — nothing is uploaded to a server in this prototype.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
          <div className="flex flex-col gap-2">
            <Label>Source Type</Label>
            <div className="mt-2 flex flex-col gap-2">
              {SOURCE_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`flex w-full items-center justify-between border px-4 py-3 text-sm font-medium transition-colors ${
                    activeType === type
                      ? "border-[#ff3d00] bg-[#e5e5e5] text-[#ff3d00]"
                      : "border-[#d4d4d4] bg-[#f5f5f5] text-[#737373] hover:text-[#0a0a0a]"
                  }`}
                >
                  {type}
                  {activeType === type && <CheckCircle2 size={16} />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {error && (
              <div className="flex items-start gap-3 border border-[#fca5a5] bg-[#fef2f2] p-4 text-sm text-[#991b1b]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                <p>{error}</p>
              </div>
            )}

            {!loaded ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFile(file);
                }}
                className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-[#d4d4d4] bg-[#f5f5f5] p-12 transition-colors hover:border-[#a3a3a3]"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept={ACCEPTED_EXT.join(",")}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                    e.target.value = "";
                  }}
                />
                <div className="flex h-16 w-16 items-center justify-center bg-[#e5e5e5] text-[#ff3d00]">
                  <UploadCloud size={32} strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 text-xl font-medium tracking-tight">Drop a file to upload</h3>
                <p className="mt-2 text-[#737373]">or click to browse local files</p>
                <p className="mt-6 text-sm text-[#737373]">Plain text formats: .txt, .csv, .json, .md</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    loadSample();
                  }}
                  disabled={reading}
                  className="mt-8 border border-[#0a0a0a] bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-wider text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a] hover:text-[#fafafa] disabled:opacity-50"
                >
                  {reading ? "Reading..." : `Load Sample ${activeType} Record`}
                </button>
              </div>
            ) : (
              <div className="border border-[#d4d4d4] bg-[#f5f5f5]">
                <div className="flex items-center justify-between border-b border-[#d4d4d4] px-6 py-4">
                  <div className="flex items-center gap-3 text-[#ff3d00]">
                    <CheckCircle2 size={20} />
                    <span className="font-semibold">
                      {loaded.source === "upload" ? "File loaded" : "Sample record loaded"}
                    </span>
                  </div>
                  <button
                    onClick={() => setLoaded(null)}
                    className="text-sm text-[#737373] hover:text-[#0a0a0a] underline underline-offset-4"
                  >
                    Clear
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#e5e5e5] text-[#404040]">
                      <tr>
                        <th className="px-6 py-3 font-medium">Record ID</th>
                        <th className="px-6 py-3 font-medium">Date</th>
                        <th className="px-6 py-3 font-medium">Lines</th>
                        <th className="px-6 py-3 font-medium">Preview</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d4d4d4]">
                      <tr>
                        <td className="px-6 py-4 font-[family-name:var(--font-mono)]">{loaded.id}</td>
                        <td className="px-6 py-4">{loaded.date}</td>
                        <td className="px-6 py-4 font-[family-name:var(--font-mono)]">{lineCount || 1}</td>
                        <td className="px-6 py-4 text-[#737373] max-w-md truncate">{loaded.text.slice(0, 120)}{loaded.text.length > 120 ? "…" : ""}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-[#d4d4d4] bg-white p-4">
                  <Label>Full text (read from {loaded.source === "upload" ? `"${loaded.fileName}"` : "sample record"})</Label>
                  <pre className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap break-words font-[family-name:var(--font-mono)] text-xs text-[#0a0a0a]">
                    {loaded.text}
                  </pre>
                </div>

                <div className="flex items-center justify-end border-t border-[#d4d4d4] bg-[#fafafa] p-4">
                  <button
                    onClick={beginExtraction}
                    className="flex items-center gap-2 border border-[#ff3d00] bg-[#ff3d00] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#fafafa] transition-opacity hover:opacity-90"
                  >
                    Begin Extraction
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {!loaded && (
              <p className="flex items-start gap-2 text-xs text-[#737373]">
                <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                This demo reads text client-side and runs it through the same regex patterns as
                the Python extractor. PDF/CSV parsing and a real backend ingest pipeline are
                scoped as future work — see the architecture note in the project audit.
              </p>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
