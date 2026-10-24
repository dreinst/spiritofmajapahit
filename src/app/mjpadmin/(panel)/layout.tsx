import { redirect } from "next/navigation";
import AdminSide from "@/components/AdminSide";
import { requireAdmin, ROLE_LABEL } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const a = await requireAdmin();
  if (a.role === "petugas") redirect("/mjpadmin/scan");
  const verify = await prisma.registration.count({ where: { status: "VERIFY" } });
  return (
    <div className="app">
      <AdminSide verify={verify} role={a.role} who={`${a.username} · ${ROLE_LABEL[a.role]}`} />
      <main className="amain">{children}</main>
    </div>
  );
}
