"use client";

import { useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { Reveal, Label } from "@/components/ui";
import netData from "@/data/network.json";

type Status = "Pending" | "Confirmed" | "Rejected";

export default function ResolvePage() {
  const clusters = netData.aliasClusters || [];
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  const handleStatus = (clusterName: string, status: Status) => {
    setStatuses(prev => ({ ...prev, [clusterName]: status }));
  };

  return (
    <div className="p-6 md:p-8 lg:p-12">
      <Reveal>
        <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">Entity Resolution</h2>
        <p className="mt-4 max-w-2xl text-[#737373] leading-relaxed">
          Review automated alias clusters. Confirm or reject merges to update the intelligence graph.
        </p>
      </Reveal>

      <div className="mt-10 space-y-8">
        {clusters.length === 0 ? (
          <div className="border border-[#d4d4d4] bg-[#f5f5f5] p-8 text-center text-[#737373]">
            No alias clusters pending resolution.
          </div>
        ) : (
          clusters.map((cluster, idx) => {
            const status = statuses[cluster.name] || "Pending";
            
            return (
              <Reveal key={cluster.name} delay={idx * 0.1}>
                <div className="border border-[#d4d4d4] bg-[#f5f5f5]">
                  <div className="flex flex-wrap items-center justify-between border-b border-[#d4d4d4] bg-[#e5e5e5] px-6 py-4">
                    <div>
                      <h3 className="font-semibold text-[#0a0a0a]">{cluster.name}</h3>
                      <p className="font-[family-name:var(--font-mono)] text-xs text-[#737373] mt-1">
                        Match Confidence: 92%
                      </p>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-4 sm:mt-0">
                      <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                        status === "Pending" ? "bg-[#d4d4d4] text-[#0a0a0a]" :
                        status === "Confirmed" ? "bg-orange-100 text-orange-800 border border-orange-300" :
                        "bg-red-100 text-red-700 border border-red-300"
                      }`}>
                        {status}
                      </span>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatus(cluster.name, "Confirmed")}
                          className="flex items-center justify-center border border-[#d4d4d4] p-2 text-[#737373] transition-colors hover:border-[#ff3d00] hover:text-[#ff3d00]"
                          title="Confirm Merge"
                        aria-label={`Confirm merge for ${cluster.name}`}
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleStatus(cluster.name, "Rejected")}
                          className="flex items-center justify-center border border-[#d4d4d4] p-2 text-[#737373] transition-colors hover:border-red-500 hover:text-red-500"
                          title="Reject"
                        aria-label={`Reject merge for ${cluster.name}`}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 divide-y divide-[#d4d4d4] md:grid-cols-2 md:divide-x md:divide-y-0">
                    {cluster.records.slice(0, 2).map((record) => (
                      <div key={record.id} className="p-6">
                        <Label>Record {record.id}</Label>
                        <dl className="mt-4 space-y-3 font-[family-name:var(--font-mono)] text-sm">
                          <div className="flex justify-between">
                            <dt className="text-[#737373]">City:</dt>
                            <dd>{record.city || "Unknown"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-[#737373]">Occupation:</dt>
                            <dd>{record.occupation || "Unknown"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-[#737373]">Community:</dt>
                            <dd>{record.community || "N/A"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-[#737373]">Age:</dt>
                            <dd>{record.age || "Unknown"}</dd>
                          </div>
                        </dl>
                      </div>
                    ))}
                  </div>
                  
                  {cluster.records.length > 2 && (
                    <div className="border-t border-[#d4d4d4] bg-[#fafafa] px-6 py-3 text-sm text-[#737373]">
                      + {cluster.records.length - 2} more records in this cluster
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })
        )}
      </div>
    </div>
  );
}
