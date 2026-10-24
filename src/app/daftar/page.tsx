import { Suspense } from "react";
import DaftarForm from "@/components/DaftarForm";
import Shell from "@/components/Shell";
import { paymentMode } from "@/lib/midtrans";
import { getSettings, terpakai } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata = { title: "Daftar", description: "Daftar Majapahit Trail Run 2027: pilih kategori, ukuran jersey, lalu tambah kamar atau merchandise dalam satu pesanan." };

export default async function Daftar() {
  const [s, used] = await Promise.all([getSettings(), terpakai()]);
  const sisa = Object.fromEntries(s.kategori.map((k) => [k.id, Math.max(0, k.kuota - (used[k.id] ?? 0))]));
  return (
    <Shell cta={false} wa={false}>
      {s.dibuka ? (
        <Suspense><DaftarForm qrisOnly={paymentMode() === "manual"} settings={s} sisa={sisa} /></Suspense>
      ) : (
        <div className="pagehead" style={{ minHeight: "60vh", paddingTop: 80 }}><p className="eb">Pendaftaran</p><h1>Pendaftaran sedang <span className="it">ditutup.</span></h1><p className="muted" style={{ marginTop: 12 }}>Ikuti kabar pembukaannya lewat panitia, kami senang membantu.</p></div>
      )}
    </Shell>
  );
}
