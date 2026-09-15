"use client";

import { useState } from "react";
import { Download, FileText, CheckCircle2, ChevronDown, FileJson, FileIcon, Globe, FileCode, Network } from "lucide-react";
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
  const [downloadOpen, setDownloadOpen] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setGeneratedAt(new Date().toISOString());
    }, 1500); // simulate some work
  };

  const handleDownload = (type: "pdf" | "html" | "json") => {
    setDownloadOpen(false);
    let blob: Blob;
    let ext = type;
    
    if (type === "json") {
      blob = new Blob([JSON.stringify(netData, null, 2)], { type: "application/json" });
    } else {
      // Mocking PDF/HTML download for now
      blob = new Blob([`Mock ${type.toUpperCase()} Report Content generated at ${generatedAt}`], { type: "text/plain" });
    }
    
    const url = URL.createObjectURL(blob);
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.href = url;
    dlAnchorElem.download = `nexus_export_${activeReport.id}_${new Date().toISOString().split('T')[0]}.${ext}`;
    dlAnchorElem.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-8 lg:p-12">
      <Reveal>
        <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">Report Generation</h2>
        <p className="mt-4 max-w-2xl text-[#737373] leading-relaxed">
          Create simple summaries and case reports to share. PDF and HTML reports include full formatting.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[400px_1fr]">
        <div className="grid grid-cols-1 gap-4 h-min">
          {REPORT_TYPES.map((type) => (
            <button 
              type="button"
              key={type.id}
              onClick={() => { setActiveReport(type); setGenerated(false); }}
              className={`text-left cursor-pointer border p-5 transition-colors ${
                activeReport.id === type.id 
                  ? "border-[#ff3d00] bg-[#e5e5e5]" 
                  : "border-[#d4d4d4] bg-[#f5f5f5] hover:border-[#a3a3a3]"
              }`}
            >
              <div className="flex items-center justify-between">
                <FileText className={activeReport.id === type.id ? "text-[#ff3d00]" : "text-[#737373]"} size={20} />
                {activeReport.id === type.id && <CheckCircle2 className="text-[#ff3d00]" size={16} />}
              </div>
              <h3 className="mt-3 text-lg font-medium text-[#0a0a0a]">{type.title}</h3>
              <p className="mt-1 text-sm text-[#737373]">{type.desc}</p>
            </button>
          ))}
        </div>

        <div className="flex flex-col border border-[#d4d4d4] bg-white min-h-[600px] shadow-sm">
          <div className="border-b border-[#d4d4d4] bg-[#f5f5f5] px-6 py-4 flex justify-between items-center">
            <Label>REPORT PREVIEW</Label>
            {generating && (
              <span className="text-sm font-[family-name:var(--font-mono)] text-[#ff3d00] animate-pulse">
                Preparing evidence... Building graph...
              </span>
            )}
          </div>
          
          <div className="flex-1 p-6 md:p-10 overflow-y-auto">
            {!generated ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <FileText className="mb-4 text-[#d4d4d4]" size={48} />
                <p className="text-[#737373]">
                  Select a report type and click generate to view the preview.
                </p>
              </div>
            ) : (
              <div className="space-y-6 text-[#0a0a0a] max-w-3xl mx-auto">
                <div className="border-b-2 border-[#0a0a0a] pb-6 mb-6">
                  <h1 className="text-3xl font-bold tracking-tighter">NEXUS Investigation Report</h1>
                  <div className="mt-4 grid grid-cols-2 gap-4 font-[family-name:var(--font-mono)] text-xs text-[#737373] uppercase">
                    <div>
                      <p>Case ID: <span className="text-[#0a0a0a]">NEX-{new Date().getTime().toString().slice(-6)}</span></p>
                      <p>Report Date: <span className="text-[#0a0a0a]">{generatedAt.split('T')[0]}</span></p>
                    </div>
                    <div>
                      <p>Prepared By: <span className="text-[#0a0a0a]">System Admin</span></p>
                      <p>Report Type: <span className="text-[#0a0a0a]">{activeReport.title}</span></p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold border-b border-[#d4d4d4] pb-2 mb-4">Executive Summary</h2>
                  <p className="text-sm leading-relaxed text-[#737373]">
                    This report compiles network insights and entity resolutions extracted from {netData.stats.nodes} records. The network analysis has identified {netData.stats.communities} distinct groups of highly connected entities. Key individuals have been marked for investigator review based on shared phone numbers and vehicle data.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold border-b border-[#d4d4d4] pb-2 mb-4">Network Overview</h2>
                  <div className="bg-[#f5f5f5] border border-[#d4d4d4] aspect-video flex items-center justify-center relative overflow-hidden">
                    <Network className="text-[#d4d4d4] absolute opacity-10" size={200} />
                    <p className="text-sm font-[family-name:var(--font-mono)] text-[#737373] z-10">[ Graph Visualization Snapshot ]</p>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-4">
                    <div className="bg-[#f5f5f5] p-3 text-center border border-[#d4d4d4]">
                      <p className="text-2xl font-[family-name:var(--font-mono)] text-[#0a0a0a]">{netData.stats.nodes}</p>
                      <p className="text-[10px] uppercase font-[family-name:var(--font-mono)] text-[#737373]">Total Entities</p>
                    </div>
                    <div className="bg-[#f5f5f5] p-3 text-center border border-[#d4d4d4]">
                      <p className="text-2xl font-[family-name:var(--font-mono)] text-[#0a0a0a]">{netData.stats.edges}</p>
                      <p className="text-[10px] uppercase font-[family-name:var(--font-mono)] text-[#737373]">Total Connections</p>
                    </div>
                    <div className="bg-[#f5f5f5] p-3 text-center border border-[#d4d4d4]">
                      <p className="text-2xl font-[family-name:var(--font-mono)] text-[#0a0a0a]">{netData.stats.communities}</p>
                      <p className="text-[10px] uppercase font-[family-name:var(--font-mono)] text-[#737373]">Communities</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-[#d4d4d4] pt-6">
                  <p className="text-xs text-[#737373] italic">
                    NEXUS provides analytical assistance based on the available records. Suggested matches and relationships should be reviewed against the original records before being treated as established facts.
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
                    <button onClick={() => handleDownload('pdf')} className="flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[#f5f5f5] border-b border-[#f0f0f0]">
                      <FileIcon size={16} className="text-red-600" />
                      PDF Report
                    </button>
                    <button onClick={() => handleDownload('html')} className="flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[#f5f5f5] border-b border-[#f0f0f0]">
                      <Globe size={16} className="text-blue-600" />
                      HTML Report
                    </button>
                    <button onClick={() => handleDownload('json')} className="flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[#f5f5f5] text-[#737373]">
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
