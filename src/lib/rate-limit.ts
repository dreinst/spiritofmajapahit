// Batas sederhana per IP di memori; cukup untuk satu container.
// Disimpan di globalThis: Next memuat route API dan halaman sebagai salinan modul terpisah, padahal hitungannya harus sama.
const g = globalThis as unknown as { __mjpHits?: Map<string, number[]> };
const hits = (g.__mjpHits ??= new Map<string, number[]>());
const HOUR = 60 * 60_000;

function prune(now: number) {
  // Buang hanya catatan yang sudah basi, jangan mengosongkan semua (itu ikut menghapus hitungan penyerang).
  for (const [k, list] of hits) if (now - list[list.length - 1] > HOUR) hits.delete(k);
}

export function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) prune(now);
  return list.length > max;
}

// Hitung kejadian tanpa menambah (dipakai untuk menghitung yang gagal saja).
export function recent(key: string, windowMs: number) {
  const now = Date.now();
  return (hits.get(key) ?? []).filter((t) => now - t < windowMs).length;
}
export function note(key: string) {
  const now = Date.now();
  hits.set(key, [...(hits.get(key) ?? []).filter((t) => now - t < HOUR), now]);
  if (hits.size > 5000) prune(now);
}

// Tebakan kode tagihan/tiket: yang dihitung hanya kode yang tidak ada, jadi pemilik asli tidak ikut terbatasi.
const MISS_MAX = 60, MISS_WINDOW = 10 * 60_000;
export const guessBlocked = (ip: string) => recent(`miss:${ip}`, MISS_WINDOW) >= MISS_MAX;
export const recordMiss = (ip: string) => note(`miss:${ip}`);

export const clientIp = (h: Headers) => h.get("x-forwarded-for")?.split(",")[0]?.trim() || "lokal";
