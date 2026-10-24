import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { clientIp, guessBlocked, limited, recordMiss } from "@/lib/rate-limit";

// Halaman berbasis kode (bayar, tiket): kode yang sah selalu bisa dibuka, walau satu IP dipakai bersama
// (CGNAT seluler, Wi-Fi venue). Yang dibatasi hanya tebakan salah dan jumlah permintaan per IP.
export async function guarded<T>(find: () => Promise<T | null | undefined>, ok: (x: T) => boolean = () => true): Promise<T> {
  const ip = clientIp(await headers());
  if (limited(`kode:${ip}`, 600, 10 * 60_000)) notFound();
  const x = await find();
  if (x && ok(x)) return x;
  if (!guessBlocked(ip)) recordMiss(ip);
  notFound();
}
