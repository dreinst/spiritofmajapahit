import { NextResponse } from "next/server";
import { clientIp, limited } from "@/lib/rate-limit";
import { createOrder, orderSchema } from "@/lib/registration";
import { sendPaymentLink } from "@/lib/payments";

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (limited(`daftar:${ip}`, 10, 10 * 60_000)) return NextResponse.json({ error: "Terlalu banyak percobaan, coba lagi beberapa menit lagi" }, { status: 429 });
  const parsed = orderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  try {
    const out = await createOrder(parsed.data);
    // Email tautan bayar dikirim di belakang supaya pendaftar tidak menunggu SMTP.
    void sendPaymentLink(out.code).catch(() => {});
    return NextResponse.json(out);
  } catch (e) {
    // Pesan yang sengaja ditulis untuk pendaftar (Error biasa) diteruskan; galat database dan lainnya tidak.
    if (e instanceof Error && e.name === "Error") return NextResponse.json({ error: e.message }, { status: 400 });
    console.error("daftar gagal", e);
    return NextResponse.json({ error: "Pendaftaran gagal, silakan coba lagi sebentar lagi" }, { status: 500 });
  }
}
