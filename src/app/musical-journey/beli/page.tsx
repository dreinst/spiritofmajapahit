import { Suspense } from "react";
import Shell from "@/components/Shell";
import TiketForm from "@/components/TiketForm";
import { paymentMode } from "@/lib/midtrans";
import { checkInAcara, getSettings, pilihanAcara, terpakai } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata = { title: { absolute: "Beli tiket Musical Journey 2027" }, robots: { index: false } };

export default async function Beli() {
  const [s, used] = await Promise.all([getSettings(), terpakai()]);
  const pilihan = pilihanAcara(s, "mj");
  const sisa = Object.fromEntries(pilihan.map((p) => [p.id, Math.max(0, p.kuota - (used[p.id] ?? 0))]));
  return (
    <Shell site="mj" cta={false} wa={false}>
      {s.dibuka ? (
        <Suspense><TiketForm event="mj" nama="Musical Journey" pilihan={pilihan} sisa={sisa} settings={s} checkIn={checkInAcara(s, "mj")} qrisOnly={paymentMode() === "manual"} /></Suspense>
      ) : (
        <div className="pagehead" style={{ minHeight: "60vh", paddingTop: 80 }}><p className="eb">Tiket</p><h1>Penjualan tiket sedang <span className="it">ditutup.</span></h1></div>
      )}
    </Shell>
  );
}
