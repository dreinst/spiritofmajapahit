// Size chart sementara: tabel jersey O-neck reguler dari vendor BMPD (20 Okt 2026), dipakai sampai vendor jersey Majapahit mengirim tabelnya. Semua dalam cm.
export const SIZE_CHART = [
  { size: "XS", lebar: 48, panjang: 66, bahu: 14.2, lenganPendek: 18, lenganPanjang: 55, lingkarLenganPendek: 17, lingkarLenganPanjang: 21, kerah: 41, lingkarBahu: 20 },
  { size: "S", lebar: 50, panjang: 68, bahu: 15.2, lenganPendek: 19, lenganPanjang: 56, lingkarLenganPendek: 17.5, lingkarLenganPanjang: 21.5, kerah: 42, lingkarBahu: 21 },
  { size: "M", lebar: 52, panjang: 70, bahu: 16.2, lenganPendek: 19, lenganPanjang: 57, lingkarLenganPendek: 18, lingkarLenganPanjang: 21.8, kerah: 43, lingkarBahu: 21 },
  { size: "L", lebar: 54, panjang: 72, bahu: 17.2, lenganPendek: 20, lenganPanjang: 58, lingkarLenganPendek: 18.5, lingkarLenganPanjang: 22.2, kerah: 44, lingkarBahu: 22 },
  { size: "XL", lebar: 56, panjang: 74, bahu: 18.2, lenganPendek: 20, lenganPanjang: 59, lingkarLenganPendek: 19, lingkarLenganPanjang: 22.5, kerah: 45, lingkarBahu: 22 },
  { size: "2XL", lebar: 58, panjang: 76, bahu: 19.2, lenganPendek: 21, lenganPanjang: 60, lingkarLenganPendek: 19.5, lingkarLenganPanjang: 22.5, kerah: 45.5, lingkarBahu: 23 },
  { size: "3XL", lebar: 60, panjang: 78, bahu: 20.2, lenganPendek: 22, lenganPanjang: 61, lingkarLenganPendek: 20, lingkarLenganPanjang: 23.2, kerah: 46.5, lingkarBahu: 24 },
  { size: "4XL", lebar: 62, panjang: 80, bahu: 21.2, lenganPendek: 23, lenganPanjang: 62, lingkarLenganPendek: 20.5, lingkarLenganPanjang: 23.7, kerah: 47.5, lingkarBahu: 25 },
  { size: "5XL", lebar: 64, panjang: 82, bahu: 22.2, lenganPendek: 24, lenganPanjang: 63, lingkarLenganPendek: 21, lingkarLenganPanjang: 23.7, kerah: 48.5, lingkarBahu: 26 },
] as const;

// Saran ukuran dari lebar dada kaos favorit: ukuran terkecil yang lebarnya tidak kurang dari ukuran pengguna.
export const sarankan = (lebarCm: number) => SIZE_CHART.find((s) => s.lebar >= lebarCm)?.size ?? "5XL";
