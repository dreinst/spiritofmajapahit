import Link from "next/link";
import { FINANCE, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { JERSEY } from "@/lib/event";
import { rupiah } from "@/lib/format";
import { STATUS } from "@/lib/regs";
import { getSettings } from "@/lib/settings";
import { EVENT_KEYS, SITES } from "@/lib/sites";

// Baris: [label, nilai, teks angka, batas penuh]. Tanpa batas, panjang batang relatif terhadap nilai terbesar.
function Bars({ rows, color }: { rows: [string, number, string?, number?][]; color?: string }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return <>{rows.map(([l, n, t, cap]) => <div key={l} className="barrow"><span className="lb">{l}</span><span className="tr"><i style={{ width: `${Math.min(100, (n / (cap || max)) * 100)}%`, background: color }} /></span><span className="n">{t ?? n}</span></div>)}</>;
}

export default async function Ringkasan() {
  await requireAdmin(FINANCE);
  const [s, ps, regs, items] = await Promise.all([
    getSettings(),
    prisma.participant.findMany({ include: { registration: { select: { status: true, event: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.registration.findMany({ select: { status: true, total: true, amountAddon: true, event: true } }),
    prisma.orderItem.findMany({ where: { registration: { status: "PAID" } } }),
  ]);
  const lunas = ps.filter((p) => p.registration.status === "PAID");
  const since = new Date(Date.now() - 864e5);
  const paid = regs.filter((r) => r.status === "PAID");
  const uang = paid.reduce((a, r) => a + r.total, 0);
  const tgl = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", weekday: "long", day: "numeric", month: "long" }).format(new Date());
  const kamar = s.kamar.map((k) => [k.nama, items.filter((i) => i.kind === "KAMAR" && i.ref === k.id).reduce((a, i) => a + i.qty * i.nights, 0)] as [string, number]);
  const merch = Object.entries(items.filter((i) => i.kind === "MERCH").reduce<Record<string, number>>((a, i) => { const k = `${i.name}${i.variant ? ` ${i.variant}` : ""}`; a[k] = (a[k] ?? 0) + i.qty; return a; }, {}));
  return (
    <>
      <div className="between">
        <div><p className="eb">{tgl}</p><h1 style={{ marginTop: 10 }}>Ringkasan <span className="it">hari ini.</span></h1></div>
        <div className="row"><a href="/api/mjpadmin/ekspor" className="btn w sm">Unduh CSV pelari</a><Link href="/mjpadmin/pengaturan" className="btn k sm"><span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dibuka ? "#3BD16F" : "#999" }} />Pendaftaran {s.dibuka ? "dibuka" : "ditutup"}</Link></div>
      </div>
      <div className="kpi">
        <div><span>Pelari terdaftar</span><b>{ps.length}</b><small>+{ps.filter((p) => p.createdAt > since).length} dalam 24 jam</small></div>
        <div><span>Pelari lunas</span><b>{lunas.length}</b><small>{ps.length ? Math.round((lunas.length / ps.length) * 100) : 0}% dari terdaftar</small></div>
        <div><span>Menunggu bayar</span><b>{ps.filter((p) => ["PENDING", "VERIFY"].includes(p.registration.status)).length}</b><small style={{ color: "var(--batat)" }}>{regs.filter((r) => r.status === "VERIFY").length} bukti perlu dicek</small></div>
        <div><span>Uang masuk</span><b style={{ fontSize: "clamp(26px,2.6vw,40px)", paddingTop: 10 }}>{rupiah(uang)}</b><small style={{ color: "var(--muted)" }}>Add on {rupiah(paid.reduce((a, r) => a + r.amountAddon, 0))}</small></div>
      </div>
      <div className="card" style={{ marginTop: 20 }}><p className="eb">Per acara (lunas)</p>
        <div className="grid3" style={{ marginTop: 10 }}>{EVENT_KEYS.map((e) => (
          <div key={e}><b style={{ fontSize: 18 }}>{SITES[e].nama}</b><p className="muted small">{lunas.filter((p) => p.registration.event === e).length} peserta lunas · {rupiah(paid.filter((r) => r.event === e).reduce((a, r) => a + r.total, 0))}</p></div>
        ))}</div></div>
      <div className="grid3" style={{ marginTop: 20 }}>
        <div className="card"><p className="eb">Kategori trail run (lunas / kuota)</p><div style={{ marginTop: 10 }}><Bars rows={s.kategori.map((k) => { const n = lunas.filter((p) => p.category === k.id).length; return [`${k.nama} ${k.jarak}`, n, `${n}/${k.kuota}`, k.kuota]; })} /></div></div>
        <div className="card"><p className="eb">Add on lunas</p><div style={{ marginTop: 10 }}><Bars color="var(--prada)" rows={[...kamar.map(([l, n]) => [`${l} (malam)`, n] as [string, number]), ...merch]} /></div>{items.length === 0 && <p className="muted small">Belum ada add on lunas.</p>}</div>
        <div className="card tablewrap"><p className="eb">Jersey pelari lunas</p><table style={{ marginTop: 6 }}><thead><tr><th>Ukuran</th><th>Jumlah</th></tr></thead>
          <tbody>{JERSEY.map((j) => { const a = lunas.filter((p) => p.jersey === j).length; return a ? <tr key={j}><td>{j}</td><td><b>{a}</b></td></tr> : null; })}</tbody></table>
          {lunas.length === 0 && <p className="muted small" style={{ marginTop: 10 }}>Belum ada pelari lunas.</p>}</div>
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <div className="between" style={{ alignItems: "center" }}><h3 style={{ fontSize: 22 }}>Pendaftar terbaru</h3><Link href="/mjpadmin/peserta" className="btn w sm">Lihat semua</Link></div>
        <div className="tablewrap"><table style={{ marginTop: 12 }}>
          <thead><tr><th>Kode</th><th>Nama</th><th>Kategori</th><th>Jersey</th><th>Kota</th><th>Status</th></tr></thead>
          <tbody>{ps.slice(0, 8).map((p) => (
            <tr key={p.id}><td className="mono small">{p.ticketCode}</td><td><b>{p.name}</b></td><td>{p.categoryName}</td><td>{p.jersey}</td><td>{p.city}</td>
              <td><span className={`pill ${STATUS[p.registration.status][0]}`}>{STATUS[p.registration.status][1]}</span></td></tr>
          ))}</tbody>
        </table></div>
        {ps.length === 0 && <p className="muted" style={{ marginTop: 14 }}>Belum ada pendaftar.</p>}
      </div>
    </>
  );
}
