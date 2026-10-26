import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";
import Shell from "@/components/Shell";
import Ket from "@/components/Ket";
import MedaliPutar from "@/components/MedaliPutar";

export const metadata = { title: { absolute: "Medali lipat · Majapahit Trail Run 2027" }, description: "Detail medali finisher Majapahit Trail Run 2027: medali segi enam yang dilipat menjadi miniatur Candi Penataran, relief, engsel, koleksi empat tahun, dan spesifikasi." };

const SISI = [
  ["/foto/medali-penataran/dekat-panel.webp", "Panel Candi Penataran", "Candi utama dengan tangga panjang dan kepala kala di atas pintu, dengan dinding bertangga di kedua sisinya. Saat medali dipakai, panel ini rebah menjadi bagian atas muka depan.", "Lebar 76 mm · tinggi 35 mm"],
  ["/foto/medali-penataran/dekat-depan.webp", "Muka depan", "Tulisan MAJAPAHIT, TRAIL RUN, 10K, dan 2027 di antara tangga bata, sulur, dan teratai. Bagian ini menjadi alas saat medali dipajang.", "Bingkai tebal di setiap tepi"],
  ["/foto/medali-penataran/dekat-belakang.webp", "Punggung", "Gapura berkepala kala, sulur di keempat sudut, dan pita bertuliskan 10K FINISHER.", "Relief di dalam bingkai belakang"],
] as const;
const SPEK = [["Bentuk", "Segi enam 84 x 75 mm, tebal 5,6 mm saat dipakai"], ["Berat perkiraan", "Sekitar 100 g tanpa pita"], ["Bahan", "Cor zamak dengan pin baja tahan karat"], ["Warna", "Emas antik dengan patina gelap di cekungan relief"],
  ["Mekanisme", "Sendi di kedua ujung garis tengah, bagian atas berputar ke punggung, panel candi berdiri di tepi garis tengah"], ["Posisi pajang", "Panel berdiri 90 derajat, tinggi sekitar 46 mm"], ["Gantungan", "Dua bingkai yang bisa dilepas, pita sublim 30 mm"]];

export default function Medali() {
  return (
    <Shell>
      <section className="sec md-hero">
        <div className="md-hero-in">
          <div data-rv>
            <p className="eb">Medali finisher · Majapahit Trail Run 2027</p>
            <h1 style={{ marginTop: 18 }}>Medali <span className="it" style={{ whiteSpace: "nowrap" }}>lipat.</span></h1>
            <p className="muted" style={{ fontSize: 17, lineHeight: 1.75, marginTop: 22, maxWidth: 480 }}>Medali segi enam ini terbelah di garis tengah. Putar bagian atasnya ke belakang, dan panel relief Candi Penataran berdiri tegak di atas tulisan MAJAPAHIT. Medali yang Anda bawa pulang dari garis finis berubah jadi miniatur candi untuk dipajang.</p>
            <div className="row" style={{ marginTop: 30 }}><Link href="/daftar" className="btn r lg">Daftar dan dapatkan medalinya <Icon name="arrow" size={18} /></Link></div>
          </div>
          <MedaliPutar />
        </div>
        <p className="note" style={{ marginTop: 34, maxWidth: 760 }}>Ini ilustrasi desain dari model 3D. Ukuran, bahan, dan mekanisme final ditetapkan setelah prototipe dan penawaran vendor.</p>
      </section>

      <section className="sec" style={{ paddingTop: 30 }}>
        <div data-rv><p className="eb">Cara kerja</p><h2 style={{ marginTop: 16 }}>Dipakai, dilipat, <span className="it">dipajang.</span></h2></div>
        <div className="md-langkah">
          {[["/foto/medali-penataran/depan.webp", "Dipakai", "Segi enam utuh di pita. Sendi di kedua sudut menjaga dua bagian medali tetap rata saat Anda berlari."], ["/foto/medali-penataran/f12.webp", "Dilipat", "Lepas gantungannya, lalu putar bagian atas ke belakang. Panel candi ikut terangkat dari dalamnya."], ["/foto/medali-penataran/buka.webp", "Dipajang", "Panel Candi Penataran berdiri 90 derajat. Bingkai kedua bagian bertumpuk rapi, jadi medali kokoh di meja."]].map(([g, t, d], i) => (
            <div key={t} className="md-kartu" data-rv style={{ ["--d" as string]: i }}>
              <div className="md-gbr"><Image src={g} alt={`Medali ${t.toLowerCase()}`} width={600} height={600} sizes="(max-width: 900px) 90vw, 30vw" /></div>
              <p className="eb" style={{ marginTop: 18 }}>0{i + 1}</p><h3 style={{ marginTop: 6 }}>{t}</h3><p className="muted small" style={{ marginTop: 8, lineHeight: 1.7 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 30 }}>
        <div data-rv><p className="eb">Relief</p><h2 style={{ marginTop: 16 }}>Detail yang bisa <span className="it">diraba.</span></h2></div>
        <div className="md-lapis">
          {SISI.map(([g, t, d, u], i) => (
            <article key={t} className="md-kartu" data-rv style={{ ["--d" as string]: i }}>
              <div className="md-gbr lebar"><Image src={g} alt={`Close-up ${t.toLowerCase()} medali`} width={1000} height={1000} sizes="(max-width: 900px) 90vw, 30vw" /></div>
              <h3 style={{ marginTop: 18 }}>{t}</h3><p className="muted small" style={{ marginTop: 8, lineHeight: 1.7 }}>{d}</p><p className="eb" style={{ marginTop: 14 }}>{u}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 30 }}>
        <div className="md-dua">
          <div className="md-gbr besar" data-rv><Image src="/foto/medali-penataran/dekat-engsel.webp" alt="Close-up sendi di sudut medali saat bagian atas sedang diputar" width={1000} height={1000} sizes="(max-width: 900px) 90vw, 45vw" /></div>
          <div data-rv style={{ ["--d" as string]: 1 }}>
            <p className="eb">Detail sendi</p><h2 style={{ marginTop: 16 }}>Kecil, tapi <span className="it">bekerja.</span></h2>
            <p className="muted" style={{ fontSize: 16, lineHeight: 1.75, marginTop: 18 }}>Bagian atas berputar pada pin baja tahan karat di tepi punggung, jadi punggung kedua bagian bertemu rata saat dilipat. Panel candi berputar pada pin kedua di tepi muka dan tertahan di posisi tegak. Tulisan MAJAPAHIT di garis tengah tetap utuh karena tidak ada engsel yang memotongnya.</p>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 30 }}>
        <div className="md-dua">
          <div data-rv>
            <p className="eb">Koleksi empat tahun</p><h2 style={{ marginTop: 16 }}>Empat medali, satu <span className="it">candi.</span></h2>
            <p className="muted" style={{ fontSize: 16, lineHeight: 1.75, marginTop: 18 }}>Medali ini dirancang sebagai koleksi. Setiap tahun Majapahit Trail Run punya satu medali dengan tahunnya sendiri. Susun empat medali yang sudah dilipat mengelilingi satu titik, dan keempat panelnya membentuk kompleks Candi Penataran dengan empat muka.</p>
          </div>
          <div className="md-gbr besar" data-rv style={{ ["--d" as string]: 1 }}><Image src="/foto/medali-penataran/empat.webp" alt="Empat medali terlipat disusun mengelilingi satu titik membentuk kompleks candi empat muka" width={1200} height={1200} sizes="(max-width: 900px) 90vw, 45vw" /></div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 30 }}>
        <div className="md-dua">
          <div data-rv>
            <p className="eb">Spesifikasi</p><h2 style={{ marginTop: 16 }}>Angka <span className="it">rancangannya.</span></h2>
            <div className="md-spek">{SPEK.map(([a, b]) => <div key={a}><span className="muted small">{a}</span><b>{b}</b></div>)}</div>
          </div>
          <div className="md-gbr besar" data-rv style={{ ["--d" as string]: 1 }}><Image src="/foto/medali-penataran/urai.webp" alt="Tampilan urai medali: bagian depan, bagian atas, panel candi, gantungan, dan pin" width={1400} height={1400} sizes="(max-width: 900px) 90vw, 45vw" /><Ket src="/foto/medali-penataran/urai.webp" /></div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 20, textAlign: "center" }}>
        <h2>Lari, selesaikan, <span className="it">pajang.</span></h2>
        <div className="row" style={{ justifyContent: "center", marginTop: 28 }}><Link href="/daftar" className="btn r lg">Daftar sekarang <Icon name="arrow" size={18} /></Link><Link href="/#kategori" className="btn w lg">Lihat kategori</Link></div>
      </section>
    </Shell>
  );
}
