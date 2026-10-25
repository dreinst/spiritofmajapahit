import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import Ket from "@/components/Ket";
import Payung from "@/components/Payung";
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
    <Payung>
      <section className="gp-hero">
        <Image src={e.gambar} alt={`Ilustrasi ${e.nama.toLowerCase()}`} fill priority sizes="100vw" style={e.fokus ? { objectPosition: e.fokus } : undefined} />
        <Ket src={e.gambar} className="pojok" />
        <div className="gp-hero-in">
          <p className="eb">Warisan Majapahit · {e.sebutan}</p>
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
          {e.gambar2 && <figure><Image src={e.gambar2} alt={`Ilustrasi ${e.nama.toLowerCase()} dari sudut lain`} width={1200} height={900} className="gp-img2" sizes="(max-width: 900px) 100vw, 40vw" /><Ket src={e.gambar2} /></figure>}
          <div className="gp-kartu">
            <p className="eb">Lihat juga</p>
            {lain.map((x) => <Link key={x.slug} href={`/gapura/${x.slug}`} className="gp-link"><Image src={x.gambar} alt="" width={144} height={108} /><span><b>{x.nama}</b><small>{x.sebutan}</small></span><Icon name="arrow" size={16} /></Link>)}
          </div>
          <div className="gp-kartu">
            <p className="eb">Rangkaian 2027</p>
            {(["trail", "konser", "mj"] as const).map((k) => <a key={k} href={siteBase(k)} className="gp-link"><span><b>{SITES[k].nama}</b><small>{SITES[k].tanggal}</small></span><Icon name="arrow" size={16} /></a>)}
          </div>
        </aside>
      </div>
    </Payung>
  );
}
