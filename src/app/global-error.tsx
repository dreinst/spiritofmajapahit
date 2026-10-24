"use client";

// Cadangan terakhir kalau layout utama ikut gagal; tanpa font dan CSS aplikasi, jadi gaya ditulis langsung.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F3EADB", color: "#1C1310", fontFamily: "system-ui, sans-serif", textAlign: "center", padding: 24 }}>
        <div>
          <p style={{ fontSize: 120, fontWeight: 700, letterSpacing: "-.05em", margin: 0 }}>5<span style={{ color: "#B4472B", fontStyle: "italic" }}>0</span>0</p>
          <h1 style={{ fontSize: 32, margin: "8px 0" }}>Website sedang mengalami gangguan</h1>
          <p style={{ color: "#6B5D53" }}>Silakan muat ulang halaman beberapa saat lagi.</p>
          <button onClick={reset} style={{ marginTop: 20, background: "#1C1310", color: "#fff", border: 0, borderRadius: 999, padding: "12px 24px", fontWeight: 600, cursor: "pointer" }}>Muat ulang</button>
        </div>
      </body>
    </html>
  );
}
