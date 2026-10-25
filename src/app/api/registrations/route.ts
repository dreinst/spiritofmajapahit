import { NextResponse } from "next/server";
import { clientIp, limited } from "@/lib/rate-limit";
import { createOrder, createTiketOrder, orderSchema, tiketSchema } from "@/lib/registration";
import { sendPaymentLink } from "@/lib/payments";

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (limited(`daftar:${ip}`, 10, 10 * 60_000)) return NextResponse.json({ error: "Terlalu banyak percobaan, coba lagi beberapa menit lagi" }, { status: 429 });
  const body = await req.json().catch(() => null);
  // Tiket konser dan musical journey membawa "event"; tanpa itu dianggap pendaftaran trail run.
  const tiket = body && typeof body === "object" && "event" in body;
  const parsed = tiket ? tiketSchema.safeParse(body) : orderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid, periksa kembali isian" }, { status: 400 });
  try {
    const out = tiket ? await createTiketOrder(parsed.data as never) : await createOrder(parsed.data as never);
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
