"use client";
import Link from "next/link";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { useRef, useState } from "react";
import type { ReactNode } from "react";

export function TextReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE } }
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={item} className="inline-block whitespace-pre">
          {word}{" "}
        </motion.span>
      ))}
    </motion.div>
  );
}

export function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255,61,0,0.08), transparent 40%)`,
        }}
      />
      <div className="relative z-20 h-full w-full">{children}</div>
    </div>
  );
}


/* Motion spec from the design system: fast and decisive.
   Fade in plus 20px rise over 500ms, children staggered 80ms
   after a 100ms lead. Viewport trigger fires once at 15%. */

const EASE = [0.25, 0, 0, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 15, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
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
        hidden: { opacity: 0, y: 15, filter: "blur(8px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE, delay } },
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
  target,
  rel
}: {
  children: ReactNode;
  href: string;
  size?: "sm" | "default" | "lg";
  target?: string;
  rel?: string;
}) {
  const pad = size === "lg" ? "py-4 gap-3 text-base" : size === "sm" ? "py-2 gap-2 text-sm" : "py-3 gap-2.5 text-sm";
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={`group relative inline-flex items-center ${pad} font-semibold uppercase track-wider text-[--color-accent] transition-all duration-150 active:translate-y-px`}
    >
      {children}
      <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-100 bg-[--color-accent] transition-transform duration-150 ease-[cubic-bezier(0.25,0,0,1)] group-hover:scale-x-110" />
    </Link>
  );
}

export function OutlineLink({
  children,
  href,
  target,
  rel
}: {
  children: ReactNode;
  href: string;
  target?: string;
  rel?: string;
}) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className="relative overflow-hidden inline-flex items-center gap-2.5 border border-[--color-foreground] px-6 py-3 text-sm font-semibold uppercase track-wider text-[--color-foreground] transition-colors duration-300 hover:bg-[--color-foreground] hover:text-[--color-background] active:translate-y-px after:absolute after:inset-0 after:z-[-1] after:translate-x-[-100%] after:bg-[--color-foreground] after:transition-transform after:duration-300 hover:after:translate-x-0"
    >
      {children}
    </Link>
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
