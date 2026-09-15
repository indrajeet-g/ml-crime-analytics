"use client";

import { useMemo, useState } from "react";
import { Search, FileText } from "lucide-react";
import ChainOfCustody from "@/components/ChainOfCustody";
import { Reveal, Label } from "@/components/ui";
import netData from "@/data/network.json";

export default function EvidencePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const records = useMemo(() => {
    const recs = new Set<string>();
    netData.graph.links.forEach((link: import("@/lib/types").GraphLink) => {
      if (link.rec) recs.add(link.rec);
    });
    return Array.from(recs).sort();
  }, []);

  const filteredRecords = records.filter(r => 
    r.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-12 pt-6">
      <ChainOfCustody />
      
      <div className="mt-16 px-6 md:px-8 lg:px-12">
        <Reveal>
          <div className="mb-8 border-t border-[#d4d4d4] pt-12">
            <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">Evidence Browser</h2>
            <p className="mt-4 max-w-2xl text-[#737373] leading-relaxed">
              Browse source records that constitute the intelligence graph.
            </p>
          </div>
          
          <div className="mb-6 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" size={18} />
            <input 
              type="text" 
              placeholder="Search record IDs..."
                  aria-label="Search record IDs" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-[#d4d4d4] bg-[#f5f5f5] py-3 pl-10 pr-4 text-sm text-[#0a0a0a] focus:border-[#ff3d00] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((rec) => (
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
              <div className="col-span-full py-8 text-center text-[#737373]">
                No records found matching "{searchTerm}"
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
