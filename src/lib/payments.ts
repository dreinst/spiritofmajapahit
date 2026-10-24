import { prisma } from "@/lib/db";
import { button, esc, mailLayout, sendMail, siteUrl } from "@/lib/mail";
import { rupiah } from "@/lib/format";
import { itemLabel } from "@/lib/regs";

// Menandai lunas sekali saja (idempoten), lalu mengirim e-ticket ke tiap pelari.
export async function markPaid(code: string, via: string) {
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
  const addon = reg.items.length ? `<p style="line-height:1.6">Add on pesanan ${reg.code}: ${reg.items.map((i) => esc(itemLabel(i))).join(", ")}. Add on diambil bersama racepack.</p>` : "";
  for (const p of reg.participants) {
    const ok = await sendMail(
      p.email,
      `E-ticket Majapahit Trail Run 2027: ${p.ticketCode}`,
      mailLayout(
        `Halo ${esc(p.name.split(" ")[0])}, e-ticket Anda sudah terbit`,
        `<p style="line-height:1.6">Terima kasih, pembayaran Anda sudah kami terima. Kategori <b>${esc(p.categoryName)}</b>, jersey ukuran <b>${esc(p.jersey)}</b>. Tunjukkan QR pada e-ticket saat mengambil racepack ya.</p>
         <p style="font-size:20px;font-weight:bold;letter-spacing:2px">${p.ticketCode}</p>${button(`${siteUrl()}/tiket/${p.ticketCode}`, "Lihat e-ticket")}${p.email === reg.buyerEmail ? addon : ""}`,
      ),
    );
    if (ok) await prisma.participant.update({ where: { id: p.id }, data: { ticketSentAt: new Date() } });
  }
  // Pemesan yang bukan pelari tetap mendapat konfirmasi (misalnya membelikan tiket untuk keluarga).
  if (!reg.participants.some((p) => p.email === reg.buyerEmail)) {
    await sendMail(reg.buyerEmail, `Pembayaran ${reg.code} sudah diterima`, mailLayout("Pembayaran Anda sudah kami terima", `<p style="line-height:1.6">Total ${rupiah(reg.total)}. E-ticket sudah dikirim ke email masing-masing pelari.</p>${addon}${button(`${siteUrl()}/bayar/${reg.code}`, "Lihat pesanan")}`));
  }
}

export async function sendPaymentLink(code: string) {
  const reg = await prisma.registration.findUnique({ where: { code } });
  if (!reg) return;
  await sendMail(
    reg.buyerEmail,
    `Selesaikan pembayaran Majapahit Trail Run (${reg.code})`,
    mailLayout(`Halo ${esc(reg.buyerName.split(" ")[0])}, pesanan Anda sudah tercatat`, `<p style="line-height:1.6">Total pembayaran ${rupiah(reg.total)}. Yuk selesaikan dalam 24 jam supaya slot Anda tidak lepas.</p>${button(`${siteUrl()}/bayar/${reg.code}`, "Bayar sekarang")}`),
  );
}
