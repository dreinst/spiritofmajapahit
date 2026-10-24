// Peran akun panitia, sama dengan KUWERA.
// superadmin: semua fitur termasuk pengaturan dan log. admin: keuangan dan data peserta. petugas: scan e-ticket saja.
export type AdminRole = "superadmin" | "admin" | "petugas";
export const ROLES: AdminRole[] = ["superadmin", "admin", "petugas"];
export const ROLE_LABEL: Record<AdminRole, string> = { superadmin: "Superadmin", admin: "Admin keuangan", petugas: "Petugas scan" };
export const FINANCE: AdminRole[] = ["superadmin", "admin"];
export const SUPER: AdminRole[] = ["superadmin"];
export const SCAN: AdminRole[] = ["superadmin", "admin", "petugas"];
export const homeFor = (role: AdminRole) => (role === "petugas" ? "/mjpadmin/scan" : "/mjpadmin");
export const ADMIN_BASE = "/mjpadmin";
