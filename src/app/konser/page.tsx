import AcaraLain, { type Konten } from "@/components/AcaraLain";

export const dynamic = "force-dynamic";
export const metadata = { title: { absolute: "Konser Majapahit 2027 · Aone Trawas" }, description: "Konser Majapahit, Sabtu sampai Minggu 3 sampai 4 Juli 2027 di Aone Trawas, Mojokerto. Dua hari musik dan budaya bertema Majapahit." };

// Draf isi: konsep dua hari dari rapat 11 Sep 2026 (malam gala dan pesta rakyat). Penampil dan jam belum ditetapkan.
const K: Konten = {
  event: "konser",
  judul: ["Konser Majapahit", "2027"],
  lead: "Dua hari musik dan budaya bertema Majapahit di Aone Trawas, Sabtu sampai Minggu, 3 sampai 4 Juli 2027.",
  gambar: "/spirit/aset/generated/kage-moonwater.webp",
  hariH: "2027-07-03T18:00:00+07:00",
  hitungLabel: "Menuju hari pertama",
  tentangJudul: ["Malam gala dan", "pesta rakyat."],
  tentang: [
    "Hari pertama berupa malam gala dengan pertunjukan musik di panggung utama.",
    "Hari kedua menjadi pesta rakyat: orkestra, hiburan khas Jawa Timur, dan sajian UMKM warga sekitar Trawas.",
    "Konser Majapahit menyambung Majapahit Trail Run seminggu sebelumnya, masih dalam rangkaian The Spirit of Majapahit.",
  ],
  catatan: "Halaman ini masih draf. Penampil, jam pertunjukan, dan harga tiket final diumumkan bertahap.",
  agendaId: "agenda",
  agendaJudul: ["Agenda", "Dua hari di Aone Trawas."],
  agenda: [
    ["Sabtu, 3 Juli 2027", "Malam Gala", "Pembukaan dan pertunjukan musik di panggung utama. Jam diumumkan."],
    ["Minggu, 4 Juli 2027", "Pesta Rakyat", "Orkestra, hiburan khas Jawa Timur, dan bazar UMKM warga. Jam diumumkan."],
  ],
  penampil: "Diumumkan segera",
  faq: [
    ["Apakah satu tiket berlaku dua hari?", "Tergantung kelasnya. Tiket Festival Hari 1 dan Hari 2 berlaku di hari masing-masing, tiket Terusan dan VIP berlaku di kedua hari."],
    ["Bisakah saya membeli tiket untuk keluarga atau teman?", "Bisa. Satu pesanan menampung sampai 20 tiket, masing-masing atas nama pemegangnya. Semua e-ticket dikirim ke email pemesan."],
    ["Bagaimana cara membayar?", "Lewat QRIS dengan nominal yang tertera di halaman pembayaran, lalu unggah buktinya. Panitia memverifikasi paling lambat 1x24 jam, lalu e-ticket dikirim lewat email."],
    ["Apakah ada batasan usia?", "Ketentuan usia dan barang bawaan diumumkan bersama daftar penampil."],
    ["Bisakah saya menginap di Aone Trawas?", "Bisa. Kamar bisa ditambahkan saat membeli tiket dan dibayar dalam satu tagihan."],
  ],
};

export default function Konser() { return <AcaraLain k={K} />; }
