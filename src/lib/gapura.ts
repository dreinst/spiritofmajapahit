// Isi halaman deskripsi elemen di galeri beranda 3D. Fakta diambil dari riset 6 Okt 2026
// (~/Downloads/DPRO/Riset-Arsitektur... dan Riset-Ornamen...), dengan sumbernya dicantumkan per halaman.
// Bagian yang merupakan tafsir modern pada ilustrasi 3D ditulis terang-terangan sebagai tafsir.
export type Bagian = { judul: string; isi: string[] };
export type Elemen = {
  slug: string; nama: string; sebutan: string; ringkas: string; gambar: string; gambar2?: string; fokus?: string;
  fakta: [string, string][]; bagian: Bagian[]; sumber: [string, string][];
};

export const ELEMEN: Elemen[] = [
  {
    slug: "candi-bentar",
    nama: "Candi Bentar",
    sebutan: "Gerbang terbelah",
    ringkas: "Gerbang berbentuk candi yang dibelah dua, tanpa atap penghubung, menandai batas halaman luar sebuah kompleks.",
    gambar: "/spirit/aset/generated/kage-approach.webp?v=9",
    gambar2: "/foto/gapura-pagi-3.webp",
    fakta: [["15,5 m", "Tinggi Wringin Lawang"], ["3,5 m", "Lebar celah tengah"], ["13 × 11 m", "Denah dasar"], ["Abad 14", "Masa Majapahit"]],
    bagian: [
      { judul: "Fungsi", isi: ["Candi bentar menandai batas halaman paling luar sebuah kompleks. Orang masuk lewat celah di tengahnya, lalu menuju gerbang beratap (paduraksa) yang membatasi halaman yang lebih suci."] },
      { judul: "Bentuk", isi: [
        "Bangunannya utuh seperti candi, dari kaki, tubuh, sampai atap bertingkat, lalu dibelah menjadi dua bagian yang saling mencerminkan.",
        "Pada versi Majapahit, sisi dalam yang menghadap celah dibiarkan polos. Hiasan ada di sisi luar dan di tepi profil bertingkatnya. Candi bentar Bali modern biasanya diukir penuh di kedua sisi.",
      ] },
      { judul: "Contoh nyata: Gapura Wringin Lawang", isi: [
        "Gapura Wringin Lawang di Trowulan, Mojokerto, dibangun dari bata merah pada abad ke-14. Tingginya 15,5 meter dengan denah 13 × 11 meter dan celah 3,5 meter, salah satu candi bentar tertua dan terbesar dari masa Majapahit yang masih berdiri.",
        "Bata Majapahit berukuran sekitar 33 × 18 cm dengan tebal 6 sampai 7 cm. Gapura besar seperti Wringin Lawang umumnya disusun dengan teknik gosok: bata digosokkan satu sama lain sampai rapat, tanpa perekat.",
      ] },
      { judul: "Dalam ilustrasi kami", isi: ["Candi bentar di beranda dibuat setinggi 15,5 meter dengan celah 3,5 meter mengikuti Wringin Lawang, dan menjadi gerbang pertama yang Anda lewati saat menggulir halaman."] },
    ],
    sumber: [["Wikipedia: Candi bentar", "https://en.wikipedia.org/wiki/Candi_bentar"], ["Wikipedia: Trowulan", "https://en.wikipedia.org/wiki/Trowulan"], ["Wikipedia: Paduraksa", "https://en.wikipedia.org/wiki/Paduraksa"]],
  },
  {
    slug: "kala",
    nama: "Kala",
    sebutan: "Penjaga gerbang",
    ringkas: "Wajah raksasa bermata melotot dan bertaring yang dipahat di atas pintu gapura, dipercaya menolak roh jahat.",
    gambar: "/foto/kala-3.webp",
    fokus: "center 64%",
    gambar2: "/spirit/aset/generated/kage-lantern-court.webp?v=9",
    fakta: [["16,5 m", "Tinggi Bajang Ratu"], ["Banaspati", "Sebutan di Jawa Timur"], ["Di atas pintu", "Letaknya"], ["Abad 14", "Masa Majapahit"]],
    bagian: [
      { judul: "Asal-usul", isi: ["Kala berakar dari tradisi Kirtimukha di India. Kisahnya, wajah raksasa ini lahir dari amarah Siwa. Di Jawa Timur kala juga disebut Banaspati."] },
      { judul: "Ciri kala Jawa Timur", isi: [
        "Matanya melotot, taringnya menonjol, dan kepalanya bermahkota. Kala Jawa Timur dipahat terpisah dari makara, berbeda dengan kalamakara Jawa Tengah yang menyatukan keduanya.",
        "Kala ditempatkan di atas ambang pintu gapura beratap (paduraksa), gerbang menuju halaman yang lebih suci, dan tidak dipasang di candi bentar.",
      ] },
      { judul: "Contoh nyata: Gapura Bajang Ratu", isi: [
        "Gapura Bajang Ratu di Trowulan, Mojokerto, adalah paduraksa bata merah setinggi sekitar 16,5 meter dari abad ke-14. Kepala kalanya berada di atas ambang pintu, diapit dua tangan yang dimaknai sebagai keseimbangan dua dunia, dengan relief Ramayana di sekitarnya.",
        "Wajahnya yang menyeramkan berfungsi sebagai penjaga, dipercaya mengusir roh jahat dari kompleks di baliknya.",
      ] },
      { judul: "Dalam ilustrasi kami", isi: ["Kala di beranda dibuat sebagai relief bata tanpa cat, menyatu dengan dinding di atas lorong gapura seperti di Bajang Ratu. Matanya bulat melotot, hidungnya lebar, deret gigi atas diapit dua taring, dan kedua tangannya berada di samping wajah. Sekelilingnya penuh sulur. Bentuk rinci wajahnya tetap tafsir kami, karena ukuran presisi kala Bajang Ratu belum kami temukan dalam sumber terbuka."] },
    ],
    sumber: [["Wikipedia: Paduraksa", "https://en.wikipedia.org/wiki/Paduraksa"], ["The Jakarta Post: Bajang Ratu, a sight past", "https://www.thejakartapost.com/news/2009/07/24/bajang-ratu-a-sight-past"], ["Wikipedia: Bhoma", "https://en.wikipedia.org/wiki/Bhoma"]],
  },
  {
    slug: "pendopo",
    nama: "Pendopo",
    sebutan: "Balai terbuka",
    ringkas: "Bangunan beratap tanpa dinding yang berdiri di atas tiang, tempat berkumpul, bermusyawarah, dan menerima tamu.",
    gambar: "/spirit/aset/generated/kage-moonwater.webp?v=9",
    fakta: [["26", "Umpak Pendopo Agung"], ["16", "Umpak penopang pendopo"], ["Segi enam", "Bentuk umpak"], ["Trowulan", "Lokasi temuan"]],
    bagian: [
      { judul: "Jejaknya di Trowulan", isi: [
        "Bangunan kayu masa Majapahit sudah lama lapuk. Yang tersisa adalah umpak, batu alas tempat tiang berdiri.",
        "Di Pendopo Agung, Trowulan, dulu ada deretan 26 umpak batu segi enam dari barat ke timur, 16 di antaranya menopang pendopo. Di Sentonorejo ditemukan 17 umpak segi enam lain sebagai landasan tiang balai.",
      ] },
      { judul: "Unsur bangunan", isi: ["Penggambaran rumah bangsawan Majapahit menyebut bubungan atap berhias, sulur atau ukel di sudut, pintu kupu tarung yang membuka simetris seperti sayap kupu-kupu, fondasi umpak yang terlihat, dan motif Surya Majapahit sebagai hiasan."] },
      { judul: "Dalam ilustrasi kami", isi: ["Pendopo di halaman dalam berdiri di atas umpak segi enam dengan genteng terakota dan ukel di keempat sudut atap. Bentuk atap dan detail kayunya adalah tafsir modern berdasarkan unsur-unsur di atas."] },
    ],
    sumber: [["Beritajatim: data umpak Pendopo Agung dan Sentonorejo", ""], ["Detik Jatim: Bagaimana wujud rumah di zaman Majapahit", "https://www.detik.com/jatim/budaya/d-6317366/bagaimana-wujud-rumah-di-zaman-majapahit-begini-penggambarannya"], ["Wikipedia: Trowulan", "https://en.wikipedia.org/wiki/Trowulan"]],
  },
];

export const elemen = (slug: string) => ELEMEN.find((e) => e.slug === slug);
