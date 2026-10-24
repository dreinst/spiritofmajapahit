"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { attemptLogin, endSession, LOCK_MINUTES, LOGIN_ERROR, FINANCE, PAIR_MAX, getAdmin, logAdmin, requireAdmin, SCAN, SUPER } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { button, mailLayout, sendMail, siteUrl } from "@/lib/mail";
import { markPaid, sendTickets } from "@/lib/payments";
import { clientIp, limited, note, recent } from "@/lib/rate-limit";
import { saveSettings } from "@/lib/settings";
import { bentrokKedaluwarsa } from "@/lib/registration";
import { headers } from "next/headers";

export async function loginAction(_: unknown, form: FormData) {
  const ip = clientIp(await headers());
  if (limited(`login:${ip}`, 20, 15 * 60_000)) return { message: "Terlalu banyak percobaan dari jaringan ini. Coba lagi 15 menit lagi." };
  const username = String(form.get("username") ?? "").trim().toLowerCase().slice(0, 60);
  const password = String(form.get("password") ?? "").slice(0, 200);
  if (!username || !password) return { message: "Isi username dan kata sandi." };
  // Format dicek dulu supaya isian aneh tidak ikut tercatat di log (sama dengan KUWERA).
  if (!/^[a-z0-9._-]{3,32}$/.test(username)) return { message: LOGIN_ERROR };
  const pair = `loginpair:${username}:${ip}`;
  if (recent(pair, LOCK_MINUTES * 60_000) >= PAIR_MAX) { await logAdmin(username, "login_terkunci"); return { message: LOGIN_ERROR }; }
  const r = await attemptLogin(username, password);
  if (!r.ok) { note(pair); return { message: r.message }; }
  redirect(r.home);
}

export async function logoutAction() {
  const a = await getAdmin();
  if (a) await logAdmin(a.username, "logout");
  await endSession(a?.id);
  redirect("/mjpadmin/login");
}

const code = (form: FormData) => String(form.get("code") ?? "").slice(0, 20);

export async function approve(form: FormData) {
  const a = await requireAdmin(FINANCE);
  const c = code(form);
  const bentrok = await bentrokKedaluwarsa(c);
  if (bentrok) redirect(`/mjpadmin/pembayaran?gagal=${encodeURIComponent(`${c}: ${bentrok}`)}`);
  if (await markPaid(c, `transfer manual (${a.username})`)) await logAdmin(a.username, "setujui_transfer", c);
  revalidatePath("/mjpadmin", "layout");
}

export async function reject(form: FormData) {
  const a = await requireAdmin(FINANCE);
  const c = code(form);
  const reason = String(form.get("reason") || "").trim().slice(0, 200);
  const r = await prisma.registration.updateMany({ where: { code: c, status: "VERIFY" }, data: { status: "REJECTED", rejectReason: reason || null } });
  if (r.count) {
    const reg = await prisma.registration.findUnique({ where: { code: c } });
    if (reg) await sendMail(reg.buyerEmail, `Bukti pembayaran ${c} perlu diunggah kembali`, mailLayout("Bukti pembayaran belum bisa kami terima", `<p>${(reason || "Bukti pembayaran belum sesuai dengan tagihan.").replace(/[<>&]/g, "")}</p>${button(`${siteUrl()}/bayar/${c}`, "Unggah kembali")}`));
    await logAdmin(a.username, "tolak_transfer", c);
  }
  revalidatePath("/mjpadmin", "layout");
}

// Membatalkan tagihan palsu atau dobel: jadi kedaluwarsa dan kode uniknya langsung bebas dipakai tagihan lain.
export async function cancelBill(form: FormData) {
  const a = await requireAdmin(FINANCE);
  const c = code(form);
  const r = await prisma.registration.updateMany({ where: { code: c, status: "PENDING" }, data: { status: "EXPIRED", expiresAt: new Date(Date.now() - 2 * 864e5) } });
  if (r.count) await logAdmin(a.username, "batalkan_tagihan", c);
  revalidatePath("/mjpadmin", "layout");
}

export async function resend(form: FormData) {
  const a = await requireAdmin(FINANCE);
  await sendTickets(code(form));
  await logAdmin(a.username, "kirim_ulang_tiket", code(form));
  revalidatePath("/mjpadmin", "layout");
}

// Baris tabel pengaturan dikirim sebagai larik sejajar (nama field sama per kolom). Baris tanpa nama dibuang.
// Id lama dipertahankan supaya pelari yang sudah mendaftar tetap terhubung ke kategorinya.
const slug = (t: string) => t.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 36) || crypto.randomUUID().slice(0, 8);
const rows = (form: FormData, prefix: string, cols: string[]) => {
  const get = (c: string) => form.getAll(`${prefix}${c}`).map((v) => String(v).trim());
  const data = Object.fromEntries(cols.map((c) => [c, get(c)]));
  return data[cols[0]].map((_, i) => Object.fromEntries(cols.map((c) => [c, data[c][i] ?? ""])));
};
const angka = (v: string) => Math.min(1e9, Number(v.replace(/\D/g, "")) || 0);
const unik = <T extends { id: string }>(list: T[]) => list.filter((x, i) => list.findIndex((y) => y.id === x.id) === i);

export async function saveSettingsAction(form: FormData) {
  const a = await requireAdmin(SUPER);
  const kategori = unik(rows(form, "kat", ["Nama", "Id", "Jarak", "Elevasi", "Harga", "Kuota", "Ket"]).filter((r) => r.Nama && r.Jarak)
    .map((r) => ({ id: r.Id || slug(`${r.Nama}-${r.Jarak}`), nama: r.Nama.slice(0, 40), jarak: r.Jarak.slice(0, 10), elevasi: r.Elevasi.slice(0, 20), harga: angka(r.Harga), kuota: angka(r.Kuota), ket: r.Ket.slice(0, 200) })));
  const kamar = unik(rows(form, "kamar", ["Nama", "Id", "Harga", "Tamu", "Ket"]).filter((r) => r.Nama && angka(r.Harga) > 0)
    .map((r) => ({ id: r.Id || slug(r.Nama), nama: r.Nama.slice(0, 60), harga: angka(r.Harga), tamu: Math.max(1, Math.min(10, angka(r.Tamu) || 2)), ket: r.Ket.slice(0, 200) })));
  const merch = unik(rows(form, "merch", ["Nama", "Id", "Harga", "Ukuran", "Ket"]).filter((r) => r.Nama && angka(r.Harga) > 0)
    .map((r) => ({ id: r.Id || slug(r.Nama), nama: r.Nama.slice(0, 60), harga: angka(r.Harga), ukuran: r.Ukuran === "1", ket: r.Ket.slice(0, 200) })));
  const teks = (k: string, max = 120) => String(form.get(k) ?? "").trim().slice(0, max);
  await saveSettings({
    kategori: JSON.stringify(kategori), kamar: JSON.stringify(kamar), merch: JSON.stringify(merch),
    checkIn: teks("checkIn"), maksMalam: String(Math.max(1, Math.min(5, angka(teks("maksMalam")) || 1))),
    jadwalDaftar: teks("jadwalDaftar"), jadwalRacepack: teks("jadwalRacepack"),
    mdrPersen: String(Math.min(5, Math.max(0, Number(teks("mdrPersen").replace(",", ".")) || 0))), mdrBatas: String(angka(teks("mdrBatas"))),
    rekening: teks("rekening", 160), dibuka: form.get("dibuka") ? "1" : "0",
  });
  await logAdmin(a.username, "ubah_pengaturan");
  revalidatePath("/", "layout");
  redirect("/mjpadmin/pengaturan?ok=1");
}

// Penanda add on sudah diserahkan di meja racepack.
export async function ambilAddon(form: FormData) {
  const a = await requireAdmin(SCAN);
  const id = String(form.get("id") ?? "").slice(0, 40);
  const r = await prisma.orderItem.updateMany({ where: { id, pickedAt: null, registration: { status: "PAID" } }, data: { pickedAt: new Date() } });
  if (r.count) await logAdmin(a.username, "serah_addon", id);
  revalidatePath("/mjpadmin", "layout");
}
