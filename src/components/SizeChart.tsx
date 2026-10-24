"use client";
import { useState } from "react";
import { SIZE_CHART, sarankan } from "@/lib/sizechart";

type Size = (typeof SIZE_CHART)[number]["size"];
const fmt = (n: number) => String(n).replace(".", ",");

// Pemilih ukuran jersey: tombol XS sampai 5XL, gambar kaos dengan angka ukuran terpilih, saran dari kaos
// favorit, dan tabel lengkap. Tanpa onChange dipakai sebagai panduan saja (guide book).
export default function SizeChart({ value, onChange, table = true }: { value?: string; onChange?: (s: Size) => void; table?: boolean }) {
  const [own, setOwn] = useState<Size>("L");
  const cur = (value as Size) || own;
  const pick = (s: Size) => (onChange ? onChange(s) : setOwn(s));
  const [lebar, setLebar] = useState("");
  const [lengan, setLengan] = useState<"pendek" | "panjang">("pendek");
  const rec = Number(lebar) >= 30 && Number(lebar) <= 80 ? sarankan(Number(lebar)) : null;
  const d = SIZE_CHART.find((s) => s.size === cur)!;
  return (
    <div>
      <div className="sizes" role="radiogroup" aria-label="Ukuran jersey">
        {SIZE_CHART.map((s) => <button type="button" key={s.size} role="radio" aria-checked={cur === s.size} className={`${cur === s.size ? "on" : ""} ${rec === s.size && cur !== s.size ? "rec" : ""}`} onClick={() => pick(s.size)}>{s.size}<small>{s.lebar}</small></button>)}
      </div>
      <div className="szgrid">
        <svg viewBox="0 0 220 230" width="100%" aria-label={`Ilustrasi ukuran ${cur}`}>
          <path d="M70 18 Q110 40 150 18 L198 44 L180 92 L160 84 L160 214 Q110 222 60 214 L60 84 L40 92 L22 44 Z" fill="#F3EADB" stroke="#1C1310" strokeWidth="2" strokeLinejoin="round" />
          <path d="M84 22 Q110 38 136 22" fill="none" stroke="#1C1310" strokeWidth="2" />
          <line x1="60" y1="110" x2="160" y2="110" stroke="#B4472B" strokeWidth="2" strokeDasharray="4 4" /><circle cx="60" cy="110" r="3.5" fill="#B4472B" /><circle cx="160" cy="110" r="3.5" fill="#B4472B" />
          <rect x="80" y="96" width="60" height="26" rx="13" fill="#B4472B" /><text x="110" y="114" textAnchor="middle" fontWeight="700" fontSize="13" fill="#fff">{fmt(d.lebar)} cm</text>
          <line x1="176" y1="40" x2="176" y2="214" stroke="#1C1310" strokeWidth="1.5" strokeDasharray="3 4" /><text x="186" y="112" fontWeight="700" fontSize="12" fill="#1C1310" transform="rotate(90 186 112)">{fmt(d.panjang)} cm</text>
        </svg>
        <div>
          <p className="eb">Ukuran {cur}</p>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 10, marginTop: 10 }}>
            {[["Lebar dada", d.lebar], ["Panjang badan", d.panjang], [`Lengan ${lengan}`, lengan === "pendek" ? d.lenganPendek : d.lenganPanjang], ["Lingkar kerah", d.kerah]].map(([l, v]) => (
              <div key={l as string} style={{ background: "var(--bg)", borderRadius: 14, padding: 12 }}><p className="muted tiny">{l}</p><b className="disp" style={{ fontSize: 26 }}>{fmt(v as number)} <span style={{ fontSize: 13 }}>cm</span></b></div>
            ))}
          </div>
        </div>
      </div>
      <div className="note" style={{ marginTop: 16, display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 12, alignItems: "center" }}>
        <div><p style={{ fontWeight: 700, fontSize: 14 }}>Tentukan ukuran dari kaos acuan</p><p className="muted tiny">Bentangkan kaos, lalu ukur lebar dari ketiak ke ketiak.</p></div>
        <div className="row" style={{ flexWrap: "nowrap" }}>
          <input className="input" inputMode="decimal" placeholder="cm" value={lebar} onChange={(e) => setLebar(e.target.value.replace(/[^\d.]/g, ""))} style={{ width: 90, height: 42 }} aria-label="Lebar kaos acuan dalam cm" />
          {rec && <button type="button" className="pill r" onClick={() => pick(rec as Size)}>Pakai {rec}</button>}
        </div>
      </div>
      {table && (
        <details style={{ marginTop: 16 }}>
          <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--batat)", fontSize: 14 }}>Lihat tabel ukuran lengkap</summary>
          <div className="seg" style={{ maxWidth: 300, marginTop: 12 }}><button type="button" className={lengan === "pendek" ? "on" : ""} onClick={() => setLengan("pendek")}>Lengan pendek</button><button type="button" className={lengan === "panjang" ? "on" : ""} onClick={() => setLengan("panjang")}>Lengan panjang</button></div>
          <div className="tablewrap" style={{ marginTop: 10 }}>
            <table>
              <thead><tr><th>Ukuran</th><th>Lebar dada</th><th>Panjang</th><th>Lebar bahu</th><th>Panjang lengan</th><th>Lingkar lengan</th><th>Lingkar kerah</th><th>Lingkar bahu</th></tr></thead>
              <tbody>{SIZE_CHART.map((s) => (
                <tr key={s.size} className={s.size === cur ? "on" : ""} onClick={() => pick(s.size)} style={{ cursor: "pointer" }}>
                  <td><b>{s.size}</b></td><td>{fmt(s.lebar)}</td><td>{fmt(s.panjang)}</td><td>{fmt(s.bahu)}</td>
                  <td>{fmt(lengan === "pendek" ? s.lenganPendek : s.lenganPanjang)}</td><td>{fmt(lengan === "pendek" ? s.lingkarLenganPendek : s.lingkarLenganPanjang)}</td><td>{fmt(s.kerah)}</td><td>{fmt(s.lingkarBahu)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <p className="muted tiny" style={{ marginTop: 8 }}>Potongan reguler. Semua ukuran dalam cm, toleransi produksi 1 sampai 2 cm.</p>
        </details>
      )}
    </div>
  );
}
