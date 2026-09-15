"use client";

import { Container, Section, Reveal, Eyebrow } from "@/components/ui";
import { CheckCircle, Search, User } from "lucide-react";

export default function HumanInTheLoop() {
  const steps = [
    {
      icon: Search,
      title: "Suggested Match",
      desc: "The system flags a possible connection",
    },
    {
      icon: User,
      title: "Human Review",
      desc: "An investigator reviews the original evidence",
    },
    {
      icon: CheckCircle,
      title: "Final Decision",
      desc: "The match is approved or rejected securely",
    },
  ];

  return (
    <Section className="border-t border-[#d4d4d4] bg-[#f5f5f5] py-24 md:py-32">
      <Container>
        <Reveal>
          <Eyebrow>Control</Eyebrow>
          <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight track-tighter md:text-5xl">
            Built to support investigators, not replace them.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#737373]">
            NEXUS supports investigation. It does not make the final decision. Every suggested link is reviewed and approved by an investigator before it is added to the case.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-col gap-8 md:flex-row md:items-start md:gap-4">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-1 flex-col items-center text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[1px] bg-[#d4d4d4]" />
                )}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center border border-[#d4d4d4] bg-[#fafafa] text-[#ff3d00]">
                  <step.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 font-[family-name:var(--font-jetbrains)] text-sm font-bold uppercase track-wider text-[#0a0a0a]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#737373]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
