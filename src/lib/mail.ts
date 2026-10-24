import nodemailer from "nodemailer";

const transport = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

export const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const siteUrl = () => (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");

// Tanpa SMTP (lokal/uji) email hanya dicatat di log supaya alur tetap jalan.
export async function sendMail(to: string, subject: string, html: string) {
  if (!transport) {
    console.log(`[email uji] ke ${to}: ${subject}`);
    return false;
  }
  try {
    await transport.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, replyTo: "care@dpro.events", to, subject, html });
    return true;
  } catch (e) {
    console.error("[email gagal]", to, (e as Error).message);
    return false;
  }
}

export const mailLayout = (title: string, body: string) => `<!doctype html><html><body style="margin:0;background:#F4ECDF;font-family:Arial,sans-serif;color:#1A1210">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
<div style="background:#fff;border:1px solid #E3D5BF;border-radius:20px;padding:28px">
<p style="margin:0;font-size:12px;letter-spacing:1px;color:#9C3A22;font-weight:bold">MAJAPAHIT TRAIL RUN 2027 · AONE TRAWAS</p>
<h1 style="font-size:24px;margin:10px 0 16px">${title}</h1>${body}</div>
<p style="font-size:12px;color:#6E6259;text-align:center;margin-top:16px">Minggu, 27 Juni 2027 · Kaki Gunung Penanggungan, Mojokerto<br>Made by dreinst | Organized by D'PRO</p></div></body></html>`;

export const button = (href: string, label: string) =>
  `<p style="margin:24px 0"><a href="${href}" style="background:#B4472B;color:#fff;text-decoration:none;padding:14px 24px;border-radius:999px;font-weight:bold;display:inline-block">${label}</a></p>`;
