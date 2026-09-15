import { ArrowRight } from "lucide-react";
import Link from "next/link";

import {
  Container,
  Label,
  OutlineLink,
  PrimaryLink,
  Reveal,
} from "@/components/ui";
import HeroGraph from "@/components/HeroGraph";

/* Asymmetric split: 7 parts type, 5 parts graph at lg, stacking to a
   single column below it. The text stack is deliberately four elements
   and nothing else: wordmark line, headline, one sentence, two links.

   The negative top margin pulls the hero under the sticky 64px nav so
   the section still measures exactly one viewport. Top padding stays
   larger than the nav, so no line ever sits behind it. */


export default function Hero() {
  return (
    <section
      id="top"
      className="relative -mt-16 flex min-h-[100dvh] items-center overflow-hidden pt-24 pb-16 md:pb-20"
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[7fr_5fr] lg:gap-12">
          <Reveal className="min-w-0">
            {/* 1. Wordmark plus the one eyebrow this section is allowed. */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-[family-name:var(--font-jetbrains)] text-[13px] font-bold track-tight text-[#0a0a0a]">
                NEXUS
              </span>
              <span aria-hidden="true" className="h-3 w-px bg-[#d4d4d4]" />
              <Label>Smart India Hackathon 2026 / PS 26189 / NCRB</Label>
            </div>

            {/* 2. Headline. Two lines at every breakpoint, one accent move. */}
            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] track-tighter md:mt-8 md:text-6xl lg:text-7xl">
              <span className="block">Fragmented records.</span>
              <span className="block text-[#ff3d00]">One network.</span>
            </h1>

            {/* 3. What it does, and who stays in charge of it. */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#737373] md:mt-7 md:text-lg">
              <span className="text-[#0a0a0a]">NEXUS</span> surfaces hidden
              connections across FIRs, call records and transactions. Each one
              stays a proposal until an investigator confirms it.
            </p>

            {/* 4. One way in, one way to check the work. */}
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-10">
              <PrimaryLink href="/login">
                  Enter Dashboard
                  <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                </PrimaryLink>
              <OutlineLink href="#pipeline">
                See how it works ↓
              </OutlineLink>
            </div>
          </Reveal>

          {/* The graph column carries its own responsive height, short on
              mobile where it sits under the type. */}
          <Reveal className="min-w-0" delay={0.12}>
            <HeroGraph />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
