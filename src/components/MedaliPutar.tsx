"use client";
import { useEffect, useRef, useState } from "react";

// Penampil medali lipat: 24 render Blender dari rata sampai terlipat dengan panel candi berdiri. Bergerak bolak-balik sendiri,
// berhenti saat digeser. Pengguna yang memilih kurangi gerak langsung melihat posisi terbuka.
const N = 24;
const src = (k: number) => `/foto/medali-penataran/f${String(k).padStart(2, "0")}.webp`;

export default function MedaliPutar() {
  const [i, setI] = useState(0);
  const [jalan, setJalan] = useState(true);
  const arah = useRef(1), tahan = useRef(0);
  useEffect(() => { for (let k = 0; k < N; k++) { const im = new window.Image(); im.src = src(k); } }, []);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setI(N - 1); setJalan(false); return; }
    if (!jalan) return;
    const t = setInterval(() => {
      if (tahan.current > 0) { tahan.current--; return; }
      setI((v) => {
        const n = v + arah.current;
        if (n >= N - 1 || n <= 0) { arah.current *= -1; tahan.current = 14; }
        return Math.max(0, Math.min(N - 1, n));
      });
    }, 90);
    return () => clearInterval(t);
  }, [jalan]);
  return (
    <div className="mp">
      <div className="mp-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src(i)} alt={i < 4 ? "Medali dalam keadaan rata" : i > N - 5 ? "Medali terlipat, panel candi berdiri" : "Medali sedang dilipat"} width={900} height={900} />
      </div>
      <div className="mp-ctl">
        <button type="button" className="btn w sm" onClick={() => setJalan((j) => !j)} aria-pressed={jalan}>{jalan ? "Jeda" : "Putar"}</button>
        <span className="small muted">Rata</span>
        <input type="range" min={0} max={N - 1} value={i} onChange={(e) => { setJalan(false); setI(+e.target.value); }} aria-label="Geser untuk melipat medali" />
        <span className="small muted">Dipajang</span>
      </div>
    </div>
  );
}
