import Link from "next/link";
import Image from "next/image";
import Icon, { WaIcon } from "@/components/Icon";
import Hitung from "@/components/Hitung";
import Shell from "@/components/Shell";
import AddOn from "@/components/AddOn";
import Ket from "@/components/Ket";
import { rupiah } from "@/lib/format";
import { checkInAcara, getSettings, pilihanAcara, terpakai } from "@/lib/settings";
import { siteBase, SITES } from "@/lib/sites";
import { WA_TAMPIL, waLink } from "@/lib/kontak";

export type Konten = {
  event: "konser" | "mj";
  judul: [string, string];
  lead: string;
  gambar: string;
  hariH?: string;
  hitungLabel?: string;
  tentangJudul: [string, string];
  tentang: string[];
  catatan?: string;
  agendaId: string;
  agendaJudul: [string, string];
  agenda: [string, string, string][];
  penampil: string;
  faq: [string, string][];
};

// Kerangka situs acara selain trail run (Konser Majapahit, Musical Journey): isi dari halaman masing-masing,
// kelas tiket dan add on dari pengaturan panel.
export default async function AcaraLain({ k }: { k: Konten }) {
  const [s, used] = await Promise.all([getSettings(), terpakai()]);
  const S = SITES[k.event];
  const tiket = pilihanAcara(s, k.event);
  const [aj1, ...aj2] = k.agendaJudul[1].split(" ");
  return (
    <Shell site={k.event}>
      <section className="lhero">
        <Image src={k.gambar} alt="" fill priority sizes="100vw" className="bg" />
        <Ket src={k.gambar} className="pojok" />
        <div className="isi">
          <p className="eb">The Spirit of Majapahit · {S.tanggal}</p>
          <h1 style={{ marginTop: 22 }}>{k.judul[0]} <span className="it">{k.judul[1]}</span></h1>
          <p className="lead">{k.lead}</p>
          <div className="cta"><Link href="/beli" className="btn r lg">Beli tiket <Icon name="arrow" size={18} /></Link><Link href={`#${k.agendaId}`} className="btn g lg">Lihat {k.agendaJudul[0].toLowerCase()}</Link></div>
          <div className="lstat">
            <div><p className="eb">Tanggal</p><b>{S.tanggal.replace(/^[^,]+, /, "")}</b></div>
            <div><p className="eb">Venue</p><b>{S.venue}</b></div>
            <div><p className="eb">Penampil</p><b>{k.penampil}</b></div>
            {k.hariH ? <div className="hit"><p className="eb">{k.hitungLabel}</p><Hitung to={k.hariH} /></div> : <div><p className="eb">Tiket</p><b>{tiket.length} kelas</b></div>}
          </div>
        </div>
      </section>

      <section className="sec" id="tentang">
        <div className="kat-head" data-rv>
          <div><p className="eb">Tentang</p><h2 style={{ marginTop: 18 }}>{k.tentangJudul[0]} <span className="it">{k.tentangJudul[1]}</span></h2></div>
          <div>{k.tentang.map((t) => <p key={t} className="d" style={{ marginTop: 12 }}>{t}</p>)}</div>
        </div>
        {k.catatan && <p className="note" style={{ marginTop: 32, maxWidth: 760 }}>{k.catatan}</p>}
      </section>

      <section className="sec" id={k.agendaId} style={{ paddingTop: 0 }}>
        <div data-rv><p className="eb">{k.agendaJudul[0]}</p><h2 style={{ marginTop: 18 }}>{aj1} <span className="it">{aj2.join(" ")}</span></h2></div>
        <div className="steps" style={{ gridTemplateColumns: `repeat(${Math.min(4, k.agenda.length)},minmax(0,1fr))` }}>
          {k.agenda.map(([waktu, judul, ket], i) => <div key={judul} className="step" data-rv style={{ ["--d" as string]: i }}><b>0{i + 1}</b><div><p className="eb">{waktu}</p><h3 style={{ marginTop: 10 }}>{judul}</h3><p className="muted" style={{ marginTop: 8 }}>{ket}</p></div></div>)}
        </div>
        <div className="penampil" data-rv>
          {[1, 2, 3, 4].map((i) => <div key={i}><span>0{i}</span><b>Penampil {i}</b><small>{k.penampil}</small></div>)}
        </div>
      </section>

      <section className="sec" id="tiket" style={{ paddingTop: 0 }}>
        <div className="kat-head" data-rv>
          <div><p className="eb">Tiket</p><h2 style={{ marginTop: 18 }}>Pilih <span className="it">kelas tiket.</span></h2></div>
          <p className="d">Kuota tiap kelas terbatas, dan sisa di bawah mengikuti jumlah pemesan. Satu pesanan bisa untuk beberapa orang, e-ticket dikirim per orang.</p>
        </div>
        <div className="kat">
          {tiket.map((t, i) => {
            const sisa = Math.max(0, t.kuota - (used[t.id] ?? 0));
            return (
              <article key={t.id} className="kcard tk" data-rv style={{ ["--d" as string]: i }}>
                <div className="between" style={{ alignItems: "center" }}><h3>{t.nama}</h3><span className="pill p">{sisa > 0 ? `Sisa ${sisa.toLocaleString("id-ID")}` : "Habis"}</span></div>
                <p className="muted" style={{ marginTop: 16, fontSize: 15, maxWidth: 320 }}>{t.ket}</p>
                <div className="harga" style={{ marginTop: "auto" }}><b>{rupiah(t.harga)}</b>{sisa > 0 ? <Link href={`/beli?k=${t.id}`} className="btn w sm">Pilih <Icon name="arrow" size={15} /></Link> : <span className="pill g">Habis</span>}</div>
              </article>
            );
          })}
        </div>
      </section>

      <AddOn s={s} checkIn={checkInAcara(s, k.event)} cta={["/beli", "Pesan bersama tiket"]} lead="Aone Trawas ada di kaki Gunung Penanggungan, Mojokerto. Kamar dan merchandise ditambahkan saat membeli tiket dan dibayar dalam satu tagihan." />

      <section className="sec">
        <div data-rv><p className="eb">Rangkaian</p><h2 style={{ marginTop: 18 }}>Satu semangat, <span className="it">tiga acara.</span></h2></div>
        <div className="rgrid">
          {(["trail", "konser", "mj"] as const).map((e) => (
            <a key={e} href={siteBase(e)} className={`rcard${e === k.event ? " on" : ""}`} data-rv>
              <p className="eb">{SITES[e].tanggal}</p><h3>{SITES[e].nama}</h3><p className="muted small">{SITES[e].ket}</p>
              <span className="lnk">{e === k.event ? "Anda di sini" : "Kunjungi situs"} <Icon name="arrow" size={14} /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="sec" id="faq" style={{ maxWidth: 1040, paddingTop: 0 }}>
        <div data-rv><p className="eb">Tanya jawab</p><h2 style={{ marginTop: 18 }}>Yang sering <span className="it">ditanyakan.</span></h2></div>
        <div style={{ marginTop: 32 }}>{k.faq.map(([q, a]) => <details key={q} className="faq"><summary><span>{q}</span><span>+</span></summary><p>{a}</p></details>)}</div>
        <a href={waLink(`Halo panitia ${S.nama}, saya ingin bertanya.`)} target="_blank" rel="noopener" className="btn wa" style={{ marginTop: 32 }}><WaIcon />Tanya lewat WhatsApp {WA_TAMPIL}</a>
      </section>

      <section className="final">
        <p className="eb rel">{S.tanggal} · {S.venue}</p>
        <h2 data-rv style={{ marginTop: 20 }}>Sampai jumpa<br />di <span className="it">Trawas.</span></h2>
        <div className="row rel" style={{ justifyContent: "center", marginTop: 34, paddingBottom: 130 }}><Link href="/beli" className="btn r lg">Beli tiket <Icon name="arrow" size={18} /></Link><Link href="/cek-tiket" className="btn g lg">Cek tiket</Link></div>
      </section>
    </Shell>
  );
}
