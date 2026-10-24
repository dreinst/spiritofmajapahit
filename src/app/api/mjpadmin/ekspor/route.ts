import { FINANCE, getAdmin, logAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { itemLabel } from "@/lib/regs";

// Awalan = + - @ di sel dinetralkan supaya CSV tidak menjalankan rumus saat dibuka di Excel.
const esc = (v: unknown) => { let s = String(v ?? ""); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };

export async function GET(req: Request) {
  const a = await getAdmin();
  if (!a || !FINANCE.includes(a.role)) return new Response("Tidak diizinkan", { status: 403 });
  const k = (new URL(req.url).searchParams.get("k") ?? "").slice(0, 40);
  const ps = await prisma.participant.findMany({ where: k ? { category: k } : {}, include: { registration: { include: { items: true } } }, orderBy: { createdAt: "asc" } });
  const head = ["Kode tiket", "Kode pesanan", "Status", "Kategori", "Nama", "NIK", "Jenis kelamin", "Tanggal lahir", "Golongan darah", "Kota", "WhatsApp", "Email", "Kontak darurat", "HP darurat", "Riwayat penyakit", "Jersey", "BIB", "Pemesan", "Add on pesanan", "Racepack", "Start", "Finish"];
  const rows = ps.map((p) => [p.ticketCode, p.registration.code, p.registration.status, p.categoryName, p.name, p.nik, p.gender, p.birthDate, p.blood, p.city, p.phone, p.email, p.emergencyName, p.emergencyPhone, p.medical, p.jersey, p.bib, p.registration.buyerName,
    p.registration.items.map(itemLabel).join("; "), p.racepackAt?.toISOString(), p.startAt?.toISOString(), p.finishAt?.toISOString()]);
  await logAdmin(a.username, "ekspor", `${ps.length} baris`);
  return new Response("﻿" + [head, ...rows].map((r) => r.map(esc).join(",")).join("\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="pelari-majapahit-2027${k ? `-${k}` : ""}.csv"`, "Cache-Control": "no-store" } });
}
