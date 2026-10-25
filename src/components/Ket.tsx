import { gambar } from "@/lib/sumber";
import { siteBase } from "@/lib/sites";

// Keterangan singkat di bawah gambar ("Ilustrasi Kala · Sumber"). Judul dan tautannya diambil dari lib/sumber.ts.
export default function Ket({ src, className = "" }: { src: string; className?: string }) {
  const a = gambar(src);
  if (!a) return null;
  return <p className={`ket ${className}`}>{a.judul} · <a href={`${siteBase("payung")}/sumber-aset#${a.id}`}>Sumber</a></p>;
}
