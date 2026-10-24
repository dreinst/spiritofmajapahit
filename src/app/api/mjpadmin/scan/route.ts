import { NextResponse } from "next/server";
import { getAdmin, logAdmin, SCAN } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { CHECKPOINTS, type Checkpoint } from "@/lib/event";
import { limited } from "@/lib/rate-limit";
import { itemLabel } from "@/lib/regs";

const FIELD = { racepack: "racepackAt", start: "startAt", finish: "finishAt" } as const;
const clean = (c: string) => c.trim().toUpperCase().slice(0, 20);

async function auth() {
  const a = await getAdmin();
  return a && SCAN.includes(a.role) ? a : null;
}
async function find(code: string) {
  return prisma.participant.findUnique({ where: { ticketCode: clean(code) }, include: { registration: { select: { status: true, items: true } } } });
}
const view = (p: NonNullable<Awaited<ReturnType<typeof find>>>) => ({
  code: p.ticketCode, name: p.name, category: p.categoryName, paid: p.registration.status === "PAID", jersey: p.jersey, gender: p.gender, blood: p.blood, bib: p.bib,
  items: p.registration.items.map((i) => ({ label: itemLabel(i), picked: !!i.pickedAt })), racepackAt: p.racepackAt, startAt: p.startAt, finishAt: p.finishAt,
});
export async function GET(req: Request) {
  const a = await auth();
  if (!a) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  if (limited(`scan:${a.id}`, 120, 60_000)) return NextResponse.json({ error: "Terlalu cepat" }, { status: 429 });
  const p = await find(new URL(req.url).searchParams.get("code") ?? "");
  if (!p) return NextResponse.json({ error: "Tiket tidak ditemukan" }, { status: 404 });
  return NextResponse.json(view(p));
}

export async function POST(req: Request) {
  const a = await auth();
  if (!a) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  const { code, cp } = (await req.json().catch(() => ({}))) as { code?: string; cp?: Checkpoint };
  if (!code || !cp || !Object.hasOwn(CHECKPOINTS, cp)) return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  const p = await find(code);
  if (!p) return NextResponse.json({ error: "Tiket tidak ditemukan" }, { status: 404 });
  if (p.registration.status !== "PAID") return NextResponse.json({ error: "Tiket belum lunas" }, { status: 400 });
  // Hanya mengisi kalau masih kosong, supaya scan ganda tidak menimpa jam pertama.
  const r = await prisma.participant.updateMany({ where: { id: p.id, [FIELD[cp]]: null }, data: { [FIELD[cp]]: new Date() } });
  if (r.count) await logAdmin(a.username, "scan", `${CHECKPOINTS[cp]} ${p.ticketCode}`);
  return NextResponse.json(view((await find(code))!));
}
