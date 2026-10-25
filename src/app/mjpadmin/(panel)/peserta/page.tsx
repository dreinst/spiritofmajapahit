import Link from "next/link";
import { FINANCE, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { wib } from "@/lib/format";
import { STATUS } from "@/lib/regs";
import { getSettings, pilihanAcara } from "@/lib/settings";
import { EVENT_KEYS, isEvent, SITES } from "@/lib/sites";

export default async function Peserta({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; k?: string; e?: string }> }) {
  await requireAdmin(FINANCE);
  const [sp, s] = await Promise.all([searchParams, getSettings()]);
  const q = (sp.q ?? "").slice(0, 80);
  const status = Object.keys(STATUS).includes(sp.status ?? "") ? sp.status! : "";
  const e = isEvent(sp.e ?? "") ? sp.e! : "";
  const semua = EVENT_KEYS.flatMap((ev) => pilihanAcara(s, ev).map((p) => ({ ...p, ev })));
  const k = semua.some((x) => x.id === sp.k) ? sp.k! : "";
  const ps = await prisma.participant.findMany({
    where: {
      ...(status || e ? { registration: { ...(status ? { status } : {}), ...(e ? { event: e } : {}) } } : {}),
      ...(k ? { category: k } : {}),
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { ticketCode: { contains: q.toUpperCase() } }, { email: { contains: q.toLowerCase() } }, { nik: { contains: q } }, { city: { contains: q, mode: "insensitive" } }] } : {}),
    },
    include: { registration: true }, orderBy: { createdAt: "desc" }, take: 500,
  });
  const url = (o: { status?: string; k?: string; e?: string }) => `/mjpadmin/peserta?${new URLSearchParams({ status: o.status ?? status, k: o.k ?? k, e: o.e ?? e, q })}`;
  const echip = (v: string, l: string) => <Link href={url({ e: v, k: "" })} className={`pill ${e === v ? "k" : "g"}`}>{l}</Link>;
  const chip = (v: string, l: string) => <Link href={url({ status: v })} className={`pill ${status === v ? "k" : "g"}`}>{l}</Link>;
  const kchip = (v: string, l: string) => <Link href={url({ k: v })} className={`pill ${k === v ? "k" : "g"}`}>{l}</Link>;
  return (
    <>
      <p className="eb">Pelari dan pemegang tiket</p><h1 style={{ marginTop: 10 }}>Daftar <span className="it">peserta.</span> <span className="muted" style={{ fontSize: 28 }}>{ps.length}</span></h1>
      <div className="row" style={{ margin: "20px 0" }}>
        <form><input name="q" defaultValue={q} className="search" placeholder="Cari nama, NIK, kota, kode, email" /><input type="hidden" name="status" value={status} /><input type="hidden" name="k" value={k} /><input type="hidden" name="e" value={e} /></form>
        {chip("", "Semua")}{chip("PAID", "Lunas")}{chip("PENDING", "Menunggu")}{chip("VERIFY", "Cek bayar")}
        <a href={`/api/mjpadmin/ekspor?${new URLSearchParams({ k, e })}`} className="btn w sm">Unduh CSV</a>
      </div>
      <div className="row" style={{ margin: "-8px 0 12px" }}><span className="muted small">Acara</span>{echip("", "Semua")}{EVENT_KEYS.map((v) => <span key={v}>{echip(v, SITES[v].singkat)}</span>)}</div>
      <div className="row" style={{ margin: "0 0 20px" }}><span className="muted small">Kategori</span>{kchip("", "Semua")}{semua.filter((x) => !e || x.ev === e).map((x) => <span key={x.id}>{kchip(x.id, x.label)}</span>)}</div>
      <div className="card tablewrap"><table>
        <thead><tr><th>Kode</th><th>Nama</th><th>Acara</th><th>Jersey</th><th>Kontak</th><th>Data diri</th><th>Darurat</th><th>Status</th><th>Check in</th></tr></thead>
        <tbody>{ps.map((p) => (
          <tr key={p.id}>
            <td className="mono small">{p.ticketCode}<br /><Link href={`/bayar/${p.registration.code}`} className="muted tiny">{p.registration.code}</Link></td>
            <td><b>{p.name}</b><br /><span className="muted small">{p.city}</span></td>
            <td>{SITES[isEvent(p.registration.event) ? p.registration.event : "trail"].singkat}<br /><span className="muted small">{p.categoryName}</span></td><td><b>{p.jersey ?? "-"}</b></td>
            <td className="small muted">{p.phone}<br />{p.email}</td>
            <td className="small muted">{p.nik ? <>NIK {p.nik}<br />{p.gender} · {p.birthDate} · {p.blood}</> : "Tiket acara"}{p.medical && <><br /><span style={{ color: "var(--batat)" }}>{p.medical}</span></>}</td>
            <td className="small muted">{p.emergencyName ?? "-"}<br />{p.emergencyPhone}</td>
            <td><span className={`pill ${STATUS[p.registration.status][0]}`}>{STATUS[p.registration.status][1]}</span></td>
            <td className="small muted">{p.racepackAt && <>Racepack {wib(p.racepackAt)}<br /></>}{p.startAt && <>Start {wib(p.startAt)}<br /></>}{p.finishAt && <>Finish {wib(p.finishAt)}</>}</td>
          </tr>
        ))}</tbody>
      </table>{ps.length === 0 && <p className="muted" style={{ padding: 16 }}>Tidak ada data.</p>}</div>
    </>
  );
}
