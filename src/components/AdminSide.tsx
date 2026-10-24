"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/mjpadmin/actions";
import { Surya } from "@/components/Brand";

export default function AdminSide({ verify, role, who }: { verify: number; role: string; who: string }) {
  const path = usePathname();
  const items: [string, string, boolean?][] = [
    ["/mjpadmin", "Ringkasan"], ["/mjpadmin/peserta", "Pelari"], ["/mjpadmin/verifikasi", "Verifikasi bayar"], ["/mjpadmin/pembayaran", "Pembayaran"],
    ["/mjpadmin/addon", "Add on"], ["/mjpadmin/scan", "Scan crew"], ["/mjpadmin/pengaturan", "Pengaturan", role !== "superadmin"], ["/mjpadmin/log", "Log aktivitas", role !== "superadmin"],
  ];
  return (
    <aside className="side">
      <span className="brand" style={{ color: "var(--bata)" }}><Surya size={30} /><b style={{ color: "var(--ink)" }}>Majapahit<br />Trail Run</b></span>
      {items.filter(([, , hide]) => !hide).map(([h, l]) => (
        <Link key={h} href={h} className={(h === "/mjpadmin" ? path === h : path.startsWith(h)) ? "on" : ""}>{l}{h.endsWith("verifikasi") && verify > 0 && <span className="badge">{verify}</span>}</Link>
      ))}
      <p className="who">{who}</p>
      <form action={logoutAction}><button className="btn w sm full">Keluar</button></form>
    </aside>
  );
}
