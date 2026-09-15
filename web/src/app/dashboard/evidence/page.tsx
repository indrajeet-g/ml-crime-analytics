"use client";

import { useMemo, useState } from "react";
import { Search, FileText } from "lucide-react";
import ChainOfCustody from "@/components/ChainOfCustody";
import { Reveal, Label } from "@/components/ui";
import netData from "@/data/network.json";

/* Render in pages rather than dumping every record at once. The graph
   references several hundred source records, and one flat grid of them
   made this view many screens of near identical cards. */
const PAGE_SIZE = 24;

export default function EvidencePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const records = useMemo(() => {
    const recs = new Set<string>();
    netData.graph.links.forEach((link: import("@/lib/types").GraphLink) => {
      if (link.rec) recs.add(link.rec);
    });
    return Array.from(recs).sort();
  }, []);

  const filteredRecords = useMemo(
    () =>
      records.filter((r) =>
        r.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [records, searchTerm]
  );

  const shown = filteredRecords.slice(0, visible);
  const remaining = filteredRecords.length - shown.length;

  return (
    <div className="pb-12 pt-6">
      <ChainOfCustody />
      
      <div className="mt-16 px-6 md:px-8 lg:px-12">
        <Reveal>
          <div className="mb-8 border-t border-[#d4d4d4] pt-12">
            <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">Evidence Browser</h2>
            <p className="mt-4 max-w-2xl text-[#737373] leading-relaxed">
              Browse the source records behind the intelligence graph. Every
              edge in the network cites one of these.
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]"
                size={18}
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search record IDs"
                aria-label="Search record IDs"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisible(PAGE_SIZE);
                }}
                className="w-full border border-[#d4d4d4] bg-[#f5f5f5] py-3 pl-10 pr-4 text-sm text-[#0a0a0a] focus:border-[#ff3d00] focus:outline-none"
              />
            </div>
            <p
              aria-live="polite"
              className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider text-[#737373]"
            >
              {filteredRecords.length} of {records.length} records
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {shown.length > 0 ? (
              shown.map((rec) => (
                <div key={rec} className="flex items-start gap-3 border border-[#d4d4d4] bg-[#f5f5f5] p-4 transition-colors hover:border-[#ff3d00]">
                  <FileText className="mt-0.5 text-[#ff3d00]" size={18} />
                  <div>
                    <div className="font-[family-name:var(--font-mono)] font-medium text-[#0a0a0a]">
                      {rec}
                    </div>
                    <Label>Source Record</Label>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full border border-dashed border-[#d4d4d4] py-12 text-center text-[#737373]">
                No record id matches{" "}
                <span className="font-[family-name:var(--font-mono)] text-[#0a0a0a]">
                  {searchTerm}
                </span>
                . Try a prefix such as CALL, EVT or CASE.
              </div>
            )}
          </div>

          {remaining > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#d4d4d4] px-6 font-[family-name:var(--font-jetbrains)] text-xs font-medium uppercase tracking-wider text-[#0a0a0a] transition-colors hover:bg-black/5"
              >
                Show {Math.min(PAGE_SIZE, remaining)} more
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}
