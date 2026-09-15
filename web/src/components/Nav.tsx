"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShieldAlert, Github } from "lucide-react";
import { useScroll, useMotionValueEvent } from "motion/react";

const REPO = "https://github.com/indrajeet-g/ml-crime-analytics";

const LINKS = [
  { label: "Pipeline", href: "#pipeline" },
  { label: "Capabilities", href: "#showcases" },
  { label: "Scope", href: "#different" },
];

export const Wordmark = ({ className, onClick }: { className?: string; onClick?: () => void }) => (
  <Link
    href="/"
    onClick={onClick}
    className={`inline-flex h-9 items-center gap-2.5 transition-colors duration-150 hover:text-[#ff3d00] ${className || ""}`}
  >
    <ShieldAlert className="h-5 w-5 text-[#ff3d00]" strokeWidth={2} />
    <span className="font-[family-name:var(--font-jetbrains)] text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
      NEXUS
    </span>
  </Link>
);

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 10);
  });

  useEffect(() => {
    setScrolled(scrollY.get() > 10);
  }, [scrollY]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-full md:border md:transition-all md:ease-out ${
        scrolled && !open
          ? "bg-[#fafafa]/90 border-[#d4d4d4] backdrop-blur-lg md:top-4 md:max-w-4xl md:shadow-sm"
          : open
          ? "bg-[#fafafa] border-[#d4d4d4]"
          : "bg-[#fafafa]/90 md:bg-transparent md:border-transparent"
      }`}
    >
      <nav
        className={`flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out ${
          scrolled ? "md:px-4" : ""
        }`}
      >
        <Wordmark onClick={() => setOpen(false)} />
        
        <div className="hidden items-center gap-2 md:flex">
          {LINKS.map((link, i) => (
            <a
              key={i}
              className="inline-flex h-9 items-center justify-center rounded-full px-4 text-xs font-medium font-[family-name:var(--font-jetbrains)] tracking-wide uppercase text-[#525252] transition-colors hover:bg-black/5 hover:text-[#0a0a0a]"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          <div className="ml-2 flex items-center gap-2">
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-full border border-[#d4d4d4] px-4 text-xs font-medium font-[family-name:var(--font-jetbrains)] tracking-wide uppercase text-[#0a0a0a] transition-colors hover:bg-black/5"
            >
              <Github className="mr-2 h-3.5 w-3.5" />
              Source
            </a>
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-full bg-[#ff3d00] px-4 text-xs font-bold font-[family-name:var(--font-jetbrains)] tracking-wide uppercase text-white transition-colors hover:bg-[#0a0a0a]"
            >
              Enter Dashboard
            </Link>
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#d4d4d4] text-[#0a0a0a] transition-colors hover:bg-black/5 md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      <div
        className={`fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-t border-[#d4d4d4] bg-[#fafafa]/95 backdrop-blur-md transition-all duration-300 ease-out md:hidden ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className={`flex h-full w-full flex-col justify-between p-4 transition-transform duration-300 ease-out ${
            open ? "scale-100" : "scale-95"
          }`}
        >
          <div className="grid gap-y-2">
            {LINKS.map((link) => (
              <a
                key={link.label}
                className="flex items-center rounded-md px-4 py-3 text-sm font-medium font-[family-name:var(--font-jetbrains)] tracking-wide uppercase text-[#0a0a0a] hover:bg-black/5"
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-3 pb-8">
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center rounded-md border border-[#d4d4d4] px-4 py-3 text-sm font-medium font-[family-name:var(--font-jetbrains)] tracking-wide uppercase text-[#0a0a0a] hover:bg-black/5"
            >
              <Github className="mr-2 h-4 w-4" />
              Source
            </a>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-md bg-[#ff3d00] px-4 py-3 text-sm font-bold font-[family-name:var(--font-jetbrains)] tracking-wide uppercase text-white hover:bg-[#0a0a0a]"
            >
              Enter Dashboard
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
