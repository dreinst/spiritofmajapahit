import ScanClient from "@/components/ScanClient";
import { requireAdmin, SCAN } from "@/lib/admin-auth";

export const metadata = { title: "Scan crew" };

export default async function Scan() {
  const a = await requireAdmin(SCAN);
  return <ScanClient crew={a.username} back={a.role !== "petugas"} />;
}
