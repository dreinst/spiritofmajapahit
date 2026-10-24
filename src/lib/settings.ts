import { prisma } from "@/lib/db";

export type Kategori = { id: string; nama: string; jarak: string; elevasi: string; harga: number; kuota: number; ket: string };
export type Kamar = { id: string; nama: string; harga: number; tamu: number; ket: string };
export type Produk = { id: string; nama: string; harga: number; ukuran: boolean; ket: string };
export type Settings = {
  kategori: Kategori[];
  kamar: Kamar[];
  merch: Produk[];
  checkIn: string;
  maksMalam: number;
  jadwalDaftar: string;
  jadwalRacepack: string;
  dibuka: boolean;
  rekening: string;
  mdrPersen: number;
  mdrBatas: number;
};

// Nilai awal hanya contoh (placeholder) untuk uji dan presentasi. Kategori, harga, kuota, kamar, dan
// merchandise belum ditetapkan; panitia menggantinya di /mjpadmin/pengaturan tanpa mengubah kode.
// Satu-satunya angka dari rapat (Plaud 11 Sep 2026): contoh tiket fun trail Rp 500.000, belum final.
const DEFAULTS: Record<string, string> = {
  kategori: JSON.stringify([
    { id: "fun-trail", nama: "Fun Trail", jarak: "7K", elevasi: "± 250 m", harga: 500000, kuota: 500, ket: "Rute pemula melewati kebun dan jalan desa di kaki Penanggungan." },
    { id: "trail-15k", nama: "Trail", jarak: "15K", elevasi: "± 650 m", harga: 650000, kuota: 300, ket: "Tanjakan hutan dan punggungan bukit untuk pelari yang sudah terbiasa trail." },
    { id: "trail-25k", nama: "Ultra Trail", jarak: "25K", elevasi: "± 1.200 m", harga: 850000, kuota: 150, ket: "Rute terpanjang menuju lereng atas dengan batas waktu ketat." },
  ]),
  kamar: JSON.stringify([
    { id: "deluxe", nama: "Kamar Deluxe", harga: 900000, tamu: 2, ket: "Satu kamar untuk dua tamu, termasuk sarapan." },
    { id: "family", nama: "Kamar Keluarga", harga: 1400000, tamu: 4, ket: "Untuk pelari yang datang bersama keluarga, termasuk sarapan." },
  ]),
  merch: JSON.stringify([
    { id: "jersey-tambahan", nama: "Jersey tambahan", harga: 225000, ukuran: true, ket: "Jersey resmi untuk keluarga atau pendukung." },
    { id: "kaos-spirit", nama: "Kaos The Spirit of Majapahit", harga: 150000, ukuran: true, ket: "Kaos katun motif Surya Majapahit." },
    { id: "topi-trail", nama: "Topi trail", harga: 120000, ukuran: false, ket: "Topi ringan dengan bordir gapura." },
    { id: "botol", nama: "Botol minum lipat", harga: 95000, ukuran: false, ket: "Soft flask 500 ml untuk di lintasan." },
  ]),
  checkIn: "Sabtu, 26 Juni 2027",
  maksMalam: "2",
  jadwalDaftar: "Segera diumumkan",
  jadwalRacepack: "Sabtu, 26 Juni 2027",
  dibuka: "1",
  rekening: "Diisi panitia",
  // Tarif GoPay Merchant D'Production (usaha mikro): 0% sampai Rp 500.000, 0,3% di atasnya. Isi 0 kalau panitia menanggung.
  mdrPersen: "0.3",
  mdrBatas: "500000",
};

function list<T>(raw: string, fallback: string): T[] {
  try { const v = JSON.parse(raw); return Array.isArray(v) ? v : JSON.parse(fallback); } catch { return JSON.parse(fallback); }
}

export async function getSettings(): Promise<Settings> {
  const rows = await prisma.setting.findMany();
  const v = { ...DEFAULTS, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) };
  return {
    kategori: list<Kategori>(v.kategori, DEFAULTS.kategori),
    kamar: list<Kamar>(v.kamar, DEFAULTS.kamar),
    merch: list<Produk>(v.merch, DEFAULTS.merch),
    checkIn: v.checkIn,
    maksMalam: Math.min(5, Math.max(1, Number(v.maksMalam) || 1)),
    jadwalDaftar: v.jadwalDaftar,
    jadwalRacepack: v.jadwalRacepack,
    dibuka: v.dibuka === "1",
    rekening: v.rekening,
    mdrPersen: Math.min(5, Math.max(0, Number(v.mdrPersen) || 0)),
    mdrBatas: Math.max(0, Number(v.mdrBatas) || 0),
  };
}

export async function saveSettings(values: Record<string, string>) {
  await prisma.$transaction(
    Object.entries(values).map(([key, value]) => prisma.setting.upsert({ where: { key }, create: { key, value }, update: { value } })),
  );
}

// Kuota terpakai per kategori: tagihan lunas, sedang dicek, atau belum lewat batas bayar.
export async function terpakai() {
  const rows = await prisma.participant.groupBy({
    by: ["category"],
    where: { registration: { OR: [{ status: { in: ["PAID", "VERIFY"] } }, { status: "PENDING", expiresAt: { gt: new Date() } }] } },
    _count: { _all: true },
  });
  return Object.fromEntries(rows.map((r) => [r.category, r._count._all])) as Record<string, number>;
}
