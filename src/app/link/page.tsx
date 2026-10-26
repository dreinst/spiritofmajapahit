import Image from "next/image";
import Icon, { WaIcon } from "@/components/Icon";
import { Surya } from "@/components/Brand";
import Kelopak from "@/components/Kelopak";
import { siteBase, SITES } from "@/lib/sites";
import { WA_TAMPIL, waLink } from "@/lib/kontak";

// Satu halaman tautan untuk bio media sosial: semua situs dan tindakan utama The Spirit of Majapahit dalam satu kolom.
export const metadata = { title: { absolute: "The Spirit of Majapahit · Semua tautan" }, description: "Pendaftaran Majapahit Trail Run, tiket Konser Majapahit, Musical Journey, medali lipat, dan cek e-ticket dalam satu halaman." };

export default function Tautan() {
  const t = siteBase("trail"), k = siteBase("konser"), m = siteBase("mj"), p = siteBase("payung");
  const utama: [string, string, string, string][] = [
    [`${t}/daftar`, "Daftar Majapahit Trail Run", SITES.trail.tanggal, "r"],
    [`${k}/beli`, "Beli tiket Konser Majapahit", SITES.konser.tanggal, ""],
  ];
  const lain: [string, string, string][] = [
    [t, "Situs Majapahit Trail Run", "Kategori, lintasan, jersey, add on"],
    [`${t}/medali`, "Medali lipat", "Medali yang berubah jadi miniatur candi"],
    [k, "Konser Majapahit", "Malam gala dan pesta rakyat"],
    [m, "Musical Journey", SITES.mj.tanggal],
    [p, "Jelajahi beranda 3D", "Gerbang Majapahit di bawah bulan merah"],
    [`${t}/cek-tiket`, "Cek e-ticket", "Kirim ulang tautan tiket ke email"],
  ];
  return (
    <div className="lux lk">
      <main className="lk-in">
        <section className="lk-sampul">
          <Image src="/spirit/aset/generated/kage-approach.webp?v=4" alt="Ilustrasi candi bentar pada malam hari" fill priority sizes="(max-width: 600px) 100vw, 560px" className="bg" />
          <Kelopak n={9} />
          <div className="lk-sampul-in">
            <span style={{ color: "#E59A82", ["--surya-dalam" as string]: "#221A1F" }}><Surya size={40} /></span>
            <h1>The Spirit of <span className="it">Majapahit</span></h1>
            <p>Aone Trawas, kaki Gunung Penanggungan · 2027</p>
          </div>
        </section>
        <div className="lk-list">
          {utama.map(([href, a, b, c]) => (
            <a key={href} href={href} className={`lk-btn utama ${c}`}><span><b>{a}</b><small>{b}</small></span><Icon name="arrow" size={18} /></a>
          ))}
          {lain.map(([href, a, b]) => (
            <a key={href} href={href} className="lk-btn"><span><b>{a}</b><small>{b}</small></span><Icon name="arrow" size={16} /></a>
          ))}
          <div className="lk-warisan">
            <p className="eb">Warisan Majapahit</p>
            <div>{[["candi-bentar", "Candi Bentar"], ["kala", "Kala"], ["pendopo", "Pendopo"]].map(([s, n]) => <a key={s} href={`${p}/gapura/${s}`} className="pill g">{n}</a>)}</div>
          </div>
          <a href={waLink("Halo panitia The Spirit of Majapahit, saya ingin bertanya.")} target="_blank" rel="noopener" className="lk-btn wa"><span><b>Tanya panitia lewat WhatsApp</b><small>{WA_TAMPIL}</small></span><WaIcon /></a>
        </div>
        <p className="lk-kaki">© 2027 The Spirit of Majapahit · Organized by D&apos;PRO · <a href={`${p}/sumber-aset`}>Sumber aset</a></p>
      </main>
    </div>
  );
}
