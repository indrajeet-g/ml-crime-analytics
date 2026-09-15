"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/* Motion spec from the design system: fast and decisive.
   Fade in plus 20px rise over 500ms, children staggered 80ms
   after a 100ms lead. Viewport trigger fires once at 15%. */

const EASE = [0.25, 0, 0, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: "-50px" }}
      variants={stagger}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

/* Layout primitives. Container is capped at 1200px with the
   responsive padding ramp: 24 / 48 / 64. */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-6 md:px-12 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
  bordered = true,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={`py-20 md:py-28 lg:py-32 ${bordered ? "border-t border-[--color-border]" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

/* Eyebrow is rationed: at most one per three sections.
   Do not add these freely. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider text-[--color-accent]">
      {children}
    </p>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider text-[--color-muted-foreground]">
      {children}
    </span>
  );
}

/* Buttons. Primary is text plus an animated underline, no fill.
   Outline inverts fully on hover. Both keep sharp corners. */

export function PrimaryLink({
  children,
  href,
  size = "default",
}: {
  children: ReactNode;
  href: string;
  size?: "sm" | "default" | "lg";
}) {
  const pad = size === "lg" ? "py-4 gap-3 text-base" : size === "sm" ? "py-2 gap-2 text-sm" : "py-3 gap-2.5 text-sm";
  return (
    <a
      href={href}
      className={`group relative inline-flex items-center ${pad} font-semibold uppercase track-wider text-[--color-accent] transition-all duration-150 active:translate-y-px`}
    >
      {children}
      <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-100 bg-[--color-accent] transition-transform duration-150 ease-[cubic-bezier(0.25,0,0,1)] group-hover:scale-x-110" />
    </a>
  );
}

export function OutlineLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2.5 border border-[--color-foreground] px-6 py-3 text-sm font-semibold uppercase track-wider text-[--color-foreground] transition-colors duration-150 hover:bg-[--color-foreground] hover:text-[--color-background] active:translate-y-px"
    >
      {children}
    </a>
  );
}

/* Entity colour map, shared by every graph surface on the page. */
export const ENTITY_COLOR: Record<string, string> = {
  PERSON: "#4a7fb5",
  PHONE: "#e67e22",
  VEHICLE: "#16a085",
  ACCOUNT: "#27ae60",
  LOCATION: "#d4a017",
  CASE: "#c0392b",
  EVENT: "#8e44ad",
  ORGANIZATION: "#8e44ad",
};

export function entityColor(t: string) {
  return ENTITY_COLOR[t] ?? "#737373";
}
