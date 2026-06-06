import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

/* --- Fonts --- */
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/* --- Viewport --- */
export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

/* --- Metadata --- */
export const metadata: Metadata = {
  title: "THE NEURAL DOSSIER — Farhan Akhtar Makandar",
  description:
    "Classified Intelligence Portfolio — AI Systems Engineer & Deep Learning Specialist. Temporal Fusion Transformers, Agentic AI, Multi-Agent Orchestration.",
  keywords: [
    "Farhan Akhtar Makandar",
    "THE NEURAL DOSSIER",
    "AI Systems Engineer",
    "Deep Learning Specialist",
    "Temporal Fusion Transformer",
    "Agentic AI",
    "PyTorch",
    "RAG",
    "Multi-Agent",
  ],
  authors: [{ name: "Farhan Akhtar Makandar" }],
  openGraph: {
    title: "THE NEURAL DOSSIER — Farhan Akhtar Makandar",
    description:
      "Classified Intelligence Portfolio — AI Systems Engineer specializing in Deep Learning, Transformers, and Agentic AI.",
    type: "website",
    locale: "en_US",
  },
};

/* --- Root Layout --- */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${ibmPlexMono.variable} ${inter.variable} antialiased`}
        style={{
          fontFamily: "var(--font-mono), var(--font-body), monospace",
          background: "#0A0A0A",
          color: "#c8d6d0",
          overflowY: "auto",
        }}
      >
        {children}
      </body>
    </html>
  );
}
