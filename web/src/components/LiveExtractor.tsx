"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ClipboardPaste, Eraser, Info, RotateCcw } from "lucide-react";
import { Container, Section, Reveal, Label, entityColor } from "@/components/ui";

/* Live extractor. The three patterns below are the real regexes from the
   Python ingestion step, ported character for character, and the displayed
   pattern string is read off the RegExp source so the code and the label
   can never drift apart. Phone normalisation copies clean_phone: strip
   every non-digit, keep the last ten, accept only a 6 to 9 leading digit.
   Person and organization cannot run spaCy in a browser, so that group is
   a capitalised multiword heuristic and is labelled as one. */

const EASE = [0.25, 0, 0, 1] as const;
const MONO = "font-[family-name:var(--font-jetbrains)]";

const SAMPLE = `On 14 March 2026 at about 21:40 hours, complainant Rohan Joshi of Sanganer, Jaipur
reported that a booked consignment was diverted before delivery.

The booking was arranged through Meridian Freight Logistics by Vivek Iyer, who is
recorded in the same transport ledger as V. Iyer, on mobile number +91 98111 00001.
Two outgoing calls were placed from that number to 98765 43210 the same evening.

A pickup bearing registration DL-01-AB-1234 was noted at the loading bay by the gate
staff, Aarav Mehta, who logged the same vehicle on two earlier nights.
The advance for the booking was received in account number 402177889012.

Copies of the consignment note and the gate register are annexed to this report.`;

/* Ported from the Python extractor. Do not "tidy" these. */
const PHONE_RE = /(?:\+91[\s-]?)?[6-9][\d\s-]{9,13}/g;
const VEHICLE_RE = /\b[A-Z]{2}[\s-]?\d{1,2}[\s-]?[A-Z]{1,3}[\s-]?\d{4}\b/g;
const ACCOUNT_RE = /\b(?:AC|A\/C|ACC)?[-:\s]?(\d{9,18})\b/gi;

/* Browser-side stand-in only. Two to four capitalised tokens, initials
   allowed, never crossing a line break or a punctuation mark. */
const PHRASE_RE = /\b(?:[A-Z][a-z]+|[A-Z]\.)(?:[ \t]+(?:[A-Z][a-z]+|[A-Z]\.)){1,3}\b/g;

const NORMALISED_PHONE = /^[6-9]\d{9}$/;

/* Words that commonly open or close a sentence in a report and would
   otherwise be glued onto the name beside them. */
const STOP = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "by", "for", "from",
  "with", "on", "at", "in", "as", "is", "it", "he", "she", "they", "this",
  "that", "these", "those", "per", "during", "after", "before", "further",
  "also", "said", "both", "one", "two", "three", "no", "dated", "date",
  "time", "case", "fir", "police", "station", "complaint", "complainant",
  "statement", "witness", "shri", "smt", "kumari", "mr", "mrs", "ms",
  "sub", "inspector", "officer", "thereafter", "subsequently", "however",
  "copies", "annexed", "report", "accused", "suspect", "victim", "informant",
  "constable", "monday", "tuesday", "wednesday", "thursday", "friday",
  "saturday", "sunday", "january", "february", "march", "april", "may",
  "june", "july", "august", "september", "october", "november", "december",
]);

/* A capitalised phrase carrying one of these reads as an organization
   rather than a person. Still a heuristic, still needs confirming. */
const ORG_WORDS = new Set([
  "logistics", "freight", "transport", "transports", "traders", "trading",
  "enterprises", "enterprise", "services", "motors", "exports", "imports",
  "agency", "agencies", "corporation", "depot", "warehouse", "carriers",
  "company", "industries", "pvt", "ltd", "limited", "bank", "society",
]);

const norm = (token: string) => token.toLowerCase().replace(/[^a-z]/g, "");

type Extraction = {
  phones: string[];
  vehicles: string[];
  accounts: string[];
  people: string[];
  orgs: string[];
};

function extract(text: string): Extraction {
  const phones: string[] = [];
  const vehicles: string[] = [];
  const accounts: string[] = [];
  const people: string[] = [];
  const orgs: string[] = [];

  /* Character spans a phone has already claimed, so the same digit run is
     never reported a second time as a bank account. */
  const claimed: [number, number][] = [];

  for (const m of text.matchAll(PHONE_RE)) {
    const digits = m[0].replace(/\D/g, "");
    if (digits.length < 10) continue;
    const last10 = digits.slice(-10);
    if (!NORMALISED_PHONE.test(last10)) continue;
    const start = m.index ?? 0;
    claimed.push([start, start + m[0].length]);
    if (!phones.includes(last10)) phones.push(last10);
  }

  for (const m of text.matchAll(VEHICLE_RE)) {
    const plate = m[0].replace(/[\s-]/g, "").toUpperCase();
    if (!vehicles.includes(plate)) vehicles.push(plate);
  }

  for (const m of text.matchAll(ACCOUNT_RE)) {
    const digits = m[1];
    if (!digits || digits.length < 9) continue;
    const start = (m.index ?? 0) + m[0].length - digits.length;
    const end = start + digits.length;
    if (claimed.some(([s, e]) => start < e && end > s)) continue;
    if (!accounts.includes(digits)) accounts.push(digits);
  }

  for (const m of text.matchAll(PHRASE_RE)) {
    let tokens = m[0].split(/\s+/).filter(Boolean);
    while (tokens.length > 0 && STOP.has(norm(tokens[0]))) {
      tokens = tokens.slice(1);
    }
    while (tokens.length > 0 && STOP.has(norm(tokens[tokens.length - 1]))) {
      tokens = tokens.slice(0, -1);
    }
    if (tokens.length < 2) continue;
    const phrase = tokens.join(" ");
    const bucket = tokens.some((t) => ORG_WORDS.has(norm(t))) ? orgs : people;
    if (!bucket.includes(phrase)) bucket.push(phrase);
  }

  return { phones, vehicles, accounts, people, orgs };
}

function GroupHead({ type, count }: { type: string; count: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2.5">
        <span
          className="h-2.5 w-2.5 shrink-0"
          style={{ backgroundColor: entityColor(type) }}
          aria-hidden="true"
        />
        <Label>{type}</Label>
      </span>
      <span className={`${MONO} shrink-0 text-[11px] tabular-nums track-wider text-[#737373]`}>
        {count}
      </span>
    </div>
  );
}

function ChipList({
  values,
  reduce,
  empty,
}: {
  values: string[];
  reduce: boolean;
  empty: string;
}) {
  if (values.length === 0) {
    return (
      <p className="mt-4 text-base leading-relaxed text-[#737373]">{empty}</p>
    );
  }
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      <AnimatePresence initial={false}>
        {values.map((v) => (
          <motion.li
            key={v}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -4 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
            className={`${MONO} border border-[#262626] px-3 py-2 text-sm text-[#fafafa]`}
          >
            {v}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

export default function LiveExtractor() {
  const reduceMotion = useReducedMotion();
  const reduce = reduceMotion === true;

  const [text, setText] = useState(SAMPLE);
  const result = useMemo(() => extract(text), [text]);

  const reset = useCallback(() => setText(SAMPLE), []);
  const clear = useCallback(() => setText(""), []);

  const isEmpty = text.trim().length === 0;

  const patternGroups = [
    {
      type: "PHONE",
      pattern: PHONE_RE.source,
      note: "non-digits stripped, last 10 digits kept, must start 6 to 9",
      values: result.phones,
    },
    {
      type: "VEHICLE",
      pattern: VEHICLE_RE.source,
      note: "spaces and hyphens stripped, uppercased",
      values: result.vehicles,
    },
    {
      type: "ACCOUNT",
      pattern: ACCOUNT_RE.source,
      note: "digit runs already read as a phone are skipped",
      values: result.accounts,
    },
  ];

  const patternTotal =
    result.phones.length + result.vehicles.length + result.accounts.length;
  const heuristicTotal = result.people.length + result.orgs.length;

  const ghostButton =
    `${MONO} inline-flex min-h-[44px] items-center gap-2 border border-transparent px-3 text-[11px] uppercase track-wider text-[#737373] transition-colors duration-150 ease-[cubic-bezier(0.25,0,0,1)] hover:border-[#262626] hover:text-[#fafafa]`;

  return (
    <Section id="extract">
      <Container>
        <Reveal>
          <h2 className="max-w-3xl text-3xl font-semibold track-tighter md:text-4xl lg:text-5xl">
            Run the extractor on an FIR.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#737373]">
            The phone, vehicle and account patterns below are the exact regexes from
            the Python pipeline, running on your text.
          </p>
        </Reveal>

        <Reveal className="mt-12 md:mt-16">
          <div className="grid grid-cols-1 border border-[#262626] bg-[#0f0f0f] lg:grid-cols-2">
            {/* Input column. */}
            <div className="min-w-0 p-5 md:p-6 lg:p-8">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <label htmlFor="fir-source" className="block">
                  <Label>Source record text</Label>
                </label>
                <div className="-mr-3 flex flex-wrap items-center">
                  <button type="button" onClick={reset} className={ghostButton}>
                    <RotateCcw size={14} strokeWidth={1.5} aria-hidden="true" />
                    Reset to sample
                  </button>
                  <button type="button" onClick={clear} className={ghostButton}>
                    <Eraser size={14} strokeWidth={1.5} aria-hidden="true" />
                    Clear
                  </button>
                </div>
              </div>

              <textarea
                id="fir-source"
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                aria-describedby="fir-source-note"
                placeholder="Paste an FIR narrative, a statement or a call record line."
                className={`${MONO} mt-4 block min-h-[14rem] w-full resize-y border border-[#262626] bg-[#1a1a1a] p-4 text-base leading-relaxed text-[#fafafa] transition-colors duration-150 ease-[cubic-bezier(0.25,0,0,1)] placeholder:text-[#737373] focus:border-[#ff3d00] lg:min-h-[20rem]`}
              />

              <p
                id="fir-source-note"
                className={`${MONO} mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-[13px] leading-relaxed text-[#737373]`}
              >
                <span className="tabular-nums">{text.length} chars</span>
                <span>matching runs in this browser, nothing is uploaded</span>
              </p>

              <p className="mt-6 max-w-2xl border-l-2 border-[#ff3d00] bg-[#0a0a0a] p-4 text-base leading-relaxed text-[#737373]">
                The sample is synthetic. It carries one name twice, once in full and
                once as an initial form, which is the variation alias resolution has
                to survive.
              </p>
            </div>

            {/* Output column. */}
            <div className="min-w-0 border-t border-[#262626] lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between gap-3 border-b border-[#262626] px-5 py-4 md:px-6 lg:px-8">
                <Label>Live output</Label>
                <p
                  aria-live="polite"
                  className={`${MONO} shrink-0 text-[11px] uppercase track-wider text-[#737373]`}
                >
                  <span className="tabular-nums">{patternTotal}</span>
                  <span aria-hidden="true"> matched</span>
                  <span className="sr-only">
                    {" "}
                    pattern matches in the current text
                  </span>
                </p>
              </div>

              {isEmpty ? (
                <div className="p-5 md:p-6 lg:p-8">
                  <ClipboardPaste
                    size={24}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="text-[#ff3d00]"
                  />
                  <h3 className="mt-5 text-xl font-semibold track-tight">
                    Nothing to read yet.
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#737373]">
                    Paste an FIR narrative, a witness statement or a line from a call
                    record into the box on the left. Every pattern reruns as you type.
                  </p>

                  <ul className="mt-6 border-t border-[#262626]">
                    {patternGroups.map((g) => (
                      <li
                        key={g.type}
                        className="flex items-center gap-2.5 border-b border-[#262626] py-3"
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0"
                          style={{ backgroundColor: entityColor(g.type) }}
                          aria-hidden="true"
                        />
                        <Label>{g.type}</Label>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={reset}
                    className={`${MONO} mt-6 inline-flex min-h-[44px] items-center gap-2 border border-[#fafafa] px-5 text-[11px] uppercase track-wider text-[#fafafa] transition-colors duration-150 ease-[cubic-bezier(0.25,0,0,1)] hover:bg-[#fafafa] hover:text-[#0a0a0a]`}
                  >
                    <RotateCcw size={14} strokeWidth={1.5} aria-hidden="true" />
                    Load the sample record
                  </button>
                </div>
              ) : (
                <>
                  {patternGroups.map((g) => (
                    <div
                      key={g.type}
                      className="border-b border-[#262626] p-5 md:p-6 lg:px-8"
                    >
                      <GroupHead type={g.type} count={g.values.length} />
                      <div className="mt-3 overflow-x-auto">
                        <code
                          className={`${MONO} block whitespace-pre text-[13px] leading-relaxed text-[#ff3d00]`}
                        >
                          {g.pattern}
                        </code>
                      </div>
                      <p
                        className={`${MONO} mt-2 text-[13px] leading-relaxed text-[#737373]`}
                      >
                        {g.note}
                      </p>
                      <ChipList
                        values={g.values}
                        reduce={reduce}
                        empty="Nothing in the current text matches this pattern."
                      />
                    </div>
                  ))}

                  <div className="bg-[#1a1a1a] p-5 md:p-6 lg:px-8">
                    <div className="flex items-center justify-between gap-3">
                      <Label>Heuristic preview</Label>
                      <span
                        className={`${MONO} shrink-0 text-[11px] tabular-nums track-wider text-[#737373]`}
                      >
                        {heuristicTotal}
                      </span>
                    </div>

                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#737373]">
                      Names below are caught by a capitalised multiword rule, nothing
                      more. Read them as candidates to confirm, not as an extraction
                      result.
                    </p>

                    <p
                      className={`${MONO} mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-[#737373]`}
                    >
                      <Info
                        size={14}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="mt-1 shrink-0"
                      />
                      <span>
                        the shipped pipeline runs spaCy en_core_web_sm server-side,
                        which a browser cannot do
                      </span>
                    </p>

                    <div className="mt-6 border-t border-[#262626] pt-5">
                      <GroupHead type="PERSON" count={result.people.length} />
                      <ChipList
                        values={result.people}
                        reduce={reduce}
                        empty="No capitalised multiword name in the current text."
                      />
                    </div>

                    <div className="mt-6 border-t border-[#262626] pt-5">
                      <GroupHead type="ORGANIZATION" count={result.orgs.length} />
                      <ChipList
                        values={result.orgs}
                        reduce={reduce}
                        empty="No phrase in the current text carries an organization word."
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
