import { requireAdmin, SUPER } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { wib } from "@/lib/format";

const LABEL: Record<string, [string, string]> = {
  batalkan_tagihan: ["g", "Batalkan tagihan"], login: ["ok", "Masuk"], logout: ["g", "Keluar"], login_gagal: ["warn", "Login gagal"], login_terkunci: ["r", "Akun terkunci"],
  setujui_transfer: ["ok", "Setujui transfer"], tolak_transfer: ["warn", "Tolak transfer"], kirim_ulang_tiket: ["g", "Kirim ulang tiket"],
  ubah_pengaturan: ["k", "Ubah pengaturan"], ekspor: ["g", "Unduh CSV"], scan: ["g", "Scan"], serah_addon: ["ok", "Serahkan add on"],
};

export default async function Log() {
  await requireAdmin(SUPER);
  const [logs, users] = await Promise.all([
    prisma.adminLog.findMany({ orderBy: { createdAt: "desc" }, take: 300 }),
    prisma.adminUser.findMany({ select: { username: true, role: true, lastLoginAt: true, lockedUntil: true }, orderBy: { username: "asc" } }),
  ]);
  return (
    <>
      <p className="eb">Keamanan · superadmin</p><h1 style={{ marginTop: 10 }}>Log <span className="it">aktivitas.</span></h1>
      <div className="grid3" style={{ marginTop: 22 }}>{users.map((u) => (
        <div key={u.username} className="card"><b>{u.username}</b> <span className="pill g">{u.role}</span><p className="muted small" style={{ marginTop: 6 }}>Login terakhir: {u.lastLoginAt ? wib(u.lastLoginAt) : "belum pernah"}</p>
          {u.lockedUntil && u.lockedUntil > new Date() && <p className="err" style={{ marginTop: 4 }}>Terkunci sampai {wib(u.lockedUntil)}</p>}</div>
      ))}</div>
      <div className="card tablewrap" style={{ marginTop: 20 }}><table>
        <thead><tr><th>Waktu</th><th>Akun</th><th>Aksi</th><th>Detail</th><th>IP</th></tr></thead>
        <tbody>{logs.map((l) => { const [t, x] = LABEL[l.action] ?? ["g", l.action]; return <tr key={l.id}><td className="small">{wib(l.createdAt)}</td><td>{l.username}</td><td><span className={`pill ${t}`}>{x}</span></td><td className="small muted">{l.target}</td><td className="mono tiny">{l.ip}</td></tr>; })}</tbody>
      </table></div>
    </>
  );
}
