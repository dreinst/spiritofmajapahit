import { prisma } from "@/lib/db";

// Tagihan yang lewat batas waktu ditandai kedaluwarsa saat dibuka (tanpa cron).
export async function loadRegistration(code: string) {
  const reg = await prisma.registration.findUnique({ where: { code }, include: { participants: { orderBy: { createdAt: "asc" } }, items: true } });
  if (reg && reg.status === "PENDING" && reg.expiresAt < new Date()) {
    await prisma.registration.update({ where: { code }, data: { status: "EXPIRED" } });
    reg.status = "EXPIRED";
  }
  return reg;
}

export const STATUS: Record<string, [string, string]> = {
  PENDING: ["g", "Menunggu bayar"],
  VERIFY: ["warn", "Cek pembayaran"],
  PAID: ["ok", "Lunas"],
  EXPIRED: ["g", "Kedaluwarsa"],
  REJECTED: ["r", "Bukti ditolak"],
};

export const itemLabel = (i: { kind: string; name: string; variant: string | null; qty: number; nights: number }) =>
  i.kind === "KAMAR" ? `${i.name} × ${i.qty}, ${i.nights} malam` : `${i.name}${i.variant ? ` (${i.variant})` : ""} × ${i.qty}`;
