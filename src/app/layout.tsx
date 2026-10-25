import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Anton, Bodoni_Moda, Geist, Geist_Mono, Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Reveal from "@/components/Reveal";

const head = Anton({ subsets: ["latin"], weight: "400", variable: "--f-head", display: "swap", preload: false });
const body = Geist({ subsets: ["latin"], variable: "--f-body", display: "swap", preload: false });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-mono", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--f-serif", display: "swap", preload: false });
// Situs publik (kelas .lux): Bodoni Moda untuk judul besar, Plus Jakarta Sans untuk teks. Panel panitia tetap memakai Anton dan Geist.
const disp = Bodoni_Moda({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-disp", display: "swap" });
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--f-sans", display: "swap" });

const site = process.env.SITE_URL || "https://majapahit.dpro.events";
const desc = "Trail run di kaki Gunung Penanggungan, Minggu 27 Juni 2027 di Aone Trawas, Mojokerto. Pendaftaran, pilihan jersey, kamar, dan merchandise ada dalam satu pesanan.";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Majapahit Trail Run 2027 · Aone Trawas", template: "%s · Majapahit Trail Run 2027" },
  description: desc,
  openGraph: { title: "Majapahit Trail Run 2027", description: desc, images: ["/foto/gapura-pagi-2.webp"], locale: "id_ID", type: "website" },
  robots: process.env.SITE_NOINDEX === "1" ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { themeColor: "#0D0B0A", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Nonce dari src/proxy.ts; membaca headers() juga membuat halaman dirender per permintaan, syarat CSP nonce.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="id" suppressHydrationWarning className={`${head.variable} ${body.variable} ${mono.variable} ${serif.variable} ${disp.variable} ${sans.variable}`}>
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
