"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";
import { Stepper } from "@/components/Site";
import { JERSEY } from "@/lib/event";
import type { Pilihan, Settings } from "@/lib/settings";
import { biayaQris } from "@/lib/fee";

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");
const phoneOk = (v: string) => /^(\+?62|0)8\d{7,12}$/.test(v.replace(/[\s-]/g, ""));
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function Qty({ value, onChange, max = 10 }: { value: number; onChange: (n: number) => void; max?: number }) {
  return (
    <div className="qty">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} disabled={value === 0} aria-label="Kurangi"><Icon name="minus" size={16} /></button>
      <b>{value}</b>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Tambah"><Icon name="plus" size={16} /></button>
    </div>
  );
}

// Pembelian tiket Konser Majapahit dan Musical Journey: kelas tiket + nama pemegang, add on, lalu bayar.
export default function TiketForm({ event, nama, pilihan, sisa, settings: s, checkIn, qrisOnly }: {
  event: "konser" | "mj"; nama: string; pilihan: Pilihan[]; sisa: Record<string, number>; settings: Settings; checkIn: string; qrisOnly?: boolean;
}) {
  const router = useRouter();
  const query = useSearchParams();
  const KEY = `mjp-tiket-${event}-v1`;
  const [step, setStep] = useState(1);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [holders, setHolders] = useState<Record<string, string[]>>({});
  const [rooms, setRooms] = useState<Record<string, { qty: number; nights: number }>>({});
  const [merch, setMerch] = useState<Record<string, number>>({});
  const [ukuran, setUkuran] = useState<Record<string, string>>({});
  const [buyer, setBuyer] = useState({ name: "", phone: "", email: "" });
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || "null");
      if (d && Date.now() - d.t < 864e5) { setQty(d.qty); setHolders(d.holders); setRooms(d.rooms); setMerch(d.merch); setBuyer(d.buyer); }
    } catch {}
    const k = query.get("k");
    if (k && pilihan.some((p) => p.id === k) && (sisa[k] ?? 0) > 0) setQty((q) => (q[k] ? q : { ...q, [k]: 1 }));
    setLoaded(true);
  }, [KEY, query, pilihan, sisa]);
  useEffect(() => { if (loaded) localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), qty, holders, rooms, merch, buyer })); }, [KEY, loaded, qty, holders, rooms, merch, buyer]);

  const tickets = pilihan.flatMap((p) => Array.from({ length: qty[p.id] ?? 0 }, (_, i) => ({ category: p.id, label: p.label, name: holders[p.id]?.[i] ?? "", i })));
  const tiket = tickets.reduce((a, t) => a + (pilihan.find((p) => p.id === t.category)?.harga ?? 0), 0);
  const roomLines = s.kamar.filter((k) => rooms[k.id]?.qty).map((k) => ({ k, qty: rooms[k.id].qty, nights: rooms[k.id].nights, sub: k.harga * rooms[k.id].qty * rooms[k.id].nights }));
  const merchLines = Object.entries(merch).filter(([, n]) => n > 0).map(([key, n]) => { const [id, variant] = key.split("|"); const p = s.merch.find((m) => m.id === id); return p ? { p, variant, qty: n, sub: p.harga * n, key } : null; }).filter((x) => x !== null);
  const addon = roomLines.reduce((a, l) => a + l.sub, 0) + merchLines.reduce((a, l) => a + l.sub, 0);
  const fee = qrisOnly ? biayaQris(tiket + addon, s) : 0;
  const setHolder = (id: string, i: number, v: string) => setHolders((h) => { const a = [...(h[id] ?? [])]; a[i] = v; return { ...h, [id]: a }; });

  function validate(n: number) {
    if (n === 1) {
      if (!tickets.length) return "Pilih minimal satu tiket ya";
      for (const p of pilihan) if ((qty[p.id] ?? 0) > (sisa[p.id] ?? 0)) return `Kuota ${p.label} tidak cukup`;
      const kosong = tickets.find((t) => t.name.trim().length < 2);
      if (kosong) return `Isi nama pemegang tiket ${kosong.label} nomor ${kosong.i + 1}`;
    }
    return "";
  }
  function go(n: number) {
    if (n > step) { for (let i = step; i < n; i++) { const e = validate(i); if (e) return setErr(e); } }
    setErr(""); setStep(n); window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function submit() {
    if (buyer.name.trim().length < 2 || !phoneOk(buyer.phone) || !emailOk(buyer.email)) return setErr("Lengkapi nama, WhatsApp, dan email pemesan yang valid ya");
    if (!agree) return setErr("Setujui syarat dan ketentuan dulu ya");
    setBusy(true); setErr("");
    const body = {
      event, buyer, tickets: tickets.map((t) => ({ category: t.category, name: t.name.trim() })),
      rooms: roomLines.map((l) => ({ id: l.k.id, qty: l.qty, nights: l.nights })),
      merch: merchLines.map((l) => ({ id: l.p.id, variant: l.variant || undefined, qty: l.qty })),
      method: "ONLINE", agree,
    };
    const res = await fetch("/api/registrations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setErr(data.error || "Pemesanan belum berhasil, silakan coba lagi");
    localStorage.removeItem(KEY);
    router.push(`/bayar/${data.code}`);
  }

  const titles = [["Pilih", "tiket."], ["Tambah", "add on."], ["Ringkasan dan", "bayar."]];
  return (
    <div style={{ paddingBottom: 90 }}>
      <div className="pagehead">
        <p className="eb">Tiket {nama} 2027 · langkah {step} dari 3</p>
        <h1>{titles[step - 1][0]} <span className="it">{titles[step - 1][1]}</span></h1>
        <Stepper step={step} first="TIKET" />
      </div>
      <div className="narrow" style={{ marginTop: 26 }}>
        <div key={step} className="langkah">
          {step === 1 && (
            <div className="split">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {pilihan.map((p) => {
                  const n = qty[p.id] ?? 0, habis = (sisa[p.id] ?? 0) <= 0;
                  return (
                    <div key={p.id} className="card" style={{ padding: 24, opacity: habis ? 0.55 : 1 }}>
                      <div className="line-item" style={{ padding: 0, border: 0 }}>
                        <div><b style={{ fontSize: 18 }}>{p.label}</b><p className="muted small">{p.ket}</p><b className="disp" style={{ fontSize: 26, color: "var(--batat)", textTransform: "none" }}>{rp(p.harga)}</b>
                          <span className="muted tiny" style={{ marginLeft: 8 }}>{habis ? "Kuota penuh" : `Sisa ${sisa[p.id].toLocaleString("id-ID")}`}</span></div>
                        <Qty value={n} max={Math.min(10, sisa[p.id] ?? 0)} onChange={(v) => setQty({ ...qty, [p.id]: v })} />
                      </div>
                      {n > 0 && (
                        <div className="grid2" style={{ gap: 10, marginTop: 14 }}>
                          {Array.from({ length: n }, (_, i) => (
                            <label key={i} className="field"><span className="lbl">Nama pemegang tiket {i + 1}</span>
                              <input className="input" value={holders[p.id]?.[i] ?? ""} onChange={(e) => setHolder(p.id, i, e.target.value)} maxLength={80} autoComplete={i === 0 ? "name" : "off"} /></label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <aside className="card sticky"><p className="eb">Tiket dipilih</p>
                <div style={{ marginTop: 8 }}>
                  {pilihan.filter((p) => qty[p.id]).map((p) => <div key={p.id} className="sum"><span>{p.label} × {qty[p.id]}</span><b>{rp(p.harga * qty[p.id])}</b></div>)}
                  {!tickets.length && <p className="muted small" style={{ padding: "10px 0" }}>Belum ada tiket. Tambahkan dengan tombol plus.</p>}
                  <div className="sum total"><span>Subtotal tiket</span><span>{rp(tiket)}</span></div>
                </div>
                <p className="muted tiny">E-ticket dikirim ke email pemesan, satu QR untuk setiap pemegang tiket.</p></aside>
            </div>
          )}

          {step === 2 && (
            <div className="split">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="card" style={{ padding: 28 }}>
                  <div className="between" style={{ alignItems: "center" }}><h2 style={{ fontSize: 30 }}>Kamar di Aone Trawas</h2><span className="pill g"><Icon name="kalender" size={14} />Check in {checkIn}</span></div>
                  <p className="muted small" style={{ marginTop: 4 }}>Opsional. Harga per kamar per malam.</p>
                  {s.kamar.map((k) => {
                    const v = rooms[k.id] ?? { qty: 0, nights: 1 };
                    const set = (patch: Partial<typeof v>) => setRooms({ ...rooms, [k.id]: { ...v, ...patch } });
                    return (
                      <div key={k.id} className="line-item">
                        <div><b style={{ fontSize: 17 }}>{k.nama}</b><p className="muted small">{k.ket} Maksimal {k.tamu} tamu.</p><b className="disp" style={{ fontSize: 24, color: "var(--batat)", textTransform: "none" }}>{rp(k.harga)}</b> <span className="muted tiny">/ malam</span></div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                          <Qty value={v.qty} onChange={(n) => set({ qty: n })} />
                          {v.qty > 0 && s.maksMalam > 1 && <div className="seg" style={{ minWidth: 170 }}>{Array.from({ length: s.maksMalam }, (_, i) => i + 1).map((n) => <button type="button" key={n} className={v.nights === n ? "on" : ""} onClick={() => set({ nights: n })}>{n} malam</button>)}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="card" style={{ padding: 28 }}>
                  <h2 style={{ fontSize: 30 }}>Merchandise</h2>
                  <p className="muted small" style={{ marginTop: 4 }}>Opsional. Diambil di meja penukaran tiket.</p>
                  {s.merch.map((p) => {
                    const size = ukuran[p.id] ?? "", key = `${p.id}|${p.ukuran ? size : ""}`;
                    return (
                      <div key={p.id} className="line-item">
                        <div><b style={{ fontSize: 17 }}>{p.nama}</b><p className="muted small">{p.ket}</p><b className="disp" style={{ fontSize: 24, color: "var(--batat)", textTransform: "none" }}>{rp(p.harga)}</b>
                          {p.ukuran && <div className="sizes kecil" style={{ marginTop: 10 }} role="radiogroup" aria-label={`Ukuran ${p.nama}`}>{JERSEY.map((j) => <button type="button" key={j} role="radio" aria-checked={size === j} className={size === j ? "on" : ""} onClick={() => setUkuran({ ...ukuran, [p.id]: j })}>{j}</button>)}</div>}</div>
                        <div>{p.ukuran && !size ? <span className="muted tiny">Pilih ukuran</span> : <Qty value={merch[key] ?? 0} onChange={(n) => setMerch({ ...merch, [key]: n })} max={20} />}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <aside className="card sticky"><p className="eb">Add on dipilih</p>
                <div style={{ marginTop: 8 }}>
                  {roomLines.map((l) => <div key={l.k.id} className="sum"><span>{l.k.nama} × {l.qty}, {l.nights} malam</span><b>{rp(l.sub)}</b></div>)}
                  {merchLines.map((l) => <div key={l.key} className="sum"><span>{l.p.nama}{l.variant ? ` (${l.variant})` : ""} × {l.qty}</span><b>{rp(l.sub)}</b></div>)}
                  {addon === 0 && <p className="muted small" style={{ padding: "10px 0" }}>Belum ada add on. Boleh langsung lanjut.</p>}
                  <div className="sum total"><span>Subtotal add on</span><span>{rp(addon)}</span></div>
                </div></aside>
            </div>
          )}

          {step === 3 && (
            <div className="split">
              <div className="card" style={{ padding: 28 }}>
                <h2 style={{ fontSize: 30 }}>Pemesan</h2>
                <div className="grid3" style={{ marginTop: 14 }}>
                  <label className="field"><span className="lbl">Nama</span><input className="input" value={buyer.name} onChange={(e) => setBuyer({ ...buyer, name: e.target.value })} autoComplete="name" maxLength={80} /></label>
                  <label className="field"><span className="lbl">WhatsApp</span><input className="input" inputMode="tel" value={buyer.phone} onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })} placeholder="08xxxxxxxxxx" autoComplete="tel" /></label>
                  <label className="field"><span className="lbl">Email</span><input className="input" type="email" value={buyer.email} onChange={(e) => setBuyer({ ...buyer, email: e.target.value })} autoComplete="email" /></label>
                </div>
                <p className="muted small" style={{ marginTop: 8 }}>Semua e-ticket dikirim ke email ini.</p>
                <h2 style={{ fontSize: 30, marginTop: 26 }}>Metode pembayaran</h2>
                <div className="opt on" style={{ marginTop: 12 }}><span className="dot" /><span><h3>{qrisOnly ? "QRIS" : "Bayar online"}</h3><span className="muted small">{qrisOnly ? "Bayar lewat mobile banking atau dompet digital dengan nominal yang sudah tertera, lalu unggah buktinya. Panitia memverifikasi paling lambat 1x24 jam." : "Virtual account, QRIS, GoPay, ShopeePay."}</span></span></div>
                <h2 style={{ fontSize: 30, marginTop: 26 }}>Pemegang tiket</h2>
                <div className="tablewrap"><table style={{ marginTop: 8 }}><tbody>{tickets.map((t) => <tr key={`${t.category}${t.i}`}><td><b>{t.name}</b></td><td>{t.label}</td></tr>)}</tbody></table></div>
                <label className="row" style={{ marginTop: 22, gap: 12, flexWrap: "nowrap", alignItems: "flex-start", cursor: "pointer", fontSize: 14 }}>
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ width: 20, height: 20, accentColor: "var(--bata)", marginTop: 2, flex: "none" }} />
                  Saya setuju dengan syarat dan ketentuan acara dan penggunaan data untuk keperluan panitia.
                </label>
              </div>
              <aside className="card sticky" style={{ padding: 28 }}>
                <p className="eb">Ringkasan</p>
                <div style={{ marginTop: 10 }}>
                  {pilihan.filter((p) => qty[p.id]).map((p) => <div key={p.id} className="sum"><span>{p.label} × {qty[p.id]}</span><b>{rp(p.harga * qty[p.id])}</b></div>)}
                  {roomLines.map((l) => <div key={l.k.id} className="sum"><span>{l.k.nama} × {l.qty}, {l.nights} malam</span><b>{rp(l.sub)}</b></div>)}
                  {merchLines.map((l) => <div key={l.key} className="sum"><span>{l.p.nama}{l.variant ? ` (${l.variant})` : ""} × {l.qty}</span><b>{rp(l.sub)}</b></div>)}
                  {fee > 0 && <div className="sum"><span>Biaya layanan QRIS</span><b>{rp(fee)}</b></div>}
                  <div className="sum total"><span>Total</span><span>{rp(tiket + addon + fee)}</span></div>
                </div>
                {qrisOnly && <p className="muted tiny">Di halaman pembayaran ditambah biaya admin Rp 1.000 sampai 2.999 yang sekaligus menjadi kode unik pencocokan.</p>}
                {err && <p className="err" style={{ marginTop: 12 }} role="alert">{err}</p>}
                <button className="btn r full lg" style={{ marginTop: 16 }} onClick={submit} disabled={busy}>{busy ? "Sedang memproses..." : "Lanjut ke pembayaran"}</button>
                <p className="muted tiny" style={{ marginTop: 10 }}>Tagihan berlaku 24 jam. Tiket Anda kami tahan selama itu.</p>
              </aside>
            </div>
          )}
        </div>
        {err && step < 3 && <p className="err" style={{ marginTop: 16 }} role="alert">{err}</p>}
        <div className="between" style={{ marginTop: 26, alignItems: "center" }}>
          {step > 1 ? <button className="btn w" onClick={() => go(step - 1)}><Icon name="back" size={16} />Kembali</button> : <span />}
          {step < 3 && <div className="row"><span className="muted small">Total sementara <b style={{ color: "var(--ink)" }}>{rp(tiket + addon)}</b></span><button className="btn k" onClick={() => go(step + 1)}>{step === 1 ? "Lanjut ke add on" : addon ? "Lanjut ke pembayaran" : "Lewati add on"} <Icon name="arrow" size={16} /></button></div>}
        </div>
      </div>
    </div>
  );
}
