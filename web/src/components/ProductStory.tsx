"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Container,
  Section,
  Reveal,
  RevealGroup,
  RevealItem,
  Label,
} from "@/components/ui";
import { Network, Database, Eye, ShieldCheck, GitMerge, Map } from "lucide-react";

/* Entity colours match the graph renderer and the Python visualiser, so a
   PERSON is the same blue here, in the explorer, and in the exported report.
   Colour is doing identification work, not decoration. */
const ENTITY = {
  person: "#4a7fb5",
  vehicle: "#16a085",
  phone: "#e67e22",
  location: "#d4a017",
  case: "#c0392b",
};

const ACCENT = "#ff3d00";
const REVIEW = "#b45309";
const CONFIRMED = "#15803d";

/* One shared reveal for diagram geometry: draw once when it scrolls into
   view, then stop. Nothing on this page loops. */
function useDraw() {
  const reduce = useReducedMotion();
  return (delay: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, amount: "some" as const },
          transition: { duration: 0.7, delay, ease: [0.25, 0, 0, 1] as const },
        };
}

function StepHeading({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Network;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <Icon size={20} strokeWidth={1.5} className="text-[#ff3d00]" aria-hidden="true" />
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
      </div>
      <p className="text-base leading-relaxed text-[#737373]">{children}</p>
    </>
  );
}

export default function ProductStory() {
  const draw = useDraw();
  const reduce = useReducedMotion();

  return (
    <Section id="story" className="border-t border-[#d4d4d4] bg-white py-24 md:py-32">
      <Container>
        <Reveal>
          <Label>System Capabilities</Label>
          <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tighter text-[#0a0a0a] md:text-5xl">
            Engineered for investigation.
          </h2>
        </Reveal>

        <div className="mt-20 space-y-32">
          {/* 1. EXTRACTION. Raw narrative on the left, what came out on the
              right, colour keyed by entity type. */}
          <Reveal className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <StepHeading icon={Database} title="Structured extraction.">
                NEXUS reads unstructured case text, FIRs, transcripts and financial
                logs, and pulls out the people, phones and vehicles named in them.
              </StepHeading>
            </div>

            <div className="flex flex-col border border-[#d4d4d4] bg-[#f5f5f5] md:flex-row lg:col-span-8">
              <div className="flex-1 border-b border-[#d4d4d4] bg-white p-6 md:border-b-0 md:border-r md:p-8">
                <Label>Raw case file</Label>
                <p className="mt-4 font-[family-name:var(--font-mono)] text-sm leading-loose text-[#737373]">
                  Suspect{" "}
                  <span className="border-b-2 px-1 text-[#0a0a0a]" style={{ borderColor: ENTITY.person }}>
                    Rahul Sharma
                  </span>{" "}
                  was seen near the location driving a{" "}
                  <span className="border-b-2 px-1 text-[#0a0a0a]" style={{ borderColor: ENTITY.vehicle }}>
                    White Sedan (DL-8C-xxxx)
                  </span>
                  . Contact was made using phone number{" "}
                  <span className="border-b-2 px-1 text-[#0a0a0a]" style={{ borderColor: ENTITY.phone }}>
                    +91-9876543210
                  </span>
                  .
                </p>
              </div>

              <div className="w-full bg-[#f5f5f5] p-6 md:w-64">
                <Label>Extracted entities</Label>
                <RevealGroup className="mt-4 space-y-3">
                  {[
                    { type: "PERSON", value: "Rahul Sharma", color: ENTITY.person },
                    { type: "VEHICLE", value: "DL-8C-xxxx", color: ENTITY.vehicle },
                    { type: "PHONE", value: "9876543210", color: ENTITY.phone },
                  ].map((e) => (
                    <RevealItem
                      key={e.type}
                      className="flex items-center justify-between gap-2 border border-[#d4d4d4] bg-white p-2 font-[family-name:var(--font-mono)] text-xs"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="inline-block h-2 w-2 shrink-0"
                          style={{ backgroundColor: e.color }}
                        />
                        <span style={{ color: e.color }}>{e.type}</span>
                      </span>
                      <span className="text-[#0a0a0a]">{e.value}</span>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            </div>
          </Reveal>

          {/* 2. RESOLUTION. Two records converge into one. The connector is
              drawn once on scroll because it is showing a state change:
              two candidates becoming a confirmed profile. */}
          <Reveal className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="order-2 border border-[#d4d4d4] bg-[#f5f5f5] p-8 lg:order-1 lg:col-span-8 lg:p-12">
              <div className="mx-auto max-w-md">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "Record P-042", name: "R. Sharma" },
                    { id: "Record P-109", name: "Rahul Sharma" },
                  ].map((r) => (
                    <div key={r.id} className="border border-[#d4d4d4] bg-white p-4 text-center">
                      <p className="font-[family-name:var(--font-mono)] text-xs text-[#737373]">
                        {r.id}
                      </p>
                      <p className="mt-1 font-semibold text-[#0a0a0a]">{r.name}</p>
                      <p
                        className="mt-2 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: REVIEW }}
                      >
                        Needs review
                      </p>
                    </div>
                  ))}
                </div>

                {/* Converging connector. Two stems meeting a stem down into
                    the merged record. Drawn once, no loop. */}
                <svg
                  viewBox="0 0 320 64"
                  className="mt-0 h-16 w-full"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M80 0 V24 H240 V0"
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth="1.5"
                    {...draw(0.1)}
                  />
                  <motion.path
                    d="M160 24 V64"
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth="1.5"
                    {...draw(0.45)}
                  />
                </svg>

                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: "some" }}
                  transition={{ delay: 0.75, duration: 0.45, ease: [0.25, 0, 0, 1] }}
                  className="relative border bg-white p-5 text-center"
                  style={{ borderColor: CONFIRMED }}
                >
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-widest text-white"
                    style={{ backgroundColor: CONFIRMED }}
                  >
                    Match confirmed
                  </span>
                  <p className="mt-2 font-[family-name:var(--font-mono)] text-xs text-[#737373]">
                    Unified profile P-999
                  </p>
                  <p className="mt-1 text-xl font-semibold text-[#0a0a0a]">Rahul Sharma</p>
                  <p className="mt-3 inline-block bg-[#f5f5f5] px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] text-[#737373]">
                    Linked by shared phone 9876543210
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-4">
              <StepHeading icon={GitMerge} title="Entity resolution.">
                The system proposes a match and shows the signal behind it. An
                investigator confirms or rejects. Nothing merges on its own.
              </StepHeading>
            </div>
          </Reveal>

          {/* 3. NETWORK. An editorial tree diagram on the page ground, not a
              terminal. Two cases that share one vehicle, which is the whole
              point of the section. */}
          <Reveal className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <StepHeading icon={Network} title="Visualising links.">
                Separate cases are drawn as one map. A vehicle appearing in two
                unrelated files is the kind of bridge that is invisible on paper.
              </StepHeading>
            </div>

            <div className="overflow-x-auto border border-[#d4d4d4] bg-[#f5f5f5] p-6 md:p-10 lg:col-span-8">
              <svg viewBox="0 0 640 300" className="h-auto w-full min-w-[520px]" role="img"
                aria-label="Case C014 and case C099 each connect to their own people and phones, and both connect to the same vehicle DL-8C, which bridges them.">
                {[
                  /* Left case spine and its branches. */
                  { d: "M60 40 V266", delay: 0.05 },
                  { d: "M60 88 H150", delay: 0.12 },
                  { d: "M150 88 V128 H200", delay: 0.2 },
                  { d: "M60 266 H150", delay: 0.28 },
                  /* Right case spine and its branches, mirrored. */
                  { d: "M580 40 V266", delay: 0.36 },
                  { d: "M580 88 H490", delay: 0.44 },
                  { d: "M490 88 V128 H440", delay: 0.5 },
                  { d: "M580 266 H490", delay: 0.56 },
                ].map((seg) => (
                  <motion.path
                    key={seg.d}
                    d={seg.d}
                    fill="none"
                    stroke="#c4c4c4"
                    strokeWidth="1.25"
                    {...draw(seg.delay)}
                  />
                ))}

                {/* The bridge: both people run down to the same vehicle.
                    Accent weight because this is the finding. */}
                <motion.path
                  d="M150 88 V186 H268"
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth="2"
                  {...draw(0.66)}
                />
                <motion.path
                  d="M490 88 V186 H372"
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth="2"
                  {...draw(0.74)}
                />

                {([
                  { x: 60, y: 40, label: "CASE_C014", c: ENTITY.case, anchor: "start" },
                  { x: 150, y: 88, label: "PERSON_01", c: ENTITY.person, anchor: "start" },
                  { x: 200, y: 128, label: "PHONE_987", c: ENTITY.phone, anchor: "start" },
                  { x: 150, y: 266, label: "LOCATION_MAIN", c: ENTITY.location, anchor: "start" },
                  { x: 580, y: 40, label: "CASE_C099", c: ENTITY.case, anchor: "end" },
                  { x: 490, y: 88, label: "PERSON_02", c: ENTITY.person, anchor: "end" },
                  { x: 440, y: 128, label: "PHONE_332", c: ENTITY.phone, anchor: "end" },
                ] as const).map((n, i) => (
                  <motion.g
                    key={n.label}
                    initial={reduce ? false : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: "some" }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
                  >
                    <rect x={n.x - 4} y={n.y - 4} width="8" height="8" fill={n.c} />
                    <text
                      x={n.anchor === "start" ? n.x + 12 : n.x - 12}
                      y={n.y + 4}
                      textAnchor={n.anchor}
                      fill="#0a0a0a"
                      fontSize="12"
                      fontFamily="var(--font-jetbrains), monospace"
                    >
                      {n.label}
                    </text>
                  </motion.g>
                ))}

                {/* Shared vehicle, sitting on the bridge line. */}
                <motion.g
                  initial={reduce ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: "some" }}
                  transition={{ delay: 0.85, duration: 0.4 }}
                >
                  <rect x="268" y="170" width="104" height="32" fill="#ffffff" stroke={ACCENT} strokeWidth="1.5" />
                  <rect x="277" y="182" width="8" height="8" fill={ENTITY.vehicle} />
                  <text x="292" y="190" fill="#0a0a0a" fontSize="12" fontFamily="var(--font-jetbrains), monospace">
                    VEHICLE_DL8C
                  </text>
                  <text x="320" y="228" textAnchor="middle" fill={ACCENT} fontSize="11" fontWeight="700"
                    fontFamily="var(--font-jetbrains), monospace">
                    SHARED ACROSS TWO CASES
                  </text>
                </motion.g>
              </svg>
            </div>
          </Reveal>

          {/* 4. EXPLORATION. A framed preview of the explorer with numbered
              annotations, the way a product page presents a real screen. */}
          <Reveal className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
            <div className="border border-[#d4d4d4] bg-[#f5f5f5] lg:col-span-8">
              <div className="flex items-center justify-between border-b border-[#d4d4d4] bg-white px-4 py-2">
                <div className="flex gap-2">
                  <span className="bg-[#0a0a0a] px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-widest text-white">
                    Hide unrelated
                  </span>
                  <span className="bg-[#e5e5e5] px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-widest text-[#0a0a0a]">
                    Focus: 2 hops
                  </span>
                </div>
                <span className="font-[family-name:var(--font-mono)] text-[10px] text-[#737373]">
                  NETWORK EXPLORER
                </span>
              </div>

              <div className="flex h-64 md:h-80">
                <div className="relative flex-1 overflow-hidden bg-[#fafafa]">
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" aria-hidden="true">
                    <motion.path d="M120 90 L200 150" fill="none" stroke="#d4d4d4" strokeWidth="1.5" {...draw(0.1)} />
                    <motion.path d="M280 90 L200 150" fill="none" stroke={ACCENT} strokeWidth="2.5" {...draw(0.3)} />
                    <motion.path d="M200 220 L200 150" fill="none" stroke="#d4d4d4" strokeWidth="1.5" {...draw(0.5)} />

                    {[
                      { cx: 120, cy: 90, r: 8, f: ENTITY.person, d: 0.2 },
                      { cx: 280, cy: 90, r: 10, f: ACCENT, d: 0.4 },
                      { cx: 200, cy: 220, r: 8, f: ENTITY.phone, d: 0.6 },
                      { cx: 200, cy: 150, r: 12, f: ENTITY.vehicle, d: 0.7 },
                    ].map((c) => (
                      <motion.circle
                        key={`${c.cx}-${c.cy}`}
                        cx={c.cx}
                        cy={c.cy}
                        r={c.r}
                        fill={c.f}
                        initial={reduce ? false : { scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true, amount: "some" }}
                        transition={{ delay: c.d, duration: 0.35, ease: [0.25, 0, 0, 1] }}
                        style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
                      />
                    ))}
                  </svg>

                  <motion.p
                    initial={reduce ? false : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: "some" }}
                    transition={{ delay: 0.95, duration: 0.35 }}
                    className="pointer-events-none absolute left-[52%] top-[52%] border border-[#ff3d00] bg-white p-1.5 font-[family-name:var(--font-mono)] text-[10px] font-bold"
                  >
                    SHARED_VEHICLE
                  </motion.p>
                </div>

                <div className="hidden w-48 border-l border-[#d4d4d4] bg-white p-4 sm:block md:w-64">
                  <Label>Selected entity</Label>
                  <p className="mt-2 text-lg font-bold">Vehicle DL8C</p>
                  <div className="mt-4 border-l-2 border-[#ff3d00] pl-3">
                    <p className="text-xs font-bold text-[#0a0a0a]">Why this matters</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#737373]">
                      This vehicle connects two separate cases and is directly
                      linked to a primary person of interest.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 lg:pt-10">
              <StepHeading icon={Eye} title="Interactive exploration.">
                A large graph is hard to read all at once. Focus modes fade
                unrelated entities so an officer can follow one thread at a time.
              </StepHeading>
            </div>
          </Reveal>

          {/* 5. EVIDENCE. A plain table. Tabular data belongs in a table. */}
          <Reveal className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <StepHeading icon={ShieldCheck} title="Traceable evidence.">
                Every connection on screen cites the record it came from, and
                every action against it is written to an append-only log.
              </StepHeading>
            </div>

            <div className="overflow-x-auto border border-[#d4d4d4] bg-white lg:col-span-8">
              <div className="border-b border-[#d4d4d4] bg-[#f5f5f5] p-4 md:p-6">
                <Label>Audit log / connection trace</Label>
              </div>
              <table className="w-full min-w-[520px] text-left font-[family-name:var(--font-mono)] text-sm">
                <thead className="text-xs text-[#737373]">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-normal uppercase tracking-wider">Timestamp</th>
                    <th scope="col" className="px-6 py-4 font-normal uppercase tracking-wider">Action</th>
                    <th scope="col" className="hidden px-6 py-4 font-normal uppercase tracking-wider md:table-cell">Source record</th>
                    <th scope="col" className="px-6 py-4 text-right font-normal uppercase tracking-wider">Verification</th>
                  </tr>
                </thead>
                <motion.tbody
                  initial={reduce ? false : "hidden"}
                  whileInView="show"
                  viewport={{ once: true, amount: "some" }}
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
                  className="divide-y divide-[#d4d4d4] text-[#0a0a0a]"
                >
                  {[
                    { t: "2026-03-09 10:15", a: "Node created: PERSON_01", s: "FIR_C014.pdf", flag: false },
                    { t: "2026-03-09 11:30", a: "Entity match approved", s: "Officer INSP_VIKRAM_DL", flag: false },
                    { t: "2026-03-10 09:42", a: "Bridge identified: VEHICLE_DL8C", s: "System output", flag: true },
                  ].map((row) => (
                    <motion.tr
                      key={row.t}
                      variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}
                      className="hover:bg-[#f5f5f5]"
                    >
                      <td className={`whitespace-nowrap px-6 py-4 ${row.flag ? "text-[#ff3d00]" : ""}`}>
                        {row.t}
                      </td>
                      <td className={`px-6 py-4 ${row.flag ? "font-bold text-[#ff3d00]" : ""}`}>{row.a}</td>
                      <td className="hidden px-6 py-4 text-[#737373] md:table-cell">{row.s}</td>
                      <td className="px-6 py-4 text-right font-bold" style={{ color: CONFIRMED }}>
                        VALID
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </Reveal>

          {/* STEP 6: TIMELINE & GEOSPATIAL */}
          <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 bg-blue-50 border border-blue-100 p-8 shadow-sm relative overflow-hidden order-2 lg:order-1">
              <div className="w-full h-64 bg-white border border-blue-200 rounded flex flex-col relative overflow-hidden shadow-lg">
                <div className="flex-1 bg-slate-100 relative overflow-hidden">
                  {/* Fake Map */}
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M 0 50 Q 100 20 200 60 T 400 30 L 400 200 L 0 200 Z" fill="#e0f2fe" />
                    <path d="M 100 100 L 250 80 L 300 150" fill="none" stroke="#60a5fa" strokeWidth="4" strokeDasharray="6 6" />
                    
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} cx="100" cy="100" r="8" fill="#ef4444" />
                    <motion.circle animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }} transition={{ duration: 2, repeat: Infinity }} cx="100" cy="100" r="16" fill="none" stroke="#ef4444" strokeWidth="2" />
                    
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.5 }} cx="250" cy="80" r="8" fill="#3b82f6" />
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.8 }} cx="300" cy="150" r="8" fill="#f59e0b" />
                  </svg>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-bold shadow-sm rounded border border-slate-200 text-slate-800">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>Incident Origin
                  </div>
                </div>
                <div className="h-16 bg-slate-800 border-t border-slate-700 flex items-center px-4 gap-4">
                  <div className="flex-1 h-2 bg-slate-600 rounded-full relative">
                    <motion.div initial={{ width: "0%" }} whileInView={{ width: "70%" }} transition={{ duration: 2, ease: "linear" }} className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" />
                    <div className="absolute top-1/2 left-[20%] w-3 h-3 bg-red-500 rounded-full -translate-y-1/2 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    <div className="absolute top-1/2 left-[45%] w-3 h-3 bg-blue-400 rounded-full -translate-y-1/2" />
                    <div className="absolute top-1/2 left-[70%] w-3 h-3 bg-yellow-400 rounded-full -translate-y-1/2" />
                  </div>
                  <span className="text-white font-[family-name:var(--font-mono)] text-[10px]">TIME MAPPING</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <Map size={20} className="text-[#3b82f6]" />
                <h3 className="text-2xl font-bold tracking-tight">Geospatial & Time tracking.</h3>
              </div>
              <p className="text-base text-[#737373] leading-relaxed">
                Understand the "where" and "when". NEXUS automatically plots incident locations and entity movements across an interactive map and timeline, exposing hidden geographical patterns.
              </p>
            </div>
          </Reveal>

        </div>
      </Container>
    </Section>
  );
}
