"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container, Label, Reveal, RevealGroup, RevealItem } from "@/components/ui";
import net from "@/data/network.json";

/* Flat numeric band. No cards, no boxes: the only structure is a
   1px vertical rule between columns at md and up. Every value below
   is read straight off net.stats, nothing is typed by hand. */

const COUNT_MS = 800;

const STATS: { value: number; label: string }[] = [
  { value: net.stats.sourceRecords, label: "Source records ingested" },
  { value: net.stats.nodes, label: "Entities resolved" },
  { value: net.stats.edges, label: "Relationships mapped" },
  { value: net.stats.communities, label: "Communities detected" },
];

/* Cubic ease out, so the count decelerates into its final value. */
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/* useLayoutEffect warns during server render, so fall back to
   useEffect on the server where it never actually runs. */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function Counter({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const played = useRef(false);

  /* The server renders the real number, so it is correct before
     hydration and correct without JavaScript. Once hydrated with
     motion allowed, drop it to zero before the browser paints. */
  useIsoLayoutEffect(() => {
    if (reduce || played.current || !ref.current) return;
    ref.current.textContent = "0";
  }, [reduce]);

  /* One rAF loop writing to the DOM node directly. No per-frame
     state, so React never re-renders while the number is running.
     The frame id is kept so an unmount mid-count cancels the loop
     instead of leaving it writing to a detached node. */
  const frame = useRef<number | null>(null);

  const start = useCallback(() => {
    const node = ref.current;
    if (reduce || played.current || !node) return;
    played.current = true;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - t0) / COUNT_MS, 1);
      node.textContent = String(Math.round(easeOut(p) * value));
      frame.current = p < 1 ? requestAnimationFrame(step) : null;
    };
    frame.current = requestAnimationFrame(step);
  }, [reduce, value]);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    []
  );

  return (
    <>
      <motion.span
        ref={ref}
        aria-hidden="true"
        onViewportEnter={start}
        viewport={{ once: true, amount: 0.6, margin: "-40px" }}
        className="block font-[family-name:var(--font-jetbrains)] text-4xl leading-none tabular-nums track-tight text-[--color-foreground] md:text-5xl"
      >
        {value}
      </motion.span>
      <span className="sr-only">{value}</span>
    </>
  );
}

export default function StatBand() {
  return (
    <section
      id="dataset"
      className="border-t border-[--color-border] py-16 md:py-20"
    >
      <Container>
        <RevealGroup>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-0 md:gap-y-0">
            {STATS.map((stat, i) => (
              <RevealItem
                key={stat.label}
                className={[
                  "flex flex-col-reverse gap-3",
                  i > 0 ? "md:border-l md:border-[--color-border] md:pl-8" : "",
                  i < STATS.length - 1 ? "md:pr-8" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <dt>
                  <Label>{stat.label}</Label>
                </dt>
                <dd>
                  <Counter value={stat.value} />
                </dd>
              </RevealItem>
            ))}
          </dl>
        </RevealGroup>

        {/* The honesty line. This band must never read as live case volume. */}
        <Reveal delay={0.1}>
          <p className="mx-auto mt-14 max-w-2xl text-center text-base leading-relaxed text-[--color-muted-foreground]">
            Figures from the synthetic evaluation dataset shipped with this repository. No real case data.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
