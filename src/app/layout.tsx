import type { Metadata, Viewport } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

/* --- Fonts --- */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* --- Viewport --- */
export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
};

/* --- Metadata --- */
export const metadata: Metadata = {
  title: "Farhan Akhtar Makandar | ML Systems Engineer",
  description:
    "Portfolio of Farhan Akhtar Makandar — AI/ML Engineer specializing in Agentic AI, Deep Learning, and Transformers",
  keywords: [
    "Farhan Akhtar Makandar",
    "ML Systems Engineer",
    "Agentic AI",
    "Deep Learning",
    "Generative AI",
    "RAG",
    "PyTorch",
    "Transformers",
    "LLM",
    "Temporal Fusion Transformer",
    "Machine Learning",
    "Portfolio",
  ],
  authors: [{ name: "Farhan Akhtar Makandar" }],
  openGraph: {
    title: "Farhan Akhtar Makandar | ML Systems Engineer",
    description:
      "Building ML systems, agentic AI workflows, and transformer-based predictive models. 22% improvement over XGBoost with Temporal Fusion Transformers.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Farhan Akhtar Makandar | ML Systems Engineer",
    description:
      "ML Systems Engineer — Agentic AI, Deep Learning, Transformers, RAG pipelines.",
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
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-[#030712] text-foreground font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
