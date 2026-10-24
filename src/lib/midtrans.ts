import { createHash, timingSafeEqual } from "node:crypto";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

// PAYMENT_MODE=midtrans: Snap otomatis. PAYMENT_MODE=manual: QRIS dinamis bernominal + unggah bukti, dicek
// panitia (seperti KUWERA sebelum Midtrans aktif). Selain itu mode uji dengan tombol simulasi bayar.
export type PayMode = "midtrans" | "manual" | "mock";
export const paymentMode = (): PayMode =>
  process.env.PAYMENT_MODE === "midtrans" && process.env.MIDTRANS_SERVER_KEY ? "midtrans" : process.env.PAYMENT_MODE === "manual" && process.env.QRIS_STATIC_PAYLOAD ? "manual" : "mock";

export const midtrans = {
  snapApi: isProduction ? "https://app.midtrans.com/snap/v1" : "https://app.sandbox.midtrans.com/snap/v1",
  snapJs: isProduction ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js",
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "",
};

const authHeader = () => "Basic " + Buffer.from(`${process.env.MIDTRANS_SERVER_KEY ?? ""}:`).toString("base64");

export async function createSnapToken(o: { code: string; total: number; name: string; email: string; phone: string; expiresAt: Date; finishUrl: string; label: string }) {
  const minutes = Math.max(1, Math.floor((o.expiresAt.getTime() - Date.now()) / 60_000));
  const res = await fetch(`${midtrans.snapApi}/transactions`, {
    method: "POST",
    headers: { Authorization: authHeader(), "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      transaction_details: { order_id: o.code, gross_amount: o.total },
      item_details: [{ id: "majapahit", price: o.total, quantity: 1, name: o.label.slice(0, 50) }],
      customer_details: { first_name: o.name.slice(0, 50), email: o.email, phone: o.phone },
      enabled_payments: ["other_qris", "bca_va", "bni_va", "bri_va", "echannel", "permata_va", "gopay", "shopeepay"],
      expiry: { unit: "minute", duration: minutes },
      callbacks: { finish: o.finishUrl },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  const data = (await res.json().catch(() => ({}))) as { token?: string; redirect_url?: string; error_messages?: string[] };
  if (!res.ok || !data.token) throw new Error(`Midtrans ${res.status}: ${(data.error_messages ?? []).join("; ")}`);
  return { token: data.token, redirectUrl: data.redirect_url ?? null };
}

export function verifySignature(n: { order_id: string; status_code: string; gross_amount: string; signature_key: string }) {
  const key = process.env.MIDTRANS_SERVER_KEY ?? "";
  if (!key || typeof n.signature_key !== "string") return false;
  const expected = Buffer.from(createHash("sha512").update(`${n.order_id}${n.status_code}${n.gross_amount}${key}`).digest("hex"));
  const given = Buffer.from(n.signature_key);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
