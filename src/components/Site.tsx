"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { WaIcon } from "@/components/Icon";
import { Surya } from "@/components/Brand";
import { EMAIL, mailLink, waLink } from "@/lib/kontak";
import { siteBase, SITES, type SiteKey } from "@/lib/sites";

// Menu tiap situs acara. Tautan relatif karena tiap situs punya domain sendiri dengan "/" sebagai berandanya.
const MENU: Record<Exclude<SiteKey, "payung">, { links: [string, string][]; cta: [string, string]; baris: [string, string] }> = {
  trail: { links: [["/#kategori", "Kategori"], ["/#lintasan", "Lintasan"], ["/#medali", "Medali"], ["/#addon", "Add on"], ["/#jadwal", "Jadwal"]], cta: ["/daftar", "Daftar sekarang"], baris: ["Majapahit", "Trail Run"] },
  konser: { links: [["/#tentang", "Tentang"], ["/#agenda", "Agenda"], ["/#tiket", "Tiket"], ["/#venue", "Venue"], ["/#faq", "Tanya jawab"]], cta: ["/beli", "Beli tiket"], baris: ["Konser", "Majapahit"] },
  mj: { links: [["/#tentang", "Tentang"], ["/#perjalanan", "Perjalanan"], ["/#tiket", "Tiket"], ["/#venue", "Venue"], ["/#faq", "Tanya jawab"]], cta: ["/beli", "Beli tiket"], baris: ["Musical", "Journey"] },
};
export type EventSite = keyof typeof MENU;

// Pita rangkaian di atas semua situs supaya keempatnya terasa satu kesatuan.
export function Rangkaian({ site }: { site: SiteKey }) {
  return (
    <nav className="rangkaian" aria-label="Rangkaian The Spirit of Majapahit">
      <span className="eb">The Spirit of Majapahit</span>
      {(["payung", "trail", "konser", "mj"] as SiteKey[]).map((k) => <a key={k} href={siteBase(k)} className={k === site ? "on" : ""}>{SITES[k].singkat}</a>)}
    </nav>
  );
}

export function Logo({ site = "trail" }: { site?: EventSite }) {
  const [a, b] = MENU[site].baris;
  return (
    <Link href="/" className="brand" aria-label={`Beranda ${SITES[site].nama}`}>
      <span style={{ color: "var(--prada)", ["--surya-dalam" as string]: "var(--malam)" }}><Surya size={34} /></span>
      <b>{a}<br />{b}<small>Aone Trawas 2027</small></b>
    </Link>
  );
}

// over: navbar transparan di atas hero beranda, berubah gelap setelah digulir.
export function Nav({ testMode, cta = true, over = false, site = "trail" }: { testMode?: boolean; cta?: boolean; over?: boolean; site?: EventSite }) {
  const LINKS = MENU[site].links, [ctaHref, ctaLabel] = MENU[site].cta;
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    if (!over) return;
    const f = () => setSolid(window.scrollY > 60);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, [over]);
  return (
    <>
      {testMode && <div className="testbar">Mode uji: {site === "trail" ? "kategori" : "kelas tiket"}, harga, dan kuota masih contoh, pembayaran masih simulasi</div>}
      <Rangkaian site={site} />
      <header className={`nav${over ? " over" : ""}${solid ? " solid" : ""}`}>
        <Logo site={site} />
        <nav className="l" aria-label="Menu utama">{LINKS.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}</nav>
        <div className="r">
          <Link href="/cek-tiket" className={`lnk${path.startsWith("/cek-tiket") ? " on" : ""}`}>Cek tiket</Link>
          {cta && <Link href={ctaHref} className="btn r sm">{ctaLabel}</Link>}
          <button className="burger" aria-label="Buka menu" onClick={() => setOpen(true)}><Icon name="menu" size={24} /></button>
        </div>
      </header>
      {open && (
        <div className="drawer" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <button aria-label="Tutup menu" onClick={() => setOpen(false)} style={{ alignSelf: "flex-end", padding: 8 }}><Icon name="x" size={22} /></button>
            {[["/", "Beranda"] as [string, string], ...LINKS, ["/cek-tiket", "Cek tiket"] as [string, string]].map(([h, l]) => (
              <Link key={h} href={h} onClick={() => setOpen(false)}>{l}</Link>
            ))}
            <Link href={ctaHref} className="btn r lg" style={{ marginTop: 16 }} onClick={() => setOpen(false)}>{ctaLabel}</Link>
            <p className="eb" style={{ marginTop: 18 }}>Rangkaian</p>
            {(["payung", "trail", "konser", "mj"] as SiteKey[]).filter((k) => k !== site).map((k) => <a key={k} href={siteBase(k)}>{SITES[k].nama}</a>)}
            <a href={waLink()} target="_blank" rel="noopener" className="btn wa lg" style={{ marginTop: 8 }}><WaIcon />Tanya panitia</a>
          </div>
        </div>
      )}
    </>
  );
}

export function WaFloat() {
  return <a className="wa-float" href={waLink()} target="_blank" rel="noopener" aria-label="Tanya panitia lewat WhatsApp"><WaIcon size={20} /><span>Tanya panitia</span></a>;
}

export function Footer({ site = "trail" }: { site?: EventSite }) {
  const [a, b] = MENU[site].baris, S = SITES[site], [ctaHref, ctaLabel] = MENU[site].cta;
  return (
    <footer className="foot">
      <div className="top">
        <div>
          <p className="big">{a}<br />{b} <span className="it pr">2027</span></p>
          <p style={{ marginTop: 14, maxWidth: 360 }}>{S.tanggal} di {S.venue}, kaki Gunung Penanggungan, Mojokerto. Bagian dari rangkaian The Spirit of Majapahit.</p>
        </div>
        <div><h4>Rangkaian</h4>{(["payung", "trail", "konser", "mj"] as SiteKey[]).map((k) => <a key={k} href={siteBase(k)}>{SITES[k].nama}</a>)}</div>
        <div><h4>{site === "trail" ? "Peserta" : "Pengunjung"}</h4><Link href={ctaHref}>{ctaLabel}</Link><Link href="/cek-tiket">Cek tiket</Link><Link href="/#faq">Tanya jawab</Link></div>
        <div><h4>Kontak</h4><a href={waLink()} target="_blank" rel="noopener" className="ic"><WaIcon size={16} />WhatsApp</a><a href={mailLink()} title={EMAIL}>{EMAIL}</a></div>
      </div>
      <div className="bot">
        <span>© 2027 {S.nama} · The Spirit of Majapahit</span>
        <span className="credit">
          <span>Made by <a href="https://www.instagram.com/dreiinst/" target="_blank" rel="noopener noreferrer">dreinst</a></span>
          <i aria-hidden="true" />
          <span className="ic" style={{ gap: 8 }}>Organized by <img src="/brand/logo-dpro-ringkas.svg?v=2" alt="D'PRO" width={79} height={16} /></span>
        </span>
      </div>
      <p className="aset">
        Visual gapura dari model 3D buatan sendiri, memakai aset berlisensi CC BY:{" "}
        <a href="https://sketchfab.com/3d-models/arca-dwarapala-fe8803efbc0043d7bc3114387c4c1545" target="_blank" rel="noopener noreferrer">Arca Dwarapala oleh pixforge.id</a> dan{" "}
        <a href="https://sketchfab.com/3d-models/suryamajapahitlow-810542c2619a4bdeb65b54b78e2c249d" target="_blank" rel="noopener noreferrer">Suryamajapahitlow oleh jokodirgantara</a>{" "}
        (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>), serta pohon jacaranda dari Poly Haven (CC0).
      </p>
    </footer>
  );
}

export function Stepper({ step, first = "PELARI" }: { step: number; first?: string }) {
  const labels = [`1. ${first}`, "2. ADD ON", "3. BAYAR"];
  return <div className="stepper">{labels.map((l, i) => <div key={l} className={i + 1 < step ? "d" : i + 1 === step ? "o" : ""}><i /><p>{l}</p></div>)}</div>;
}
