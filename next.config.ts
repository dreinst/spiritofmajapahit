import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const midtrans = "https://app.midtrans.com https://app.sandbox.midtrans.com";
// CSP tanpa nonce supaya halaman statis tetap bisa di-cache. Pihak ketiga hanya Midtrans Snap.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${midtrans}`,
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
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const security = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];
const longCache = [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Traefik di VPS yang mengompres (brotli).
  compress: false,
  images: { formats: ["image/avif", "image/webp"], qualities: [70, 75], minimumCacheTTL: 2592000, deviceSizes: [390, 640, 828, 1080, 1440, 1920], imageSizes: [64, 128, 256, 384] },
  experimental: { serverActions: { bodySizeLimit: "1mb" } },
  async headers() {
    return [
      { source: "/(.*)", headers: security },
      // Header khusus area panitia (kamera, no-store) dipasang src/proxy.ts hanya untuk yang membawa cookie sesi,
      // supaya 404 /bmpdadmin tampak sama persis dengan 404 lain.
      { source: "/((?!bmpdadmin).*)", headers: [{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" }] },
      { source: "/foto/:path*", headers: longCache },
      { source: "/brand/:path*", headers: longCache },
      { source: "/texture/:path*", headers: longCache },
    ];
  },
};

export default nextConfig;
