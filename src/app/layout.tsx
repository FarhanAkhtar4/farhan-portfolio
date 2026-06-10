import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Farhan Akhtar Makandar — ML Systems Engineer",
  description:
    "Portfolio of Farhan Akhtar Makandar — ML Systems Engineer specializing in Agentic AI, Deep Learning, and Transformers. Building production AI systems with PyTorch, LLMs, and Multi-Agent Orchestration.",
  keywords: [
    "Farhan Akhtar Makandar",
    "ML Systems Engineer",
    "Agentic AI",
    "Deep Learning",
    "Transformers",
    "Temporal Fusion Transformer",
    "RAG",
    "PyTorch",
    "Multi-Agent",
    "Portfolio",
  ],
  authors: [{ name: "Farhan Akhtar Makandar" }],
  openGraph: {
    title: "Farhan Akhtar Makandar — ML Systems Engineer",
    description:
      "ML Systems Engineer specializing in Agentic AI, Deep Learning, and Transformers.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        style={{ background: "hsl(0 0% 2%)" }}
      >
        <div className="gradient-mesh" />
        <div className="noise-bg" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}