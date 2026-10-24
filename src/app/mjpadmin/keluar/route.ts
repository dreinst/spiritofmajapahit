import { NextResponse } from "next/server";
import { endSession, getAdmin, logAdmin } from "@/lib/admin-auth";

// Keluar lewat form biasa (dipakai layar scan petugas). Origin dicek supaya situs lain tidak bisa memaksa keluar.
export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) return new NextResponse("Tidak diizinkan", { status: 403 });
  const a = await getAdmin();
  if (a) await logAdmin(a.username, "logout");
  await endSession(a?.id);
  return new NextResponse(null, { status: 303, headers: { Location: "/mjpadmin/login" } });
}
