"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Icon, { WaIcon } from "@/components/Icon";
import { waLink } from "@/lib/kontak";

declare global { interface Window { snap?: { pay: (t: string, o: Record<string, () => void>) => void } } }
type Props = { code: string; status: string; expiresAt: string; mode: "midtrans" | "manual" | "mock"; qris: string | null; snapJs: string; clientKey: string; rekening: string; total: number; rejectReason: string | null };

function useCountdown(to: string) {
  // Mulai null supaya HTML server dan browser sama (jam server beda beberapa detik), lalu diisi setelah mount.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  if (now === null) return "-- : -- : --";
  const s = Math.max(0, Math.floor((new Date(to).getTime() - now) / 1000));
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(s / 3600))} : ${p(Math.floor((s % 3600) / 60))} : ${p(s % 60)}`;
}

export default function BayarClient(p: Props) {
  const router = useRouter();
  const left = useCountdown(p.expiresAt);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!["PENDING", "VERIFY"].includes(p.status)) return;
    const t = setInterval(async () => { const r = await fetch(`/api/registrations/${p.code}`).then((r) => r.json()).catch(() => null); if (r && r.status !== p.status) router.refresh(); }, 6000);
    return () => clearInterval(t);
  }, [p.code, p.status, router]);
  useEffect(() => {
    if (p.mode !== "midtrans" || document.getElementById("snapjs")) return;
    const sc = document.createElement("script"); sc.id = "snapjs"; sc.src = p.snapJs; sc.setAttribute("data-client-key", p.clientKey); document.body.appendChild(sc);
  }, [p.mode, p.snapJs, p.clientKey]);

  async function payOnline() {
    setBusy(true); setErr("");
    if (p.mode === "mock") { await fetch(`/api/registrations/${p.code}/simulasi`, { method: "POST" }); setBusy(false); return router.refresh(); }
    const r = await fetch(`/api/registrations/${p.code}/snap`, { method: "POST" });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok || !d.token) return setErr(d.error || "Pembayaran tidak dapat dimulai");
    window.snap?.pay(d.token, { onSuccess: () => router.refresh(), onPending: () => router.refresh(), onClose: () => router.refresh() });
  }
  async function upload() {
    if (!file) return setErr("Pilih file bukti pembayaran dulu ya");
    setBusy(true); setErr("");
    const fd = new FormData(); fd.append("bukti", file);
    const r = await fetch(`/api/registrations/${p.code}/bukti`, { method: "POST", body: fd });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) return setErr(d.error || "Unggah tidak berhasil");
    router.refresh();
  }

  if (p.status === "VERIFY") return (
    <div className="card center" style={{ padding: 32 }}><span className="pill warn">Sedang diverifikasi</span><h3 style={{ fontSize: 26, marginTop: 14 }}>Bukti transfer sudah <span className="it">diterima.</span></h3>
      <p className="muted" style={{ marginTop: 8 }}>Panitia melakukan verifikasi paling lambat 1x24 jam. E-ticket dikirim ke email setiap pelari setelah disetujui. Halaman ini diperbarui secara otomatis.</p></div>
  );

  const uploadCard = (title: string, note: string) => (
    <div className="card" style={{ padding: 28 }}>
      <span className="pill g">{p.status === "REJECTED" ? "Unggah ulang" : "Langkah 2"}</span>
      <h3 style={{ fontSize: 24, marginTop: 12 }}>{title}</h3>
      {p.status === "REJECTED" && <p className="err" style={{ marginTop: 6 }}>Bukti sebelumnya ditolak{p.rejectReason ? `: ${p.rejectReason}` : ""}.</p>}
      <p className="muted small" style={{ marginTop: 6 }}>{note}</p>
      <div className="field" style={{ marginTop: 14 }}><label htmlFor="bukti">Tangkapan layar bukti pembayaran (JPG, PNG, WEBP, PDF, maksimal 3 MB)</label>
        <label className="input pickfile"><input id="bukti" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /><Icon name="camera" size={18} /><span>{file ? file.name : "Pilih foto atau PDF"}</span></label></div>
      <button className="btn k full" style={{ marginTop: 14 }} onClick={upload} disabled={busy}><Icon name="arrow" size={16} />Kirim bukti pembayaran</button>
    </div>
  );

  if (p.mode === "manual" && !p.qris) return (
    <div className="card center" style={{ padding: 30 }}><span className="pill warn">QRIS sedang mengalami kendala</span><h3 style={{ fontSize: 24, marginTop: 12 }}>Hubungi panitia untuk <span className="it">membayar.</span></h3>
      <p className="muted" style={{ marginTop: 8 }}>Tagihan Anda tetap tersimpan. Panitia akan mengirim QRIS lewat WhatsApp.</p>
      <a href={waLink(`Saya hendak membayar ${p.code} sebesar Rp ${p.total.toLocaleString("id-ID")}, namun QRIS pada website belum tampil.`)} target="_blank" rel="noopener" className="btn wa" style={{ marginTop: 16 }}><WaIcon />Minta QRIS melalui WhatsApp</a></div>
  );

  if (p.mode === "manual" && p.qris) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="card center" style={{ padding: 28 }}>
        <span className="pill r">Langkah 1 · Bayar dengan QRIS</span>
        <div style={{ background: "#fff", borderRadius: 22, boxShadow: "0 0 0 1px var(--line)", padding: 14, width: "min(300px,100%)", margin: "18px auto 0" }}>
          <img src={p.qris} alt={`QRIS bernominal Rp ${p.total.toLocaleString("id-ID")}`} width={720} height={720} style={{ width: "100%", height: "auto" }} />
        </div>
        <p className="eb" style={{ marginTop: 14 }}>Nominal yang tertera di aplikasi</p>
        <p className="disp" style={{ fontSize: 40, marginTop: 4 }}>Rp {p.total.toLocaleString("id-ID")}</p>
        <p className="muted small" style={{ marginTop: 4 }}>Pastikan nominalnya sama sampai digit terakhir ya.</p>
        <div className="row" style={{ justifyContent: "center", marginTop: 16 }}>
          <a href={p.qris} download={`QRIS-${p.code}.png`} className="btn w"><Icon name="arrow" size={16} />Simpan QR</a>
        </div>
        <ol style={{ textAlign: "left", margin: "18px 0 0 20px", lineHeight: 1.8, fontSize: 14 }} className="muted">
          <li>Buka aplikasi mobile banking atau dompet digital (GoPay, OVO, DANA, dan lainnya), lalu pilih pembayaran QRIS.</li>
          <li>Pindai QR di atas, atau unggah QR yang telah disimpan dari galeri.</li>
          <li>Nominal terisi secara otomatis. Selesaikan pembayaran, lalu simpan tangkapan layar bukti pembayaran.</li>
        </ol>
        <p className="muted tiny" style={{ marginTop: 12 }}>Selesaikan sebelum {left} lagi. Merchant: D&apos;Production.</p>
      </div>
      {uploadCard("Unggah bukti pembayaran", "Panitia mencocokkan nominal dengan riwayat QRIS paling lambat 1x24 jam. Setelah itu e-ticket dikirim ke email setiap pelari.")}
      {err && <p className="err" role="alert">{err}</p>}
      <a href={waLink(`Saya memerlukan bantuan terkait pembayaran ${p.code}.`)} target="_blank" rel="noopener" className="btn w"><WaIcon />Memerlukan bantuan pembayaran?</a>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {p.status === "PENDING" && (
        <div className="card center" style={{ padding: 30 }}>
          <p className="eb">Bayar online sebelum</p>
          <p className="disp" style={{ fontSize: 46, marginTop: 6 }}>{left}</p>
          <p className="muted small" style={{ margin: "8px 0 18px" }}>Virtual account, QRIS, GoPay, ShopeePay. Lunas terkonfirmasi otomatis.</p>
          <button className="btn r full lg" onClick={payOnline} disabled={busy}>{busy ? "Sedang memproses..." : p.mode === "mock" ? "Simulasikan bayar (mode uji)" : "Bayar online sekarang"}</button>
        </div>
      )}
      {p.status === "EXPIRED" && <div className="note">Batas waktu pembayaran online telah berakhir. Pembayaran masih dapat dilakukan melalui transfer manual di bawah, atau dengan mendaftar ulang.</div>}
      <div className="card" style={{ padding: 28 }}>
        <span className="pill g">{p.status === "REJECTED" ? "Unggah ulang" : "Alternatif"}</span>
        <h3 style={{ fontSize: 24, marginTop: 12 }}>Transfer manual</h3>
        {p.status === "REJECTED" && <p className="err" style={{ marginTop: 6 }}>Bukti sebelumnya ditolak{p.rejectReason ? `: ${p.rejectReason}` : ""}.</p>}
        <p className="muted small" style={{ marginTop: 6 }}>Transfer tepat Rp {p.total.toLocaleString("id-ID")} lalu unggah buktinya.</p>
        <div style={{ background: "var(--bg)", borderRadius: 16, padding: 16, marginTop: 14 }}><p className="eb">Rekening panitia</p><p className="disp" style={{ fontSize: 22, marginTop: 6 }}>{p.rekening}</p></div>
        <div className="field" style={{ marginTop: 14 }}><label htmlFor="bukti">Bukti transfer (JPG, PNG, WEBP, PDF, maksimal 3 MB)</label>
          <label className="input pickfile"><input id="bukti" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /><Icon name="camera" size={18} /><span>{file ? file.name : "Pilih foto atau PDF"}</span></label></div>
        <button className="btn k full" style={{ marginTop: 14 }} onClick={upload} disabled={busy}><Icon name="arrow" size={16} />Kirim bukti</button>
      </div>
      {err && <p className="err" role="alert">{err}</p>}
      <a href={waLink(`Saya memerlukan bantuan terkait pembayaran ${p.code}.`)} target="_blank" rel="noopener" className="btn w"><WaIcon />Memerlukan bantuan pembayaran?</a>
    </div>
  );
}
