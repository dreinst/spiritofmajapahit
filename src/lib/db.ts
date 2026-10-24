import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


function createClient() {
  // Satu container di VPS, jadi pool kecil sudah cukup dan tidak menghabiskan max_connections Postgres bersama.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 5, connectionTimeoutMillis: 10_000 });
  // Bukti bayar (data URL sampai sekitar 4 MB) tidak ikut terbaca kecuali diminta lewat omit: { proof: false }.
  return new PrismaClient({ adapter, omit: { registration: { proof: true } } });
}

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createClient> };
export const prisma = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
