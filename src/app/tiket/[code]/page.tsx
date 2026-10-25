import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { TICKET_RE } from "@/lib/codes";
import PrintButton from "@/components/PrintButton";
import Shell from "@/components/Shell";
import { Surya } from "@/components/Brand";
import { prisma } from "@/lib/db";
import { guarded } from "@/lib/guard";
import { GENDER } from "@/lib/event";
import { isEvent, SITES } from "@/lib/sites";
import { wib } from "@/lib/format";
import { itemLabel } from "@/lib/regs";

export const dynamic = "force-dynamic";
export const metadata = { title: "E-ticket", robots: { index: false } };

export default async function Tiket({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!TICKET_RE.test(code)) notFound();
  const p = await guarded(() => prisma.participant.findUnique({ where: { ticketCode: code }, include: { registration: { include: { items: true } } } }), (x) => x.registration.status === "PAID");
  const qr = await QRCode.toDataURL(p.ticketCode, { margin: 0, width: 400, color: { dark: "#1C1310", light: "#ffffff" } });
  const first = p.name.split(" ")[0];
  const cp = (label: string, d: Date | null) => <span className={`pill ${d ? "ok" : "g"}`}>{d ? `✓ ${label} ${wib(d, false)}` : `${label} belum`}</span>;
  const items = p.registration.items;
  const ev = isEvent(p.registration.event) ? p.registration.event : "trail";
  const S = SITES[ev], trail = ev === "trail";
  return (
    <Shell cta={false} site={ev}>
      <div className="narrow" style={{ maxWidth: 1080, paddingTop: 36, paddingBottom: 90 }}>
        <span className="pill ok">Lunas</span>
        <h1 style={{ fontSize: "clamp(48px,7vw,92px)", marginTop: 14 }}>Sampai jumpa, <span className="it">{first}.</span></h1>
        <p className="muted" style={{ marginTop: 10 }}>Tunjukkan QR ini {trail ? "saat mengambil racepack" : "di pintu masuk"} ya. Salinan e-ticket sudah kami kirim ke {p.email}.</p>
        <div className="ticket" style={{ marginTop: 30 }}>
          <div style={{ padding: "clamp(22px,3vw,36px)" }}>
            <div className="between" style={{ alignItems: "center" }}><span className="row" style={{ color: "var(--gold, var(--bata))", ["--surya-dalam" as string]: "var(--surface)" }}><Surya size={30} /><b className="disp" style={{ fontSize: 24, color: "var(--ink)" }}>{S.nama} 2027</b></span><span className="pill k">{p.categoryName}</span></div>
            <div className="kv" style={{ marginTop: 28 }}>
              <div><p className="eb">Nama</p><b>{p.name}</b></div>
              <div><p className="eb">{trail ? "Kategori" : "Kelas tiket"}</p><b>{p.categoryName}</b></div>
              {trail && <>
                <div><p className="eb">Jersey</p><b>{p.jersey}</b></div>
                <div><p className="eb">Nomor BIB</p><b>{p.bib ?? "Dibagikan saat racepack"}</b></div>
                <div><p className="eb">Jenis kelamin</p><b>{GENDER[p.gender as keyof typeof GENDER]}</b></div>
                <div><p className="eb">Golongan darah</p><b>{p.blood}</b></div>
              </>}
              <div><p className="eb">{trail ? "Hari lomba" : "Tanggal"}</p><b>{S.tanggal}</b></div>
              <div><p className="eb">Lokasi</p><b>{S.venue}, Mojokerto</b></div>
            </div>
            {items.length > 0 && <div style={{ marginTop: 22 }}><p className="eb">Add on di pesanan ini</p><p style={{ marginTop: 6, fontWeight: 600 }}>{items.map(itemLabel).join(" · ")}</p></div>}
            <div className="row" style={{ marginTop: 26 }}>{trail ? <>{cp("Racepack", p.racepackAt)}{cp("Start", p.startAt)}{cp("Finish", p.finishAt)}</> : cp("Masuk", p.startAt)}</div>
          </div>
          <div className="stub">
            <p className="eb">Pindai di sini</p>
            <div className="qr"><img src={qr} alt={`QR e-ticket ${p.ticketCode}`} width={200} height={200} /></div>
            <p className="mono" style={{ fontSize: 16, letterSpacing: 3 }}>{p.ticketCode}</p>
            <PrintButton />
          </div>
        </div>
      </div>
    </Shell>
  );
}
