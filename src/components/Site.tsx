"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { WaIcon } from "@/components/Icon";
import { Surya } from "@/components/Brand";
import { EMAIL, mailLink, waLink } from "@/lib/kontak";

const LINKS: [string, string][] = [["/#kategori", "Kategori"], ["/#lintasan", "Lintasan"], ["/#medali", "Medali"], ["/#addon", "Add on"], ["/#jadwal", "Jadwal"]];

export function Logo() {
  return (
    <Link href="/" className="brand" aria-label="Beranda Majapahit Trail Run 2027">
      <span style={{ color: "var(--prada)", ["--surya-dalam" as string]: "var(--malam)" }}><Surya size={34} /></span>
      <b>Majapahit<br />Trail Run<small>Aone Trawas 2027</small></b>
    </Link>
  );
}

// over: navbar transparan di atas hero beranda, berubah gelap setelah digulir.
export function Nav({ testMode, cta = true, over = false }: { testMode?: boolean; cta?: boolean; over?: boolean }) {
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
      {testMode && <div className="testbar">Mode uji: kategori, harga, dan kuota masih contoh, pembayaran masih simulasi</div>}
      <header className={`nav${over ? " over" : ""}${solid ? " solid" : ""}`}>
        <Logo />
        <nav className="l" aria-label="Menu utama">{LINKS.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}</nav>
        <div className="r">
          <Link href="/cek-tiket" className={`lnk${path.startsWith("/cek-tiket") ? " on" : ""}`}>Cek tiket</Link>
          {cta && <Link href="/daftar" className="btn r sm">Daftar sekarang</Link>}
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
            <Link href="/daftar" className="btn r lg" style={{ marginTop: 16 }} onClick={() => setOpen(false)}>Daftar sekarang</Link>
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

export function Footer() {
  return (
    <footer className="foot">
      <div className="top">
        <div>
          <p className="big">Majapahit<br />Trail Run <span className="it pr">2027</span></p>
          <p style={{ marginTop: 14, maxWidth: 360 }}>Minggu, 27 Juni 2027 di Aone Trawas, kaki Gunung Penanggungan, Mojokerto. Bagian dari rangkaian The Spirit of Majapahit.</p>
        </div>
        <div><h4>Acara</h4>{LINKS.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}</div>
        <div><h4>Peserta</h4><Link href="/daftar">Daftar</Link><Link href="/cek-tiket">Cek tiket</Link><Link href="/#faq">Tanya jawab</Link></div>
        <div><h4>Kontak</h4><a href={waLink()} target="_blank" rel="noopener" className="ic"><WaIcon size={16} />WhatsApp</a><a href={mailLink()} title={EMAIL}>{EMAIL}</a></div>
      </div>
      <div className="bot">
        <span>© 2027 Majapahit Trail Run</span>
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

export function Stepper({ step }: { step: number }) {
  const labels = ["1. PELARI", "2. ADD ON", "3. BAYAR"];
  return <div className="stepper">{labels.map((l, i) => <div key={l} className={i + 1 < step ? "d" : i + 1 === step ? "o" : ""}><i /><p>{l}</p></div>)}</div>;
}
