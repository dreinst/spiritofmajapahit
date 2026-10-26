import type { NextConfig } from "next";
import { siteBase } from "./src/lib/sites";

// Host tiap situs (produksi dan uji lokal *.localhost). Satu aplikasi melayani keempatnya.
const H = {
  payung: "(majapahit\\.dpro\\.events|localhost|majapahit\\.localhost)",
  trail: "(trailrun-majapahit\\.dpro\\.events|trailrun\\.localhost)",
  konser: "(konser-majapahit\\.dpro\\.events|konser\\.localhost)",
  mj: "(musicaljourney-majapahit\\.dpro\\.events|musicaljourney\\.localhost)",
};
const di = (k: keyof typeof H) => [{ type: "host" as const, value: H[k] }];

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

const csp3d = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "worker-src 'self' blob:",
  "connect-src 'self' blob: data:",
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
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
  images: { localPatterns: [{ pathname: "/**", search: "" }, { pathname: "/spirit/aset/**", search: "?v=9" }], formats: ["image/avif", "image/webp"], qualities: [70, 75], minimumCacheTTL: 2592000, deviceSizes: [390, 640, 828, 1080, 1440, 1920], imageSizes: [64, 128, 256, 384] },
  experimental: { serverActions: { bodySizeLimit: "1mb" } },
  // Beranda tiap domain: payung = halaman 3D statis (public/spirit/index.html), trail = /acara,
  // konser = /konser, musical journey = /musical-journey. /beli menuju formulir tiket acaranya.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", has: di("payung"), destination: "/spirit/index.html" },
        { source: "/", has: di("trail"), destination: "/acara" },
        { source: "/", has: di("konser"), destination: "/konser" },
        { source: "/beli", has: di("konser"), destination: "/konser/beli" },
        { source: "/", has: di("mj"), destination: "/musical-journey" },
        { source: "/beli", has: di("mj"), destination: "/musical-journey/beli" },
      ],
    };
  },
  // Tiap halaman dibuka di domain acaranya; tautan lama (misalnya majapahit.dpro.events/daftar) tetap berfungsi.
  async redirects() {
    const ke = (k: "payung" | "trail" | "konser" | "mj", path = "") => siteBase(k) + path;
    return [
      { source: "/sumber-aset", destination: "/", permanent: false },
      { source: "/daftar", has: di("payung"), destination: ke("trail", "/daftar"), permanent: false },
      { source: "/acara", has: di("payung"), destination: ke("trail", "/"), permanent: false },
      { source: "/konser/:p*", has: di("payung"), destination: ke("konser", "/"), permanent: false },
      { source: "/musical-journey/:p*", has: di("payung"), destination: ke("mj", "/"), permanent: false },
      { source: "/acara", has: di("trail"), destination: "/", permanent: false },
      { source: "/konser", has: di("konser"), destination: "/", permanent: false },
      { source: "/konser/beli", has: di("konser"), destination: "/beli", permanent: false },
      { source: "/musical-journey", has: di("mj"), destination: "/", permanent: false },
      { source: "/musical-journey/beli", has: di("mj"), destination: "/beli", permanent: false },
      ...(["konser", "mj"] as const).flatMap((k) => [
        { source: "/daftar", has: di(k), destination: ke("trail", "/daftar"), permanent: false },
        { source: "/gapura/:p*", has: di(k), destination: ke("payung", "/gapura/:p*"), permanent: false },
      ]),
      { source: "/gapura/:p*", has: di("trail"), destination: ke("payung", "/gapura/:p*"), permanent: false },
      ...(["payung", "konser", "mj"] as const).map((k) => ({ source: "/medali", has: di(k), destination: ke("trail", "/medali"), permanent: false })),
      ...(["trail", "konser", "mj"] as const).map((k) => ({ source: "/link", has: di(k), destination: ke("payung", "/link"), permanent: false })),
    ];
  },
  async headers() {
    return [
      { source: "/(.*)", headers: security },
      // Header khusus area panitia (kamera, no-store) dipasang src/proxy.ts hanya untuk yang membawa cookie sesi,
      // supaya 404 /bmpdadmin tampak sama persis dengan 404 lain.
      { source: "/((?!bmpdadmin).*)", headers: [{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" }] },
      { source: "/foto/:path*", headers: longCache },
      { source: "/brand/:path*", headers: longCache },
      // Halaman 3D (adaptasi ThreeUI Kage): skrip inline, decoder Draco (WebAssembly) di worker blob.
      { source: "/spirit/:path*", headers: [{ key: "Content-Security-Policy", value: csp3d }] },
      { source: "/", has: di("payung"), headers: [{ key: "Content-Security-Policy", value: csp3d }] },
      { source: "/spirit/aset/:path*", headers: longCache },
      { source: "/texture/:path*", headers: longCache },
    ];
  },
};

export default nextConfig;
