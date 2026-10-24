import { NextResponse } from "next/server";
import { ORDER_RE } from "@/lib/codes";
import { prisma } from "@/lib/db";
import { clientIp, guessBlocked, recordMiss } from "@/lib/rate-limit";

export async function GET(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  if (!ORDER_RE.test(code)) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  const ip = clientIp(req.headers);
  if (guessBlocked(ip)) return NextResponse.json({ error: "Terlalu banyak percobaan" }, { status: 429 });
  const reg = await prisma.registration.findUnique({ where: { code }, select: { status: true } });
  if (!reg) recordMiss(ip);
  return NextResponse.json({ status: reg?.status ?? "NOT_FOUND" }, { headers: { "Cache-Control": "no-store" } });
}
