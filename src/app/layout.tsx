import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

/* --- Font --- */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* --- Viewport --- */
export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/* --- Metadata --- */
export const metadata: Metadata = {
  title: "FARHAN AI MATRIX TERMINAL",
  description:
    "FARHAN AI MATRIX TERMINAL — AI Research Mainframe. Portfolio of Farhan Akhtar Makandar — ML Systems Engineer specializing in Agentic AI, Deep Learning, and Transformers.",
  keywords: [
    "Farhan Akhtar Makandar",
    "FARHAN AI MATRIX TERMINAL",
    "ML Systems Engineer",
    "Agentic AI",
    "Deep Learning",
    "Transformers",
    "RAG",
    "PyTorch",
    "Terminal Portfolio",
  ],
  authors: [{ name: "Farhan Akhtar Makandar" }],
  openGraph: {
    title: "FARHAN AI MATRIX TERMINAL",
    description:
      "AI Research Mainframe — Building ML systems, agentic AI workflows, and transformer-based predictive models.",
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
      <body className={`${geistMono.variable} main-canvas-root`} style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
        {children}
      </body>
    </html>
  );
}
