import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySignature } from "@/lib/midtrans";
import { markPaid } from "@/lib/payments";

// Notification URL Midtrans: https://majapahit.dpro.events/api/midtrans
export async function POST(req: Request) {
  const n = await req.json().catch(() => null);
  if (!n || !verifySignature(n)) return NextResponse.json({ ok: false }, { status: 403 });
  const reg = await prisma.registration.findUnique({ where: { code: n.order_id } });
  if (!reg) return NextResponse.json({ ok: false });
  if (String(Number(n.gross_amount)) !== String(reg.total)) return NextResponse.json({ ok: false }, { status: 400 });
  const st = n.transaction_status;
  // transaction_status tidak ikut ditandatangani, status_code ikut; lunas hanya kalau status_code yang ditandatangani 200.
  if (n.status_code === "200" && (st === "settlement" || (st === "capture" && n.fraud_status === "accept"))) await markPaid(reg.code, `midtrans:${n.payment_type ?? ""}`);
  else if (["expire", "cancel", "deny"].includes(st)) await prisma.registration.updateMany({ where: { code: reg.code, status: "PENDING" }, data: { status: "EXPIRED", snapToken: null } });
  return NextResponse.json({ ok: true });
}
