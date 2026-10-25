import { prisma } from "@/lib/db";
import { button, esc, mailLayout, sendMail } from "@/lib/mail";
import { isEvent, siteBase, SITES } from "@/lib/sites";

// Nama, tanggal, dan domain acara untuk isi email.
const info = (event: string) => { const k = isEvent(event) ? event : "trail"; return { ...SITES[k], base: siteBase(k), trail: k === "trail" }; };
import { rupiah } from "@/lib/format";
import { itemLabel } from "@/lib/regs";
import { bentrokKedaluwarsa } from "@/lib/registration";

// Menandai lunas sekali saja (idempoten), lalu mengirim e-ticket ke tiap pelari.
export async function markPaid(code: string, via: string) {
  // Pesanan kedaluwarsa hanya boleh lunas kalau slot dan NIK-nya belum dipakai pesanan lain.
  if (await bentrokKedaluwarsa(code)) return false;
  const updated = await prisma.registration.updateMany({
    where: { code, status: { in: ["PENDING", "VERIFY", "EXPIRED"] } },
    data: { status: "PAID", paidAt: new Date(), paidVia: via, rejectReason: null },
  });
  if (updated.count === 0) return false;
  await sendTickets(code);
  return true;
}

export async function sendTickets(code: string) {
  const reg = await prisma.registration.findUnique({ where: { code }, include: { participants: true, items: true } });
  if (!reg) return;
  const a = info(reg.event);
  const ambil = a.trail ? "diambil bersama racepack" : "diambil di meja penukaran tiket";
  const addon = reg.items.length ? `<p style="line-height:1.6">Add on pesanan ${reg.code}: ${reg.items.map((i) => esc(itemLabel(i))).join(", ")}. Add on ${ambil}.</p>` : "";
  // Tiket konser/musical journey milik satu pemesan dikirim ke email yang sama; satu email per tiket tetap dikirim supaya tiap QR terpisah.
  for (const p of reg.participants) {
    const isi = a.trail
      ? `Kategori <b>${esc(p.categoryName)}</b>, jersey ukuran <b>${esc(p.jersey)}</b>. Tunjukkan QR pada e-ticket saat mengambil racepack ya.`
      : `Tiket <b>${esc(p.categoryName)}</b> atas nama <b>${esc(p.name)}</b>. Tunjukkan QR pada e-ticket di pintu masuk ya.`;
    const ok = await sendMail(
      p.email,
      `E-ticket ${a.nama} 2027: ${p.ticketCode}`,
      mailLayout(
        `Halo ${esc(p.name.split(" ")[0])}, e-ticket Anda sudah terbit`,
        `<p style="line-height:1.6">Terima kasih, pembayaran Anda sudah kami terima. ${isi}</p>
         <p style="font-size:20px;font-weight:bold;letter-spacing:2px">${p.ticketCode}</p>${button(`${a.base}/tiket/${p.ticketCode}`, "Lihat e-ticket")}${p.email === reg.buyerEmail ? addon : ""}`,
        a.nama, a.tanggal,
      ),
    );
    if (ok) await prisma.participant.update({ where: { id: p.id }, data: { ticketSentAt: new Date() } });
  }
  // Pemesan yang bukan pelari tetap mendapat konfirmasi (misalnya membelikan tiket untuk keluarga).
  if (!reg.participants.some((p) => p.email === reg.buyerEmail)) {
    await sendMail(reg.buyerEmail, `Pembayaran ${reg.code} sudah diterima`, mailLayout("Pembayaran Anda sudah kami terima", `<p style="line-height:1.6">Total ${rupiah(reg.total)}. E-ticket sudah dikirim ke email masing-masing pelari.</p>${addon}${button(`${a.base}/bayar/${reg.code}`, "Lihat pesanan")}`, a.nama, a.tanggal));
  }
}

export async function sendPaymentLink(code: string) {
  const reg = await prisma.registration.findUnique({ where: { code } });
  if (!reg) return;
  const a = info(reg.event);
  await sendMail(
    reg.buyerEmail,
    `Selesaikan pembayaran ${a.nama} (${reg.code})`,
    mailLayout(`Halo ${esc(reg.buyerName.split(" ")[0])}, pesanan Anda sudah tercatat`, `<p style="line-height:1.6">Total pembayaran ${rupiah(reg.total)}. Yuk selesaikan dalam 24 jam supaya ${a.trail ? "slot" : "tiket"} Anda tidak lepas.</p>${button(`${a.base}/bayar/${reg.code}`, "Bayar sekarang")}`, a.nama, a.tanggal),
  );
}
