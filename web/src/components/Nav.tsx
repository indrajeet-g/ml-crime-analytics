"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { ArrowUpRight, Github, Menu, X } from "lucide-react";
import { Container } from "@/components/ui";

const REPO = "https://github.com/indrajeet-g/ml-crime-analytics";

/* Single word labels so the rail never wraps. "always" links survive
   the md breakpoint, the rest are dropped below lg to hold one line. */
const LINKS: { href: string; label: string; always: boolean }[] = [
  { href: "#problem", label: "Problem", always: true },
  { href: "#pipeline", label: "Pipeline", always: true },
  { href: "#capabilities", label: "Capabilities", always: false },
  { href: "#explorer", label: "Explorer", always: true },
  { href: "#custody", label: "Custody", always: false },
];

const EASE = [0.25, 0, 0, 1] as const;

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <a
      href="#top"
      onClick={onClick}
      className="inline-flex h-11 items-center gap-2.5 whitespace-nowrap font-[family-name:var(--font-jetbrains)]"
    >
      <span className="text-[15px] font-bold track-tight text-[#ff3d00]">NEXUS</span>
      <span aria-hidden="true" className="h-4 w-px bg-[#262626]" />
      <span className="text-[13px] font-medium track-tight text-[#fafafa]">
        <span className="hidden sm:inline">Network Intelligence</span>
        <span className="sm:hidden">Network Intel</span>
      </span>
    </a>
  );
}

export default function Nav() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 8);
  });

  /* Cover a reload that restores a scrolled position, where the motion
     value never fires a change event on mount. */
  useEffect(() => {
    setScrolled(scrollY.get() > 8);
  }, [scrollY]);

  /* Lock the page behind the overlay and wire the escape key. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0a0a0acc] backdrop-blur-md backdrop-saturate-150">
        <Container>
          <nav aria-label="Primary" className="relative flex h-16 items-center justify-between gap-4">
            <Wordmark />

            {/* Desktop rail. Hidden below md, where the hamburger takes over. */}
            <div className="hidden items-center gap-1 md:flex">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={`group relative inline-flex h-11 items-center px-3 font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider text-[#737373] transition-colors duration-150 hover:text-[#fafafa] ${
                    l.always ? "" : "hidden lg:inline-flex"
                  }`}
                >
                  <span className="relative">
                    {l.label}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1.5 left-0 h-0.5 w-full origin-left scale-x-0 bg-[#ff3d00] transition-transform duration-150 ease-[cubic-bezier(0.25,0,0,1)] group-hover:scale-x-100"
                    />
                  </span>
                </a>
              ))}

              <a
                href={REPO}
                target="_blank"
                rel="noreferrer"
                className="ml-2 inline-flex h-11 items-center gap-2 border border-[#262626] px-4 font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider text-[#fafafa] transition-colors duration-150 hover:border-[#ff3d00] hover:text-[#ff3d00]"
              >
                <Github className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <span className="hidden lg:inline">View source</span>
                <span className="lg:hidden">Source</span>
              </a>
            </div>

            {/* Mobile trigger. */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="-mr-3 inline-flex h-11 w-11 items-center justify-center text-[#fafafa] transition-colors duration-150 hover:text-[#ff3d00] md:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </button>

            {/* Hairline that only resolves once the page has moved. */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[#262626] transition-opacity duration-200 ease-[cubic-bezier(0.25,0,0,1)] ${
                scrolled ? "opacity-100" : "opacity-0"
              }`}
            />
          </nav>
        </Container>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
            className="fixed inset-0 z-[70] bg-[#0a0a0a] md:hidden"
          >
            <Container>
              <div className="flex h-16 items-center justify-between">
                <Wordmark onClick={() => setOpen(false)} />
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="-mr-3 inline-flex h-11 w-11 items-center justify-center text-[#fafafa] transition-colors duration-150 hover:text-[#ff3d00]"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </Container>

            <div className="h-px w-full bg-[#262626]" />

            <Container>
              <div className="grid grid-cols-1 pt-6">
                {LINKS.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduce ? 0 : 0.2,
                      ease: EASE,
                      delay: reduce ? 0 : 0.04 * i,
                    }}
                    className="group flex min-h-[64px] items-center justify-between border-b border-[#262626] py-4 text-3xl font-semibold track-tighter text-[#fafafa] transition-colors duration-150 hover:text-[#ff3d00]"
                  >
                    {l.label}
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-[#737373] transition-colors duration-150 group-hover:text-[#ff3d00]"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </motion.a>
                ))}

                <a
                  href={REPO}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="mt-8 inline-flex min-h-[56px] items-center justify-center gap-2.5 border border-[#fafafa] px-6 font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider text-[#fafafa] transition-colors duration-150 hover:bg-[#fafafa] hover:text-[#0a0a0a]"
                >
                  <Github className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  View source
                </a>

                <p className="mt-8 max-w-2xl text-base leading-relaxed text-[#737373]">
                  Smart India Hackathon 2026, Problem Statement 26189. Ministry of Home Affairs,
                  National Crime Records Bureau.
                </p>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
