import Shell from "@/components/Shell";
import ErrorView from "@/components/ErrorView";

export const metadata = { title: "Halaman tidak ditemukan", robots: { index: false } };

export default function NotFound() {
  return <Shell wa={false}><ErrorView code="404" title={<>Halaman <span className="it">tidak ditemukan.</span></>} text="Alamat ini tidak tersedia, atau tiketnya belum lunas. Coba cari lewat menu Cek tiket ya." /></Shell>;
}
