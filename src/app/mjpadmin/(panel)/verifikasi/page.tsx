import Link from "next/link";
import { FINANCE, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { rupiah, wib } from "@/lib/format";
import { approve, reject } from "../../actions";
import { itemLabel } from "@/lib/regs";

export default async function Verifikasi({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  await requireAdmin(FINANCE);
  const { k } = await searchParams;
  const list = await prisma.registration.findMany({ where: { status: "VERIFY" }, include: { participants: { select: { name: true, categoryName: true } }, items: true }, orderBy: { proofAt: "asc" } });
  const pick = list.find((r) => r.code === k) ?? list[0];
  const cur = pick && { ...pick, proof: (await prisma.registration.findUnique({ where: { id: pick.id }, select: { proof: true } }))?.proof ?? null };
  return (
    <>
      <p className="eb">Pembayaran manual</p><h1 style={{ marginTop: 10 }}>{list.length} bukti <span className="it">menunggu.</span></h1>
      {list.length === 0 ? <div className="card" style={{ marginTop: 26 }}><p className="muted">Tidak ada bukti pembayaran yang perlu dicek.</p></div> : (
        <div className="grid2" style={{ marginTop: 26, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {list.map((r) => (
              <Link key={r.code} href={`/mjpadmin/verifikasi?k=${r.code}`} className="card lift" style={{ padding: 20, boxShadow: r.code === cur?.code ? "0 0 0 2px var(--ink)" : undefined }}>
                <div className="between" style={{ alignItems: "center" }}><span className="mono small">{r.code}</span><b className="disp" style={{ fontSize: 22 }}>{rupiah(r.total)}</b></div>
                <p style={{ marginTop: 8 }}><b>{r.participants.map((p) => p.name).join(", ")}</b> <span className="muted small">· {wib(r.proofAt)}</span></p>
              </Link>
            ))}
          </div>
          {cur && (
            <div className="card sticky" style={{ padding: 28 }}>
              <div className="between" style={{ alignItems: "center" }}><div><p className="eb">Bukti transfer</p><h3 style={{ fontSize: 26, marginTop: 6 }}>{cur.buyerName}</h3></div><span className="pill warn">Perlu dicek</span></div>
              <div style={{ marginTop: 16 }}>
                {cur.proof?.startsWith("data:application/pdf") ? <a href={cur.proof} download={`${cur.code}.pdf`} className="btn w">Unduh bukti PDF</a> : cur.proof ? <img src={cur.proof} alt={`Bukti transfer ${cur.code}`} className="proof" /> : <p className="muted">Tidak ada berkas.</p>}
              </div>
              <table style={{ marginTop: 14 }}><tbody>
                <tr><td className="muted">Nominal yang harus masuk</td><td style={{ textAlign: "right" }}><b className="disp" style={{ fontSize: 24 }}>{rupiah(cur.total)}</b></td></tr>
                {cur.uniqueCode > 0 && <tr><td className="muted">Kode unik</td><td style={{ textAlign: "right" }}><span className="pill r">{cur.uniqueCode}</span> <span className="muted small">cocokkan nominal persis dengan riwayat GoPay Merchant</span></td></tr>}
                <tr><td className="muted">Pelari</td><td style={{ textAlign: "right" }}>{cur.participants.map((p) => `${p.name} (${p.categoryName})`).join(", ")}</td></tr>
                {cur.items.length > 0 && <tr><td className="muted">Add on</td><td style={{ textAlign: "right" }}>{cur.items.map(itemLabel).join(", ")}</td></tr>}
                <tr><td className="muted">Kontak</td><td style={{ textAlign: "right" }}>{cur.buyerPhone} · {cur.buyerEmail}</td></tr>
              </tbody></table>
              <div className="row" style={{ marginTop: 18, flexWrap: "nowrap", alignItems: "stretch" }}>
                <form action={approve} style={{ flex: 1 }}><input type="hidden" name="code" value={cur.code} /><button className="btn r full lg">Setujui dan kirim e-ticket</button></form>
              </div>
              <form action={reject} className="row" style={{ marginTop: 10, flexWrap: "nowrap" }}><input type="hidden" name="code" value={cur.code} /><input name="reason" className="input" placeholder="Alasan tolak (dikirim ke pemesan)" style={{ height: 44 }} maxLength={200} /><button className="btn w">Tolak</button></form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
