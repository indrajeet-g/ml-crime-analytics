"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import net from "@/data/network.json";
import { entityColor } from "@/components/ui";

/* A legible slice of the real graph, not all 287 nodes.
   We take the highest betweenness entities and keep only the
   edges induced between them, so the picture stays readable. */

type SeedNode = {
  id: string;
  label: string;
  type: string;
  betweenness: number;
  degree: number;
  isBroker: boolean;
};

type SeedEdge = { a: number; b: number };

const NODE_BUDGET = 45;
const TICKS = 280;
const SEED = 82634;
const ACCENT = "#ff3d00";
const EDGE = "#a3a3a3";
const EDGE_LIT = "#525252";
const BG = "#fafafa";
const FG = "#0a0a0a";

const seeds: SeedNode[] = [...net.graph.nodes]
  .sort((a, b) => b.betweenness - a.betweenness || b.degree - a.degree)
  .slice(0, NODE_BUDGET);

const seedIndex = new Map<string, number>(seeds.map((n, i) => [n.id, i]));

const seedEdges: SeedEdge[] = [];
for (const link of net.graph.links) {
  const a = seedIndex.get(link.source);
  const b = seedIndex.get(link.target);
  if (a !== undefined && b !== undefined && a !== b) seedEdges.push({ a, b });
}

const maxBetweenness = seeds.length > 0 ? seeds[0].betweenness : 1;

function radiusOf(node: SeedNode, scale: number) {
  const t = Math.sqrt(Math.max(node.betweenness, 0) / maxBetweenness);
  return (3.2 + t * 6.6) * scale;
}

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

/* Deterministic generator so the opening layout is the same
   on every load and never depends on Math.random. */
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Sim = {
  xs: Float64Array;
  ys: Float64Array;
  dx: Float64Array;
  dy: Float64Array;
  w: number;
  h: number;
  temp: number;
  tick: number;
  scale: number;
};

type Tip = { index: number; x: number; y: number; below: boolean };

const noop = () => {};

const srSummary = net.topEntities
  .slice(0, 5)
  .map((e) => `${e.label}, ${e.type.toLowerCase()}, betweenness ${e.betweenness}`)
  .join("; ");

export default function HeroGraph() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef<Sim | null>(null);
  const hoverRef = useRef<number>(-1);
  const drawRef = useRef<() => void>(noop);
  const [tip, setTip] = useState<Tip | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let disposed = false;

    const scaleFor = (w: number, h: number) =>
      clamp(Math.min(w, h) / 440, 0.7, 1.15);

    const resizeBuffer = (w: number, h: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = (w: number, h: number) => {
      const n = seeds.length;
      const xs = new Float64Array(n);
      const ys = new Float64Array(n);
      const rnd = lcg(SEED);
      const cx = w / 2;
      const cy = h / 2;
      const ring = Math.min(w, h) * 0.34;
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2;
        const jitter = 0.55 + rnd() * 0.85;
        xs[i] = cx + Math.cos(angle) * ring * jitter;
        ys[i] = cy + Math.sin(angle) * ring * jitter;
      }
      simRef.current = {
        xs,
        ys,
        dx: new Float64Array(n),
        dy: new Float64Array(n),
        w,
        h,
        temp: Math.min(w, h) * 0.14,
        tick: 0,
        scale: scaleFor(w, h),
      };
    };

    /* Fruchterman Reingold: repulsion between every pair, spring
       attraction along edges, a mild pull toward the centre, and a
       temperature that cools so the layout settles instead of jittering. */
    const tick = () => {
      const st = simRef.current;
      if (!st) return;
      const { xs, ys, dx, dy, w, h } = st;
      const n = seeds.length;
      const k = Math.sqrt((w * h) / n) * 0.62;

      dx.fill(0);
      dy.fill(0);

      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          let ax = xs[i] - xs[j];
          let ay = ys[i] - ys[j];
          let d = Math.sqrt(ax * ax + ay * ay);
          if (d < 0.5) {
            ax = 0.4 + (i % 5) * 0.07;
            ay = 0.3 + (j % 5) * 0.07;
            d = Math.sqrt(ax * ax + ay * ay);
          }
          const f = (k * k) / d;
          const ux = ax / d;
          const uy = ay / d;
          dx[i] += ux * f;
          dy[i] += uy * f;
          dx[j] -= ux * f;
          dy[j] -= uy * f;
        }
      }

      for (let e = 0; e < seedEdges.length; e++) {
        const a = seedEdges[e].a;
        const b = seedEdges[e].b;
        const ax = xs[a] - xs[b];
        const ay = ys[a] - ys[b];
        const d = Math.max(0.5, Math.sqrt(ax * ax + ay * ay));
        const f = (d * d) / k;
        const ux = ax / d;
        const uy = ay / d;
        dx[a] -= ux * f;
        dy[a] -= uy * f;
        dx[b] += ux * f;
        dy[b] += uy * f;
      }

      const cx = w / 2;
      const cy = h / 2;
      const reach = Math.max(1, Math.min(w, h) / 2);
      const pad = 12 * st.scale + 4;

      for (let i = 0; i < n; i++) {
        dx[i] += ((cx - xs[i]) / reach) * k * 0.6;
        dy[i] += ((cy - ys[i]) / reach) * k * 0.6;
        const len = Math.sqrt(dx[i] * dx[i] + dy[i] * dy[i]) || 1;
        const limit = Math.min(len, st.temp) / len;
        xs[i] = clamp(xs[i] + dx[i] * limit, pad, w - pad);
        ys[i] = clamp(ys[i] + dy[i] * limit, pad, h - pad);
      }

      st.temp *= 0.975;
      st.tick += 1;
    };

    const draw = () => {
      const st = simRef.current;
      if (!st) return;
      const hov = hoverRef.current;
      ctx.clearRect(0, 0, st.w, st.h);

      ctx.lineWidth = 1;
      for (let e = 0; e < seedEdges.length; e++) {
        const a = seedEdges[e].a;
        const b = seedEdges[e].b;
        ctx.strokeStyle = hov >= 0 && (a === hov || b === hov) ? EDGE_LIT : EDGE;
        ctx.beginPath();
        ctx.moveTo(st.xs[a], st.ys[a]);
        ctx.lineTo(st.xs[b], st.ys[b]);
        ctx.stroke();
      }

      for (let i = 0; i < seeds.length; i++) {
        const node = seeds[i];
        const r = radiusOf(node, st.scale);
        const x = st.xs[i];
        const y = st.ys[i];

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = node.isBroker ? ACCENT : entityColor(node.type);
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = BG;
        ctx.stroke();

        if (node.isBroker) {
          ctx.beginPath();
          ctx.arc(x, y, r + 4 * st.scale, 0, Math.PI * 2);
          ctx.lineWidth = 1;
          ctx.strokeStyle = ACCENT;
          ctx.stroke();
        }

        if (i === hov) {
          ctx.beginPath();
          ctx.arc(x, y, r + 6 * st.scale, 0, Math.PI * 2);
          ctx.lineWidth = 1;
          ctx.strokeStyle = FG;
          ctx.stroke();
        }
      }
    };

    const loop = () => {
      if (disposed) return;
      const st = simRef.current;
      if (st) {
        if (st.tick < TICKS) {
          tick();
          tick();
          draw();
        } else {
          draw();
          return;
        }
      }
      raf = requestAnimationFrame(loop);
    };

    const settle = () => {
      for (let i = 0; i < TICKS; i++) tick();
      draw();
    };

    drawRef.current = draw;

    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (!box) return;
      const w = Math.round(box.width);
      const h = Math.round(box.height);

      /* Ignore degenerate boxes. ResizeObserver fires once before layout has
         settled, and seeding the simulation against a 0 or 1px height puts
         every node at the same y (the clamp collapses them outright). The
         later rescale multiplies all of them by the same factor, so the
         graph stays collapsed to a flat line for the life of the page. */
      if (w < 2 || h < 2) return;

      resizeBuffer(w, h);

      const st = simRef.current;
      if (!st) {
        init(w, h);
        if (reduce) settle();
        else raf = requestAnimationFrame(loop);
        return;
      }

      if (st.w !== w || st.h !== h) {
        const sx = w / st.w;
        const sy = h / st.h;
        for (let i = 0; i < seeds.length; i++) {
          st.xs[i] *= sx;
          st.ys[i] *= sy;
        }
        st.w = w;
        st.h = h;
        st.scale = scaleFor(w, h);
      }
      draw();
    });

    observer.observe(wrap);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      drawRef.current = noop;
    };
  }, [reduce]);

  const handleMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const st = simRef.current;
    const canvas = canvasRef.current;
    if (!st || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;

    let best = -1;
    let bestDist = Infinity;
    for (let i = 0; i < seeds.length; i++) {
      const reach = radiusOf(seeds[i], st.scale) + 8;
      const ax = st.xs[i] - px;
      const ay = st.ys[i] - py;
      const d = Math.sqrt(ax * ax + ay * ay);
      if (d <= reach && d < bestDist) {
        bestDist = d;
        best = i;
      }
    }

    if (best === hoverRef.current) return;
    hoverRef.current = best;
    if (best < 0) {
      setTip(null);
    } else {
      const below = st.ys[best] < 96;
      setTip({
        index: best,
        x: clamp(st.xs[best], 84, Math.max(84, st.w - 84)),
        y: st.ys[best],
        below,
      });
    }
    drawRef.current();
  };

  const handleLeave = () => {
    if (hoverRef.current === -1) return;
    hoverRef.current = -1;
    setTip(null);
    drawRef.current();
  };

  const active = tip ? seeds[tip.index] : null;

  return (
    <div
      ref={wrapRef}
      className="relative h-[300px] w-full overflow-hidden sm:h-[360px] lg:h-[520px]"
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Force directed map of the ${seeds.length} most central entities in the case network, connected by ${seedEdges.length} links.`}
        className="block h-full w-full"
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        onPointerCancel={handleLeave}
      />

      {active && tip ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 min-w-[152px] border border-[--color-border] bg-[--color-card] px-3 py-2"
          style={{
            left: `${tip.x}px`,
            top: `${tip.below ? tip.y + 16 : tip.y - 16}px`,
            transform: `translate(-50%, ${tip.below ? "0%" : "-100%"})`,
          }}
        >
          <p className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider text-[--color-foreground]">
            {active.label}
          </p>
          <p className="mt-1 font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider text-[--color-muted-foreground]">
            {active.type}
          </p>
          <div className="mt-2 flex gap-4 font-[family-name:var(--font-jetbrains)] text-[11px] tabular-nums text-[--color-muted-foreground]">
            <span>
              DEG <span className="text-[--color-foreground]">{active.degree}</span>
            </span>
            <span>
              BTW{" "}
              <span className="text-[--color-foreground]">
                {active.betweenness.toFixed(4)}
              </span>
            </span>
          </div>
        </div>
      ) : null}

      <p className="sr-only">
        A force directed preview of the case network showing the {seeds.length} entities
        with the highest betweenness centrality and the {seedEdges.length} links between
        them. Node colour encodes entity type and node size encodes betweenness. The
        strongest connectors are {srSummary}.
      </p>
    </div>
  );
}
