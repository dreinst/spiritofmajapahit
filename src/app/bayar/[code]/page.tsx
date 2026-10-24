import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { ORDER_RE } from "@/lib/codes";
import BayarClient from "@/components/BayarClient";
import { dynamicQris, qrisPayload } from "@/lib/qris";
import Shell from "@/components/Shell";
import { rupiah } from "@/lib/format";
import { midtrans, paymentMode } from "@/lib/midtrans";
import { guarded } from "@/lib/guard";
import { itemLabel, loadRegistration, STATUS } from "@/lib/regs";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pembayaran", robots: { index: false } };

export default async function Bayar({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!ORDER_RE.test(code)) notFound();
  const reg = await guarded(() => loadRegistration(code));
  const s = await getSettings();
  const [tone, label] = STATUS[reg.status];
  const paid = reg.status === "PAID";
  const mode = paymentMode();
  // QRIS dinamis: nominal tagihan (sudah termasuk kode unik) tertanam di QR, jadi pembayar tidak perlu mengetik angka.
  let qris: string | null = null;
  if (mode === "manual" && !paid) {
    try { qris = await QRCode.toDataURL(dynamicQris(qrisPayload(), reg.total), { margin: 2, width: 720, errorCorrectionLevel: "M" }); }
    catch (e) { console.error("[qris] payload tidak valid:", (e as Error).message); }
  }
  const perKat = Object.values(reg.participants.reduce<Record<string, { n: string; q: number; h: number }>>((a, p) => { a[p.category] ??= { n: p.categoryName, q: 0, h: 0 }; a[p.category].q++; a[p.category].h += p.price; return a; }, {}));
  return (
    <Shell cta={false} wa={false}>
      <div className="pagehead">
        <p className="eb">Pesanan {reg.code}</p>
        <h1>{paid ? <>Pembayaran <span className="it">diterima.</span></> : <>Selesaikan <span className="it">pembayaran.</span></>}</h1>
        <p className="muted" style={{ marginTop: 10 }}>Atas nama {reg.buyerName} · {reg.buyerEmail}</p>
      </div>
      <div className="narrow" style={{ marginTop: 28, paddingBottom: 90 }}>
        <div className={paid ? "" : "grid2"} style={{ alignItems: "start" }}>
          <div className="card" style={{ padding: 28 }}>
            <span className={`pill ${tone}`}>{label}</span>
            <h3 style={{ fontSize: 24, marginTop: 14 }}>Rincian</h3>
            {perKat.map((k) => <div key={k.n} className="sum"><span>{k.n} × {k.q}</span><b>{rupiah(k.h)}</b></div>)}
            {reg.items.map((i) => <div key={i.id} className="sum"><span>{itemLabel(i)}</span><b>{rupiah(i.subtotal)}</b></div>)}
            {reg.fee > 0 && <div className="sum"><span>Biaya layanan QRIS</span><b>{rupiah(reg.fee)}</b></div>}
            {reg.uniqueCode > 0 && <div className="sum"><span>Biaya admin <span className="muted small">(kode unik pencocokan)</span></span><b>{rupiah(reg.uniqueCode)}</b></div>}
            <div className="sum total"><span>Total</span><span>{rupiah(reg.total)}</span></div>
            <div style={{ marginTop: 14 }}>
              <p className="eb">Pelari</p>
              {reg.participants.map((p) => (
                <div key={p.id} className="sum"><span>{p.name} <span className="muted small">· {p.categoryName} · jersey {p.jersey}</span></span>
                  {paid ? <Link href={`/tiket/${p.ticketCode}`} style={{ color: "var(--batat)", fontWeight: 600 }}>E-ticket →</Link> : <span className="muted mono small">{p.ticketCode}</span>}</div>
              ))}
            </div>
            {paid && reg.items.length > 0 && <p className="note" style={{ marginTop: 16 }}>Add on diambil bersama racepack, cukup tunjukkan e-ticket salah satu pelari di pesanan ini.</p>}
          </div>
          {!paid && <BayarClient code={reg.code} status={reg.status} expiresAt={reg.expiresAt.toISOString()} mode={mode} qris={qris} snapJs={midtrans.snapJs} clientKey={midtrans.clientKey} rekening={s.rekening} total={reg.total} rejectReason={reg.rejectReason} />}
        </div>
      </div>
    </Shell>
  );
}
