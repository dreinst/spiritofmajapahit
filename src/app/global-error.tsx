"use client";

// Cadangan terakhir kalau layout utama ikut gagal; tanpa font dan CSS aplikasi, jadi gaya ditulis langsung.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0D0B0A", color: "#F2ECE2", fontFamily: "system-ui, sans-serif", textAlign: "center", padding: 24 }}>
        <div>
          <p style={{ fontSize: 120, fontWeight: 700, letterSpacing: "-.05em", margin: 0 }}>5<span style={{ color: "#C9A45C" }}>0</span>0</p>
          <h1 style={{ fontSize: 32, margin: "8px 0" }}>Website sedang mengalami gangguan</h1>
          <p style={{ color: "#9D9386" }}>Silakan muat ulang halaman beberapa saat lagi.</p>
          <button onClick={reset} style={{ marginTop: 20, background: "#C9A45C", color: "#0D0B0A", border: 0, borderRadius: 2, padding: "12px 24px", fontWeight: 600, cursor: "pointer" }}>Muat ulang</button>
        </div>
      </body>
    </html>
  );
}
