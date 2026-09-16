import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Mono,
  Instrument_Sans,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import { AdvisorDock } from "@/components/layout/AdvisorDock";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { Preloader } from "@/components/layout/Preloader";
import { RouteCurtain } from "@/components/layout/RouteCurtain";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { LenisProvider } from "@/components/providers/LenisProvider";

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VAULT — Private Residences | A Square Devs",
    template: "%s | A Square Devs",
  },
  description:
    "VAULT — 34 private residences by A Square Devs in Sector 58, Gurugram. Two, three and four bedroom homes, plus four penthouses, shaped around light and space.",
  keywords: [
    "VAULT Gurugram",
    "A Square Devs",
    "luxury residences Sector 58",
    "private residences Gurugram",
    "Golf Course Road apartments",
  ],
  openGraph: {
    title: "VAULT — Private Residences | A Square Devs",
    description:
      "34 private residences in Sector 58, Gurugram. Built around light, space and the way you live.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable} antialiased`}
    >
      <body className="min-h-dvh bg-paper text-text">
        {/* Anchor for the footer's “back to top” on every route. */}
        <LenisProvider>
          <span id="top" aria-hidden className="sr-only" />
          <Preloader />
          <RouteCurtain />
          <SiteNav />
          <main id="main">{children}</main>
          <SiteFooter />
          <MobileCtaBar />
          <AdvisorDock />
        </LenisProvider>
      </body>
    </html>
  );
}
