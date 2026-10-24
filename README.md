# Majapahit Trail Run 2027

Situs pendaftaran Majapahit Trail Run, Minggu 27 Juni 2027 di Aone Trawas, kaki Gunung Penanggungan, Mojokerto. Acara ini bagian dari rangkaian The Spirit of Majapahit. Domain: https://majapahit.dpro.events

Pelari memilih kategori, mengisi data diri dan ukuran jersey, lalu boleh menambah kamar Aone Trawas dan merchandise dalam satu tagihan. Pembayaran lewat QRIS manual (unggah bukti, dicek panitia) atau Midtrans Snap. Setelah lunas, e-ticket ber-QR dikirim ke email setiap pelari.

Pola teknisnya sama dengan KUWERA dan BMPD: Next.js 16, Prisma 7 dengan adapter pg, Postgres, CSS polos, hosting Coolify di VPS.

## Menjalankan di lokal

```bash
cp .env.example .env          # isi DATABASE_URL dan AUTH_SECRET
npm install
npx prisma db push            # buat tabel
echo 'sandi-minimal-10' | node tools/admin-user.mjs nama superadmin
npm run dev
```

Panel panitia ada di `/mjpadmin/login`. Peran: superadmin (semua, termasuk pengaturan dan log), admin (keuangan dan data pelari), petugas (scan e-ticket saja).

## Yang diatur dari panel, tanpa mengubah kode

Kategori (nama, jarak, elevasi, harga, kuota), tipe kamar dan harga per malam, tanggal check in, produk merchandise, periode pendaftaran, jadwal racepack, rekening, dan buka tutup pendaftaran. Semua angka bawaan masih contoh dan perlu diganti panitia sebelum situs dibuka. Satu-satunya angka dari rapat adalah contoh tiket fun trail Rp 500.000 yang juga belum final.

Tabel ukuran jersey di `src/lib/sizechart.ts` sementara memakai tabel vendor BMPD, sampai vendor jersey Majapahit mengirim tabelnya.

## Mode pembayaran (env saat build)

- `PAYMENT_MODE=mock` dengan `SIMULASI=1`: mode uji, ada tombol simulasi bayar dan pita "Mode uji".
- `PAYMENT_MODE=manual` dengan `QRIS_STATIC_PAYLOAD`: QRIS bernominal plus kode unik, bukti diunggah lalu dicek di `/mjpadmin/verifikasi`.
- `PAYMENT_MODE=midtrans` dengan `MIDTRANS_SERVER_KEY` dan `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`: Notification URL `https://majapahit.dpro.events/api/midtrans`.

Email terkirim lewat SMTP (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`). Tanpa SMTP, email hanya dicatat di log.

## Aset visual

- Gapura (candi bentar dan paduraksa) dirender dari model Blender sendiri, `~/Downloads/Spirit of Majapahit/3D/Spirit of Majapahit v3.blend`, dengan cahaya fajar dan latar transparan. Langit, matahari, dan siluet Penanggungan digambar sebagai SVG/CSS di `src/components/Brand.tsx`.
- Model itu memakai dua aset CC BY 4.0 yang kreditnya tampil di footer: [Arca Dwarapala oleh pixforge.id](https://sketchfab.com/3d-models/arca-dwarapala-fe8803efbc0043d7bc3114387c4c1545) dan [Suryamajapahitlow oleh jokodirgantara](https://sketchfab.com/3d-models/suryamajapahitlow-810542c2619a4bdeb65b54b78e2c249d), plus pohon jacaranda dari Poly Haven (CC0).
- Foto medali diambil dari konsep desain medali D'PRO ("Interactive Medal Design Concept", 20 Okt 2026).

## Aturan commit

Semua commit di repo ini ber-author `dreinst <asteinec@gmail.com>` tanpa trailer `Co-Authored-By`. Setelah clone, jalankan sekali:

```bash
git config user.name dreinst
git config user.email asteinec@gmail.com
git config core.hooksPath .githooks
```
