# Spirit of Majapahit

Situs landing berbasis Vite, React, dan TypeScript yang menampilkan komponen `KageLandingPage` dari ThreeUI (paket npm `@designcodeio/threeui`). Halaman Kage dimuat apa adanya dari `public/landing-pages/kage.html` di dalam iframe, lengkap dengan navigasi, adegan scroll, dan dunia Three.js miliknya sendiri.

## Menjalankan

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # hasil produksi di dist/
npm run preview   # meninjau hasil build
```

## Susunan berkas

- `src/Scene.tsx` memakai `<KageLandingPage />` dengan props yang sudah dikonfigurasi: font Onest untuk heading dan body, bobot 400 dan 300, warna utama `#e0231c`, ukuran heading 46, body 17, letter spacing heading -0.012.
- `src/index.css` membuat `.shader-frame` setinggi layar penuh, tempat komponen dirender.
- `public/landing-pages/kage.html` adalah dokumen asli Kage. Folder `public/landing-pages/secret-pathways-assets/` berisi `fonts.css`, `three.min.js`, dan 14 gambar webp yang dirujuk dokumen itu.

Komponen memuat `/landing-pages/kage.html` lewat jalur root-relative, jadi folder `public/landing-pages/` harus ikut ter-deploy apa adanya. Jangan mengedit berkas di dalamnya. Perubahan warna atau tipografi dilakukan lewat props di `src/Scene.tsx`; nilainya disuntikkan sebagai stylesheet tambahan ke dalam iframe tanpa menyentuh dokumen aslinya.

## Asal aset dan verifikasi

Semua berkas di `public/landing-pages/` disalin byte demi byte dari `node_modules/@designcodeio/threeui/lib-dist/assets/landing-pages/` (paket versi 1.2.0) dan dicocokkan dengan SHA-256 pada manifes sumber ThreeUI di `https://threeui.com/source-code/kage-landing-page.json` (revisi `c8e06b90397a`). Untuk memeriksa ulang dokumen utamanya:

```bash
shasum -a 256 public/landing-pages/kage.html
# c8e06b90397ac246baf0ab6f32f5f6b570acc6fe03c7009f711b579fb72d9f49
```

Saat paket naik versi, salin ulang asetnya lalu cocokkan hash-nya lagi:

```bash
npm update @designcodeio/threeui
SRC=node_modules/@designcodeio/threeui/lib-dist/assets/landing-pages
cp "$SRC/kage.html" public/landing-pages/
cp -R "$SRC/secret-pathways-assets" public/landing-pages/
```

## Lisensi aset

Kode dan aset Kage dari ThreeUI berlisensi MIT, lihat `licenses/THREEUI-LICENSE`. Font yang tertanam di `fonts.css` berlisensi SIL Open Font License 1.1, lihat `licenses/FONT-LICENSES.md`. `three.min.js` adalah Three.js r149 dengan lisensi MIT.

## Aturan commit

Semua commit di repo ini ber-author `dreinst <asteinec@gmail.com>` tanpa trailer `Co-Authored-By`. Setelah clone, jalankan sekali:

```bash
git config user.name dreinst
git config user.email asteinec@gmail.com
git config core.hooksPath .githooks
```

Hook `.githooks/commit-msg` membuang setiap baris `Co-Authored-By` dari pesan commit, sehingga trailer yang ditambahkan alat apa pun tidak ikut tersimpan. Cek dengan:

```bash
git log --format='%an <%ae>%n%B'
```
