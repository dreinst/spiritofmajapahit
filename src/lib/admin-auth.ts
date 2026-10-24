import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ROLES, homeFor, type AdminRole } from "@/lib/admin-roles";

// Autentikasi panitia, disalin dari pola KUWERA: hash scrypt, kunci 15 menit setelah 5 kali salah, sesi
// bertanda tangan HMAC yang ikut gugur saat versi sesi akun dinaikkan. Setiap halaman, aksi, dan route
// admin memanggil requireAdmin()/getAdmin() sendiri; proxy hanya menyembunyikan halaman (404).
export * from "@/lib/admin-roles";
export type AdminSession = { id: string; username: string; role: AdminRole };

export const COOKIE = "mjp_admin";
const SESSION_HOURS = 12;
// Salah 5 kali dari satu IP mengunci pasangan username + IP itu saja (lihat loginAction), supaya orang lain tidak bisa
// mengunci akun panitia dari luar. Kunci akun total baru berlaku setelah 30 kali salah dari mana pun.
export const PAIR_MAX = 5;
export const LOCK_MINUTES = 15;
const MAX_FAILED = 30;
const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

const DUMMY_HASH = "scrypt$AAAAAAAAAAAAAAAAAAAAAA==$" + Buffer.alloc(64).toString("base64");

async function verifyPassword(password: string, stored: string | null) {
  const [scheme, saltB64, hashB64] = (stored ?? DUMMY_HASH).split("$");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scryptAsync(password, Buffer.from(saltB64, "base64"), expected.length);
  return stored !== null && timingSafeEqual(actual, expected);
}

let cachedSecret: string | null = null;
async function sessionSecret() {
  if (cachedSecret) return cachedSecret;
  const row = await prisma.setting.findUnique({ where: { key: "adminAuth" } });
  let secret = row?.value;
  if (!secret) {
    await prisma.setting.create({ data: { key: "adminAuth", value: randomBytes(32).toString("base64url") } }).catch(() => null);
    secret = (await prisma.setting.findUnique({ where: { key: "adminAuth" } }))!.value;
  }
  // Kunci akhir gabungan rahasia di DB dan AUTH_SECRET di env server: bocornya database saja tidak cukup untuk memalsukan sesi.
  const env = process.env.AUTH_SECRET ?? "";
  if (process.env.NODE_ENV === "production" && env.length < 32) throw new Error("AUTH_SECRET belum diisi (minimal 32 karakter)");
  cachedSecret = env ? createHmac("sha256", env).update(secret).digest("base64url") : secret;
  return cachedSecret;
}

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

async function startSession(user: { id: string; sessionVersion: number }) {
  const exp = Date.now() + SESSION_HOURS * 3600_000;
  const payload = b64(JSON.stringify({ u: user.id, v: user.sessionVersion, exp }));
  (await cookies()).set(COOKIE, `${payload}.${sign(payload, await sessionSecret())}`, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_HOURS * 3600,
  });
}

export async function endSession(userId?: string) {
  if (userId) await prisma.adminUser.update({ where: { id: userId }, data: { sessionVersion: { increment: 1 } } }).catch(() => null);
  (await cookies()).delete({ name: COOKIE, path: "/" });
}

export async function getAdmin(): Promise<AdminSession | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload, await sessionSecret()));
  const given = Buffer.from(sig);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  let data: { u: string; v: number; exp: number };
  try { data = JSON.parse(Buffer.from(payload, "base64url").toString()); } catch { return null; }
  if (!data.exp || data.exp < Date.now()) return null;
  const user = await prisma.adminUser.findUnique({ where: { id: data.u } });
  if (!user || !user.passwordHash || user.sessionVersion !== data.v) return null;
  const role = (ROLES as string[]).includes(user.role) ? (user.role as AdminRole) : "petugas";
  return { id: user.id, username: user.username, role };
}

// Halaman: belum login ke /mjpadmin/login; peran tidak berhak ke halaman 403.
export async function requireAdmin(roles: AdminRole[] = ROLES) {
  const admin = await getAdmin();
  if (!admin) redirect("/mjpadmin/login");
  if (!roles.includes(admin.role)) redirect("/mjpadmin/terlarang");
  return admin;
}

export async function clientIp() {
  return (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || null;
}

async function deviceName() {
  const ua = (await headers()).get("user-agent") ?? "";
  const os = /iPhone|iPad/.test(ua) ? "iPhone/iPad" : /Android/.test(ua) ? "Android" : /Mac OS X/.test(ua) ? "Mac" : /Windows/.test(ua) ? "Windows" : "lainnya";
  const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "browser lain";
  return `${browser} di ${os}`;
}

export async function logAdmin(username: string, action: string, target?: string | null) {
  await prisma.adminLog.create({ data: { username, action, target: target ?? null, ip: await clientIp() } }).catch(() => null);
}

export const LOGIN_ERROR = `Username atau kata sandi salah. Setelah ${PAIR_MAX} kali salah, login dikunci ${LOCK_MINUTES} menit.`;

export async function attemptLogin(username: string, password: string): Promise<{ ok: true; home: string } | { ok: false; message: string }> {
  const now = new Date();
  const user = await prisma.adminUser.findUnique({ where: { username } });
  let reserved = false;
  if (user) {
    const r = await prisma.adminUser.updateMany({
      where: { id: user.id, failedLogins: { lt: MAX_FAILED }, OR: [{ lockedUntil: null }, { lockedUntil: { lt: now } }] },
      data: { failedLogins: { increment: 1 } },
    });
    reserved = r.count === 1;
  }
  const valid = await verifyPassword(password, user && reserved ? user.passwordHash : null);
  if (!user || !reserved || !valid) {
    if (user && reserved) {
      await prisma.adminUser.updateMany({ where: { id: user.id, failedLogins: { gte: MAX_FAILED } }, data: { failedLogins: 0, lockedUntil: new Date(now.getTime() + LOCK_MINUTES * 60_000) } });
    }
    await logAdmin(username.slice(0, 60), user && !reserved ? "login_terkunci" : "login_gagal", await deviceName());
    return { ok: false, message: LOGIN_ERROR };
  }
  await prisma.adminUser.update({ where: { id: user.id }, data: { failedLogins: 0, lockedUntil: null, lastLoginAt: now } });
  await startSession(user);
  await logAdmin(user.username, "login", await deviceName());
  const role = (ROLES as string[]).includes(user.role) ? (user.role as AdminRole) : "petugas";
  return { ok: true, home: homeFor(role) };
}
