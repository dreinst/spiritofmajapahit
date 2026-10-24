import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { clientIp, guessBlocked, recordMiss } from "@/lib/rate-limit";

// Halaman berbasis kode (bayar, tiket, grup): IP yang terlalu sering menebak kode salah dapat 404 sementara.
export async function guarded<T>(find: () => Promise<T | null | undefined>, ok: (x: T) => boolean = () => true): Promise<T> {
  const ip = clientIp(await headers());
  if (guessBlocked(ip)) notFound();
  const x = await find();
  if (!x || !ok(x)) { recordMiss(ip); notFound(); }
  return x;
}
