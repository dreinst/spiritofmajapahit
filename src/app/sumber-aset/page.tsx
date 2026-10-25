import Image from "next/image";
import Payung from "@/components/Payung";
import { FONT, GAMBAR, GRAFIS, KODE, MODEL_3D, TEKSTUR, type Aset } from "@/lib/sumber";

export const metadata = { title: { absolute: "Sumber aset · The Spirit of Majapahit" }, description: "Sumber dan lisensi gambar, model 3D, grafis, dan font di situs The Spirit of Majapahit." };

function Baris({ a }: { a: Aset }) {
  return (
    <div className={`sa-baris${a.path ? "" : " tanpa"}`} id={a.id}>
      {a.path && <Image src={a.path} alt="" width={240} height={160} className="sa-img" />}
      <div>
        <h3>{a.judul}</h3>
        <p className="muted">{a.url ? <a href={a.url} target="_blank" rel="noopener noreferrer">{a.sumber}</a> : a.sumber}</p>
        {a.ket && <p className="muted small" style={{ marginTop: 6 }}>{a.ket}</p>}
      </div>
      <span className="pill p">{a.lisensi}</span>
    </div>
  );
}

const BAGIAN: [string, Aset[]][] = [
  ["Gambar di situs", GAMBAR],
  ["Aset di dalam model 3D", MODEL_3D],
  ["Tekstur material", TEKSTUR],
  ["Grafis, ikon, dan logo", GRAFIS],
  ["Font", FONT],
  ["Kode tampilan beranda 3D", KODE],
];

export default function SumberAset() {
  return (
    <Payung back={["/", "Ke beranda"]}>
      <div className="pagehead" style={{ paddingTop: 80 }}>
        <p className="eb">The Spirit of Majapahit</p>
        <h1 style={{ marginTop: 18 }}>Sumber <span className="it">aset.</span></h1>
        <p className="muted" style={{ marginTop: 18, maxWidth: 620, fontSize: 16, lineHeight: 1.7 }}>Asal dan lisensi setiap gambar, model 3D, grafis, dan font di keempat situs The Spirit of Majapahit. Gambar gapura, kala, dan pendopo adalah ilustrasi 3D, bukan foto situs asli.</p>
      </div>
      <div className="narrow" style={{ paddingTop: 30, paddingBottom: 120 }}>
        {BAGIAN.filter(([, l]) => l.length).map(([judul, list]) => (
          <section key={judul} className="sa-sec">
            <h2>{judul}</h2>
            {list.map((a) => <Baris key={a.id} a={a} />)}
          </section>
        ))}
      </div>
    </Payung>
  );
}
