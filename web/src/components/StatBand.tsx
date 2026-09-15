"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container, Label, Reveal, RevealGroup, RevealItem } from "@/components/ui";
import net from "@/data/network.json";

const COUNT_MS = 800;

const STATS: { value: number; label: string }[] = [
  { value: net.stats.sourceRecords, label: "Records processed" },
  { value: net.stats.nodes, label: "Profiles matched" },
  { value: net.stats.edges, label: "Connections found" },
  { value: net.stats.communities, label: "Groups identified" },
];

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function Counter({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const played = useRef(false);

  useIsoLayoutEffect(() => {
    if (reduce || played.current || !ref.current) return;
    ref.current.textContent = "0";
  }, [reduce]);

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

        <Reveal delay={0.1}>
          <p className="mx-auto mt-14 max-w-2xl text-center text-base leading-relaxed text-[--color-muted-foreground]">
            Figures shown above are from a sample dataset used for testing. No real case information is included in this demonstration.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
