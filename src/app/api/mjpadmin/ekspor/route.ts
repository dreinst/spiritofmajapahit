import { FINANCE, getAdmin, logAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { itemLabel } from "@/lib/regs";

// Awalan = + - @ di sel dinetralkan supaya CSV tidak menjalankan rumus saat dibuka di Excel.
const esc = (v: unknown) => { let s = String(v ?? ""); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };

export async function GET(req: Request) {
  const a = await getAdmin();
  if (!a || !FINANCE.includes(a.role)) return new Response("Tidak diizinkan", { status: 403 });
  const sp = new URL(req.url).searchParams;
  const k = (sp.get("k") ?? "").slice(0, 40), e = (sp.get("e") ?? "").slice(0, 10);
  const ps = await prisma.participant.findMany({ where: { ...(k ? { category: k } : {}), ...(e ? { registration: { event: e } } : {}) }, include: { registration: { include: { items: true } } }, orderBy: { createdAt: "asc" } });
  const head = ["Kode tiket", "Kode pesanan", "Acara", "Status", "Kategori", "Nama", "NIK", "Jenis kelamin", "Tanggal lahir", "Golongan darah", "Kota", "WhatsApp", "Email", "Kontak darurat", "HP darurat", "Riwayat penyakit", "Jersey", "BIB", "Pemesan", "Add on pesanan", "Racepack", "Start", "Finish"];
  const rows = ps.map((p) => [p.ticketCode, p.registration.code, p.registration.event, p.registration.status, p.categoryName, p.name, p.nik, p.gender, p.birthDate, p.blood, p.city, p.phone, p.email, p.emergencyName, p.emergencyPhone, p.medical, p.jersey, p.bib, p.registration.buyerName,
    p.registration.items.map(itemLabel).join("; "), p.racepackAt?.toISOString(), p.startAt?.toISOString(), p.finishAt?.toISOString()]);
  await logAdmin(a.username, "ekspor", `${ps.length} baris`);
  return new Response("﻿" + [head, ...rows].map((r) => r.map(esc).join(",")).join("\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="peserta-majapahit-2027${e ? `-${e}` : ""}${k ? `-${k}` : ""}.csv"`, "Cache-Control": "no-store" } });
}
