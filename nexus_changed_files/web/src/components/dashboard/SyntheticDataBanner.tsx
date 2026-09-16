"use client";

import { useState } from "react";
import { ShieldAlert, X } from "lucide-react";

/* Responsible-AI / synthetic-data disclosure, shown once per dashboard
   session. The dataset itself (manifest.json) is already marked
   synthetic: true — this just surfaces that fact where an investigator
   or judge actually sees it, instead of leaving it buried in a data file
   nobody outside the repo will open. Dismissing hides it for the
   session only; it reappears on the next full page load, which is the
   right default for a disclosure like this. */
export default function SyntheticDataBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      role="note"
      aria-label="Synthetic data disclosure"
      className="flex items-start gap-3 border-b border-[#d4d4d4] bg-[#fff7ed] px-5 py-3 md:items-center md:px-8"
    >
      <ShieldAlert
        className="mt-0.5 h-4 w-4 shrink-0 text-[#b45309] md:mt-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <p className="min-w-0 text-xs leading-relaxed text-[#78350f] md:text-sm">
        <strong className="font-semibold">Demonstration environment.</strong>{" "}
        Every person, case, phone, vehicle and relationship shown here comes from a
        synthetic dataset generated for this prototype. Nothing in NEXUS represents a
        real individual, case, or investigation. Risk scores and network roles are
        analytical signals, not findings of guilt — every result requires human
        investigator review before action.
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss disclosure"
        className="ml-auto flex h-[32px] w-[32px] shrink-0 items-center justify-center text-[#b45309] transition-colors hover:text-[#78350f]"
      >
        <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}
