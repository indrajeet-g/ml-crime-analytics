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
  title: "NEXUS | Investigation and Evidence Platform",
  description:
    "A platform that helps investigators connect information from FIRs, call records, and transactions in one place, while keeping a secure record of where every piece of evidence came from.",
  keywords: [
    "investigation software",
    "police",
    "NCRB",
    "evidence tracking",
    "record matching",
    "Smart India Hackathon",
  ],
  openGraph: {
    title: "NEXUS | Investigation and Evidence Platform",
    description:
      "Bring information from different records together. Find connections across cases. Know exactly where every piece of evidence came from.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body className="overflow-x-hidden antialiased">
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
