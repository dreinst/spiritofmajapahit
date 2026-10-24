import Link from "next/link";
import Image from "next/image";
import Icon, { WaIcon } from "@/components/Icon";
import Hitung from "@/components/Hitung";
import SizeChart from "@/components/SizeChart";
import Shell, { Words } from "@/components/Shell";
import { PetaLintasan, Pegunungan, Surya } from "@/components/Brand";
import { EVENT } from "@/lib/event";
import { rupiah } from "@/lib/format";
import { getSettings, terpakai } from "@/lib/settings";
import { WA_TAMPIL, waLink } from "@/lib/kontak";

export const dynamic = "force-dynamic";

const WARNA_RUTE = ["#D3A44C", "#B4472B", "#5A2C3E"];
const IKON_MERCH = ["baju", "baju", "topi", "botol"];

export default async function Home() {
  const [s, used] = await Promise.all([getSettings(), terpakai()]);
  const jarak = s.kategori.map((k) => k.jarak);
  const STEPS = [
    ["Pilih kategori", "Tentukan jarak lalu isi data pelari. Satu pesanan bisa untuk beberapa pelari sekaligus."],
    ["Pilih ukuran jersey", "Tabel ukuran membantu Anda memilih jersey yang pas dari kaos yang biasa dipakai."],
    ["Tambah add on", "Kamar di Aone Trawas dan merchandise resmi, kalau Anda mau. Boleh juga dilewati."],
    ["Bayar, terima e-ticket", "Bayar lewat QRIS. E-ticket dikirim ke email setiap pelari setelah pembayaran diterima."],
  ];
  const FAQ = [
    ["Apa saja yang saya dapat dari tiket?", "Jersey resmi sesuai ukuran pilihan Anda, nomor BIB, dan medali finisher bagi pelari yang menyelesaikan rute dalam batas waktu."],
    ["Berapa usia minimal pelari?", "15 tahun pada hari lomba, 27 Juni 2027. NIK diminta saat mendaftar dan dicocokkan saat pengambilan racepack."],
    ["Bisakah saya mendaftarkan teman atau keluarga?", "Bisa. Satu pesanan menampung sampai 10 pelari, masing-masing dengan kategori dan ukuran jersey sendiri. E-ticket dikirim ke email setiap pelari."],
    ["Bagaimana cara membayar?", "Lewat QRIS dengan nominal yang sudah tertera di halaman pembayaran. Setelah membayar, unggah bukti pembayarannya. Panitia memverifikasi paling lambat 1x24 jam, lalu e-ticket dikirim lewat email."],
    ["Apakah kamar wajib dipesan?", "Tidak. Kamar dan merchandise adalah add on yang boleh dilewati. Kalau dipesan, semuanya dibayar dalam satu tagihan bersama tiket."],
    ["Kapan racepack diambil?", `${s.jadwalRacepack} di ${EVENT.venue}. Bawa e-ticket (QR) dan KTP ya. Add on yang Anda pesan juga diambil di sana.`],
  ];
  const pita = ["Majapahit Trail Run 2027", EVENT.venue, "27 Juni 2027", "Kaki Gunung Penanggungan", "The Spirit of Majapahit"];

  return (
    <Shell over>
      <section className="hero">
        <div className="bintang" />
        <div className="matahari" />
        <Pegunungan className="gunung" />
        <Image src="/foto/gapura-pagi.webp" alt="Candi bentar dan gapura paduraksa bergaya Majapahit saat fajar" width={2400} height={1350} priority className="gapura" sizes="(max-width: 900px) 150vw, 68vw" />
        <div className="tanah" />
        <div className="isi">
          <p className="eb" style={{ color: "#F3D9B0" }}>{EVENT.seri} · Trail run</p>
          <h1 style={{ marginTop: 16 }}><Words text="Majapahit Trail Run" /><span className="it">edisi pertama 2027</span></h1>
          <p className="lead">Lari lintas alam di kaki Gunung Penanggungan. {EVENT.tanggal} di {EVENT.venue}, Mojokerto.</p>
          <div className="cta"><Link href="#kategori" className="btn r lg">Pilih kategori <Icon name="arrow" size={18} /></Link><Link href="#medali" className="btn g lg">Lihat medali</Link></div>
        </div>
        <div className="kaki"><div>
          <div className="hit"><p className="eb">Menuju hari lomba</p><Hitung to={EVENT.hariH} /></div>
          <div><p className="eb">Tanggal</p><b>27.06<small>2027</small></b></div>
          <div><p className="eb">Venue</p><b>Aone<small>Trawas</small></b></div>
          <div><p className="eb">Kategori</p><b>{jarak.length > 1 ? `${jarak[0]} · ${jarak[jarak.length - 1]}` : jarak[0]}<small>{s.kategori.length} jarak</small></b></div>
        </div></div>
      </section>

      <div className="pita" aria-hidden="true">{[0, 1].map((n) => <div key={n}>{[...pita, ...pita].map((t, i) => <span key={i}>{t}<Surya size={18} /></span>)}</div>)}</div>

      <section className="sec" id="kategori">
        <div className="kat-head" data-rv>
          <div><p className="eb">Kategori</p><h2 style={{ marginTop: 14 }}>Pilih jarak <span className="it">Anda.</span></h2></div>
          <p className="muted" style={{ fontSize: 17 }}>Tiket sudah termasuk jersey resmi dan medali finisher. Kuota tiap kategori terbatas, sisa slot di bawah langsung mengikuti jumlah pendaftar.</p>
        </div>
        <div className="kat">
          {s.kategori.map((k, i) => {
            const sisa = Math.max(0, k.kuota - (used[k.id] ?? 0));
            return (
              <article key={k.id} className="kcard" data-rv style={{ ["--d" as string]: i }}>
                <Surya className="pola" size={260} />
                <div className="between" style={{ alignItems: "center" }}><h3>{k.nama}</h3><span className="pill p">{sisa > 0 ? `Sisa ${sisa.toLocaleString("id-ID")} slot` : "Kuota penuh"}</span></div>
                <div className="meta"><span>Elevasi {k.elevasi}</span><span>Kuota {k.kuota.toLocaleString("id-ID")}</span></div>
                <p style={{ marginTop: 16, fontSize: 15, opacity: 0.88, maxWidth: 320 }}>{k.ket}</p>
                <p className="jarak">{k.jarak.replace(/K$/i, "")}<small>K</small></p>
                <div className="harga"><b>{rupiah(k.harga)}</b>{sisa > 0 ? <Link href={`/daftar?k=${k.id}`} className="btn w sm">Daftar {k.jarak} <Icon name="arrow" size={16} /></Link> : <span className="pill g">Penuh</span>}</div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="sec" id="lintasan" style={{ paddingTop: 30 }}>
        <div className="peta">
          <div className="map" data-rv><PetaLintasan /></div>
          <div data-rv style={{ ["--d" as string]: 1 }}>
            <p className="eb">Lintasan</p><h2 style={{ marginTop: 14, fontSize: "clamp(46px,5vw,76px)" }}>Kaki <span className="it">Penanggungan.</span></h2>
            <p className="muted" style={{ fontSize: 17, marginTop: 18 }}>Semua kategori berkumpul di Aone Trawas, di lereng Gunung Penanggungan (1.653 mdpl). Gunung ini menyimpan lebih dari seratus situs purbakala, banyak di antaranya dari masa Majapahit.</p>
            <div className="rute-garis">{s.kategori.slice(0, 3).map((k, i) => <span key={k.id}><i style={{ background: WARNA_RUTE[i] }} />{k.nama} {k.jarak}</span>)}</div>
            <div className="legend">
              <span><i style={{ background: "var(--ink)" }}><Icon name="bendera" size={14} /></i>Start dan finish</span>
              <span><i style={{ background: "#2F7FA8" }}>A</i>Pos air</span>
              <span><i style={{ background: "var(--bata)" }}>+</i>Pos medis</span>
              <span><i style={{ background: "#5A2C3E" }}><Icon name="gunung" size={14} /></i>Puncak</span>
            </div>
            <p className="note" style={{ marginTop: 22 }}>Peta ini gambaran arah. Rute resmi, jarak pasti, dan titik pos diumumkan setelah survei jalur.</p>
          </div>
        </div>
      </section>

      <section className="dark" id="medali">
        <div className="sec">
          <div className="medali">
            <div className="tumpuk" data-rv>
              <div className="cahaya" />
              <Image src="/foto/medali-depan.webp" alt="Sisi depan medali finisher bergambar Candi Penataran" width={1000} height={1010} className="depan" sizes="(max-width: 900px) 70vw, 36vw" />
              <Image src="/foto/medali-candi.webp" alt="Medali yang dibuka berdiri menjadi miniatur candi" width={1000} height={1190} className="candi" sizes="(max-width: 900px) 50vw, 26vw" />
            </div>
            <div data-rv style={{ ["--d" as string]: 1 }}>
              <p className="eb">Medali finisher</p>
              <h2 style={{ marginTop: 14 }}>Medali yang berdiri jadi <span className="it">candi.</span></h2>
              <p className="muted" style={{ fontSize: 17, marginTop: 18, maxWidth: 520 }}>Desainnya terinspirasi Candi Penataran. Panel reliefnya bisa dibuka lalu dikunci tegak, sehingga medali Anda berubah menjadi miniatur candi tiga dimensi.</p>
              <div className="fitur">
                <div><b>4</b><p>Edisi medali untuk dikoleksi dari tahun ke tahun</p></div>
                <div><b>3D</b><p>Panel relief Candi Penataran yang bisa berdiri</p></div>
              </div>
              <p className="tiny muted" style={{ marginTop: 12 }}>Gambar konsep desain medali.</p>
            </div>
          </div>
          <div className="jersey">
            <div data-rv>
              <p className="eb">Jersey resmi</p>
              <h2 className="h2" style={{ marginTop: 14 }}>Satu desain dengan <span className="it">medali.</span></h2>
              <p className="muted" style={{ fontSize: 17, marginTop: 18, maxWidth: 480 }}>Jersey dan medali dirancang dalam satu key visual. Ukuran dipilih saat mendaftar. Coba ukur kaos yang biasa Anda pakai, lalu bandingkan dengan tabel ini.</p>
              <Link href="/daftar" className="btn p lg" style={{ marginTop: 26 }}>Daftar dan pilih ukuran <Icon name="arrow" size={18} /></Link>
            </div>
            <div className="sz" data-rv style={{ ["--d" as string]: 1 }}><SizeChart /></div>
          </div>
        </div>
      </section>

      <section className="sec" id="addon">
        <div className="kat-head" data-rv>
          <div><p className="eb">Add on Aone Trawas</p><h2 style={{ marginTop: 14 }}>Menginap dan belanja, <span className="it">sekali bayar.</span></h2></div>
          <p className="muted" style={{ fontSize: 17 }}>Datang sehari sebelumnya supaya pagi hari lomba lebih santai. Kamar dan merchandise bisa ditambahkan saat mendaftar dan masuk ke tagihan yang sama.</p>
        </div>
        <div className="addon">
          <div className="kamar" data-rv>
            <div className="between" style={{ alignItems: "center" }}><p className="eb">Kamar di Aone Trawas</p><span className="pill p"><Icon name="kalender" size={14} />Check in {s.checkIn}</span></div>
            {s.kamar.map((k) => (
              <div key={k.id} className="baris">
                <div><b>{k.nama}</b><p className="muted small" style={{ marginTop: 4 }}>{k.ket} Maksimal {k.tamu} tamu.</p></div>
                <div style={{ textAlign: "right" }}><b className="disp" style={{ fontSize: 30, color: "var(--prada)" }}>{rupiah(k.harga)}</b><p className="muted tiny">per malam</p></div>
              </div>
            ))}
            <Link href="/daftar" className="btn p" style={{ alignSelf: "flex-start", marginTop: 8 }}><Icon name="bed" size={18} />Pesan bersama tiket</Link>
          </div>
          <div className="merch">
            {s.merch.map((m, i) => (
              <div key={m.id} className="mcard" data-rv style={{ ["--d" as string]: i }}>
                <span className="ikon"><Icon name={IKON_MERCH[i] ?? "paket"} size={26} /></span>
                <h3 style={{ fontSize: 18 }}>{m.nama}</h3>
                <p className="muted small">{m.ket}{m.ukuran ? " Tersedia ukuran XS sampai 5XL." : ""}</p>
                <b className="disp">{rupiah(m.harga)}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="jadwal" style={{ paddingTop: 30 }}>
        <div data-rv><p className="eb">Jadwal</p><h2 style={{ marginTop: 14 }}>Catat <span className="it">tanggalnya.</span></h2></div>
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

      <section className="sec" style={{ paddingTop: 40 }}>
        <div data-rv><p className="eb">Cara daftar</p><h2 style={{ marginTop: 14 }}>Empat langkah, <span className="it">beres.</span></h2></div>
        <div className="steps">{STEPS.map(([h, p], i) => <div key={h} className="step" data-rv style={{ ["--d" as string]: i }}><b>{i + 1}</b><div><h3>{h}</h3><p className="muted" style={{ marginTop: 6 }}>{p}</p></div></div>)}</div>
      </section>

      <section className="sec" id="faq" style={{ maxWidth: 1000, paddingTop: 40 }}>
        <div data-rv><p className="eb">Tanya jawab</p><h2 style={{ marginTop: 14 }}>Yang sering <span className="it">ditanyakan.</span></h2></div>
        <div style={{ marginTop: 24 }}>{FAQ.map(([q, a]) => <details key={q} className="faq"><summary><span>{q}</span><span>+</span></summary><p>{a}</p></details>)}</div>
        <a href={waLink()} target="_blank" rel="noopener" className="btn wa" style={{ marginTop: 28 }}><WaIcon />Tanya lewat WhatsApp {WA_TAMPIL}</a>
      </section>

      <section className="final">
        <p className="eb rel" style={{ color: "#F3D9B0" }}>{EVENT.tanggal} · {EVENT.venue}</p>
        <h2 data-rv style={{ marginTop: 16 }}>Sampai jumpa<br />di <span className="it">Trawas.</span></h2>
        <div className="row rel" style={{ justifyContent: "center", marginTop: 30 }}><Link href="/daftar" className="btn r lg">Daftar sekarang <Icon name="arrow" size={18} /></Link><Link href="/cek-tiket" className="btn g lg">Cek tiket</Link></div>
        <Image src="/foto/paduraksa.webp" alt="Gapura paduraksa dengan arca dwarapala" width={1200} height={1500} className="padu" sizes="(max-width: 900px) 80vw, 560px" />
        <div className="lantai" />
      </section>
    </Shell>
  );
}
