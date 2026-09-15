"use client";
import { useEffect, useState } from "react";

import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { Link2 } from "lucide-react";
import {
  Container,
  Section,
  Reveal,
  RevealGroup,
  RevealItem,
  Eyebrow,
} from "@/components/ui";

const EASE = [0.25, 0, 0, 1] as const;

function EntityExtractionDemo() {
  const reduce = useReducedMotion();
  const transition = reduce
    ? { duration: 0 }
    : { duration: 1.5, repeat: Infinity, repeatType: "reverse" as const, ease: EASE as unknown as [number, number, number, number] };

  return (
    <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-[#f5f5f5] p-6 text-sm leading-relaxed text-[#737373] font-[family-name:var(--font-jetbrains)]">
      <div>
        Suspect{" "}
        <motion.span
          initial={{ backgroundColor: "transparent", color: "#737373" }}
          animate={{ backgroundColor: "#4a7fb533", color: "#4a7fb5" }}
          transition={transition}
          className="px-1"
        >
          Rahul Kumar
        </motion.span>{" "}
        was seen leaving in a{" "}
        <motion.span
          initial={{ backgroundColor: "transparent", color: "#737373" }}
          animate={{ backgroundColor: "#16a08533", color: "#16a085" }}
          transition={{ ...transition, delay: 0.5 }}
          className="px-1"
        >
          black SUV (DL-8C)
        </motion.span>
        . Contacted{" "}
        <motion.span
          initial={{ backgroundColor: "transparent", color: "#737373" }}
          animate={{ backgroundColor: "#e67e2233", color: "#e67e22" }}
          transition={{ ...transition, delay: 1 }}
          className="px-1"
        >
          +91-9876543210
        </motion.span>{" "}
        shortly after.
      </div>
    </div>
  );
}


function EntityResolutionDemo() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex h-full min-h-[250px] items-center justify-center overflow-hidden bg-[#f5f5f5] p-6 text-sm">
      <AnimatePresence mode="popLayout">
        {phase < 2 ? (
          <motion.div
            key="split"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            className="flex w-full max-w-sm items-center justify-between gap-4 relative"
          >
            <motion.div
              animate={{ x: phase === 1 ? 20 : 0 }}
              className="flex-1 border border-[#d4d4d4] bg-[#fafafa] p-4 shadow-sm"
            >
              <div className="mb-2 text-xs font-bold text-[#737373]">REC_892</div>
              <div className="font-[family-name:var(--font-jetbrains)] font-medium">R. Sharma</div>
              <div className="mt-1 text-xs text-[#737373]">Mumbai</div>
            </motion.div>
            
            {phase === 1 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#ff3d00] text-white shadow-md shadow-[#ff3d00]/20"
              >
                <Link2 size={14} />
              </motion.div>
            )}

            <motion.div
              animate={{ x: phase === 1 ? -20 : 0 }}
              className="flex-1 border border-[#d4d4d4] bg-[#fafafa] p-4 shadow-sm"
            >
              <div className="mb-2 text-xs font-bold text-[#737373]">REC_104</div>
              <div className="font-[family-name:var(--font-jetbrains)] font-medium">Rahul K. Sharma</div>
              <div className="mt-1 text-xs text-[#737373]">Mumbai Central</div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="merged"
            initial={{ opacity: 0, scale: 1.1, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-xs border border-[#ff3d00] bg-[#fafafa] p-4 shadow-lg shadow-[#ff3d00]/5 relative overflow-hidden"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
              className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-[#ff3d00]/10 to-transparent skew-x-12"
            />
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-[#ff3d00]">RESOLVED ENTITY</span>
              <span className="text-[10px] bg-[#ff3d00]/10 text-[#ff3d00] px-1.5 py-0.5 font-bold">98% MATCH</span>
            </div>
            <div className="font-[family-name:var(--font-jetbrains)] text-lg font-medium">Rahul K. Sharma</div>
            <div className="mt-2 text-xs text-[#737373]">
              Merged from: REC_892, REC_104
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


function MiniGraphDemo() {
  const reduce = useReducedMotion();
  const transition = reduce ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: EASE as unknown as [number, number, number, number] };

  return (
    <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-[#f5f5f5]">
      <svg className="absolute inset-0 h-full w-full">
        <motion.line x1="20%" y1="20%" x2="50%" y2="50%" stroke="#d4d4d4" animate={{ stroke: ["#d4d4d4", "#ff3d00", "#d4d4d4"] }} transition={transition} strokeWidth="2" />
        <motion.line x1="80%" y1="20%" x2="50%" y2="50%" stroke="#d4d4d4" animate={{ stroke: ["#d4d4d4", "#ff3d00", "#d4d4d4"] }} transition={{ ...transition, delay: 0.5 }} strokeWidth="2" />
        <motion.line x1="50%" y1="80%" x2="50%" y2="50%" stroke="#d4d4d4" animate={{ stroke: ["#d4d4d4", "#ff3d00", "#d4d4d4"] }} transition={{ ...transition, delay: 1 }} strokeWidth="2" />
        <circle cx="20%" cy="20%" r="6" fill="#4a7fb5" />
        <circle cx="80%" cy="20%" r="6" fill="#e67e22" />
        <circle cx="50%" cy="80%" r="6" fill="#16a085" />
        <motion.circle cx="50%" cy="50%" r="8" fill="#0a0a0a" animate={{ fill: ["#0a0a0a", "#ff3d00", "#0a0a0a"], r: [8, 10, 8] }} transition={{ ...transition, delay: 0.2 }} />
      </svg>
    </div>
  );
}

function CrossCaseDemo() {
  const reduce = useReducedMotion();
  const transition = reduce ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: "linear" as const };

  return (
    <div className="relative flex h-48 w-full items-center justify-between overflow-hidden bg-[#f5f5f5] px-8">
      <div className="border border-[#c0392b] bg-[#c0392b]/10 p-2 font-[family-name:var(--font-jetbrains)] text-xs text-[#0a0a0a]">FIR-2023-01</div>
      <div className="border border-[#c0392b] bg-[#c0392b]/10 p-2 font-[family-name:var(--font-jetbrains)] text-xs text-[#0a0a0a]">FIR-2023-45</div>
      <svg className="absolute inset-0 -z-10 h-full w-full">
        <motion.line
          x1="25%"
          y1="50%"
          x2="75%"
          y2="50%"
          stroke="#e67e22"
          strokeWidth="2"
          strokeDasharray="4,4"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={transition}
        />
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#e67e22] px-2 py-1 font-[family-name:var(--font-jetbrains)] text-[10px] font-bold text-[#0a0a0a]">
        +91-xxx
      </div>
    </div>
  );
}

function EvidenceTrailDemo() {
  const reduce = useReducedMotion();
  const transition = reduce ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: EASE as unknown as [number, number, number, number] };

  return (
    <div className="relative flex h-48 w-full flex-col items-center justify-center space-y-4 overflow-hidden bg-[#f5f5f5]">
      <div className="border border-[#d4d4d4] bg-[#f5f5f5] p-2 text-xs text-[#0a0a0a]">Entity Link Created</div>
      <motion.div animate={{ height: [0, 30, 0], opacity: [0, 1, 0] }} transition={transition} className="w-[2px] bg-[#ff3d00]" />
      <div className="border border-[#d4d4d4] bg-[#fafafa] p-2 font-[family-name:var(--font-jetbrains)] text-xs text-[#737373]">Source: statements_04.pdf</div>
    </div>
  );
}

function ChainOfCustodyDemo() {
  const reduce = useReducedMotion();

  return (
    <div className="relative flex h-48 w-full items-center justify-center space-x-3 overflow-hidden bg-[#f5f5f5]">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 1, 0.3], y: [4, 0, 4] }}
          transition={reduce ? { duration: 0 } : { duration: 2, delay: i * 0.4, repeat: Infinity, ease: EASE as unknown as [number, number, number, number] }}
          className="flex flex-col border border-[#d4d4d4] bg-[#f5f5f5] p-3 w-24"
        >
          <span className="text-[10px] uppercase track-wider text-[#0a0a0a]">Block {i}</span>
          <span className="mt-1 font-[family-name:var(--font-jetbrains)] text-[9px] text-[#ff3d00]">
            0x{["4a1f", "8e2b", "d49c"][i - 1]}...
          </span>
        </motion.div>
      ))}
    </div>
  );
}

const SHOWCASES = [
  {
    title: "Entity Extraction",
    desc: "Unstructured text parsed into structured entities automatically.",
    demo: <EntityExtractionDemo />,
  },
  {
    title: "Entity Resolution",
    desc: "Fuzzy matching merges fragmented records into unified profiles.",
    demo: <EntityResolutionDemo />,
  },
  {
    title: "Network Intelligence",
    desc: "Graph analysis surfaces hidden intermediaries and bridge nodes.",
    demo: <MiniGraphDemo />,
  },
  {
    title: "Cross-Case Linking",
    desc: "Isolated incidents connected via shared vehicles and phones.",
    demo: <CrossCaseDemo />,
  },
  {
    title: "Evidence Trail",
    desc: "Every graph edge maintains a pointer to its source document.",
    demo: <EvidenceTrailDemo />,
  },
  {
    title: "Chain of Custody",
    desc: "Actions are cryptographically hashed to ensure auditability.",
    demo: <ChainOfCustodyDemo />,
  },
];

export default function CapabilityShowcases() {
  return (
    <Section className="border-t border-[#d4d4d4] bg-[#fafafa] py-24 md:py-32" id="showcases">
      <Container>
        <Reveal>
          <Eyebrow>Showcase</Eyebrow>
          <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight track-tighter md:text-5xl">
            See the pipeline in action.
          </h2>
        </Reveal>

        <RevealGroup className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SHOWCASES.map((showcase, i) => (
            <RevealItem key={i} className="flex flex-col border border-[#d4d4d4] bg-[#f5f5f5]">
              {showcase.demo}
              <div className="border-t border-[#d4d4d4] p-6">
                <h3 className="font-[family-name:var(--font-jetbrains)] text-sm font-bold uppercase track-wider text-[#0a0a0a]">
                  {showcase.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#737373]">
                  {showcase.desc}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
