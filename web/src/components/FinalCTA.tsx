"use client";

import Link from "next/link";
import { Container, Section, Reveal } from "@/components/ui";

export default function FinalCTA() {
  return (
    <Section className="border-t border-[#d4d4d4] bg-[#fafafa] py-32 md:py-48">
      <Container>
        <Reveal className="flex flex-col items-center text-center">
          <h2 className="max-w-4xl text-4xl sm:text-5xl font-semibold leading-[1.05] track-tighter md:text-6xl lg:text-7xl">
            The evidence already exists.<br />
            <span className="text-[#ff3d00]">NEXUS connects it.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#737373]">
            Start finding hidden links, tracking connections, and building solid evidence today.
          </p>
          <div className="mt-12">
            <Link
              href="/login"
              className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-[#ff3d00] px-8 font-[family-name:var(--font-jetbrains)] text-[14px] font-bold uppercase track-wider text-[#fafafa] transition-colors duration-200 hover:bg-[#0a0a0a]"
            >
              Enter Dashboard
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
