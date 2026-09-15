"use client";

import { useCallback, useEffect, useState } from "react";
import { Hash, FileWarning, RotateCcw, Shield, ShieldCheck, ShieldX } from "lucide-react";

import {
  Container,
  Section,
  Reveal,
  RevealGroup,
  RevealItem,
  Eyebrow,
  Label,
} from "@/components/ui";

/* Horizontal block chain. Every hash rendered below is computed in the
   browser with crypto.subtle SHA-256, chained exactly the way the Python
   CustodyBlock.calculate_hash does it:

     sha256(index + timestamp + action + officer_id + payload_hash + prev_hash)

   Timestamps are fixed constants, never Date.now(), so the render is
   deterministic and the markup is hydration safe. The tamper action really
   mutates the action string and the verifier really recomputes, so the FAIL
   state is produced by the hash chain and not by a timer. */

const mono = "font-[family-name:var(--font-jetbrains)]";

const ZERO_HASH = "0".repeat(64);

/* Index of the block the tamper control mutates. */
const TAMPER_INDEX = 2;
const TAMPERED_ACTION = "MERGE_CONFIRM_BYPASS";

type Seed = {
  index: number;
  timestamp: string;
  action: string;
  officerId: string;
  payload: string;
};

type Block = Seed & {
  payloadHash: string;
  prevHash: string;
  hash: string;
};

type VerifyResult = {
  ok: boolean;
  brokenAt: number | null;
  checked: number;
  reason: string;
};

/* The four demo events. Payload strings are short deterministic descriptors,
   never case content: the ledger holds hashes and event metadata only. */
const SEED: Seed[] = [
  {
    index: 0,
    timestamp: "2026-03-09 08:00:00Z",
    action: "GENESIS_INIT",
    officerId: "SYSTEM",
    payload: "NEXUS_CUSTODY_CHAIN_GENESIS",
  },
  {
    index: 1,
    timestamp: "2026-03-09 09:14:22Z",
    action: "INGEST_FIR_101",
    officerId: "INSP_VIKRAM_DL",
    payload: "fir_101.csv|source=FIR|ingest",
  },
  {
    index: 2,
    timestamp: "2026-03-09 11:47:05Z",
    action: "MERGE_CONFIRM",
    officerId: "SI_AMIT_HR",
    payload: "merge|P020+P040|confirmed_by_officer",
  },
  {
    index: 3,
    timestamp: "2026-03-10 10:32:40Z",
    action: "EXPORT_REPORT",
    officerId: "INSP_VIKRAM_DL",
    payload: "export|case_summary|entities+graph+evidence",
  },
];

async function sha256(input: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function blockHash(
  b: Pick<Seed, "index" | "timestamp" | "officerId">,
  action: string,
  payloadHash: string,
  prevHash: string,
) {
  return sha256(
    `${b.index}${b.timestamp}${action}${b.officerId}${payloadHash}${prevHash}`,
  );
}

async function buildChain(): Promise<Block[]> {
  const out: Block[] = [];
  let prevHash = ZERO_HASH;
  for (const seed of SEED) {
    const payloadHash = await sha256(seed.payload);
    const hash = await blockHash(seed, seed.action, payloadHash, prevHash);
    out.push({ ...seed, payloadHash, prevHash, hash });
    prevHash = hash;
  }
  return out;
}

/* Walks the chain the way verify_integrity does: recompute each block from
   its current field values, compare against the hash stored on the block,
   then confirm the stored prev hash still points at the previous block. */
async function verifyChain(
  chain: Block[],
  tampered: boolean,
): Promise<VerifyResult> {
  for (let i = 0; i < chain.length; i += 1) {
    const b = chain[i];
    const action =
      tampered && b.index === TAMPER_INDEX ? TAMPERED_ACTION : b.action;
    const recomputed = await blockHash(b, action, b.payloadHash, b.prevHash);

    if (recomputed !== b.hash) {
      return {
        ok: false,
        brokenAt: b.index,
        checked: i,
        reason: "recomputed hash does not match the hash stored on the block",
      };
    }
    if (i > 0 && b.prevHash !== chain[i - 1].hash) {
      return {
        ok: false,
        brokenAt: b.index,
        checked: i,
        reason: "stored prev hash no longer points at the previous block",
      };
    }
  }
  return {
    ok: true,
    brokenAt: null,
    checked: chain.length,
    reason: "every block recomputes to the hash written when it was sealed",
  };
}

const pad2 = (n: number) => String(n).padStart(2, "0");

const trunc = (h: string) => `${h.slice(0, 12)}...${h.slice(-4)}`;

function Field({
  label,
  value,
  title,
}: {
  label: string;
  value: string;
  title?: string;
}) {
  return (
    <div>
      <dt>
        <Label>{label}</Label>
      </dt>
      <dd
        title={title}
        className={`${mono} mt-1 break-all text-[13px] leading-relaxed text-[--color-foreground]`}
      >
        {value}
      </dd>
    </div>
  );
}

function SkeletonBar({ width }: { width: string }) {
  return (
    <span
      aria-hidden="true"
      className="mt-1 block h-[13px] animate-pulse bg-[--color-border]"
      style={{ width }}
    />
  );
}

const btnBase =
  "inline-flex min-h-[44px] items-center gap-2.5 border px-6 py-3 text-sm font-semibold uppercase track-wider transition-colors duration-150 ease-[cubic-bezier(0.25,0,0,1)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50";

export default function ChainOfCustody() {
  const [chain, setChain] = useState<Block[] | null>(null);
  const [tampered, setTampered] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  /* Hashing happens once on mount. Until it resolves the section renders a
     skeleton shaped like the finished blocks, so nothing shifts on arrival. */
  useEffect(() => {
    let live = true;
    if (typeof crypto !== "undefined" && crypto.subtle) {
      buildChain()
        .then((built) => {
          if (live) setChain(built);
        })
        .catch(() => {
          if (live) setFailed(true);
        });
    } else {
      setFailed(true);
    }
    return () => {
      live = false;
    };
  }, []);

  const run = useCallback(
    async (next: boolean) => {
      if (!chain) return;
      setBusy(true);
      try {
        setResult(await verifyChain(chain, next));
      } catch {
        setFailed(true);
      } finally {
        setBusy(false);
      }
    },
    [chain],
  );

  const onVerify = useCallback(() => {
    void run(tampered);
  }, [run, tampered]);

  const onTamper = useCallback(() => {
    setTampered(true);
    void run(true);
  }, [run]);

  const onRestore = useCallback(() => {
    setTampered(false);
    void run(false);
  }, [run]);

  const rows: Seed[] = chain ?? SEED;
  const ready = chain !== null && !failed;

  const StatusIcon = failed
    ? ShieldX
    : result === null
      ? Shield
      : result.ok
        ? ShieldCheck
        : ShieldX;

  const statusTone =
    result === null && !failed
      ? "text-[--color-muted-foreground]"
      : result?.ok
        ? "text-[--color-accent]"
        : "text-[--color-foreground]";

  const statusText = failed
    ? "UNAVAILABLE: Security check could not run"
    : !ready
      ? `PROCESSING: Securing ${SEED.length} records`
      : result === null
        ? `READY: ${SEED.length} records logged, not yet checked`
        : result.ok
          ? `PASS: Evidence is secure and unchanged`
          : `FAIL: Evidence has been altered at block ${pad2(result.brokenAt ?? 0)}`;

  return (
    <div id="custody" className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      
        <Reveal>
          <Eyebrow>Secure evidence trail</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold track-tighter md:text-4xl lg:text-5xl">
            Every action is securely recorded.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[--color-muted-foreground]">
            The ledger stores hashes and event metadata, never raw case data. Names,
            numbers and report contents stay in encrypted storage off-chain.
          </p>
        </Reveal>

        {/* The chain itself. One column on mobile, four across at lg, with a
            1px connector standing in for the prev hash pointer. */}
        <RevealGroup className="mt-14 grid grid-cols-1 gap-6 md:mt-16 lg:grid-cols-4">
          {rows.map((row, i) => {
            const block = chain ? chain[i] : null;
            const altered = tampered && row.index === TAMPER_INDEX;
            const broken =
              result !== null && !result.ok && result.brokenAt === row.index;

            return (
              <RevealItem key={row.index} className="relative">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-6 left-8 h-6 w-px bg-[--color-border] lg:top-14 lg:-left-6 lg:h-px lg:w-6"
                  />
                )}

                <article
                  className={`h-full border p-5 transition-colors duration-200 ease-[cubic-bezier(0.25,0,0,1)] ${
                    broken
                      ? "border-[--color-accent] bg-[--color-muted]"
                      : "border-[--color-border] bg-[--color-card]"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span
                      className={`${mono} text-3xl font-bold tabular-nums track-tight text-[#a3a3a3]`}
                    >
                      {pad2(row.index)}
                    </span>
                    <Label>block</Label>
                  </div>

                  <p
                    className={`${mono} mt-5 break-all text-sm leading-relaxed text-[--color-foreground]`}
                  >
                    {altered ? TAMPERED_ACTION : row.action}
                  </p>
                  <p
                    className={`${mono} mt-1.5 text-[13px] leading-relaxed text-[--color-muted-foreground]`}
                  >
                    {row.timestamp}
                  </p>

                  <dl className="mt-5 space-y-3 border-t border-[--color-border] pt-4">
                    <Field label="officer id" value={row.officerId} />

                    <div>
                      <dt>
                        <Label>payload hash</Label>
                      </dt>
                      {block ? (
                        <dd
                          title={block.payloadHash}
                          className={`${mono} mt-1 break-all text-[13px] leading-relaxed text-[--color-foreground]`}
                        >
                          {trunc(block.payloadHash)}
                        </dd>
                      ) : (
                        <dd>
                          <SkeletonBar width="88%" />
                        </dd>
                      )}
                    </div>

                    <div>
                      <dt>
                        <Label>prev hash</Label>
                      </dt>
                      {block ? (
                        <dd
                          title={block.prevHash}
                          className={`${mono} mt-1 break-all text-[13px] leading-relaxed text-[--color-muted-foreground]`}
                        >
                          {trunc(block.prevHash)}
                        </dd>
                      ) : (
                        <dd>
                          <SkeletonBar width="76%" />
                        </dd>
                      )}
                    </div>
                  </dl>

                  {altered && (
                    <p
                      className={`${mono} mt-4 text-[13px] leading-relaxed text-[--color-muted-foreground]`}
                    >
                      action was edited after being securely logged
                    </p>
                  )}

                  {broken && (
                    <p
                      className={`${mono} mt-4 border-t border-[--color-accent] pt-3 text-[13px] leading-relaxed text-[--color-accent]`}
                    >
                      ERROR: Evidence has been altered at this block
                    </p>
                  )}
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {/* The demonstration. Both controls run the real verifier. */}
        <Reveal delay={0.08}>
          <div className="mt-12 border-t border-[--color-border] pt-10 md:mt-14">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={onVerify}
                disabled={!ready || busy}
                className={`${btnBase} border-[--color-foreground] text-[--color-foreground] hover:bg-[--color-foreground] hover:text-[--color-background]`}
              >
                <Hash size={16} strokeWidth={1.5} aria-hidden="true" />
                Check security trail
              </button>

              {tampered ? (
                <button
                  type="button"
                  onClick={onRestore}
                  disabled={!ready || busy}
                  className={`${btnBase} border-[--color-border] text-[--color-muted-foreground] hover:border-[--color-foreground] hover:text-[--color-foreground]`}
                >
                  <RotateCcw size={16} strokeWidth={1.5} aria-hidden="true" />
                  Fix tampered block {pad2(TAMPER_INDEX)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onTamper}
                  disabled={!ready || busy}
                  className={`${btnBase} border-[--color-border] text-[--color-muted-foreground] hover:border-[--color-foreground] hover:text-[--color-foreground]`}
                >
                  <FileWarning size={16} strokeWidth={1.5} aria-hidden="true" />
                  Simulate tampered block {pad2(TAMPER_INDEX)}
                </button>
              )}
            </div>

            <p
              aria-live="polite"
              className={`${mono} mt-8 flex items-start gap-3 text-sm leading-relaxed ${statusTone}`}
            >
              <StatusIcon
                size={18}
                strokeWidth={1.5}
                aria-hidden="true"
                className="mt-0.5 shrink-0"
              />
              <span>{statusText}</span>
            </p>

            <p
              className={`${mono} mt-6 max-w-2xl text-[13px] leading-relaxed text-[--color-muted-foreground]`}
            >
              Demo-scale hash chain, running in this page to illustrate the
              tamper-evidence mechanism. A permissioned ledger (Hyperledger Fabric)
              is the T1 step, not a claim about the current build.
            </p>
          </div>
        </Reveal>
      
    </div>
  );
}
