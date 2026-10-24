"use client";
import { useEffect, useState } from "react";

// Hitung mundur ke hari H. Mulai kosong supaya HTML server dan browser sama, lalu diisi setelah mount.
export default function Hitung({ to }: { to: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const s = now === null ? null : Math.max(0, Math.floor((new Date(to).getTime() - now) / 1000));
  const p = (n: number) => String(n).padStart(2, "0");
  const parts: [string, string][] = s === null ? [["--", "hari"], ["--", "jam"], ["--", "menit"], ["--", "detik"]]
    : [[String(Math.floor(s / 86400)), "hari"], [p(Math.floor((s % 86400) / 3600)), "jam"], [p(Math.floor((s % 3600) / 60)), "menit"], [p(s % 60), "detik"]];
  return <div className="hitung" role="timer" aria-label="Hitung mundur menuju hari lomba">{parts.map(([v, l]) => <span key={l}><b>{v}</b><i>{l}</i></span>)}</div>;
}
