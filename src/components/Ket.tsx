import { gambar } from "@/lib/sumber";

// Keterangan singkat di bawah gambar ("Ilustrasi Kala"). Judulnya diambil dari lib/sumber.ts.
export default function Ket({ src, className = "" }: { src: string; className?: string }) {
  const a = gambar(src);
  if (!a) return null;
  return <p className={`ket ${className}`}>{a.judul}</p>;
}
