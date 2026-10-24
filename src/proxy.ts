import { NextResponse, type NextRequest } from "next/server";

const PUBLIK = "camera=(), microphone=(), geolocation=(), payment=(), usb=()";
const midtrans = "https://app.midtrans.com https://app.sandbox.midtrans.com";
const dev = process.env.NODE_ENV === "development";

// CSP dengan nonce per permintaan: hanya skrip bawaan halaman ini (dan yang dimuatnya, misalnya Snap Midtrans)
// yang boleh jalan, jadi skrip sisipan tidak bisa dieksekusi. Header ini mengalahkan CSP dasar di next.config.ts.
function csp(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""} ${midtrans}`,
    `frame-src ${midtrans}`,
    `connect-src 'self' ${midtrans} https://api.midtrans.com https://api.sandbox.midtrans.com`,
    "img-src 'self' data: blob:",
    "media-src 'self' blob:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(dev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

export function proxy(req: NextRequest) {
  const p = req.nextUrl.pathname;
  const nonce = btoa(crypto.randomUUID());
  const policy = csp(nonce);
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-nonce", nonce);
  reqHeaders.set("Content-Security-Policy", policy);

  const admin = p === "/mjpadmin" || p.startsWith("/mjpadmin/") || p.startsWith("/api/mjpadmin/");
  // Halaman panitia selain login tampil sebagai 404 kalau belum ada cookie sesi, dengan header yang sama seperti
  // 404 lain. Keabsahan sesi tetap dicek requireAdmin()/getAdmin() di setiap halaman, aksi, dan API admin.
  const hidden = admin && p !== "/mjpadmin/login" && !req.cookies.has("mjp_admin");
  const res = hidden
    ? NextResponse.rewrite(new URL("/_tidak-ada", req.url), { request: { headers: reqHeaders } })
    : NextResponse.next({ request: { headers: reqHeaders } });
  res.headers.set("Content-Security-Policy", policy);
  if (admin && !hidden) {
    // Izin kamera berlaku per dokumen dan petugas sampai di layar scan lewat navigasi klien dari login.
    res.headers.set("Permissions-Policy", PUBLIK.replace("camera=()", "camera=(self)"));
    res.headers.set("Cache-Control", "no-store");
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  } else if (admin) res.headers.set("Permissions-Policy", PUBLIK);
  return res;
}

export const config = {
  matcher: [
    "/mjpadmin", "/mjpadmin/:path*", "/api/mjpadmin/:path*",
    // Semua halaman, kecuali API publik, aset statis, dan prefetch.
    { source: "/((?!api|_next/static|_next/image|foto|brand|texture|favicon|icon|apple-icon|robots.txt|sitemap.xml).*)", missing: [{ type: "header", key: "next-router-prefetch" }, { type: "header", key: "purpose", value: "prefetch" }] },
  ],
};
