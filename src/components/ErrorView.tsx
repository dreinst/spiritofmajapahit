import Link from "next/link";
import Image from "next/image";
import Icon, { WaIcon } from "@/components/Icon";
import Ket from "@/components/Ket";
import { waLink } from "@/lib/kontak";

// Satu tampilan untuk 403, 404, dan 500 supaya pesan error tetap ramah dan tidak membocorkan detail teknis.
export default function ErrorView({ code, title, text, action }: { code: string; title: React.ReactNode; text: string; action?: React.ReactNode }) {
  return (
    <div className="errpage">
      <div>
        <p className="eb">Kode {code}</p>
        <p className="code" aria-hidden>{code}</p>
        <h1>{title}</h1>
        <p className="muted" style={{ maxWidth: 460, marginTop: 14, fontSize: 17 }}>{text}</p>
        <div className="row" style={{ marginTop: 26 }}>
          {action ?? <Link href="/" className="btn k"><Icon name="back" size={18} />Kembali ke beranda</Link>}
          <a href={waLink("Saya menemukan kendala di website Majapahit Trail Run.")} target="_blank" rel="noopener" className="btn w"><WaIcon />Tanya panitia</a>
        </div>
      </div>
      <figure><div className="photo kala"><Image src="/foto/kala-3.webp" alt="Ilustrasi kepala kala di atas pintu gapura" fill sizes="(max-width: 900px) 90vw, 440px" /></div><Ket src="/foto/kala-3.webp" /></figure>
    </div>
  );
}
