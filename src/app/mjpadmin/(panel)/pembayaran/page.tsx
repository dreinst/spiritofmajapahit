import Link from "next/link";
import { FINANCE, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { rupiah, wib } from "@/lib/format";
import { STATUS } from "@/lib/regs";
import { approve, cancelBill, resend } from "../../actions";

export default async function Pembayaran({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin(FINANCE);
  const sp = await searchParams;
  const status = Object.keys(STATUS).includes(sp.status ?? "") ? sp.status! : "";
  const regs = await prisma.registration.findMany({ where: status ? { status } : {}, include: { participants: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 300 });
  const chip = (v: string, l: string) => <Link href={`/mjpadmin/pembayaran?status=${v}`} className={`pill ${status === v ? "k" : "g"}`}>{l}</Link>;
  return (
    <>
      <p className="eb">Pembayaran</p><h1 style={{ marginTop: 10 }}>Semua <span className="it">tagihan.</span> <span className="muted" style={{ fontSize: 28 }}>{regs.length}</span></h1>
      <div className="row" style={{ margin: "20px 0" }}>{chip("", "Semua")}{chip("PENDING", "Menunggu")}{chip("VERIFY", "Cek bayar")}{chip("PAID", "Lunas")}{chip("EXPIRED", "Kedaluwarsa")}{chip("REJECTED", "Ditolak")}</div>
      <div className="card tablewrap"><table>
        <thead><tr><th>Tagihan</th><th>Pemesan</th><th>Isi</th><th>Metode</th><th>Total</th><th>Status</th><th></th></tr></thead>
        <tbody>{regs.map((r) => (
          <tr key={r.code}>
            <td className="mono small">{r.code}<br /><span className="muted tiny">{wib(r.createdAt)}</span></td>
            <td>{r.buyerName}<br /><span className="muted tiny">{r.buyerPhone}</span></td><td className="small">{r.participants.length} pelari{r.amountAddon > 0 && <><br /><span className="muted tiny">add on {rupiah(r.amountAddon)}</span></>}</td>
            <td className="small">{r.method === "MANUAL" ? (r.uniqueCode > 0 ? "QRIS manual" : "Transfer") : "Online"}{r.paidVia && <><br /><span className="muted tiny">{r.paidVia}</span></>}</td>
            <td><b>{rupiah(r.total)}</b>{r.uniqueCode > 0 && <><br /><span className="muted tiny">{r.fee > 0 ? `layanan ${rupiah(r.fee)} · ` : ""}kode unik {r.uniqueCode}</span></>}</td><td><span className={`pill ${STATUS[r.status][0]}`}>{STATUS[r.status][1]}</span></td>
            <td>{["PENDING", "EXPIRED"].includes(r.status) && <form action={approve}><input type="hidden" name="code" value={r.code} /><button className="btn w sm">Tandai lunas</button></form>}
              {r.status === "PENDING" && <form action={cancelBill} style={{ marginTop: 6 }}><input type="hidden" name="code" value={r.code} /><button className="btn w sm" title="Untuk tagihan palsu atau dobel">Batalkan</button></form>}
              {r.status === "VERIFY" && <Link href={`/mjpadmin/verifikasi?k=${r.code}`} className="btn k sm">Cek bukti</Link>}
              {r.status === "PAID" && <form action={resend}><input type="hidden" name="code" value={r.code} /><button className="btn w sm">Kirim ulang tiket</button></form>}</td>
          </tr>
        ))}</tbody>
      </table>{regs.length === 0 && <p className="muted" style={{ padding: 16 }}>Tidak ada tagihan.</p>}</div>
    </>
  );
}
