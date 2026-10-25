// Satu aplikasi, empat situs. Tiap acara The Spirit of Majapahit punya domain sendiri; database, panel
// panitia, pembayaran, dan e-ticket dipakai bersama. Uji lokal memakai *.localhost (otomatis ke 127.0.0.1).
export type SiteKey = "payung" | "trail" | "konser" | "mj";
export type EventKey = Exclude<SiteKey, "payung">;

type Site = { host: string; dev: string; nama: string; singkat: string; tanggal: string; venue: string; ket: string; path: string };

export const SITES: Record<SiteKey, Site> = {
  payung: { host: "majapahit.dpro.events", dev: "localhost", nama: "The Spirit of Majapahit", singkat: "Beranda", tanggal: "2027", venue: "Aone Trawas", ket: "Rangkaian acara bertema Majapahit di Aone Trawas, kaki Gunung Penanggungan.", path: "/" },
  trail: { host: "trailrun-majapahit.dpro.events", dev: "trailrun.localhost", nama: "Majapahit Trail Run", singkat: "Trail Run", tanggal: "Minggu, 27 Juni 2027", venue: "Aone Trawas", ket: "Lari lintas alam di kaki Gunung Penanggungan.", path: "/acara" },
  konser: { host: "konser-majapahit.dpro.events", dev: "konser.localhost", nama: "Konser Majapahit", singkat: "Konser", tanggal: "Sabtu sampai Minggu, 3 sampai 4 Juli 2027", venue: "Aone Trawas", ket: "Dua hari musik dan budaya bertema Majapahit.", path: "/konser" },
  mj: { host: "musicaljourney-majapahit.dpro.events", dev: "musicaljourney.localhost", nama: "Musical Journey", singkat: "Musical Journey", tanggal: "Tanggal diumumkan", venue: "Aone Trawas", ket: "Perjalanan musik bertema Majapahit.", path: "/musical-journey" },
};

export const EVENT_KEYS: EventKey[] = ["trail", "konser", "mj"];
const DEV = process.env.NEXT_PUBLIC_DEV_HOSTS === "1";
const PORT = process.env.NEXT_PUBLIC_DEV_PORT || "3077";

// Alamat dasar tiap situs, dipakai untuk menu silang dan tautan di email.
export const siteBase = (k: SiteKey) => (DEV ? `http://${SITES[k].dev}:${PORT}` : `https://${SITES[k].host}`);
export const isEvent = (v: string): v is EventKey => (EVENT_KEYS as string[]).includes(v);
