import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatBand from "@/components/StatBand";
import Problem from "@/components/Problem";
import Pipeline from "@/components/Pipeline";
import Capabilities from "@/components/Capabilities";
import CapabilityShowcases from "@/components/CapabilityShowcases";
import HumanInTheLoop from "@/components/HumanInTheLoop";
import Differentiation from "@/components/Differentiation";
import Responsible from "@/components/Responsible";
import Roadmap from "@/components/Roadmap";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StatBand />
        <Problem />
        <Pipeline />
        <Capabilities />
        <CapabilityShowcases />
        <HumanInTheLoop />
        <Differentiation />
        <Responsible />
        <Roadmap />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
