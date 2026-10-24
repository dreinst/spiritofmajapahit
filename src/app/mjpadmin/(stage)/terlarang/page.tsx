import Link from "next/link";
import ErrorView from "@/components/ErrorView";
import { getAdmin, homeFor } from "@/lib/admin-auth";

export const metadata = { title: "Akses ditolak" };

// 403: akun sudah masuk tetapi perannya tidak berhak membuka halaman itu.
export default async function Terlarang() {
  const a = await getAdmin();
  return <ErrorView code="403" title={<>Akses <span className="it">ditolak.</span></>} text="Akun Anda belum punya akses ke halaman ini. Hubungi superadmin kalau perlu akses."
    action={<Link href={a ? homeFor(a.role) : "/mjpadmin/login"} className="btn k">Kembali ke halaman saya</Link>} />;
}
