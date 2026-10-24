import { NextResponse } from "next/server";
import { ORDER_RE } from "@/lib/codes";
import { prisma } from "@/lib/db";
import { siteUrl } from "@/lib/mail";
import { createSnapToken, paymentMode } from "@/lib/midtrans";

// Token Snap dibuat sekali lalu disimpan; Midtrans menolak order_id yang sama kalau metode sudah dipilih.
export async function POST(_req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  if (!ORDER_RE.test(code)) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  if (paymentMode() !== "midtrans") return NextResponse.json({ error: "Pembayaran online belum aktif" }, { status: 400 });
  const reg = await prisma.registration.findUnique({ where: { code } });
  if (!reg || reg.status !== "PENDING" || reg.expiresAt < new Date()) return NextResponse.json({ error: "Tagihan tidak bisa dibayar" }, { status: 400 });
  if (reg.snapToken) return NextResponse.json({ token: reg.snapToken });
  try {
    const t = await createSnapToken({ code, total: reg.total, name: reg.buyerName, email: reg.buyerEmail, phone: reg.buyerPhone, expiresAt: reg.expiresAt, finishUrl: `${siteUrl()}/bayar/${code}`, label: "Majapahit Trail Run 2027" });
    await prisma.registration.update({ where: { code }, data: { snapToken: t.token, snapRedirect: t.redirectUrl } });
    return NextResponse.json({ token: t.token });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Gagal menghubungi Midtrans, coba lagi" }, { status: 502 });
  }
}
