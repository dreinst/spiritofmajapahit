import Link from "next/link";
import Icon from "@/components/Icon";
import { rupiah } from "@/lib/format";
import type { Settings } from "@/lib/settings";

const IKON_MERCH = ["baju", "baju", "topi", "botol"];

// Bagian add on (kamar Aone Trawas dan merchandise) untuk semua situs acara. Isi dan harga dari panel panitia.
export default function AddOn({ s, checkIn, cta, lead }: { s: Settings; checkIn: string; cta: [string, string]; lead: string }) {
  return (
    <section className="ao" id="addon">
      <div className="sec">
        <div className="kat-head" data-rv>
          <div><p className="eb">Add on · Aone Trawas</p><h2 style={{ marginTop: 18 }}>Menginap dan belanja, <span className="it">satu tagihan.</span></h2></div>
          <p className="d">{lead}</p>
        </div>

        <div className="ao-kamar">
          {s.kamar.map((k, i) => (
            <article key={k.id} className="ao-room" data-rv style={{ ["--d" as string]: i }}>
              <div className="between" style={{ alignItems: "center" }}><p className="eb">Kamar</p><span className="ao-tag"><Icon name="users" size={14} />Maksimal {k.tamu} tamu</span></div>
              <h3>{k.nama}</h3>
              <p className="muted">{k.ket}</p>
              <div className="ao-harga"><b>{rupiah(k.harga)}</b><span>per malam</span></div>
            </article>
          ))}
        </div>

        <div className="ao-sub" data-rv><p className="eb">Merchandise resmi</p><span className="ao-tag"><Icon name="kalender" size={14} />Check in kamar {checkIn}</span></div>
        <div className="ao-merch">
          {s.merch.map((m, i) => (
            <div key={m.id} className="ao-item" data-rv style={{ ["--d" as string]: i }}>
              <span className="ao-ikon"><Icon name={IKON_MERCH[i] ?? "paket"} size={22} /></span>
              <h4>{m.nama}</h4>
              <p className="muted small">{m.ket}{m.ukuran ? " Ukuran XS sampai 5XL." : ""}</p>
              <b>{rupiah(m.harga)}</b>
            </div>
          ))}
        </div>
        <Link href={cta[0]} className="btn r lg" style={{ marginTop: 48 }}>{cta[1]} <Icon name="arrow" size={18} /></Link>
      </div>
    </section>
  );
}
