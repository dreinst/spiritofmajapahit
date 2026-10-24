import { NextResponse } from "next/server";
import { ORDER_RE } from "@/lib/codes";
import { prisma } from "@/lib/db";
import { bentrokKedaluwarsa } from "@/lib/registration";
import { clientIp, guessBlocked, limited, recordMiss } from "@/lib/rate-limit";

const MAX = 3 * 1024 * 1024;
// Jenis berkas dicek dari isi (magic bytes), bukan hanya dari label browser yang bisa dipalsukan.
const SIG: [string, (b: Buffer) => boolean][] = [
  ["image/jpeg", (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff],
  ["image/png", (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))],
  ["image/webp", (b) => b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP"],
  ["application/pdf", (b) => b.subarray(0, 5).toString() === "%PDF-"],
];

export async function POST(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  if (!ORDER_RE.test(code)) return NextResponse.json({ error: "Tagihan tidak ditemukan" }, { status: 404 });
  const ip = clientIp(req.headers);
  if (guessBlocked(ip) || limited(`bukti:${ip}`, 10, 10 * 60_000)) return NextResponse.json({ error: "Terlalu banyak unggahan, coba lagi nanti" }, { status: 429 });
  // Tanpa Content-Length (chunked) ukuran baru ketahuan setelah seluruh isi dibaca ke memori, jadi ditolak di depan.
  const len = Number(req.headers.get("content-length"));
  if (!len) return NextResponse.json({ error: "Ukuran file tidak diketahui" }, { status: 411 });
  if (len > MAX + 64 * 1024) return NextResponse.json({ error: "Ukuran file maksimal 3 MB" }, { status: 413 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("bukti");
  if (!(file instanceof File)) return NextResponse.json({ error: "Pilih file bukti transfer" }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "Ukuran file maksimal 3 MB" }, { status: 413 });
  const buf = Buffer.from(await file.arrayBuffer());
  const type = SIG.find(([, test]) => test(buf))?.[0];
  if (!type) return NextResponse.json({ error: "Format harus JPG, PNG, WEBP, atau PDF" }, { status: 415 });
  const bentrok = await bentrokKedaluwarsa(code);
  if (bentrok) return NextResponse.json({ error: `Batas bayar pesanan ini sudah lewat. ${bentrok}. Hubungi panitia lewat WhatsApp ya, kami bantu.` }, { status: 409 });
  const r = await prisma.registration.updateMany({ where: { code, status: { in: ["PENDING", "REJECTED", "EXPIRED"] } }, data: { proof: `data:${type};base64,${buf.toString("base64")}`, proofAt: new Date(), status: "VERIFY", method: "MANUAL" } });
  if (r.count === 0) recordMiss(ip);
  if (r.count === 0) return NextResponse.json({ error: "Tagihan tidak ditemukan atau telah lunas" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
