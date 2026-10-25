import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { Surya } from "@/components/Brand";
import { Rangkaian } from "@/components/Site";
import { ELEMEN, elemen } from "@/lib/gapura";
import { siteBase, SITES } from "@/lib/sites";

export function generateStaticParams() { return ELEMEN.map((e) => ({ slug: e.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const e = elemen((await params).slug);
  return e ? { title: { absolute: `${e.nama} · The Spirit of Majapahit` }, description: e.ringkas } : {};
}

// Halaman deskripsi elemen galeri beranda 3D (candi bentar, kala, pendopo) di situs payung.
export default async function Gapura({ params }: { params: Promise<{ slug: string }> }) {
  const e = elemen((await params).slug);
  if (!e) notFound();
  const lain = ELEMEN.filter((x) => x.slug !== e.slug);
  return (
    <div className="gp">
      <Rangkaian site="payung" />
      <header className="gp-nav">
        <a href="/" className="brand"><span style={{ color: "var(--prada)", ["--surya-dalam" as string]: "var(--malam)" }}><Surya size={30} /></span><b>The Spirit<br />of Majapahit</b></a>
        <a href="/#pathways" className="btn g sm"><Icon name="back" size={16} />Kembali ke galeri</a>
      </header>
      <main>
        <section className="gp-hero">
          <img src={e.gambar} alt={`${e.nama} pada model 3D The Spirit of Majapahit`} />
          <div className="gp-hero-in">
            <p className="eb">Galeri · {e.sebutan}</p>
            <h1>{e.nama}</h1>
            <p className="lead">{e.ringkas}</p>
          </div>
        </section>
        <div className="gp-fakta">{e.fakta.map(([b, l]) => <div key={l}><b>{b}</b><span>{l}</span></div>)}</div>
        <div className="gp-isi">
          <article>
            {e.bagian.map((b) => (
              <section key={b.judul} data-rv>
                <h2>{b.judul}</h2>
                {b.isi.map((t) => <p key={t}>{t}</p>)}
              </section>
            ))}
            <section className="gp-sumber">
              <h2>Sumber</h2>
              <ul>{e.sumber.map(([l, u]) => <li key={l}>{u ? <a href={u} target="_blank" rel="noopener noreferrer">{l}</a> : l}</li>)}</ul>
            </section>
          </article>
          <aside>
            {e.gambar2 && <img src={e.gambar2} alt={`${e.nama}, sudut lain`} className="gp-img2" />}
            <div className="gp-kartu">
              <p className="eb">Lihat juga</p>
              {lain.map((x) => <Link key={x.slug} href={`/gapura/${x.slug}`} className="gp-link"><img src={x.gambar} alt="" /><span><b>{x.nama}</b><small>{x.sebutan}</small></span><Icon name="arrow" size={16} /></Link>)}
            </div>
            <div className="gp-kartu">
              <p className="eb">Rangkaian 2027</p>
              {(["trail", "konser", "mj"] as const).map((k) => <a key={k} href={siteBase(k)} className="gp-link"><span><b>{SITES[k].nama}</b><small>{SITES[k].tanggal}</small></span><Icon name="arrow" size={16} /></a>)}
            </div>
          </aside>
        </div>
      </main>
      <footer className="gp-foot">
        <span>© 2027 The Spirit of Majapahit · Made by dreinst · Organized by D&apos;PRO</span>
        <span>Model 3D memakai <a href="https://sketchfab.com/3d-models/arca-dwarapala-fe8803efbc0043d7bc3114387c4c1545" target="_blank" rel="noopener noreferrer">Arca Dwarapala oleh pixforge.id</a> dan <a href="https://sketchfab.com/3d-models/suryamajapahitlow-810542c2619a4bdeb65b54b78e2c249d" target="_blank" rel="noopener noreferrer">Suryamajapahitlow oleh jokodirgantara</a> (CC BY 4.0).</span>
      </footer>
    </div>
  );
}
