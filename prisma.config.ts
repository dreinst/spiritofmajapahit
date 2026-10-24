import "dotenv/config";
import { defineConfig } from "prisma/config";

// `prisma generate` saat build Docker tidak butuh koneksi, jadi URL kosong boleh di tahap itu.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: process.env.DATABASE_URL ?? "" },
});
