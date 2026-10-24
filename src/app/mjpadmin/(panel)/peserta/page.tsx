import Link from "next/link";
import { FINANCE, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { wib } from "@/lib/format";
import { STATUS } from "@/lib/regs";
import { getSettings } from "@/lib/settings";

export default async function Peserta({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; k?: string }> }) {
  await requireAdmin(FINANCE);
  const [sp, s] = await Promise.all([searchParams, getSettings()]);
  const q = (sp.q ?? "").slice(0, 80);
  const status = Object.keys(STATUS).includes(sp.status ?? "") ? sp.status! : "";
  const k = s.kategori.some((x) => x.id === sp.k) ? sp.k! : "";
  const ps = await prisma.participant.findMany({
    where: {
      ...(status ? { registration: { status } } : {}),
      ...(k ? { category: k } : {}),
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { ticketCode: { contains: q.toUpperCase() } }, { email: { contains: q.toLowerCase() } }, { nik: { contains: q } }, { city: { contains: q, mode: "insensitive" } }] } : {}),
    },
    include: { registration: true }, orderBy: { createdAt: "desc" }, take: 500,
  });
  const url = (o: { status?: string; k?: string }) => `/mjpadmin/peserta?${new URLSearchParams({ status: o.status ?? status, k: o.k ?? k, q })}`;
  const chip = (v: string, l: string) => <Link href={url({ status: v })} className={`pill ${status === v ? "k" : "g"}`}>{l}</Link>;
  const kchip = (v: string, l: string) => <Link href={url({ k: v })} className={`pill ${k === v ? "k" : "g"}`}>{l}</Link>;
  return (
    <>
      <p className="eb">Pelari</p><h1 style={{ marginTop: 10 }}>Daftar <span className="it">pelari.</span> <span className="muted" style={{ fontSize: 28 }}>{ps.length}</span></h1>
      <div className="row" style={{ margin: "20px 0" }}>
        <form><input name="q" defaultValue={q} className="search" placeholder="Cari nama, NIK, kota, kode, email" /><input type="hidden" name="status" value={status} /><input type="hidden" name="k" value={k} /></form>
        {chip("", "Semua")}{chip("PAID", "Lunas")}{chip("PENDING", "Menunggu")}{chip("VERIFY", "Cek bayar")}
        <a href={`/api/mjpadmin/ekspor${k ? `?k=${k}` : ""}`} className="btn w sm">Unduh CSV</a>
      </div>
      <div className="row" style={{ margin: "-8px 0 20px" }}><span className="muted small">Kategori</span>{kchip("", "Semua")}{s.kategori.map((x) => <span key={x.id}>{kchip(x.id, `${x.nama} ${x.jarak}`)}</span>)}</div>
      <div className="card tablewrap"><table>
        <thead><tr><th>Kode</th><th>Nama</th><th>Kategori</th><th>Jersey</th><th>Kontak</th><th>Data diri</th><th>Darurat</th><th>Status</th><th>Check in</th></tr></thead>
        <tbody>{ps.map((p) => (
          <tr key={p.id}>
            <td className="mono small">{p.ticketCode}<br /><Link href={`/bayar/${p.registration.code}`} className="muted tiny">{p.registration.code}</Link></td>
            <td><b>{p.name}</b><br /><span className="muted small">{p.city}</span></td>
            <td>{p.categoryName}</td><td><b>{p.jersey}</b></td>
            <td className="small muted">{p.phone}<br />{p.email}</td>
            <td className="small muted">NIK {p.nik}<br />{p.gender} · {p.birthDate} · {p.blood}{p.medical && <><br /><span style={{ color: "var(--batat)" }}>{p.medical}</span></>}</td>
            <td className="small muted">{p.emergencyName}<br />{p.emergencyPhone}</td>
            <td><span className={`pill ${STATUS[p.registration.status][0]}`}>{STATUS[p.registration.status][1]}</span></td>
            <td className="small muted">{p.racepackAt && <>Racepack {wib(p.racepackAt)}<br /></>}{p.startAt && <>Start {wib(p.startAt)}<br /></>}{p.finishAt && <>Finish {wib(p.finishAt)}</>}</td>
          </tr>
        ))}</tbody>
      </table>{ps.length === 0 && <p className="muted" style={{ padding: 16 }}>Tidak ada data.</p>}</div>
    </>
  );
}
