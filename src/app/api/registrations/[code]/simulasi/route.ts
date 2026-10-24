import { NextResponse } from "next/server";
import { ORDER_RE } from "@/lib/codes";
import { paymentMode } from "@/lib/midtrans";
import { markPaid } from "@/lib/payments";
import { limited } from "@/lib/rate-limit";

// Hanya ada saat mode uji DAN env SIMULASI=1: menandai tagihan lunas supaya alur e-ticket bisa dicoba.
// Wajib dimatikan (hapus SIMULASI) sebelum website dibuka untuk peserta.
export async function POST(req: Request, ctx: { params: Promise<{ code: string }> }) {
  if (paymentMode() !== "mock" || process.env.SIMULASI !== "1") return NextResponse.json({ error: "Tidak tersedia" }, { status: 404 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "lokal";
  if (limited(`simulasi:${ip}`, 10, 10 * 60_000)) return NextResponse.json({ error: "Terlalu banyak percobaan" }, { status: 429 });
  const { code } = await ctx.params;
  if (!ORDER_RE.test(code)) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  const ok = await markPaid(code, "simulasi");
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}
