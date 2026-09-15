"use client";

import { useState } from "react";
import { Check, X, ChevronDown, ChevronUp, AlertCircle, Info } from "lucide-react";
import { Reveal, Label } from "@/components/ui";
import netData from "@/data/network.json";

type Status = "Pending" | "Confirmed" | "Rejected";

export default function ResolvePage() {
  const clusters = netData.aliasClusters || [];
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleStatus = (clusterName: string, status: Status) => {
    setStatuses(prev => ({ ...prev, [clusterName]: status }));
  };

  const toggleExpand = (clusterName: string) => {
    setExpanded(prev => ({ ...prev, [clusterName]: !prev[clusterName] }));
  };

  return (
    <div className="p-6 md:p-8 lg:p-12">
      <Reveal>
        <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">Match Records</h2>
        <p className="mt-4 max-w-2xl text-[#737373] leading-relaxed">
          Review suggested matches and approve them to combine records.
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
            const isExpanded = expanded[cluster.name] || false;
            
            // Mock dynamic scores based on index for variety
            const score = 92 - (idx * 6);
            let matchText = "Very Strong Match";
            if (score < 85) matchText = "Strong Match";
            if (score < 75) matchText = "Possible Match";
            
            return (
              <Reveal key={cluster.name} delay={idx * 0.1}>
                <div className={`border transition-colors duration-300 ${
                  status === "Confirmed" ? "border-green-400 bg-green-50/10" :
                  status === "Rejected" ? "border-red-400 bg-red-50/10" :
                  "border-[#d4d4d4] bg-[#f5f5f5]"
                }`}>
                  <div className="flex flex-wrap items-center justify-between border-b border-[#d4d4d4] bg-[#e5e5e5] px-6 py-4">
                    <div>
                      <h3 className="font-semibold text-[#0a0a0a] text-lg">{cluster.name}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="font-[family-name:var(--font-mono)] text-sm font-bold text-[#ff3d00]">
                          {score}%
                        </p>
                        <p className="font-[family-name:var(--font-mono)] text-xs text-[#737373]">
                          — {matchText}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-4 sm:mt-0">
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                        status === "Pending" ? "bg-[#d4d4d4] text-[#0a0a0a]" :
                        status === "Confirmed" ? "bg-green-100 text-green-800 border border-green-300" :
                        "bg-red-100 text-red-700 border border-red-300"
                      }`}>
                        {status}
                      </span>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatus(cluster.name, "Confirmed")}
                          className="flex items-center justify-center border border-[#d4d4d4] p-2 text-[#737373] transition-colors hover:border-green-500 hover:text-green-600 bg-white"
                          title="Confirm Match"
                          aria-label={`Confirm match for ${cluster.name}`}
                        >
                          <Check size={18} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => handleStatus(cluster.name, "Rejected")}
                          className="flex items-center justify-center border border-[#d4d4d4] p-2 text-[#737373] transition-colors hover:border-red-500 hover:text-red-600 bg-white"
                          title="Reject Match"
                          aria-label={`Reject match for ${cluster.name}`}
                        >
                          <X size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-[#d4d4d4] bg-white px-6 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                       onClick={() => toggleExpand(cluster.name)}>
                    <span className="font-[family-name:var(--font-mono)] text-xs font-semibold uppercase tracking-wider text-[#0a0a0a] flex items-center gap-2">
                      <Info size={14} className="text-[#ff3d00]" />
                      Why this match?
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>

                  {isExpanded && (
                    <div className="border-b border-[#d4d4d4] bg-white p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <Label>Matching Factors</Label>
                          <table className="mt-3 w-full text-sm font-[family-name:var(--font-mono)] text-left">
                            <tbody>
                              <tr className="border-b border-[#f0f0f0]">
                                <td className="py-2 text-[#737373]">Name similarity</td>
                                <td className="py-2 text-right text-green-600 font-medium">+30</td>
                              </tr>
                              <tr className="border-b border-[#f0f0f0]">
                                <td className="py-2 text-[#737373]">Phone match</td>
                                <td className="py-2 text-right text-green-600 font-medium">+35</td>
                              </tr>
                              <tr className="border-b border-[#f0f0f0]">
                                <td className="py-2 text-[#737373]">Occupation similarity</td>
                                <td className="py-2 text-right text-green-600 font-medium">+15</td>
                              </tr>
                              <tr className="border-b border-[#f0f0f0]">
                                <td className="py-2 text-[#737373]">Age gap penalty</td>
                                <td className="py-2 text-right text-red-500 font-medium">-10</td>
                              </tr>
                              <tr className="border-b border-[#f0f0f0]">
                                <td className="py-2 text-[#737373]">Location conflict penalty</td>
                                <td className="py-2 text-right text-red-500 font-medium">-{(85 - score) || 0}</td>
                              </tr>
                            </tbody>
                            <tfoot>
                              <tr>
                                <td className="py-3 font-semibold text-[#0a0a0a]">Final Score</td>
                                <td className="py-3 text-right font-semibold text-[#0a0a0a]">{score}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>

                        <div className="bg-[#f5f5f5] p-5 border-l-2 border-[#ff3d00]">
                          <Label>Agent Summary</Label>
                          <p className="mt-3 text-sm text-[#0a0a0a] leading-relaxed">
                            <strong>Why these records may belong to the same person:</strong><br/>
                            The records use very similar names and share identical or closely related phone numbers. 
                            However, the ages differ and the locations are in conflicting jurisdictions, 
                            which lowers the overall confidence.
                          </p>
                          <p className="mt-4 text-xs font-[family-name:var(--font-mono)] text-[#737373]">
                            <AlertCircle size={12} className="inline mr-1 -mt-0.5" />
                            This score is a guide for review, not proof that the records belong to the same person.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 divide-y divide-[#d4d4d4] md:grid-cols-2 md:divide-x md:divide-y-0">
                    {cluster.records.slice(0, 2).map((record) => (
                      <div key={record.id} className="p-6 bg-white">
                        <Label>Record {record.id}</Label>
                        <dl className="mt-4 space-y-3 font-[family-name:var(--font-mono)] text-sm">
                          <div className="flex justify-between">
                            <dt className="text-[#737373]">City:</dt>
                            <dd className={record.city === cluster.records[0].city ? "text-[#0a0a0a]" : "text-amber-600 font-medium"}>{record.city || "Unknown"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-[#737373]">Occupation:</dt>
                            <dd className="text-[#0a0a0a]">{record.occupation || "Unknown"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-[#737373]">Community:</dt>
                            <dd className="text-[#0a0a0a]">{record.community || "N/A"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-[#737373]">Age:</dt>
                            <dd className={record.age === cluster.records[0].age ? "text-[#0a0a0a]" : "text-amber-600 font-medium"}>{record.age || "Unknown"}</dd>
                          </div>
                        </dl>
                      </div>
                    ))}
                  </div>
                  
                  {cluster.records.length > 2 && (
                    <div className="border-t border-[#d4d4d4] bg-[#fafafa] px-6 py-3 text-xs font-[family-name:var(--font-mono)] text-[#737373]">
                      + {cluster.records.length - 2} MORE RECORDS IN THIS CLUSTER
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
