// Fakta acara yang sudah pasti (tanggal final dari Andrew, 24 Okt 2026). Yang belum pasti
// (kategori, harga, kuota, kamar, merchandise) ada di pengaturan admin, lihat lib/settings.ts.
export const EVENT = {
  nama: "Majapahit Trail Run",
  seri: "The Spirit of Majapahit",
  tahun: 2027,
  tanggal: "Minggu, 27 Juni 2027",
  tanggalPendek: "27.06.2027",
  // Jam start belum ditetapkan; hitung mundur memakai pukul 05.00 WIB sebagai patokan hari H.
  hariH: "2027-06-27T05:00:00+07:00",
  venue: "Aone Trawas",
  lokasi: "Kaki Gunung Penanggungan, Trawas, Mojokerto",
  konser: "3 sampai 4 Juli 2027",
};

export const JERSEY = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"] as const;
export const GENDER = { L: "Laki-laki", P: "Perempuan" } as const;
export const GOLDAR = ["A", "B", "AB", "O", "Belum tahu"] as const;
export const CHECKPOINTS = { racepack: "Racepack", start: "Start", finish: "Finish" } as const;
export type Checkpoint = keyof typeof CHECKPOINTS;
