import { FINANCE, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { rupiah, wib } from "@/lib/format";
import { itemLabel } from "@/lib/regs";
import { ambilAddon } from "../../actions";

// Daftar add on dari pesanan lunas, untuk meja racepack dan koordinasi kamar dengan Aone Trawas.
export default async function Addon({ searchParams }: { searchParams: Promise<{ j?: string }> }) {
  await requireAdmin(FINANCE);
  const { j } = await searchParams;
  const kind = j === "KAMAR" || j === "MERCH" ? j : "";
  const items = await prisma.orderItem.findMany({ where: { registration: { status: "PAID" }, ...(kind ? { kind } : {}) }, include: { registration: { select: { code: true, buyerName: true, buyerPhone: true, participants: { select: { ticketCode: true } } } } }, orderBy: [{ kind: "asc" }, { name: "asc" }] });
  const chip = (v: string, l: string) => <a href={`/mjpadmin/addon${v ? `?j=${v}` : ""}`} className={`pill ${kind === v ? "k" : "g"}`}>{l}</a>;
  return (
    <>
      <p className="eb">Add on lunas</p><h1 style={{ marginTop: 10 }}>Kamar dan <span className="it">merchandise.</span> <span className="muted" style={{ fontSize: 28 }}>{items.length}</span></h1>
      <div className="row" style={{ margin: "20px 0" }}>{chip("", "Semua")}{chip("KAMAR", "Kamar")}{chip("MERCH", "Merchandise")}</div>
      <div className="card tablewrap"><table>
        <thead><tr><th>Item</th><th>Pemesan</th><th>Pesanan</th><th>Subtotal</th><th>Diserahkan</th></tr></thead>
        <tbody>{items.map((i) => (
          <tr key={i.id}>
            <td><b>{itemLabel(i)}</b></td>
            <td>{i.registration.buyerName}<br /><span className="muted tiny">{i.registration.buyerPhone}</span></td>
            <td className="mono small">{i.registration.code}<br /><span className="muted tiny">{i.registration.participants.map((p) => p.ticketCode).join(", ")}</span></td>
            <td>{rupiah(i.subtotal)}</td>
            <td>{i.pickedAt ? <span className="pill ok">✓ {wib(i.pickedAt)}</span> : <form action={ambilAddon}><input type="hidden" name="id" value={i.id} /><button className="btn w sm">Tandai diserahkan</button></form>}</td>
          </tr>
        ))}</tbody>
      </table>{items.length === 0 && <p className="muted" style={{ padding: 16 }}>Belum ada add on dari pesanan lunas.</p>}</div>
    </>
  );
}
