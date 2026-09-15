"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { UploadCloud, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { Reveal, Label, OutlineLink, PrimaryLink } from "@/components/ui";

const SOURCE_TYPES = ["FIR", "CDR", "Transaction", "Vehicle Registry", "Field Report"];

const SAMPLE_DATA = [
  { id: "FIR-2026-042", date: "2026-03-14", preview: "Complainant Rohan Joshi of Sanganer..." },
  { id: "CDR-98111-X", date: "2026-03-14", preview: "9811100001 -> 9876543210 (124s)" },
  { id: "TRX-40217", date: "2026-03-15", preview: "INR 45,000.00 from AC 402177889012" },
];

export default function IngestPage() {
  const [activeType, setActiveType] = useState(SOURCE_TYPES[0]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasFile, setHasFile] = useState(false);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setHasFile(true);
    }, 1500);
  };

  return (
    <div className="p-6 md:p-8 lg:p-12">
      <Reveal>
        <div className="mb-8">
          <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">Data Ingestion</h2>
          <p className="mt-4 max-w-2xl text-[#737373] leading-relaxed">
            Upload raw source records to be processed by the intelligence pipeline.
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
            {!hasFile ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-[#d4d4d4] bg-[#f5f5f5] p-12 transition-colors hover:border-[#a3a3a3]"
              >
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => { e.preventDefault(); handleSimulateUpload(); }} />
                <div className="flex h-16 w-16 items-center justify-center bg-[#e5e5e5] text-[#ff3d00]">
                  <UploadCloud size={32} strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 text-xl font-medium tracking-tight">Drop files to upload</h3>
                <p className="mt-2 text-[#737373]">or click to browse local files</p>
                <p className="mt-6 text-sm text-[#737373]">
                  Supported formats: PDF, TXT, CSV, JSON (Max 50MB)
                </p>
                
                <button
                  onClick={(e) => { e.stopPropagation(); handleSimulateUpload(); }}
                  disabled={isUploading}
                  className="mt-8 border border-[#0a0a0a] bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-wider text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a] hover:text-[#fafafa] disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Load Sample Data"}
                </button>
              </div>
            ) : (
              <div className="border border-[#d4d4d4] bg-[#f5f5f5]">
                <div className="flex items-center justify-between border-b border-[#d4d4d4] px-6 py-4">
                  <div className="flex items-center gap-3 text-[#ff3d00]">
                    <CheckCircle2 size={20} />
                    <span className="font-semibold">Sample Data Loaded</span>
                  </div>
                  <button 
                    onClick={() => setHasFile(false)}
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
                        <th className="px-6 py-3 font-medium">Preview</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d4d4d4]">
                      {SAMPLE_DATA.map((row) => (
                        <tr key={row.id} className="hover:bg-[#e5e5e5]/50">
                          <td className="px-6 py-4 font-[family-name:var(--font-mono)]">{row.id}</td>
                          <td className="px-6 py-4">{row.date}</td>
                          <td className="px-6 py-4 text-[#737373]">{row.preview}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex items-center justify-end border-t border-[#d4d4d4] bg-[#fafafa] p-4">
                  <Link
                    href="/dashboard/extract"
                    className="flex items-center gap-2 border border-[#ff3d00] bg-[#ff3d00] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#fafafa] transition-opacity hover:opacity-90"
                  >
                    Begin Extraction
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
