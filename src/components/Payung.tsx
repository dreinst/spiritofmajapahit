import Icon from "@/components/Icon";
import { Surya } from "@/components/Brand";
import { Rangkaian } from "@/components/Site";
import { siteBase } from "@/lib/sites";

// Kerangka halaman situs payung selain beranda 3D (halaman warisan).
export default function Payung({ children, back = ["/#pathways", "Kembali ke galeri"] }: { children: React.ReactNode; back?: [string, string] }) {
  const home = siteBase("payung");
  return (
    <div className="lux s-payung">
      <Rangkaian site="payung" />
      <header className="nav">
        <a href={home} className="brand"><span style={{ color: "var(--gold)", ["--surya-dalam" as string]: "var(--bg)" }}><Surya size={30} /></span><b>The Spirit<br />of Majapahit<small>Aone Trawas 2027</small></b></a>
        <a href={home + back[0]} className="btn w sm"><Icon name="back" size={15} />{back[1]}</a>
      </header>
      <main>{children}</main>
      <footer className="gp-foot">
        <span>© 2027 The Spirit of Majapahit · Made by dreinst · Organized by D&apos;PRO</span>
        <span>Gambar gapura, kala, dan pendopo adalah ilustrasi 3D, bukan foto situs asli.</span>
      </footer>
    </div>
  );
}
