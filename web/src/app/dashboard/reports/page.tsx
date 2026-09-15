"use client";

import { useState } from "react";
import { Download, FileText, CheckCircle2 } from "lucide-react";
import { Reveal, Label } from "@/components/ui";
import netData from "@/data/network.json";

const REPORT_TYPES = [
  { id: "network", title: "Network Summary", desc: "Top entities and network statistics" },
  { id: "dossier", title: "Entity Dossier", desc: "Detailed profile for selected target" },
  { id: "evidence", title: "Evidence Trail", desc: "Chain of custody and source verification" },
  { id: "full", title: "Full Case Report", desc: "Comprehensive export of all case data" },
];

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState(REPORT_TYPES[0]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [generatedAt, setGeneratedAt] = useState("");

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setGeneratedAt(new Date().toISOString());
    }, 1200);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(netData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.href = url;
    dlAnchorElem.download = `nexus_export_${activeReport.id}_${new Date().toISOString().split('T')[0]}.json`;
    dlAnchorElem.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-8 lg:p-12">
      <Reveal>
        <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">Report Generation</h2>
        <p className="mt-4 max-w-2xl text-[#737373] leading-relaxed">
          Compile intelligence products from graph data.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {REPORT_TYPES.map((type) => (
            <button 
              type="button"
              key={type.id}
              onClick={() => { setActiveReport(type); setGenerated(false); }}
              className={`text-left cursor-pointer border p-6 transition-colors ${
                activeReport.id === type.id 
                  ? "border-[#ff3d00] bg-[#e5e5e5]" 
                  : "border-[#d4d4d4] bg-[#f5f5f5] hover:border-[#a3a3a3]"
              }`}
            >
              <div className="flex items-center justify-between">
                <FileText className={activeReport.id === type.id ? "text-[#ff3d00]" : "text-[#737373]"} size={24} />
                {activeReport.id === type.id && <CheckCircle2 className="text-[#ff3d00]" size={18} />}
              </div>
              <h3 className="mt-4 text-lg font-medium text-[#0a0a0a]">{type.title}</h3>
              <p className="mt-2 text-sm text-[#737373]">{type.desc}</p>
            </button>
          ))}
        </div>

        <div className="flex flex-col border border-[#d4d4d4] bg-[#f5f5f5]">
          <div className="border-b border-[#d4d4d4] px-6 py-4">
            <Label>Preview: {activeReport.title}</Label>
          </div>
          
          <div className="flex-1 p-6">
            {!generated ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <FileText className="mb-4 text-[#d4d4d4]" size={48} />
                <p className="text-[#737373]">
                  Select a report type and generate to view preview.
                </p>
              </div>
            ) : (
              <div className="space-y-4 font-[family-name:var(--font-mono)] text-xs text-[#737373]">
                <p className="text-[#0a0a0a] font-bold">NEXUS INTELLIGENCE REPORT</p>
                <p>Generated: {generatedAt}</p>
                <p>Type: {activeReport.title.toUpperCase()}</p>
                <div className="border-t border-b border-[#d4d4d4] py-4 my-4 space-y-2">
                  <p>Nodes: {netData.stats.nodes}</p>
                  <p>Edges: {netData.stats.edges}</p>
                  <p>Communities Identified: {netData.stats.communities}</p>
                </div>
                <p>Data payload ready for export.</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-[#d4d4d4] bg-[#fafafa] p-4">
            {!generated ? (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full border border-[#ff3d00] bg-transparent py-3 text-sm font-semibold uppercase tracking-wider text-[#ff3d00] transition-colors hover:bg-[#ff3d00] hover:text-[#fafafa]"
              >
                {generating ? "Compiling..." : "Generate Report"}
              </button>
            ) : (
              <button
                onClick={handleDownload}
                className="flex w-full items-center justify-center gap-2 border border-[#0a0a0a] bg-[#0a0a0a] py-3 text-sm font-semibold uppercase tracking-wider text-[#fafafa] transition-opacity hover:opacity-90"
              >
                <Download size={18} />
                Download JSON
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
