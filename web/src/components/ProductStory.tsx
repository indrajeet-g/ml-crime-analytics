"use client";

import { motion, useReducedMotion } from "motion/react";
import { Container, Section, Reveal, RevealGroup, RevealItem, Label } from "@/components/ui";
import { Network, Database, Eye, ShieldCheck, GitMerge } from "lucide-react";

export default function ProductStory() {
  const reduce = useReducedMotion();
  const transition = reduce ? { duration: 0 } : { duration: 3, repeat: Infinity, ease: "linear" };

  return (
    <Section id="story" className="bg-white border-t border-[#d4d4d4] py-24 md:py-32">
      <Container>
        <Reveal>
          <Label>System Capabilities</Label>
          <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tighter md:text-5xl text-[#0a0a0a]">
            Engineered for investigation.
          </h2>
        </Reveal>

        <div className="mt-20 space-y-32">
          
          {/* STEP 1: EXTRACTION */}
          <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <Database size={20} className="text-[#ff3d00]" />
                <h3 className="text-2xl font-bold tracking-tight">Structured extraction.</h3>
              </div>
              <p className="text-base text-[#737373] leading-relaxed">
                NEXUS ingests raw unstructured intelligence—FIRs, transcripts, financial logs—and automatically isolates critical entities like people, phones, and vehicles into a structured graph database.
              </p>
            </div>
            <div className="lg:col-span-8 bg-[#f5f5f5] border border-[#d4d4d4] flex flex-col md:flex-row shadow-sm">
              <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#d4d4d4] bg-white">
                <Label>Raw Case File</Label>
                <p className="mt-4 text-sm font-[family-name:var(--font-mono)] leading-loose text-[#737373]">
                  Suspect <span className="text-[#0a0a0a] bg-blue-50 border-b border-blue-200 px-1">Rahul Sharma</span> was seen near the location driving a <span className="text-[#0a0a0a] bg-teal-50 border-b border-teal-200 px-1">White Sedan (DL-8C-xxxx)</span>. Contact was made using phone number <span className="text-[#0a0a0a] bg-amber-50 border-b border-amber-200 px-1">+91-9876543210</span>.
                </p>
              </div>
              <div className="w-full md:w-64 bg-[#f5f5f5] p-6">
                <Label>Extracted Entities</Label>
                <RevealGroup className="mt-4 space-y-3">
                  <RevealItem className="border border-blue-200 bg-white p-2 text-xs font-[family-name:var(--font-mono)] flex justify-between">
                    <span className="text-blue-700">PERSON</span>
                    <span className="text-[#0a0a0a]">Rahul Sharma</span>
                  </RevealItem>
                  <RevealItem className="border border-teal-200 bg-white p-2 text-xs font-[family-name:var(--font-mono)] flex justify-between">
                    <span className="text-teal-700">VEHICLE</span>
                    <span className="text-[#0a0a0a]">DL-8C-xxxx</span>
                  </RevealItem>
                  <RevealItem className="border border-amber-200 bg-white p-2 text-xs font-[family-name:var(--font-mono)] flex justify-between">
                    <span className="text-amber-700">PHONE</span>
                    <span className="text-[#0a0a0a]">9876543210</span>
                  </RevealItem>
                </RevealGroup>
              </div>
            </div>
          </Reveal>

          {/* STEP 2: ENTITY RESOLUTION */}
          <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 order-2 lg:order-1 bg-[#f5f5f5] border border-[#d4d4d4] p-8 lg:p-12 shadow-sm relative overflow-hidden">
              <div className="max-w-md mx-auto">
                <div className="flex justify-between gap-4 mb-8 relative z-10">
                  <div className="flex-1 bg-white border border-[#d4d4d4] p-4 text-center">
                    <p className="text-xs font-[family-name:var(--font-mono)] text-[#737373]">Record P-042</p>
                    <p className="mt-1 font-semibold text-[#0a0a0a]">R. Sharma</p>
                    <p className="mt-1 text-[10px] text-amber-600 font-bold uppercase tracking-widest">Needs Review</p>
                  </div>
                  <div className="flex-1 bg-white border border-[#d4d4d4] p-4 text-center">
                    <p className="text-xs font-[family-name:var(--font-mono)] text-[#737373]">Record P-109</p>
                    <p className="mt-1 font-semibold text-[#0a0a0a]">Rahul Sharma</p>
                    <p className="mt-1 text-[10px] text-amber-600 font-bold uppercase tracking-widest">Needs Review</p>
                  </div>
                </div>
                
                {/* Connecting lines animated */}
                <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-48 h-16 border-b-2 border-l-2 border-r-2 border-[#ff3d00]/30 rounded-b-xl z-0 overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "200%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full bg-gradient-to-r from-transparent via-[#ff3d00]/40 to-transparent absolute top-0"
                  />
                </div>
                <div className="absolute top-[144px] left-1/2 -translate-x-1/2 w-px h-8 bg-[#ff3d00]/30 z-0 overflow-hidden">
                  <motion.div 
                    initial={{ y: "-100%" }}
                    whileInView={{ y: "100%" }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full bg-gradient-to-b from-transparent via-[#ff3d00] to-transparent"
                  />
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white border-2 border-green-500 p-5 text-center relative z-10 mt-16 shadow-lg"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
                    Match Confirmed
                  </div>
                  <p className="text-xs font-[family-name:var(--font-mono)] text-[#737373] mt-2">Unified Profile P-999</p>
                  <p className="mt-1 font-semibold text-xl text-[#0a0a0a]">Rahul Sharma</p>
                  <div className="mt-3 flex justify-center gap-2">
                    <span className="px-2 py-1 bg-[#f5f5f5] text-[10px] font-[family-name:var(--font-mono)] text-[#737373]">Linked by Phone</span>
                  </div>
                </motion.div>
              </div>
            </div>
            <div className="lg:col-span-4 order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <GitMerge size={20} className="text-[#ff3d00]" />
                <h3 className="text-2xl font-bold tracking-tight">Entity Resolution.</h3>
              </div>
              <p className="text-base text-[#737373] leading-relaxed">
                The system analyzes fragmented data and suggests potential matches. Investigators can review the evidence—like a shared phone number or identical aliases—and merge them into a single, unified profile.
              </p>
            </div>
          </Reveal>

          {/* STEP 3: NETWORK DIAGRAM */}
          <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <Network size={20} className="text-[#ff3d00]" />
                <h3 className="text-2xl font-bold tracking-tight">Visualizing links.</h3>
              </div>
              <p className="text-base text-[#737373] leading-relaxed">
                Isolated incidents are brought together into a single cohesive network map. Investigators can instantly spot bridge entities—like a single vehicle used across three separate cases.
              </p>
            </div>
            <div className="lg:col-span-8 bg-[#0a0a0a] p-8 lg:p-12 shadow-sm font-[family-name:var(--font-mono)] text-[#d4d4d4] overflow-x-auto relative">
              <div className="min-w-[500px]">
                <pre className="text-sm leading-[1.8]">
{`CASE_C014
    │
    ├──── [PRIMARY] PERSON_01
    │       │
    │       └──── PHONE_987
    │
    ├──── VEHICLE_DL8C ────────┐
    │                          │
    └──── LOCATION_MAIN        │
                               │
CASE_C099                      │
    │                          │
    ├──── <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-red-400 font-bold">[PRIMARY]</motion.span> PERSON_02  │
    │       │                  │
    │       └──── VEHICLE_DL8C ┘  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="text-[#ff3d00] font-bold">&lt;-- BRIDGE DETECTED</motion.span>
    │
    └──── PHONE_332`}
                </pre>
              </div>
            </div>
          </Reveal>

          {/* STEP 4: EXPLORATION (DASHBOARD) */}
          <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 bg-[#f5f5f5] border border-[#d4d4d4] shadow-sm">
              {/* Fake Top Bar */}
              <div className="border-b border-[#d4d4d4] bg-white px-4 py-2 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="px-2 py-1 text-[10px] bg-[#0a0a0a] text-white font-bold uppercase tracking-widest">Hide Unrelated</div>
                  <div className="px-2 py-1 text-[10px] bg-[#e5e5e5] text-[#0a0a0a] font-bold uppercase tracking-widest">Focus: 2 Hops</div>
                </div>
                <div className="text-[10px] text-[#737373] font-[family-name:var(--font-mono)]">NETWORK EXPLORER</div>
              </div>
              {/* Fake Layout */}
              <div className="flex h-64 md:h-80">
                <div className="flex-1 relative overflow-hidden bg-[#fafafa]">
                  {/* Decorative abstract network */}
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeOut" }} x1="30%" y1="30%" x2="50%" y2="50%" stroke="#d4d4d4" strokeWidth="2" />
                    <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} x1="70%" y1="30%" x2="50%" y2="50%" stroke="#ff3d00" strokeWidth="3" />
                    <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.6, ease: "easeOut" }} x1="50%" y1="70%" x2="50%" y2="50%" stroke="#d4d4d4" strokeWidth="2" />
                    
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5 }} cx="30%" cy="30%" r="8" fill="#4a7fb5" />
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }} cx="70%" cy="30%" r="10" fill="#ff0000" />
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }} cx="50%" cy="70%" r="8" fill="#e67e22" />
                    
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.8 }} cx="50%" cy="50%" r="12" fill="#d97706" />
                  </svg>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                    className="absolute top-1/2 left-1/2 translate-x-3 translate-y-3 bg-white border border-[#ff3d00] p-1.5 shadow-sm pointer-events-none"
                  >
                    <p className="text-[10px] font-[family-name:var(--font-mono)] font-bold">SHARED_VEHICLE</p>
                  </motion.div>
                </div>
                {/* Fake Sidebar */}
                <div className="w-48 md:w-64 bg-white border-l border-[#d4d4d4] p-4 hidden sm:block">
                  <Label>Selected Entity</Label>
                  <p className="mt-2 text-lg font-bold">Vehicle DL8C</p>
                  <div className="mt-4 border-l-2 border-[#ff3d00] pl-3">
                    <p className="text-xs font-bold text-[#0a0a0a]">Why this matters</p>
                    <p className="mt-1 text-xs text-[#737373] leading-relaxed">
                      This vehicle connects two separate cases and is directly linked to a primary target.
                    </p>
                </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 lg:pt-10">
              <div className="flex items-center gap-3 mb-4">
                <Eye size={20} className="text-[#ff3d00]" />
                <h3 className="text-2xl font-bold tracking-tight">Interactive exploration.</h3>
              </div>
              <p className="text-base text-[#737373] leading-relaxed">
                Investigating a massive graph can be overwhelming. NEXUS features Focus Modes that allow officers to fade out unrelated nodes and drill down into the direct relationships of a specific target.
              </p>
            </div>
          </Reveal>

          {/* STEP 5: EVIDENCE TRAIL */}
          <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={20} className="text-[#ff3d00]" />
                <h3 className="text-2xl font-bold tracking-tight">Immutable evidence.</h3>
              </div>
              <p className="text-base text-[#737373] leading-relaxed">
                NEXUS is built for the courtroom. Every connection displayed in the system is directly linked to the original source document, ensuring complete traceability and an auditable chain of custody.
              </p>
            </div>
            <div className="lg:col-span-8 border border-[#d4d4d4] bg-white">
              <div className="p-4 md:p-6 border-b border-[#d4d4d4] bg-[#f5f5f5]">
                <Label>Audit Log / Connection Trace</Label>
              </div>
              <div className="p-0">
                <table className="w-full text-left text-sm font-[family-name:var(--font-mono)]">
                  <thead className="bg-white text-[#737373] text-xs">
                    <tr>
                      <th className="px-6 py-4 font-normal uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-4 font-normal uppercase tracking-wider">Action</th>
                      <th className="px-6 py-4 font-normal uppercase tracking-wider hidden md:table-cell">Source Record</th>
                      <th className="px-6 py-4 font-normal uppercase tracking-wider text-right">Verification</th>
                    </tr>
                  </thead>
                  <motion.tbody 
                    initial="hidden" 
                    whileInView="show" 
                    viewport={{ once: true }} 
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} 
                    className="divide-y divide-[#d4d4d4] text-[#0a0a0a]"
                  >
                    <motion.tr variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }} className="hover:bg-[#f5f5f5]">
                      <td className="px-6 py-4 whitespace-nowrap">2026-09-14 10:15</td>
                      <td className="px-6 py-4">Node Created: PERSON_01</td>
                      <td className="px-6 py-4 hidden md:table-cell text-[#737373]">FIR_C014.pdf</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">VALID</td>
                    </motion.tr>
                    <motion.tr variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }} className="hover:bg-[#f5f5f5]">
                      <td className="px-6 py-4 whitespace-nowrap">2026-09-14 11:30</td>
                      <td className="px-6 py-4">Entity Match Approved</td>
                      <td className="px-6 py-4 hidden md:table-cell text-[#737373]">User: admin</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">VALID</td>
                    </motion.tr>
                    <motion.tr variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }} className="hover:bg-[#f5f5f5] bg-red-50/30">
                      <td className="px-6 py-4 whitespace-nowrap text-[#ff3d00]">2026-09-15 09:42</td>
                      <td className="px-6 py-4 text-[#ff3d00] font-bold">Bridge Identified</td>
                      <td className="px-6 py-4 hidden md:table-cell text-[#737373]">System Output</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">VALID</td>
                    </motion.tr>
                  </motion.tbody>
                </table>
              </div>
            </div>
          </Reveal>

        </div>
      </Container>
    </Section>
  );
}
