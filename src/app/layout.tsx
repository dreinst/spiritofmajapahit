import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Anton, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Reveal from "@/components/Reveal";

const head = Anton({ subsets: ["latin"], weight: "400", variable: "--f-head", display: "swap" });
const body = Geist({ subsets: ["latin"], variable: "--f-body", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-mono", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--f-serif", display: "swap" });

const site = process.env.SITE_URL || "https://majapahit.dpro.events";
const desc = "Trail run di kaki Gunung Penanggungan, Minggu 27 Juni 2027 di Aone Trawas, Mojokerto. Daftar online, pilih jersey, dan tambah kamar atau merchandise dalam satu pesanan.";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Majapahit Trail Run 2027 · Aone Trawas", template: "%s · Majapahit Trail Run 2027" },
  description: desc,
  openGraph: { title: "Majapahit Trail Run 2027", description: desc, images: ["/foto/gapura-pagi.webp"], locale: "id_ID", type: "website" },
  robots: process.env.SITE_NOINDEX === "1" ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { themeColor: "#120C0A", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Nonce dari src/proxy.ts; membaca headers() juga membuat halaman dirender per permintaan, syarat CSP nonce.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="id" suppressHydrationWarning className={`${head.variable} ${body.variable} ${mono.variable} ${serif.variable}`}>
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <Reveal />
      </body>
    </html>
  );
}
