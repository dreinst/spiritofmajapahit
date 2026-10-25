import Link from "next/link";
import Icon, { WaIcon } from "@/components/Icon";
import Hitung from "@/components/Hitung";
import Shell from "@/components/Shell";
import { Surya } from "@/components/Brand";
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
  return (
    <Shell site={k.event}>
      <section className="acarahero">
        <img src={k.gambar} alt="" className="latar" />
        <div className="narrow rel">
          <p className="eb">The Spirit of Majapahit · {S.singkat}</p>
          <h1 style={{ marginTop: 14 }}>{k.judul[0]} <span className="it">{k.judul[1]}</span></h1>
          <p className="lead">{k.lead}</p>
          <div className="row" style={{ marginTop: 26 }}><Link href="/beli" className="btn r lg">Beli tiket <Icon name="arrow" size={18} /></Link><Link href={`#${k.agendaId}`} className="btn g lg">Lihat {k.agendaJudul[0].toLowerCase()}</Link></div>
          {k.hariH && <div className="kaki2"><p className="eb">{k.hitungLabel}</p><Hitung to={k.hariH} /></div>}
        </div>
      </section>

      <section className="sec" id="tentang">
        <div className="kat-head" data-rv>
          <div><p className="eb">Tentang</p><h2 style={{ marginTop: 14 }}>{k.tentangJudul[0]} <span className="it">{k.tentangJudul[1]}</span></h2></div>
          <div>{k.tentang.map((t) => <p key={t} className="muted" style={{ fontSize: 17, marginTop: 10 }}>{t}</p>)}</div>
        </div>
        {k.catatan && <p className="note" style={{ marginTop: 26, maxWidth: 760 }}>{k.catatan}</p>}
      </section>

      <section className="sec" id={k.agendaId} style={{ paddingTop: 20 }}>
        <div data-rv><p className="eb">{k.agendaJudul[0]}</p><h2 style={{ marginTop: 14 }}>{k.agendaJudul[1].split(" ")[0]} <span className="it">{k.agendaJudul[1].split(" ").slice(1).join(" ")}</span></h2></div>
        <div className="steps" style={{ gridTemplateColumns: `repeat(${Math.min(4, k.agenda.length)},minmax(0,1fr))` }}>
          {k.agenda.map(([waktu, judul, ket], i) => <div key={judul} className="step" data-rv style={{ ["--d" as string]: i }}><b style={{ fontSize: 90 }}>{i + 1}</b><div><p className="eb">{waktu}</p><h3 style={{ marginTop: 6 }}>{judul}</h3><p className="muted" style={{ marginTop: 6 }}>{ket}</p></div></div>)}
        </div>
        <div className="penampil" data-rv>
          {[1, 2, 3, 4].map((i) => <div key={i}><Surya size={40} /><b>Penampil {i}</b><span>{k.penampil}</span></div>)}
        </div>
      </section>

      <section className="sec" id="tiket" style={{ paddingTop: 30 }}>
        <div className="kat-head" data-rv>
          <div><p className="eb">Tiket</p><h2 style={{ marginTop: 14 }}>Pilih <span className="it">kelas tiket.</span></h2></div>
          <p className="muted" style={{ fontSize: 17 }}>Kuota tiap kelas terbatas, sisa di bawah langsung mengikuti jumlah pemesan. Satu pesanan bisa untuk beberapa orang, e-ticket dikirim per orang.</p>
        </div>
        <div className="kat">
          {tiket.map((t, i) => {
            const sisa = Math.max(0, t.kuota - (used[t.id] ?? 0));
            return (
              <article key={t.id} className="kcard" data-rv style={{ ["--d" as string]: i, minHeight: 340 }}>
                <Surya className="pola" size={260} />
                <div className="between" style={{ alignItems: "center" }}><h3>{t.nama}</h3><span className="pill p">{sisa > 0 ? `Sisa ${sisa.toLocaleString("id-ID")}` : "Habis"}</span></div>
                <p style={{ marginTop: 16, fontSize: 15, opacity: 0.88, maxWidth: 320 }}>{t.ket}</p>
                <div className="harga" style={{ marginTop: "auto" }}><b>{rupiah(t.harga)}</b>{sisa > 0 ? <Link href={`/beli?k=${t.id}`} className="btn w sm">Pilih <Icon name="arrow" size={16} /></Link> : <span className="pill g">Habis</span>}</div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="sec" id="venue" style={{ paddingTop: 30 }}>
        <div className="kat-head" data-rv>
          <div><p className="eb">Venue dan add on</p><h2 style={{ marginTop: 14 }}>Aone Trawas, <span className="it">menginap sekalian.</span></h2></div>
          <p className="muted" style={{ fontSize: 17 }}>Aone Trawas di kaki Gunung Penanggungan, Mojokerto. Kamar dan merchandise bisa ditambahkan saat membeli tiket, dibayar dalam satu tagihan.</p>
        </div>
        <div className="addon">
          <div className="kamar" data-rv>
            <div className="between" style={{ alignItems: "center" }}><p className="eb">Kamar di Aone Trawas</p><span className="pill p"><Icon name="kalender" size={14} />Check in {checkInAcara(s, k.event)}</span></div>
            {s.kamar.map((r) => (
              <div key={r.id} className="baris">
                <div><b>{r.nama}</b><p className="muted small" style={{ marginTop: 4 }}>{r.ket} Maksimal {r.tamu} tamu.</p></div>
                <div style={{ textAlign: "right" }}><b className="disp" style={{ fontSize: 30, color: "var(--prada)" }}>{rupiah(r.harga)}</b><p className="muted tiny">per malam</p></div>
              </div>
            ))}
          </div>
          <div className="merch">
            {s.merch.map((m, i) => (
              <div key={m.id} className="mcard" data-rv style={{ ["--d" as string]: i }}>
                <span className="ikon"><Icon name={["baju", "baju", "topi", "botol"][i] ?? "paket"} size={26} /></span>
                <h3 style={{ fontSize: 18 }}>{m.nama}</h3>
                <p className="muted small">{m.ket}</p>
                <b className="disp">{rupiah(m.harga)}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 30 }}>
        <div data-rv><p className="eb">Rangkaian</p><h2 style={{ marginTop: 14 }}>Satu semangat, <span className="it">tiga acara.</span></h2></div>
        <div className="kat" style={{ marginTop: 34 }}>
          {(["trail", "konser", "mj"] as const).map((e) => (
            <a key={e} href={siteBase(e)} className={`rcard${e === k.event ? " on" : ""}`} data-rv>
              <p className="eb">{SITES[e].tanggal}</p><h3>{SITES[e].nama}</h3><p className="muted small">{SITES[e].ket}</p>
              <span className="row small" style={{ marginTop: "auto", fontWeight: 600 }}>{e === k.event ? "Anda di sini" : "Kunjungi situs"} <Icon name="arrow" size={14} /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="sec" id="faq" style={{ maxWidth: 1000, paddingTop: 30 }}>
        <div data-rv><p className="eb">Tanya jawab</p><h2 style={{ marginTop: 14 }}>Yang sering <span className="it">ditanyakan.</span></h2></div>
        <div style={{ marginTop: 24 }}>{k.faq.map(([q, a]) => <details key={q} className="faq"><summary><span>{q}</span><span>+</span></summary><p>{a}</p></details>)}</div>
        <a href={waLink(`Halo panitia ${S.nama}, saya ingin bertanya.`)} target="_blank" rel="noopener" className="btn wa" style={{ marginTop: 28 }}><WaIcon />Tanya lewat WhatsApp {WA_TAMPIL}</a>
      </section>

      <section className="final">
        <p className="eb rel" style={{ color: "#F3D9B0" }}>{S.tanggal} · {S.venue}</p>
        <h2 data-rv style={{ marginTop: 16 }}>Sampai jumpa<br />di <span className="it">Trawas.</span></h2>
        <div className="row rel" style={{ justifyContent: "center", marginTop: 30, paddingBottom: 110 }}><Link href="/beli" className="btn r lg">Beli tiket <Icon name="arrow" size={18} /></Link><Link href="/cek-tiket" className="btn g lg">Cek tiket</Link></div>
        <div className="lantai" />
      </section>
    </Shell>
  );
}
