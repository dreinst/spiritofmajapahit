import Link from "next/link";
import Image from "next/image";
import Icon, { WaIcon } from "@/components/Icon";
import Hitung from "@/components/Hitung";
import SizeChart from "@/components/SizeChart";
import Shell from "@/components/Shell";
import AddOn from "@/components/AddOn";
import Ket from "@/components/Ket";
import { PetaLintasan, WARNA_RUTE } from "@/components/Brand";
import { EVENT } from "@/lib/event";
import { rupiah } from "@/lib/format";
import { getSettings, terpakai } from "@/lib/settings";
import { WA_TAMPIL, waLink } from "@/lib/kontak";
import Kelopak from "@/components/Kelopak";

export const dynamic = "force-dynamic";
export const metadata = { title: { absolute: "Majapahit Trail Run 2027 · Aone Trawas" }, description: "Majapahit Trail Run, Minggu 27 Juni 2027 di Aone Trawas, kaki Gunung Penanggungan, Mojokerto. Kategori dan harga, lintasan, medali, add on, jadwal, dan tanya jawab." };

const HERO = "/spirit/aset/generated/kage-approach.webp?v=9";

export default async function Home() {
  const [s, used] = await Promise.all([getSettings(), terpakai()]);
  const STEPS = [
    ["Pilih kategori", "Tentukan jarak, lalu isi data pelari. Satu pesanan bisa untuk beberapa pelari."],
    ["Pilih ukuran jersey", "Bandingkan kaos yang biasa Anda pakai dengan tabel ukuran."],
    ["Tambah add on", "Kamar di Aone Trawas dan merchandise resmi. Boleh dilewati."],
    ["Bayar dan terima e-ticket", "Bayar lewat QRIS. E-ticket dikirim ke email tiap pelari setelah pembayaran diterima."],
  ];
  const FAQ = [
    ["Apa saja yang saya dapat dari tiket?", "Jersey resmi sesuai ukuran pilihan Anda, nomor BIB, dan medali finisher untuk pelari yang menyelesaikan rute dalam batas waktu."],
    ["Berapa usia minimal pelari?", "15 tahun pada hari lomba, 27 Juni 2027. NIK diminta saat mendaftar dan dicocokkan saat pengambilan racepack."],
    ["Bisakah saya mendaftarkan teman atau keluarga?", "Bisa. Satu pesanan menampung sampai 10 pelari, masing-masing dengan kategori dan ukuran jersey sendiri. E-ticket dikirim ke email tiap pelari."],
    ["Bagaimana cara membayar?", "Lewat QRIS dengan nominal yang tertera di halaman pembayaran, lalu unggah bukti pembayarannya. Panitia memverifikasi paling lambat 1x24 jam, lalu e-ticket dikirim lewat email."],
    ["Apakah kamar wajib dipesan?", "Tidak. Kamar dan merchandise adalah add on yang boleh dilewati. Kalau dipesan, semuanya dibayar dalam satu tagihan bersama tiket."],
    ["Kapan racepack diambil?", `${s.jadwalRacepack} di ${EVENT.venue}. Bawa e-ticket (QR) dan KTP. Add on yang Anda pesan juga diambil di sana.`],
  ];
  const jarak = s.kategori.map((k) => k.jarak);

  return (
    <Shell>
      <section className="lhero">
        <Kelopak />
        <Image src={HERO} alt="Ilustrasi candi bentar pada malam hari" fill priority sizes="100vw" className="bg" />
        <Ket src={HERO} className="pojok" />
        <div className="isi">
          <p className="eb">{EVENT.seri} · {EVENT.tanggal}</p>
          <h1 style={{ marginTop: 22 }}>Majapahit <span className="it">Trail Run</span></h1>
          <p className="lead">Lari lintas alam di kaki Gunung Penanggungan, di {EVENT.venue}, Mojokerto.</p>
          <div className="cta"><Link href="/daftar" className="btn r lg">Daftar sekarang <Icon name="arrow" size={18} /></Link><Link href="#kategori" className="btn g lg">Lihat kategori</Link></div>
          <div className="lstat">
            <div><p className="eb">Hari lomba</p><b>27 Juni 2027</b></div>
            <div><p className="eb">Jarak</p><b>{jarak.length > 1 ? `${jarak[0]} sampai ${jarak[jarak.length - 1]}` : jarak[0]}</b></div>
            <div><p className="eb">Venue</p><b>{EVENT.venue}</b></div>
            <div className="hit"><p className="eb">Menuju hari lomba</p><Hitung to={EVENT.hariH} /></div>
          </div>
        </div>
      </section>

      <section className="sec" id="kategori">
        <div className="kat-head" data-rv>
          <div><p className="eb">Kategori</p><h2 style={{ marginTop: 18 }}>Pilih <span className="it">jarak Anda.</span></h2></div>
          <p className="d">Tiket sudah termasuk jersey resmi dan medali finisher. Kuota tiap kategori terbatas, dan sisa slot di bawah mengikuti jumlah pendaftar.</p>
        </div>
        <div className="kat">
          {s.kategori.map((k, i) => {
            const sisa = Math.max(0, k.kuota - (used[k.id] ?? 0));
            return (
              <article key={k.id} className="kcard" data-rv style={{ ["--d" as string]: i, ["--c" as string]: WARNA_RUTE[i % 3] }}>
                <div className="between" style={{ alignItems: "center" }}><h3>{k.nama}</h3><span className="pill p">{sisa > 0 ? `Sisa ${sisa.toLocaleString("id-ID")} slot` : "Kuota penuh"}</span></div>
                <p className="jarak">{k.jarak.replace(/K$/i, "")}<small>K</small></p>
                <p className="muted" style={{ fontSize: 15, maxWidth: 340 }}>{k.ket}</p>
                <div className="meta"><span>Elevasi {k.elevasi}</span><span>Kuota {k.kuota.toLocaleString("id-ID")}</span></div>
                <div className="harga"><b>{rupiah(k.harga)}</b>{sisa > 0 ? <Link href={`/daftar?k=${k.id}`} className="btn w sm">Daftar {k.jarak} <Icon name="arrow" size={15} /></Link> : <span className="pill g">Penuh</span>}</div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="sec" id="lintasan" style={{ paddingTop: 0 }}>
        <div className="peta">
          <div className="map" data-rv><PetaLintasan /></div>
          <div data-rv style={{ ["--d" as string]: 1 }}>
            <p className="eb">Lintasan</p><h2 style={{ marginTop: 18, fontSize: "clamp(40px,4.4vw,64px)" }}>Kaki <span className="it">Penanggungan.</span></h2>
            <p className="muted" style={{ fontSize: 16, marginTop: 20, lineHeight: 1.7 }}>Semua kategori berkumpul di Aone Trawas, di lereng Gunung Penanggungan (1.653 mdpl). Gunung ini menyimpan lebih dari seratus situs purbakala, banyak di antaranya dari masa Majapahit.</p>
            <div className="rute-garis">{s.kategori.slice(0, 3).map((k, i) => <span key={k.id}><i style={{ background: WARNA_RUTE[i] }} />{k.nama} {k.jarak}</span>)}</div>
            <div className="legend">
              <span><i><Icon name="bendera" size={13} /></i>Start dan finish</span>
              <span><i>A</i>Pos air</span>
              <span><i>+</i>Pos medis</span>
              <span><i><Icon name="gunung" size={13} /></i>Puncak</span>
            </div>
            <p className="note" style={{ marginTop: 24 }}>Peta ini gambaran arah. Rute resmi, jarak pasti, dan titik pos diumumkan setelah survei jalur.</p>
          </div>
        </div>
      </section>

      <section className="dark" id="medali">
        <div className="sec">
          <div className="medali">
            <div data-rv>
              <div className="tumpuk">
                <div className="cahaya" />
                <Image src="/foto/medali-penataran/depan.webp" alt="Ilustrasi medali finisher Majapahit Trail Run 2027 dalam keadaan tertutup" width={1000} height={1001} className="depan" sizes="(max-width: 900px) 70vw, 36vw" />
                <Image src="/foto/medali-penataran/buka.webp" alt="Ilustrasi medali yang dilipat, panel relief Candi Penataran berdiri di atas tulisan MAJAPAHIT" width={1000} height={1185} className="candi" sizes="(max-width: 900px) 50vw, 26vw" />
              </div>
              <Ket src="/foto/medali-penataran/depan.webp" />
            </div>
            <div data-rv style={{ ["--d" as string]: 1 }}>
              <p className="eb">Medali finisher</p>
              <h2 style={{ marginTop: 18 }}>Medali yang berubah jadi <span className="it">candi.</span></h2>
              <p className="muted" style={{ fontSize: 16, marginTop: 20, maxWidth: 500, lineHeight: 1.7 }}>Medali segi enam ini bisa dilipat. Putar bagian atasnya ke belakang, dan panel relief Candi Penataran berdiri tegak di atas tulisan MAJAPAHIT. Medali dari garis finis berubah jadi miniatur candi untuk dipajang.</p>
              <div className="fitur">
                <div><b>84 mm</b><p>Lebar medali segi enam</p></div>
                <div><b>90°</b><p>Panel candi berdiri saat medali dilipat</p></div>
              </div>
              <Link href="/medali" className="btn w" style={{ marginTop: 28 }}>Lihat detail medali <Icon name="arrow" size={16} /></Link>
            </div>
          </div>
          <div className="jersey">
            <div data-rv>
              <p className="eb">Jersey resmi</p>
              <h2 className="h2" style={{ marginTop: 18 }}>Satu desain dengan <span className="it">medali.</span></h2>
              <p className="muted" style={{ fontSize: 16, marginTop: 20, maxWidth: 460, lineHeight: 1.7 }}>Jersey dan medali dirancang dalam satu key visual. Ukuran dipilih saat mendaftar. Ukur kaos yang biasa Anda pakai, lalu bandingkan dengan tabel ini.</p>
              <Link href="/daftar" className="btn r lg" style={{ marginTop: 30 }}>Daftar dan pilih ukuran <Icon name="arrow" size={18} /></Link>
            </div>
            <div className="sz" data-rv style={{ ["--d" as string]: 1 }}><SizeChart /></div>
          </div>
        </div>
      </section>

      <AddOn s={s} checkIn={s.checkIn} cta={["/daftar", "Pesan bersama tiket"]} lead="Datang sehari sebelumnya supaya pagi hari lomba lebih santai. Kamar dan merchandise ditambahkan saat mendaftar dan masuk ke tagihan yang sama. Merchandise diambil bersama racepack." />

      <section className="sec" id="jadwal">
        <div data-rv><p className="eb">Jadwal</p><h2 style={{ marginTop: 18 }}>Catat <span className="it">tanggalnya.</span></h2></div>
        <div className="jadwal">
          {[
            ["Pendaftaran", s.jadwalDaftar, "Kuota terbatas per kategori.", false],
            ["Racepack", s.jadwalRacepack, `Di ${EVENT.venue}. Bawa e-ticket dan KTP.`, false],
            ["Hari lomba", "27 Juni 2027", `${EVENT.tanggal.split(",")[0]} di ${EVENT.venue}.`, true],
            ["Konser Majapahit", EVENT.konser, "Rangkaian The Spirit of Majapahit berlanjut.", false],
          ].map(([t, w, k, puncak], i) => (
            <div key={t as string} className={puncak ? "puncak" : ""} data-rv style={{ ["--d" as string]: i }}><p className="eb">{t}</p><b className="disp">{w}</b><p>{k}</p></div>
          ))}
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div data-rv><p className="eb">Cara daftar</p><h2 style={{ marginTop: 18 }}>Empat <span className="it">langkah.</span></h2></div>
        <div className="steps">{STEPS.map(([h, p], i) => <div key={h} className="step" data-rv style={{ ["--d" as string]: i }}><b>0{i + 1}</b><div><h3>{h}</h3><p className="muted" style={{ marginTop: 8 }}>{p}</p></div></div>)}</div>
      </section>

      <section className="sec" id="faq" style={{ maxWidth: 1040, paddingTop: 0 }}>
        <div data-rv><p className="eb">Tanya jawab</p><h2 style={{ marginTop: 18 }}>Yang sering <span className="it">ditanyakan.</span></h2></div>
        <div style={{ marginTop: 32 }}>{FAQ.map(([q, a]) => <details key={q} className="faq"><summary><span>{q}</span><span>+</span></summary><p>{a}</p></details>)}</div>
        <a href={waLink()} target="_blank" rel="noopener" className="btn wa" style={{ marginTop: 32 }}><WaIcon />Tanya lewat WhatsApp {WA_TAMPIL}</a>
      </section>

      <section className="final">
        <Kelopak n={10} />
        <p className="eb rel">{EVENT.tanggal} · {EVENT.venue}</p>
        <h2 data-rv style={{ marginTop: 20 }}>Sampai jumpa<br />di <span className="it">Trawas.</span></h2>
        <div className="row rel" style={{ justifyContent: "center", marginTop: 34 }}><Link href="/daftar" className="btn r lg">Daftar sekarang <Icon name="arrow" size={18} /></Link><Link href="/cek-tiket" className="btn g lg">Cek tiket</Link></div>
        <Image src="/foto/paduraksa-3.webp" alt="Ilustrasi gapura paduraksa dengan sepasang miniatur candi" width={1200} height={1500} className="padu" sizes="(max-width: 900px) 80vw, 560px" />
        <Ket src="/foto/paduraksa-3.webp" className="rel" />
      </section>
    </Shell>
  );
}
