// Keterangan "Ilustrasi ..." di bawah gambar di situs. Ket.tsx mencari judulnya lewat path gambar.
export type Gambar = { id: string; path: string; judul: string };

export const GAMBAR: Gambar[] = [
  { id: "candi-bentar-pagi", path: "/foto/gapura-pagi-3.webp", judul: "Ilustrasi Candi Bentar" },
  { id: "candi-bentar-malam", path: "/spirit/aset/generated/kage-approach.webp?v=9", judul: "Ilustrasi Candi Bentar" },
  { id: "halaman-gapura", path: "/spirit/aset/generated/kage-sanmon-preview.webp?v=9", judul: "Ilustrasi Halaman Gapura" },
  { id: "paduraksa", path: "/foto/paduraksa-3.webp", judul: "Ilustrasi Gapura Paduraksa" },
  { id: "pintu-paduraksa", path: "/spirit/aset/generated/kage-lantern-court.webp?v=9", judul: "Ilustrasi Lorong Paduraksa" },
  { id: "kala", path: "/foto/kala-3.webp", judul: "Ilustrasi Kala" },
  { id: "pendopo", path: "/spirit/aset/generated/kage-moonwater.webp?v=9", judul: "Ilustrasi Pendopo" },
  { id: "medali-depan", path: "/foto/medali-penataran/depan.webp", judul: "Ilustrasi medali finisher" },
  { id: "medali-candi", path: "/foto/medali-penataran/buka.webp", judul: "Ilustrasi medali terlipat dengan panel candi berdiri" },
  { id: "medali-detail", path: "/foto/medali-penataran/urai.webp", judul: "Ilustrasi medali: animasi lipat, close-up relief dan sendi, koleksi empat tahun, dan tampilan urai" },
];

export const gambar = (path: string) => GAMBAR.find((a) => a.path === path);
