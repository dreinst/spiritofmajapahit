import { z } from "zod";

// Pesan galat bawaan zod dalam Bahasa Indonesia.
z.config(z.locales.id());
import { randomInt } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { orderCode, ticketCode } from "@/lib/codes";
import { GOLDAR, JERSEY } from "@/lib/event";
import { paymentMode } from "@/lib/midtrans";
import { getSettings, terpakai, type Settings } from "@/lib/settings";
import { biayaQris } from "@/lib/fee";

// Nomor disimpan dalam bentuk 08..., jadi +62 dan 62 di depan diganti 0.
const phone = z.string().trim().transform((v) => v.replace(/[\s-]/g, "")).pipe(z.string().regex(/^(\+?62|0)8\d{7,12}$/, "Nomor WhatsApp tidak valid")).transform((v) => v.replace(/^\+?62/, "0"));
const email = z.string().trim().toLowerCase().email("Email tidak valid").max(120);
const name = z.string().trim().min(2, "Nama terlalu pendek").max(80).regex(/^[^<>{}]*$/, "Nama mengandung karakter tidak valid");
const text = (max: number) => z.string().trim().max(max).regex(/^[^<>{}]*$/, "Isian mengandung karakter tidak valid");

// Usia minimal 15 tahun di hari lomba (27 Juni 2027), sama dengan ketentuan umum lomba lari.
const cukupUmur = (d: string) => {
  const lahir = new Date(`${d}T00:00:00Z`);
  if (Number.isNaN(lahir.getTime()) || lahir.toISOString().slice(0, 10) !== d) return false;
  const min = new Date("2012-06-27T00:00:00Z");
  return lahir <= min && lahir.getFullYear() >= 1930;
};

export const runnerSchema = z.object({
  category: z.string().min(1).max(40),
  name, phone, email,
  nik: z.string().trim().regex(/^\d{16}$/, "NIK harus 16 digit angka"),
  gender: z.enum(["L", "P"]),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal lahir tidak valid").refine(cukupUmur, "Usia minimal 15 tahun pada hari lomba"),
  blood: z.enum(GOLDAR),
  city: text(60).min(2, "Isi kota domisili"),
  emergencyName: name,
  emergencyPhone: phone,
  medical: text(200).optional().default(""),
  jersey: z.enum(JERSEY),
});

export const orderSchema = z.object({
  buyer: z.object({ name, phone, email }),
  runners: z.array(runnerSchema).min(1, "Tambahkan minimal satu pelari").max(10, "Maksimal 10 pelari per pesanan"),
  rooms: z.array(z.object({ id: z.string().max(40), qty: z.number().int().min(0).max(10), nights: z.number().int().min(1).max(5) })).max(10).default([]),
  merch: z.array(z.object({ id: z.string().max(40), variant: z.enum(JERSEY).optional(), qty: z.number().int().min(0).max(20) })).max(40).default([]),
  method: z.enum(["ONLINE", "MANUAL"]),
  agree: z.literal(true, { message: "Setujui syarat dan ketentuan" }),
});

export type OrderInput = z.infer<typeof orderSchema>;
type Line = { kind: "KAMAR" | "MERCH"; ref: string; name: string; variant: string | null; qty: number; nights: number; price: number; subtotal: number };

// Harga selalu dihitung dari pengaturan server, bukan dari browser. Item yang tidak dikenal diabaikan.
export function quote(input: Pick<OrderInput, "runners" | "rooms" | "merch">, s: Settings) {
  const tiket = input.runners.reduce((a, r) => a + (s.kategori.find((k) => k.id === r.category)?.harga ?? 0), 0);
  const lines: Line[] = [];
  for (const r of input.rooms) {
    const k = s.kamar.find((x) => x.id === r.id);
    const nights = Math.min(r.nights, s.maksMalam);
    if (k && r.qty > 0) lines.push({ kind: "KAMAR", ref: k.id, name: k.nama, variant: null, qty: r.qty, nights, price: k.harga, subtotal: k.harga * r.qty * nights });
  }
  for (const m of input.merch) {
    const p = s.merch.find((x) => x.id === m.id);
    if (p && m.qty > 0 && (!p.ukuran || m.variant)) lines.push({ kind: "MERCH", ref: p.id, name: p.nama, variant: p.ukuran ? m.variant! : null, qty: m.qty, nights: 1, price: p.harga, subtotal: p.harga * m.qty });
  }
  const addon = lines.reduce((a, l) => a + l.subtotal, 0);
  return { tiket, addon, lines, total: tiket + addon };
}

const EXPIRE_MS = 24 * 60 * 60 * 1000;

// Kode unik sekaligus biaya admin Rp 1.000 sampai 1.999 supaya tidak ada dua tagihan aktif dengan nominal sama;
// pembayaran QRIS dicocokkan panitia lewat nominal di riwayat GoPay Merchant (pola KUWERA dan BMPD).
async function pickUniqueCode(base: number, tx: Prisma.TransactionClient) {
  const since = new Date(Date.now() - EXPIRE_MS);
  const rows = await tx.registration.findMany({ where: { uniqueCode: { gt: 0 }, OR: [{ status: "VERIFY" }, { status: { in: ["PENDING", "EXPIRED"] }, expiresAt: { gt: since } }] }, select: { total: true } });
  const taken = new Set(rows.map((r) => r.total));
  for (const [lo, hi] of [[1000, 1999], [2000, 2999]]) {
    const free: number[] = [];
    for (let c = lo; c <= hi; c++) if (!taken.has(base + c)) free.push(c);
    if (free.length) return free[randomInt(free.length)];
  }
  throw new Error("Pendaftaran sedang ramai, silakan coba lagi beberapa menit lagi");
}

export async function createOrder(input: OrderInput) {
  const s = await getSettings();
  if (!s.dibuka) throw new Error("Pendaftaran sedang ditutup");
  for (const r of input.runners) if (!s.kategori.some((k) => k.id === r.category)) throw new Error("Kategori tidak tersedia, silakan pilih ulang");
  const niks = input.runners.map((r) => r.nik);
  if (new Set(niks).size !== niks.length) throw new Error("NIK yang sama tidak bisa didaftarkan dua kali");
  const q = quote(input, s);
  const manual = paymentMode() === "manual";

  const reg = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(272027)`;
    // Kuota dan NIK dicek di dalam kunci supaya dua pendaftar tidak sama-sama mengambil slot terakhir.
    const used = await terpakai();
    for (const k of s.kategori) {
      const n = input.runners.filter((r) => r.category === k.id).length;
      if (n && (used[k.id] ?? 0) + n > k.kuota) throw new Error(`Kuota ${k.nama} ${k.jarak} sudah penuh`);
    }
    const dobel = await tx.participant.findFirst({ where: { nik: { in: niks }, registration: { OR: [{ status: { in: ["PAID", "VERIFY"] } }, { status: "PENDING", expiresAt: { gt: new Date() } }] } }, select: { nik: true } });
    if (dobel) throw new Error("Salah satu NIK sudah punya pendaftaran aktif. Cek email Anda atau menu Cek tiket, atau hubungi panitia");
    const f = manual ? biayaQris(q.total, s) : 0;
    const u = manual ? await pickUniqueCode(q.total + f, tx) : 0;
    return tx.registration.create({
      data: {
        code: orderCode(), buyerName: input.buyer.name, buyerPhone: input.buyer.phone, buyerEmail: input.buyer.email,
        amountTicket: q.tiket, amountAddon: q.addon, fee: f, uniqueCode: u, total: q.total + f + u,
        method: manual ? "MANUAL" : input.method, expiresAt: new Date(Date.now() + EXPIRE_MS),
        participants: {
          create: input.runners.map((r) => {
            const k = s.kategori.find((x) => x.id === r.category)!;
            return { ticketCode: ticketCode(), category: k.id, categoryName: `${k.nama} ${k.jarak}`, price: k.harga, name: r.name, nik: r.nik, gender: r.gender, birthDate: r.birthDate,
              blood: r.blood, phone: r.phone, email: r.email, city: r.city, emergencyName: r.emergencyName, emergencyPhone: r.emergencyPhone, medical: r.medical || null, jersey: r.jersey };
          }),
        },
        items: { create: q.lines },
      },
    });
  });
  return { code: reg.code };
}

// Pesanan kedaluwarsa yang dibayar belakangan: slot dan NIK-nya mungkin sudah dipakai pesanan lain.
// Dipanggil sebelum EXPIRED naik ke VERIFY atau PAID; mengembalikan alasan bentrok, atau null kalau aman.
export async function bentrokKedaluwarsa(code: string) {
  const reg = await prisma.registration.findUnique({ where: { code }, include: { participants: true } });
  // Termasuk PENDING/REJECTED yang batas bayarnya lewat tapi belum ditandai EXPIRED (status diperbarui saat halaman dibuka).
  if (!reg || !["PENDING", "EXPIRED", "REJECTED"].includes(reg.status) || reg.expiresAt > new Date()) return null;
  const aktif = { OR: [{ status: { in: ["PAID", "VERIFY"] } }, { status: "PENDING", expiresAt: { gt: new Date() } }] };
  const dobel = await prisma.participant.findFirst({ where: { nik: { in: reg.participants.map((p) => p.nik) }, registration: { ...aktif, id: { not: reg.id } } }, select: { name: true } });
  if (dobel) return "NIK salah satu pelari sudah punya pendaftaran aktif lain";
  const [s, used] = await Promise.all([getSettings(), terpakai()]);
  for (const k of s.kategori) {
    const n = reg.participants.filter((p) => p.category === k.id).length;
    if (n && (used[k.id] ?? 0) + n > k.kuota) return `Kuota ${k.nama} ${k.jarak} sudah penuh`;
  }
  return null;
}
