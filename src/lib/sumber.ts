// Daftar sumber semua gambar dan aset desain yang tampil di situs. Halaman /sumber-aset dan keterangan
// "Ilustrasi ..." di bawah tiap gambar membaca dari sini, jadi aset baru cukup didaftarkan di satu tempat.
export type Aset = { id: string; judul: string; sumber: string; url?: string; lisensi: string; ket?: string; path?: string };

const MODEL = "Render Blender dari model 3D The Spirit of Majapahit (Spirit of Majapahit v3.blend) buatan tim D'PRO.";
const BUKAN_FOTO = "Ilustrasi 3D, bukan foto situs asli.";

// Gambar yang dipakai di halaman. path dipakai untuk mencari keterangan gambar.
export const GAMBAR: Aset[] = [
  { id: "candi-bentar-pagi", path: "/foto/gapura-pagi-2.webp", judul: "Ilustrasi Candi Bentar", sumber: MODEL, lisensi: "Milik D'PRO", ket: `${BUKAN_FOTO} Ukurannya mengikuti Gapura Wringin Lawang di Trowulan.` },
  { id: "candi-bentar-malam", path: "/spirit/aset/generated/kage-approach.webp?v=4", judul: "Ilustrasi Candi Bentar", sumber: MODEL, lisensi: "Milik D'PRO", ket: BUKAN_FOTO },
  { id: "halaman-gapura", path: "/spirit/aset/generated/kage-sanmon-preview.webp?v=4", judul: "Ilustrasi Halaman Gapura", sumber: MODEL, lisensi: "Milik D'PRO", ket: BUKAN_FOTO },
  { id: "paduraksa", path: "/foto/paduraksa-2.webp", judul: "Ilustrasi Gapura Paduraksa", sumber: `${MODEL} Arca dwarapala memakai model pixforge.id.`, lisensi: "Milik D'PRO, arca dwarapala CC BY 4.0", ket: `${BUKAN_FOTO} Tinggi 16,5 meter mengikuti Gapura Bajang Ratu di Trowulan.` },
  { id: "pintu-paduraksa", path: "/spirit/aset/generated/kage-lantern-court.webp?v=4", judul: "Ilustrasi Lorong Paduraksa", sumber: MODEL, lisensi: "Milik D'PRO", ket: BUKAN_FOTO },
  { id: "kala", path: "/foto/kala-2.webp", judul: "Ilustrasi Kala", sumber: MODEL, lisensi: "Milik D'PRO", ket: `${BUKAN_FOTO} Relief bata dipahat ulang dengan acuan foto kala gerbang Trowulan dan Gapura Bajang Ratu.` },
  { id: "pendopo", path: "/spirit/aset/generated/kage-moonwater.webp?v=4", judul: "Ilustrasi Pendopo", sumber: MODEL, lisensi: "Milik D'PRO", ket: `${BUKAN_FOTO} Bentuk atap dan detail kayunya tafsir modern.` },
  { id: "medali-depan", path: "/foto/medali-lipat/depan.webp", judul: "Ilustrasi medali finisher", sumber: "Model 3D medali lipat dibuat di Blender oleh tim D'PRO. Relief dan warnanya diambil dari konsep Interactive Medal Design Concept D'PRO, dengan tulisan TRAIL RUN dan tahun 2027 memakai huruf Montserrat. Cahaya studio dari HDRI Studio Small 09 (Poly Haven).", lisensi: "Milik D'PRO", ket: "Draf desain, bukan foto produk. Mekanisme dan ukuran final menunggu sampel vendor." },
  { id: "medali-candi", path: "/foto/medali-lipat/buka.webp", judul: "Ilustrasi medali terlipat dengan panel candi berdiri", sumber: "Model 3D medali lipat dibuat di Blender oleh tim D'PRO dari konsep Interactive Medal Design Concept D'PRO.", lisensi: "Milik D'PRO", ket: "Ilustrasi desain, bukan foto produk." },
  { id: "medali-detail", path: "/foto/medali-lipat/urai.webp", judul: "Ilustrasi medali: animasi lipat, close-up relief dan sendi, koleksi empat tahun, dan tampilan urai", sumber: "Render Blender dari model 3D medali lipat oleh tim D'PRO. Animasi lipat berupa 24 gambar render.", lisensi: "Milik D'PRO", ket: "Draf desain, bukan foto produk." },
  { id: "peta-satelit", path: "/foto/peta-satelit.webp", judul: "Peta lintasan di atas citra satelit", sumber: "Citra Sentinel-2 cloudless 2016 oleh EOX IT Services (berisi data Copernicus Sentinel 2016 yang diolah), bayangan relief dari Terrain Tiles (data ketinggian SRTM), posisi Aone Trawas dan puncak Penanggungan dari OpenStreetMap. Jalur kategori digambar tim D'PRO sebagai ilustrasi.", url: "https://s2maps.eu", lisensi: "CC BY 4.0 (citra), ODbL (OpenStreetMap)", ket: "Jalur masih ilustrasi. Rute resmi diumumkan setelah survei jalur." },
];

// Aset pihak ketiga di dalam model 3D. Tekstur material dari render ulang ditambahkan ke TEKSTUR.
export const MODEL_3D: Aset[] = [
  { id: "dwarapala", judul: "Arca Dwarapala", sumber: "pixforge.id di Sketchfab", url: "https://sketchfab.com/3d-models/arca-dwarapala-fe8803efbc0043d7bc3114387c4c1545", lisensi: "CC BY 4.0" },
  { id: "surya-3d", judul: "Suryamajapahitlow", sumber: "jokodirgantara di Sketchfab", url: "https://sketchfab.com/3d-models/suryamajapahitlow-810542c2619a4bdeb65b54b78e2c249d", lisensi: "CC BY 4.0" },
  { id: "jacaranda", judul: "Pohon jacaranda", sumber: "Rob Tuytel dan Rico Cilliers di Poly Haven", url: "https://polyhaven.com/a/jacaranda_tree", lisensi: "CC0" },
  { id: "relief-kala", judul: "Relief kala", sumber: "Dipahat ulang secara prosedural di Blender oleh tim D'PRO. Acuan bentuk: foto kala gerbang Trowulan (Michael Gunther, Wikimedia Commons) dan foto Candi Bajang Ratu (Ivuvisual, Wikimedia Commons). Foto acuan hanya dilihat, tidak dipakai sebagai tekstur.", url: "https://commons.wikimedia.org/wiki/File:Kala,_Trawulan_Gate,_East_Java_1343.jpg", lisensi: "Milik D'PRO" },
];
export const TEKSTUR: Aset[] = [
  { id: "bata", judul: "Brick Wall 006 (bata gapura dan relief)", sumber: "Jan Burghardt di Poly Haven", url: "https://polyhaven.com/a/brick_wall_006", lisensi: "CC0" },
  { id: "rumput", judul: "Grass Ground (tanah berumput)", sumber: "Charlotte Baglioni di Poly Haven", url: "https://polyhaven.com/a/grass_ground", lisensi: "CC0" },
  { id: "langit-siang", judul: "Autumn Field (HDRI cahaya siang)", sumber: "Sergej Majboroda di Poly Haven", url: "https://polyhaven.com/a/autumn_field", lisensi: "CC0" },
  { id: "studio", judul: "Studio Small 09 (HDRI cahaya medali)", sumber: "Sergej Majboroda di Poly Haven", url: "https://polyhaven.com/a/studio_small_09", lisensi: "CC0" },
  { id: "langit-2", judul: "Suburban Field 02 (HDRI)", sumber: "Jacopo Voltolina di Poly Haven", url: "https://polyhaven.com/a/suburban_field_02", lisensi: "CC0" },
];

export const GRAFIS: Aset[] = [
  { id: "surya", judul: "Lambang Surya Majapahit", sumber: "Digambar ulang sebagai vektor untuk situs ini dari lambang Surya Majapahit.", lisensi: "Motif sejarah, domain publik" },
  { id: "peta", judul: "Peta ilustrasi lintasan", sumber: "Vektor buatan sendiri. Bukan peta rute resmi.", lisensi: "Milik D'PRO" },
  { id: "jersey", judul: "Gambar jersey di tabel ukuran", sumber: "Vektor buatan sendiri.", lisensi: "Milik D'PRO" },
  { id: "ikon", judul: "Ikon garis", sumber: "Digambar ulang mengikuti ikon Lucide.", url: "https://lucide.dev/license", lisensi: "ISC" },
  { id: "logo-dpro", judul: "Logo D'PRO", sumber: "D'PRO", lisensi: "Milik D'PRO" },
];

export const FONT: Aset[] = [
  { id: "bodoni", judul: "Bodoni Moda", sumber: "Google Fonts", url: "https://fonts.google.com/specimen/Bodoni+Moda", lisensi: "SIL Open Font License" },
  { id: "jakarta", judul: "Plus Jakarta Sans", sumber: "Google Fonts", url: "https://fonts.google.com/specimen/Plus+Jakarta+Sans", lisensi: "SIL Open Font License" },
  { id: "montserrat", judul: "Montserrat (huruf TRAIL RUN dan tahun di medali)", sumber: "Google Fonts", url: "https://fonts.google.com/specimen/Montserrat", lisensi: "SIL Open Font License" },
  { id: "geist-mono", judul: "Geist Mono", sumber: "Google Fonts", url: "https://fonts.google.com/specimen/Geist+Mono", lisensi: "SIL Open Font License" },
];

export const KODE: Aset[] = [
  { id: "kage", judul: "ThreeUI Kage", sumber: "Kerangka tampilan beranda 3D, diadaptasi untuk situs ini.", lisensi: "MIT" },
  { id: "threejs", judul: "three.js", sumber: "Pustaka 3D untuk beranda.", url: "https://threejs.org", lisensi: "MIT" },
  { id: "draco", judul: "Draco", sumber: "Kompresi model 3D di beranda.", url: "https://github.com/google/draco", lisensi: "Apache 2.0" },
];

export const gambar = (path: string) => GAMBAR.find((a) => a.path === path);
