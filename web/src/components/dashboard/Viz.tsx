"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { entityColor } from "@/components/ui";

/* Shared dashboard visualisation primitives.

   The rule these follow: colour identifies a thing (entity type) or
   reports a state (review / confirmed / attention). It is never applied
   to make a panel look livelier. Anything decorative belongs nowhere. */

export const STATUS = {
  review: "#b45309",
  confirmed: "#15803d",
  attention: "#ff3d00",
  idle: "#737373",
} as const;

export type StatusKey = keyof typeof STATUS;

const EASE = [0.25, 0, 0, 1] as const;

/* ---------------------------------------------------------------- */

/* A figure, not a card. Large mono value, quiet label, optional small
   annotation that carries the only colour in the block. Items sit in a
   row divided by hairlines rather than each floating in its own box. */
export function StatFigure({
  value,
  label,
  note,
  noteColor = STATUS.idle,
  delay = 0,
}: {
  value: number;
  label: string;
  note?: string;
  noteColor?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef<number | null>(null);
  const played = useRef(false);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    []
  );

  const run = () => {
    const node = ref.current;
    if (reduce || played.current || !node) return;
    played.current = true;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - t0) / 700, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = String(Math.round(eased * value));
      frame.current = p < 1 ? requestAnimationFrame(step) : null;
    };
    frame.current = requestAnimationFrame(step);
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some" }}
      transition={{ duration: 0.45, delay, ease: EASE }}
      onViewportEnter={run}
      className="min-w-0"
    >
      <span
        ref={ref}
        aria-hidden="true"
        className="block font-[family-name:var(--font-jetbrains)] text-4xl leading-none tabular-nums tracking-tight text-[#0a0a0a] md:text-5xl"
      >
        {value}
      </span>
      <span className="sr-only">{value}</span>
      <p className="mt-3 font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.1em] text-[#737373]">
        {label}
      </p>
      {note ? (
        <p
          className="mt-1.5 font-[family-name:var(--font-jetbrains)] text-[11px] tracking-tight"
          style={{ color: noteColor }}
        >
          {note}
        </p>
      ) : null}
    </motion.div>
  );
}

/* ---------------------------------------------------------------- */

export type Segment = { key: string; label: string; value: number };

/* Proportional bar keyed by entity type. Each segment grows from zero
   once, on scroll. The widths are the real counts, so the bar is
   readable as data rather than as a graphic. */
export function DistributionBar({
  segments,
  total,
  caption,
}: {
  segments: Segment[];
  total: number;
  caption?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div>
      <div
        className="flex h-8 w-full overflow-hidden border border-[#d4d4d4] bg-white"
        role="img"
        aria-label={`Entity distribution: ${segments
          .map((s) => `${s.label} ${s.value}`)
          .join(", ")}. Total ${total}.`}
      >
        {segments.map((s, i) => (
          <motion.div
            key={s.key}
            initial={reduce ? false : { width: 0 }}
            whileInView={{ width: `${(s.value / total) * 100}%` }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.6, delay: 0.06 * i, ease: EASE }}
            style={{ backgroundColor: entityColor(s.key), width: `${(s.value / total) * 100}%` }}
            title={`${s.label}: ${s.value}`}
          />
        ))}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 shrink-0"
              style={{ backgroundColor: entityColor(s.key) }}
            />
            <span className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.08em] text-[#525252]">
              {s.label}
            </span>
            <span className="font-[family-name:var(--font-jetbrains)] text-[11px] tabular-nums text-[#0a0a0a]">
              {s.value}
            </span>
          </li>
        ))}
      </ul>

      {caption ? (
        <p className="mt-4 text-sm leading-relaxed text-[#737373]">{caption}</p>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------- */

/* Ranked horizontal bars. Used for relationship counts, where the
   ordering is the information and a pie would hide it. */
export function RankedBars({
  rows,
  accent = "#ff3d00",
}: {
  rows: { label: string; value: number }[];
  accent?: string;
}) {
  const reduce = useReducedMotion();
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <ul className="space-y-3">
      {rows.map((r, i) => (
        <li key={r.label} className="grid grid-cols-[minmax(0,9rem)_1fr_auto] items-center gap-3">
          <span className="truncate font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.08em] text-[#525252]">
            {r.label}
          </span>
          <span className="block h-px w-full bg-[#e5e5e5]">
            <motion.span
              className="block h-px"
              style={{ backgroundColor: i === 0 ? accent : "#a3a3a3" }}
              initial={reduce ? false : { width: 0 }}
              whileInView={{ width: `${(r.value / max) * 100}%` }}
              viewport={{ once: true, amount: "some" }}
              transition={{ duration: 0.55, delay: 0.05 * i, ease: EASE }}
            />
          </span>
          <span className="font-[family-name:var(--font-jetbrains)] text-[11px] tabular-nums text-[#0a0a0a]">
            {r.value}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------- */

/* Status pill. Text carries the meaning as well as the colour, so it
   still reads correctly in greyscale or for a colour blind user. */
export function StatusTag({
  status,
  children,
}: {
  status: StatusKey;
  children: React.ReactNode;
}) {
  const color = STATUS[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 border px-2 py-0.5 font-[family-name:var(--font-jetbrains)] text-[10px] font-bold uppercase tracking-[0.1em]"
      style={{ color, borderColor: color }}
    >
      <span aria-hidden="true" className="inline-block h-1.5 w-1.5" style={{ backgroundColor: color }} />
      {children}
    </span>
  );
}
