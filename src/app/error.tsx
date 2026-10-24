"use client";
import ErrorView from "@/components/ErrorView";

// Error saat merender halaman (500). Detail teknis hanya di log server; pengguna melihat kode digest untuk dilaporkan.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main><ErrorView code="500" title={<>Terjadi <span className="it">gangguan.</span></>}
      text={`Server sedang terganggu. Coba lagi beberapa saat lagi ya.${error.digest ? ` Kode laporan: ${error.digest}` : ""}`}
      action={<button className="btn k" onClick={reset}>Coba lagi</button>} /></main>
  );
}
