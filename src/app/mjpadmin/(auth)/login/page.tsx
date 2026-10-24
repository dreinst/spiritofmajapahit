import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { Surya } from "@/components/Brand";
import { getAdmin, homeFor } from "@/lib/admin-auth";

export const metadata = { title: "Masuk panitia" };

export default async function Login() {
  const a = await getAdmin();
  if (a) redirect(homeFor(a.role));
  return (
    <main style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
            <div className="rel" style={{ padding: "clamp(24px,4vw,56px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 40 }}>
        <span className="row" style={{ color: "var(--bata)" }}><Surya size={40} /><b className="disp" style={{ fontSize: 22, color: "var(--ink)" }}>Majapahit Trail Run 2027</b></span>
        <div><p className="eb">Ruang panitia dan crew</p><h1 style={{ fontSize: "clamp(48px,6vw,84px)", marginTop: 16 }}>Selamat datang <span className="it">kembali.</span></h1>
          <p className="muted" style={{ fontSize: 17, marginTop: 18, maxWidth: 440 }}>Pantau pendaftaran, cek bukti bayar, atur kategori dan add on, lalu scan e-ticket di lokasi dari satu tempat.</p></div>
        <p className="muted small">Made by dreinst | Organized by D&apos;PRO</p>
      </div>
      <div className="rel" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(16px,4vw,56px)" }}><LoginForm /></div>
    </main>
  );
}
