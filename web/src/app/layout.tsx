import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ml-crime-analytics.vercel.app"),
  title: "NEXUS | Criminal Network Intelligence and Evidence Audit",
  description:
    "An explainable, human-in-the-loop platform that turns fragmented FIRs, call records and transaction data into a searchable criminal-network graph, with a tamper-evident chain of custody.",
  keywords: [
    "criminal network analysis",
    "link analysis",
    "NCRB",
    "chain of custody",
    "entity resolution",
    "graph analytics",
    "Smart India Hackathon",
  ],
  openGraph: {
    title: "NEXUS, Criminal Network Intelligence Platform",
    description:
      "Fragmented records into a searchable criminal-network graph. Every link traceable to its source. Every action hash-chained.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body>
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
