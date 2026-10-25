import AcaraLain, { type Konten } from "@/components/AcaraLain";

export const dynamic = "force-dynamic";
export const metadata = { title: { absolute: "Musical Journey 2027 · The Spirit of Majapahit" }, description: "Musical Journey, perjalanan musik bertema Majapahit di Aone Trawas, Mojokerto. Bagian dari rangkaian The Spirit of Majapahit." };

// Draf isi: rapat 11 Sep 2026 hanya menyebut "musical journey" sebagai salah satu acara rangkaian.
// Konsep, tanggal, penampil, dan harga belum ditetapkan, jadi seluruh isi di sini ditandai sebagai draf.
const K: Konten = {
  event: "mj",
  judul: ["Musical", "Journey"],
  lead: "Perjalanan musik bertema Majapahit di Aone Trawas, kaki Gunung Penanggungan. Tanggal dan penampil diumumkan bertahap.",
  gambar: "/spirit/aset/generated/kage-sanmon-preview.webp?v=4",
  tentangJudul: ["Musik yang", "bercerita."],
  tentang: [
    "Musical Journey adalah pertunjukan musik bertema Majapahit di Aone Trawas. Konsep lengkapnya diumumkan bertahap.",
    "Acara ini bagian dari rangkaian The Spirit of Majapahit, bersama Majapahit Trail Run dan Konser Majapahit.",
  ],
  catatan: "Halaman ini masih draf. Konsep, tanggal, penampil, dan harga tiket final menyusul.",
  agendaId: "perjalanan",
  agendaJudul: ["Perjalanan", "Tiga babak cerita."],
  agenda: [
    ["Babak 1", "Gerbang", "Pembuka di depan gapura, mengenalkan kisah awal Majapahit."],
    ["Babak 2", "Pendopo", "Pertunjukan utama di halaman dalam."],
    ["Babak 3", "Puncak", "Penutup bersama seluruh penampil."],
  ],
  penampil: "Diumumkan segera",
  faq: [
    ["Kapan Musical Journey digelar?", "Tanggalnya diumumkan bertahap di halaman ini dan di media sosial resmi."],
    ["Bisakah saya membeli tiket sekarang?", "Kelas tiket di halaman ini masih contoh untuk uji sistem. Penjualan resmi dibuka setelah tanggal ditetapkan."],
    ["Bagaimana cara membayar?", "Lewat QRIS dengan nominal yang tertera, lalu unggah bukti. E-ticket dikirim lewat email setelah pembayaran diverifikasi."],
    ["Bisakah saya menginap di Aone Trawas?", "Bisa. Kamar bisa ditambahkan saat membeli tiket dan dibayar dalam satu tagihan."],
  ],
};

export default function MusicalJourney() { return <AcaraLain k={K} />; }
