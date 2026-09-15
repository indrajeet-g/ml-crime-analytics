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

export default function Hero() {
  return (
    <section
      id="top"
      className="relative -mt-16 flex min-h-[100dvh] items-center overflow-hidden pt-24 pb-16 md:pb-20 bg-[#0a0a0a] text-white"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[7fr_5fr] lg:gap-12">
          <Reveal className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-[family-name:var(--font-jetbrains)] text-[13px] font-bold track-tight text-white">
                NEXUS
              </span>
              <span aria-hidden="true" className="h-3 w-px bg-[#333333]" />
              <Label>Smart India Hackathon 2026 / PS 26189 / NCRB</Label>
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl font-semibold leading-[1.05] track-tighter md:mt-8 md:text-6xl lg:text-7xl">
              <span className="block">Disconnected records.</span>
              <span className="block text-[#ff3d00]">One clear network.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#a3a3a3] md:mt-7 md:text-lg">
              <span className="text-white">NEXUS</span> helps investigators find hidden links across FIRs, call records, and transactions. Every match is reviewed and confirmed by an investigator before it is used.
            </p>

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

          <Reveal className="min-w-0" delay={0.12}>
            <HeroGraph />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
