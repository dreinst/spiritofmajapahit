import { Footer, Nav, WaFloat, type EventSite } from "@/components/Site";

// Kerangka halaman publik: navbar, isi, footer, dan tombol WhatsApp melayang.
export default function Shell({ children, cta = true, wa = true, over = false, site = "trail" }: { children: React.ReactNode; cta?: boolean; wa?: boolean; over?: boolean; site?: EventSite }) {
  return (
    <div className={`lux s-${site}`}>
      {/* Halaman statis dirender saat build, saat QRIS_STATIC_PAYLOAD belum ada, jadi cukup baca PAYMENT_MODE. */}
      <Nav testMode={!["manual", "midtrans"].includes(process.env.PAYMENT_MODE ?? "")} cta={cta} over={over} site={site} />
      <main>{children}</main>
      <Footer site={site} />
      {wa && <WaFloat />}
    </div>
  );
}

// Judul dengan animasi kata per kata; bagian bertanda {*kata*} dicetak miring.
export function Words({ text, start = 0 }: { text: string; start?: number }) {
  let i = start;
  return (
    <>
      {text.split(/(\{[^}]+\})/).filter(Boolean).flatMap((part) => {
        const it = part.startsWith("{");
        const words = (it ? part.slice(1, -1) : part).split(/(\s+)/);
        return words.map((w, k) => (/^\s+$/.test(w) ? w : <span key={`${part}${k}`} className={`kt${it ? " it" : ""}`} style={{ ["--i" as string]: i++ }}>{w}</span>));
      })}
    </>
  );
}
