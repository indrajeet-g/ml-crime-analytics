"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Search, X, Network, FileText } from "lucide-react";
import { Container, Section, Reveal, Label, entityColor } from "@/components/ui";
import net from "@/data/network.json";

/* Graph explorer. The canvas below renders every node and every link in
   network.json, laid out by a small Fruchterman Reingold simulation that
   runs in a rAF loop and settles after 300 ticks. Nothing here is drawn
   by hand: positions come from the data, and every value in the evidence
   panel is read straight off the node or the link it belongs to. */

type GNode = {
  id: string;
  label: string;
  type: string;
  community: string | null;
  betweenness: number;
  pagerank: number;
  degree: number;
  isBroker: boolean;
};

type GLink = {
  source: string;
  target: string;
  rel: string;
  conf: number;
  rec: string;
};

const NODES = net.graph.nodes as unknown as GNode[];
const LINKS = net.graph.links as unknown as GLink[];
const TOP = net.topEntities as unknown as GNode[];

const N = NODES.length;
const INDEX = new Map<string, number>(NODES.map((n, i) => [n.id, i]));
const BY_ID = new Map<string, GNode>(NODES.map((n) => [n.id, n]));
const EDGES = LINKS.map((l) => ({
  s: INDEX.get(l.source) ?? 0,
  t: INDEX.get(l.target) ?? 0,
}));

const BRIDGE_CUTOFF = 0.05;
const BRIDGE_COUNT = NODES.filter((n) => n.betweenness > BRIDGE_CUTOFF).length;

const TYPE_ORDER = [
  "PERSON",
  "PHONE",
  "VEHICLE",
  "ACCOUNT",
  "LOCATION",
  "CASE",
  "EVENT",
  "ORGANIZATION",
];
const TYPE_COUNTS: Record<string, number> = {};
for (const nd of NODES) TYPE_COUNTS[nd.type] = (TYPE_COUNTS[nd.type] ?? 0) + 1;
const TYPES = TYPE_ORDER.filter((t) => (TYPE_COUNTS[t] ?? 0) > 0);

/* Simulation constants. The layout runs in its own abstract 1000 by 640
   space and the draw pass fits that box into whatever the canvas is, so a
   resize never restarts the physics. */
const SIM_W = 1000;
const SIM_H = 640;
const CX = SIM_W / 2;
const CY = SIM_H / 2;
const TICKS = 300;
const K = Math.sqrt((SIM_W * SIM_H) / N);
const MAX_STEP = SIM_W / 12;

function simTick(
  x: Float32Array,
  y: Float32Array,
  dx: Float32Array,
  dy: Float32Array,
  cool: number,
) {
  dx.fill(0);
  dy.fill(0);

  for (let i = 0; i < N; i++) {
    const xi = x[i];
    const yi = y[i];
    for (let j = i + 1; j < N; j++) {
      let ax = xi - x[j];
      let ay = yi - y[j];
      let d2 = ax * ax + ay * ay;
      if (d2 < 1) {
        ax = (((i * 31 + j * 17) % 13) / 13) - 0.5 + 0.02;
        ay = (((i * 7 + j * 29) % 11) / 11) - 0.5 + 0.02;
        d2 = ax * ax + ay * ay + 0.01;
      }
      const d = Math.sqrt(d2);
      const f = (K * K) / d2;
      dx[i] += ax * f;
      dy[i] += ay * f;
      dx[j] -= ax * f;
      dy[j] -= ay * f;
    }
  }

  for (let e = 0; e < EDGES.length; e++) {
    const s = EDGES[e].s;
    const t = EDGES[e].t;
    const ax = x[s] - x[t];
    const ay = y[s] - y[t];
    const d = Math.sqrt(ax * ax + ay * ay) || 0.01;
    const f = d / K;
    dx[s] -= ax * f;
    dy[s] -= ay * f;
    dx[t] += ax * f;
    dy[t] += ay * f;
  }

  const temp = MAX_STEP * cool * cool + 0.5;
  for (let i = 0; i < N; i++) {
    dx[i] += (CX - x[i]) * 0.02;
    dy[i] += (CY - y[i]) * 0.02;
    const d = Math.sqrt(dx[i] * dx[i] + dy[i] * dy[i]) || 1;
    const lim = d < temp ? d : temp;
    const nx = x[i] + (dx[i] / d) * lim;
    const ny = y[i] + (dy[i] / d) * lim;
    x[i] = nx < 8 ? 8 : nx > SIM_W - 8 ? SIM_W - 8 : nx;
    y[i] = ny < 8 ? 8 : ny > SIM_H - 8 ? SIM_H - 8 : ny;
  }
}

function radiusOf(degree: number) {
  return 2.2 + Math.sqrt(degree) * 1.3;
}

export default function GraphExplorer() {
  const reduce = useReducedMotion();

  const [types, setTypes] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TYPES.map((t) => [t, true])),
  );
  const [query, setQuery] = useState("");
  const [bridgesOnly, setBridgesOnly] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  const posRef = useRef<{
    x: Float32Array;
    y: Float32Array;
    sx: Float32Array;
    sy: Float32Array;
  } | null>(null);
  const activeRef = useRef<Uint8Array | null>(null);
  const sizeRef = useRef({ w: 0, h: 0, padTop: 20 });
  const hoverRef = useRef(-1);
  const viewRef = useRef({
    types: types as Record<string, boolean>,
    q: "",
    bridges: false,
    sel: -1,
  });

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const r = wrap.getBoundingClientRect();
    const w = Math.max(0, Math.round(r.width));
    const h = Math.max(0, Math.round(r.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bw = Math.round(w * dpr);
    const bh = Math.round(h * dpr);
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    let padTop = 20;
    const rail = railRef.current;
    if (rail) {
      const rr = rail.getBoundingClientRect();
      /* The rail floats over the canvas on large screens. When it does,
         keep the layout clear of it instead of hiding nodes behind it. */
      if (rr.bottom > r.top + 1) {
        padTop = Math.min(rr.bottom - r.top + 20, h * 0.5);
      }
    }
    sizeRef.current = { w, h, padTop };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const pos = posRef.current;
    if (!canvas || !pos) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h, padTop } = sizeRef.current;
    if (w <= 0 || h <= 0) return;

    const dpr = canvas.width / w || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const { x, y, sx, sy } = pos;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < N; i++) {
      if (x[i] < minX) minX = x[i];
      if (x[i] > maxX) maxX = x[i];
      if (y[i] < minY) minY = y[i];
      if (y[i] > maxY) maxY = y[i];
    }
    const padX = 22;
    const availW = Math.max(40, w - padX * 2);
    const availH = Math.max(40, h - padTop - 22);
    const spanX = Math.max(1, maxX - minX);
    const spanY = Math.max(1, maxY - minY);
    const scale = Math.min(availW / spanX, availH / spanY);
    const ox = padX + (availW - spanX * scale) / 2 - minX * scale;
    const oy = padTop + (availH - spanY * scale) / 2 - minY * scale;
    for (let i = 0; i < N; i++) {
      sx[i] = x[i] * scale + ox;
      sy[i] = y[i] * scale + oy;
    }

    const v = viewRef.current;
    const act = activeRef.current ?? new Uint8Array(N);
    activeRef.current = act;
    const hit = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      const nd = NODES[i];
      const typeOn = v.types[nd.type] !== false;
      const bridgeOn = !v.bridges || nd.betweenness > BRIDGE_CUTOFF;
      const m =
        v.q.length > 0 &&
        (nd.label.toLowerCase().includes(v.q) || nd.id.toLowerCase().includes(v.q));
      hit[i] = m ? 1 : 0;
      act[i] = typeOn && bridgeOn && (v.q.length === 0 || m) ? 1 : 0;
    }

    const sel = v.sel;
    const neighbours: number[] = [];

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(115,115,115,0.10)";
    ctx.beginPath();
    for (let e = 0; e < EDGES.length; e++) {
      const s = EDGES[e].s;
      const t = EDGES[e].t;
      if (sel >= 0 && (s === sel || t === sel)) continue;
      if (act[s] && act[t]) continue;
      ctx.moveTo(sx[s], sy[s]);
      ctx.lineTo(sx[t], sy[t]);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(160,160,160,0.42)";
    ctx.beginPath();
    for (let e = 0; e < EDGES.length; e++) {
      const s = EDGES[e].s;
      const t = EDGES[e].t;
      if (sel >= 0 && (s === sel || t === sel)) continue;
      if (!act[s] || !act[t]) continue;
      ctx.moveTo(sx[s], sy[s]);
      ctx.lineTo(sx[t], sy[t]);
    }
    ctx.stroke();

    if (sel >= 0) {
      ctx.strokeStyle = "#ff3d00";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let e = 0; e < EDGES.length; e++) {
        const s = EDGES[e].s;
        const t = EDGES[e].t;
        if (s !== sel && t !== sel) continue;
        neighbours.push(s === sel ? t : s);
        ctx.moveTo(sx[s], sy[s]);
        ctx.lineTo(sx[t], sy[t]);
      }
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    for (let i = 0; i < N; i++) {
      if (act[i]) continue;
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = entityColor(NODES[i].type);
      ctx.beginPath();
      ctx.arc(sx[i], sy[i], radiusOf(NODES[i].degree), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (let i = 0; i < N; i++) {
      if (!act[i]) continue;
      ctx.fillStyle = entityColor(NODES[i].type);
      ctx.beginPath();
      ctx.arc(sx[i], sy[i], radiusOf(NODES[i].degree), 0, Math.PI * 2);
      ctx.fill();
    }

    if (v.q.length > 0) {
      ctx.strokeStyle = "#ff3d00";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < N; i++) {
        if (!hit[i] || !act[i]) continue;
        ctx.beginPath();
        ctx.arc(sx[i], sy[i], radiusOf(NODES[i].degree) + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    const hov = hoverRef.current;
    if (hov >= 0 && hov !== sel) {
      ctx.strokeStyle = "#fafafa";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sx[hov], sy[hov], radiusOf(NODES[hov].degree) + 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (sel >= 0) {
      ctx.strokeStyle = "#ff3d00";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx[sel], sy[sel], radiusOf(NODES[sel].degree) + 7, 0, Math.PI * 2);
      ctx.stroke();
    }

    const labelled =
      sel >= 0
        ? [sel, ...neighbours.slice(0, 12)]
        : v.q.length > 0
          ? NODES.map((_, i) => i)
              .filter((i) => hit[i] && act[i])
              .slice(0, 10)
          : [];

    if (labelled.length > 0) {
      ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      for (const i of labelled) {
        const text = NODES[i].label;
        const tw = ctx.measureText(text).width;
        const top = sy[i] - radiusOf(NODES[i].degree) - 17;
        ctx.fillStyle = "rgba(10,10,10,0.88)";
        ctx.fillRect(sx[i] - tw / 2 - 5, top, tw + 10, 15);
        ctx.fillStyle = i === sel ? "#ff3d00" : "#fafafa";
        ctx.fillText(text, sx[i], top + 11.5);
      }
    }
  }, []);

  /* Hold off on the simulation until the section is close to the viewport,
     so an offscreen canvas never competes with the rest of the page. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    measure();
    draw();
    const ro = new ResizeObserver(() => {
      measure();
      draw();
    });
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (railRef.current) ro.observe(railRef.current);
    return () => ro.disconnect();
  }, [measure, draw]);

  useEffect(() => {
    if (!started) return;

    const x = new Float32Array(N);
    const y = new Float32Array(N);
    const dx = new Float32Array(N);
    const dy = new Float32Array(N);
    /* Deterministic golden angle seeding. Same input, same layout. */
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const r = SIM_W * 0.44 * Math.sqrt((i + 0.5) / N);
      const a = i * golden;
      x[i] = CX + r * Math.cos(a);
      y[i] = CY + r * Math.sin(a) * (SIM_H / SIM_W);
    }
    posRef.current = { x, y, sx: new Float32Array(N), sy: new Float32Array(N) };

    let tick = 0;
    let raf = 0;
    const perFrame = reduce ? 25 : 2;
    const step = () => {
      for (let s = 0; s < perFrame && tick < TICKS; s++) {
        simTick(x, y, dx, dy, 1 - tick / TICKS);
        tick++;
      }
      if (!reduce || tick >= TICKS) draw();
      raf = tick < TICKS ? requestAnimationFrame(step) : 0;
    };
    measure();
    raf = requestAnimationFrame(step);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [started, reduce, draw, measure]);

  useEffect(() => {
    viewRef.current = {
      types,
      q: query.trim().toLowerCase(),
      bridges: bridgesOnly,
      sel: selected ? (INDEX.get(selected) ?? -1) : -1,
    };
    draw();
  }, [types, query, bridgesOnly, selected, draw]);

  const pick = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const pos = posRef.current;
    if (!canvas || !pos) return -1;
    const r = canvas.getBoundingClientRect();
    const px = clientX - r.left;
    const py = clientY - r.top;
    const act = activeRef.current;
    for (let pass = 0; pass < 2; pass++) {
      let best = -1;
      let bestD = 289;
      for (let i = 0; i < N; i++) {
        const on = act ? act[i] === 1 : true;
        if (pass === 0 ? !on : on) continue;
        const ax = pos.sx[i] - px;
        const ay = pos.sy[i] - py;
        const d = ax * ax + ay * ay;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      if (best >= 0) return best;
    }
    return -1;
  }, []);

  const selectedNode = selected ? (BY_ID.get(selected) ?? null) : null;

  const connections = useMemo(() => {
    if (!selected) return [];
    return LINKS.filter((l) => l.source === selected || l.target === selected).map((l) => {
      const otherId = l.source === selected ? l.target : l.source;
      return { link: l, other: BY_ID.get(otherId) ?? null, otherId };
    });
  }, [selected]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return NODES.filter(
      (n) => n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q),
    )
      .sort((a, b) => b.betweenness - a.betweenness)
      .slice(0, 8);
  }, [query]);

  const shortcuts = query.trim().length > 0 ? matches.slice(0, 3) : TOP.slice(0, 3);

  const counters: [number, string][] = [
    [net.stats.nodes, "NODES"],
    [net.stats.edges, "EDGES"],
    [net.stats.communities, "COMMUNITIES"],
  ];

  return (
    <Section id="explorer">
      <Container>
        <Reveal>
          <h2 className="max-w-3xl text-3xl font-semibold track-tighter md:text-4xl lg:text-5xl">
            Explore the network.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#737373]">
            Every node and edge below comes from the real 287-node synthetic graph. Filter it,
            search it, then open any entity.
          </p>
          <div className="mt-8 flex flex-wrap items-stretch gap-y-4 border-t border-[#262626] pt-6">
            {counters.map(([value, name], i) => (
              <div key={name} className={i === 0 ? "pr-8" : "border-l border-[#262626] px-8"}>
                <div className="font-[family-name:var(--font-jetbrains)] text-2xl track-tight tabular-nums">
                  {value}
                </div>
                <div className="mt-1">
                  <Label>{name}</Label>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>

      <Reveal className="mt-12 md:mt-16">
        <div className="grid grid-cols-1 border-y border-[#262626] bg-[#0f0f0f] lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Canvas column. The rail sits in the flow on small screens and
              floats over the canvas from lg upward. */}
          <div className="relative min-w-0">
            <div
              ref={railRef}
              className="border-b border-[#262626] bg-[#0a0a0a] px-5 py-4 lg:absolute lg:inset-x-0 lg:top-0 lg:z-10 lg:bg-[#0a0a0a]/85 lg:px-6 lg:backdrop-blur-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <label className="relative flex min-h-[44px] w-full items-center border border-[#262626] bg-[#0f0f0f] pl-9 pr-3 transition-colors duration-150 focus-within:border-[#ff3d00] sm:w-[230px]">
                  <Search
                    className="pointer-events-none absolute left-3 h-4 w-4 text-[#737373]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="sr-only">Search entities by name or id</span>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Name or id"
                    autoComplete="off"
                    className="w-full bg-transparent text-base text-[#fafafa] outline-none placeholder:text-[#737373]"
                  />
                  {query.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear the search"
                      className="-mr-2 flex h-[44px] w-[44px] shrink-0 items-center justify-center text-[#737373] transition-colors duration-150 hover:text-[#fafafa]"
                    >
                      <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    </button>
                  ) : null}
                </label>

                {TYPES.map((t) => {
                  const on = types[t] !== false;
                  return (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setTypes((p) => ({ ...p, [t]: !on }))}
                      className={`flex min-h-[44px] items-center gap-2 border px-3 transition-colors duration-150 ${
                        on
                          ? "border-[#3d3d3d] bg-[#1a1a1a] text-[#fafafa]"
                          : "border-[#262626] text-[#737373] hover:text-[#fafafa]"
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0"
                        style={{
                          backgroundColor: entityColor(t),
                          opacity: on ? 1 : 0.35,
                        }}
                        aria-hidden="true"
                      />
                      <span className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider">
                        {t}
                      </span>
                      <span className="font-[family-name:var(--font-jetbrains)] text-[11px] tabular-nums text-[#737373]">
                        {TYPE_COUNTS[t]}
                      </span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  aria-pressed={bridgesOnly}
                  aria-label="Show bridges only, entities with betweenness above 0.05"
                  onClick={() => setBridgesOnly((p) => !p)}
                  className={`flex min-h-[44px] items-center gap-2 border px-3 transition-colors duration-150 ${
                    bridgesOnly
                      ? "border-[#ff3d00] text-[#ff3d00]"
                      : "border-[#262626] text-[#737373] hover:text-[#fafafa]"
                  }`}
                >
                  <span className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider">
                    Bridges only
                  </span>
                  <span className="font-[family-name:var(--font-jetbrains)] text-[11px] tabular-nums">
                    {BRIDGE_COUNT}
                  </span>
                </button>
              </div>
            </div>

            <div ref={wrapRef} className="relative h-[420px] w-full overflow-hidden lg:h-[560px]">
              <canvas
                ref={canvasRef}
                role="img"
                aria-label={`Force directed map of ${net.stats.nodes} entities and ${net.stats.edges} relationships from the case graph. The ranked list that follows gives the same top entities as text.`}
                className="block h-full w-full touch-pan-y"
                onClick={(e) => {
                  const i = pick(e.clientX, e.clientY);
                  setSelected(i >= 0 ? NODES[i].id : null);
                }}
                onPointerMove={(e) => {
                  if (e.pointerType !== "mouse") return;
                  const i = pick(e.clientX, e.clientY);
                  if (i === hoverRef.current) return;
                  hoverRef.current = i;
                  if (canvasRef.current) {
                    canvasRef.current.style.cursor = i >= 0 ? "pointer" : "default";
                  }
                  draw();
                }}
                onPointerLeave={() => {
                  if (hoverRef.current === -1) return;
                  hoverRef.current = -1;
                  draw();
                }}
              />
              <ul className="sr-only">
                {TOP.map((n) => (
                  <li key={n.id}>
                    {n.label}, id {n.id}, type {n.type}, degree {n.degree}, betweenness{" "}
                    {n.betweenness.toFixed(4)}.
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Evidence panel. */}
          <aside
            aria-label="Evidence panel"
            className="min-w-0 border-t border-[#262626] bg-[#0a0a0a] lg:max-h-[560px] lg:overflow-y-auto lg:border-l lg:border-t-0"
          >
            {selectedNode ? (
              <>
                <div className="flex items-start justify-between gap-3 border-b border-[#262626] p-5 lg:p-6">
                  <div className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0"
                        style={{ backgroundColor: entityColor(selectedNode.type) }}
                        aria-hidden="true"
                      />
                      <Label>{selectedNode.type}</Label>
                    </span>
                    <h3 className="mt-3 break-words text-2xl font-semibold track-tight">
                      {selectedNode.label}
                    </h3>
                    <p className="mt-1.5 font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider text-[#737373]">
                      {selectedNode.id}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    aria-label="Close the evidence panel"
                    className="-mr-2 -mt-2 flex h-[44px] w-[44px] shrink-0 items-center justify-center text-[#737373] transition-colors duration-150 hover:text-[#fafafa]"
                  >
                    <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </div>

                <dl className="grid grid-cols-2 border-b border-[#262626]">
                  {(
                    [
                      ["DEGREE", String(selectedNode.degree)],
                      ["BETWEENNESS", selectedNode.betweenness.toFixed(4)],
                      ["PAGERANK", selectedNode.pagerank.toFixed(5)],
                      ["COMMUNITY", selectedNode.community ?? "UNASSIGNED"],
                    ] as [string, string][]
                  ).map(([k, val], i) => (
                    <div
                      key={k}
                      className={`p-5 lg:px-6 ${i % 2 === 1 ? "border-l border-[#262626]" : ""} ${
                        i < 2 ? "border-b border-[#262626]" : ""
                      }`}
                    >
                      <dt>
                        <Label>{k}</Label>
                      </dt>
                      <dd className="mt-2 font-[family-name:var(--font-jetbrains)] text-lg tabular-nums track-tight">
                        {val}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="flex items-baseline justify-between gap-3 px-5 pb-3 pt-5 lg:px-6">
                  <Label>Connected edges</Label>
                  <span className="font-[family-name:var(--font-jetbrains)] text-[11px] tabular-nums text-[#737373]">
                    {connections.length}
                  </span>
                </div>

                <ul>
                  {connections.map(({ link, other, otherId }, i) => (
                    <li key={`${link.source}-${link.target}-${link.rel}-${i}`} className="border-t border-[#262626]">
                      <div className="p-5 lg:px-6">
                        <div className="flex items-baseline justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setSelected(otherId)}
                            className="min-h-[24px] break-words text-left text-base text-[#fafafa] underline decoration-[#3d3d3d] underline-offset-4 transition-colors duration-150 hover:decoration-[#ff3d00]"
                          >
                            {other ? other.label : otherId}
                          </button>
                          <span className="flex shrink-0 items-center gap-2">
                            <span
                              className="h-2 w-2"
                              style={{ backgroundColor: entityColor(other ? other.type : "") }}
                              aria-hidden="true"
                            />
                            <span className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider text-[#737373]">
                              {other ? other.type : "UNKNOWN"}
                            </span>
                          </span>
                        </div>
                        <p className="mt-2 font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider text-[#737373]">
                          {link.rel}
                        </p>
                        <div className="mt-3 flex items-center gap-3 border-l-2 border-[#ff3d00] bg-[#0f0f0f] py-2.5 pl-3">
                          <FileText
                            className="h-4 w-4 shrink-0 text-[#737373]"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          <span className="min-w-0">
                            <span className="block font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider text-[#737373]">
                              Source record
                            </span>
                            <span className="mt-0.5 block font-[family-name:var(--font-jetbrains)] text-base track-tight text-[#fafafa]">
                              {link.rec}
                            </span>
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="p-5 lg:p-6">
                <Network className="h-6 w-6 text-[#ff3d00]" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold track-tight">
                  Pick a node to open its evidence.
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#737373]">
                  Every entity carries its own centrality values and, for each connection, the
                  source record the link was extracted from.
                </p>
                <p className="mt-6">
                  <Label>
                    {query.trim().length > 0 ? "Search matches" : "Highest betweenness"}
                  </Label>
                </p>
                {shortcuts.length > 0 ? (
                  <ul className="mt-3 border-t border-[#262626]">
                    {shortcuts.map((n) => (
                      <li key={n.id} className="border-b border-[#262626]">
                        <button
                          type="button"
                          onClick={() => setSelected(n.id)}
                          className="flex min-h-[56px] w-full items-center justify-between gap-3 py-3 text-left transition-colors duration-150 hover:text-[#ff3d00]"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span
                              className="h-2.5 w-2.5 shrink-0"
                              style={{ backgroundColor: entityColor(n.type) }}
                              aria-hidden="true"
                            />
                            <span className="min-w-0 break-words text-base">{n.label}</span>
                          </span>
                          <span className="shrink-0 font-[family-name:var(--font-jetbrains)] text-[11px] tabular-nums text-[#737373]">
                            {n.betweenness.toFixed(4)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 border-t border-[#262626] pt-4 text-base text-[#737373]">
                    Nothing in the graph matches that text.
                  </p>
                )}
              </div>
            )}
          </aside>
        </div>
      </Reveal>
    </Section>
  );
}
