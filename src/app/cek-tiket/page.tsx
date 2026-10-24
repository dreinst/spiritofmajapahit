import { headers } from "next/headers";
import { ORDER_RE, TICKET_RE } from "@/lib/codes";
import { redirect } from "next/navigation";
import Shell from "@/components/Shell";
import { prisma } from "@/lib/db";
import { button, esc, mailLayout, sendMail, siteUrl } from "@/lib/mail";
import { clientIp, limited } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const metadata = { title: "Cek tiket" };

async function cari(form: FormData) {
  "use server";
  const q = String(form.get("q") ?? "").trim().slice(0, 120);
  const ip = clientIp(await headers());
  if (!q || limited(`cek:${ip}`, 8, 10 * 60_000)) redirect("/cek-tiket?m=batas");
  const up = q.toUpperCase();
  if (ORDER_RE.test(up)) redirect(`/bayar/${up}`);
  if (TICKET_RE.test(up)) redirect(`/tiket/${up}`);
  // Pencarian email tidak pernah menampilkan data di layar; tautan dikirim ke email itu sendiri.
  const email = q.toLowerCase();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const ps = await prisma.participant.findMany({ where: { email }, include: { registration: true } });
    const regs = await prisma.registration.findMany({ where: { buyerEmail: email } });
    const links = [
      ...ps.filter((p) => p.registration.status === "PAID").map((p) => button(`${siteUrl()}/tiket/${p.ticketCode}`, `E-ticket ${esc(p.name)}`)),
      ...regs.filter((r) => r.status !== "PAID").map((r) => button(`${siteUrl()}/bayar/${r.code}`, `Tagihan ${r.code}`)),
    ];
    // Maksimal 3 email per alamat per jam, supaya kotak masuk peserta tidak bisa dibanjiri dari banyak jaringan.
    if (links.length && !limited(`cekmail:${email}`, 3, 60 * 60_000)) await sendMail(email, "Tautan e-ticket dan tagihan Majapahit Trail Run", mailLayout("Tautan e-ticket dan tagihan Anda", links.join("")));
  }
  redirect("/cek-tiket?m=terkirim");
}

export default async function Cek({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m } = await searchParams;
  return (
    <Shell>
      <div className="narrow" style={{ maxWidth: 680, paddingTop: 40, paddingBottom: 100, position: "relative" }}>
        <p className="eb rel">Cek tiket</p>
        <h1 className="rel" style={{ fontSize: "clamp(50px,7vw,88px)", marginTop: 10 }}>Cari <span className="it">e-ticket.</span></h1>
        <p className="muted rel" style={{ marginTop: 12 }}>Masukkan kode tiket (MJP-XXXXX), kode pesanan (MJP-2027-XXXXX), atau email yang dipakai saat mendaftar. Untuk pencarian lewat email, tautannya kami kirim ke email tersebut.</p>
        <form action={cari} className="card rel" style={{ marginTop: 26, padding: 28 }}>
          <div className="field"><label htmlFor="q">Kode atau email</label><input id="q" name="q" className="input" required maxLength={120} autoComplete="email" /></div>
          {m === "terkirim" && <p className="note" style={{ marginTop: 14 }}>Kalau email tersebut terdaftar, tautannya sudah kami kirim. Cek juga folder spam ya.</p>}
          {m === "batas" && <p className="err" style={{ marginTop: 14 }}>Terlalu banyak percobaan. Coba lagi beberapa menit lagi ya.</p>}
          <button className="btn k full lg" style={{ marginTop: 18 }}>Cari</button>
        </form>
      </div>
    </Shell>
  );
}
