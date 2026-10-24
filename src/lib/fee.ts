// Biaya layanan QRIS supaya MDR GoPay tidak memotong harga panitia.
// Data GoBiz KUWERA (29 Sep sampai 5 Okt 2026): transaksi sampai Rp 500.000 kena MDR 0%, di atasnya 0,3%.
// Biaya dihitung dari nominal terbesar yang mungkin (harga + kode unik 2.999) lalu dibulatkan ke atas per Rp 1.000,
// jadi kode unik (biaya admin Rp 1.000 sampai 1.999) tetap utuh untuk menutup potongan tarik saldo (aturan KUWERA).
export type FeeRule = { mdrPersen: number; mdrBatas: number };

export function biayaQris(harga: number, r: FeeRule) {
  const rate = r.mdrPersen / 100;
  if (rate <= 0 || harga <= 0 || harga + 2999 <= r.mdrBatas) return 0;
  return Math.ceil(((harga + 2999) * rate) / (1 - rate) / 1000) * 1000;
}
