import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatBand from "@/components/StatBand";
import Problem from "@/components/Problem";
import Pipeline from "@/components/Pipeline";
import Capabilities from "@/components/Capabilities";
import LiveExtractor from "@/components/LiveExtractor";
import GraphExplorer from "@/components/GraphExplorer";
import ChainOfCustody from "@/components/ChainOfCustody";
import Differentiation from "@/components/Differentiation";
import Responsible from "@/components/Responsible";
import Roadmap from "@/components/Roadmap";
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
        <LiveExtractor />
        <GraphExplorer />
        <ChainOfCustody />
        <Differentiation />
        <Responsible />
        <Roadmap />
      </main>
      <Footer />
    </>
  );
}
