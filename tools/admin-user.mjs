// Membuat atau mengganti sandi akun panitia: node tools/admin-user.mjs <username> <superadmin|admin|petugas>
// Sandi dibaca dari stdin supaya tidak tersimpan di riwayat shell.
import "dotenv/config";
import { randomBytes, scryptSync } from "node:crypto";
import pg from "pg";
const [username, role] = process.argv.slice(2);
if (!username || !["superadmin", "admin", "petugas"].includes(role)) { console.error("pakai: <username> <superadmin|admin|petugas>"); process.exit(1); }
let pw = ""; for await (const c of process.stdin) pw += c; pw = pw.trim();
if (pw.length < 10) { console.error("sandi minimal 10 karakter"); process.exit(1); }
const salt = randomBytes(16);
const hash = `scrypt$${salt.toString("base64")}$${scryptSync(pw, salt, 64).toString("base64")}`;
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect();
await c.query(`insert into "AdminUser"(id, username, role, "passwordHash") values ($1,$2,$3,$4)
  on conflict (username) do update set role=$3, "passwordHash"=$4, "failedLogins"=0, "lockedUntil"=null, "sessionVersion"="AdminUser"."sessionVersion"+1`,
  ["adm_" + randomBytes(8).toString("hex"), username, role, hash]);
await c.end(); console.log("ok", username, role);
