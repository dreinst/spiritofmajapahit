"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import jsQR from "jsqr";
import Icon from "@/components/Icon";
import { Surya } from "@/components/Brand";

type CP = "racepack" | "start" | "finish";
type Info = { code: string; name: string; category: string; paid: boolean; jersey: string; gender: string; blood: string; bib: number | null; items: { label: string; picked: boolean }[]; racepackAt: string | null; startAt: string | null; finishAt: string | null };
const LABEL: Record<CP, string> = { racepack: "Racepack", start: "Start", finish: "Finish" };
const ACTION: Record<CP, string> = { racepack: "Serahkan racepack", start: "Catat start", finish: "Catat finish dan serahkan medali" };
const FIELD = { racepack: "racepackAt", start: "startAt", finish: "finishAt" } as const;
const jam = (s: string) => new Date(s).toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit" });

export default function ScanClient({ crew, back }: { crew: string; back: boolean }) {
  const [cp, setCp] = useState<CP>("racepack");
  const [info, setInfo] = useState<Info | null>(null);
  const [err, setErr] = useState("");
  const [manual, setManual] = useState("");
  const [done, setDone] = useState(0);
  const [cam, setCam] = useState<"off" | "on" | "denied">("off");
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const last = useRef("");

  const lookup = useCallback(async (code: string) => {
    setErr("");
    const r = await fetch(`/api/mjpadmin/scan?code=${encodeURIComponent(code)}`);
    const d = await r.json().catch(() => ({}));
    if (r.status === 403) { location.href = "/mjpadmin/login"; return; }
    if (!r.ok) { setInfo(null); navigator.vibrate?.([60, 60, 60]); return setErr(d.error || "Gagal membaca tiket"); }
    navigator.vibrate?.(80); setInfo(d);
  }, []);
  async function act() {
    if (!info) return;
    const r = await fetch("/api/mjpadmin/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: info.code, cp }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return setErr(d.error || "Gagal menyimpan");
    setInfo(d); setDone((n) => n + 1); last.current = "";
  }
  useEffect(() => {
    let stream: MediaStream | null = null, raf = 0, t = 0;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (!video.current) return;
        video.current.srcObject = stream; await video.current.play(); setCam("on");
        const tick = (now: number) => {
          // Dibaca 8 kali per detik saja supaya HP crew tidak panas dan baterai awet.
          if (now - t > 125) {
            t = now;
            const v = video.current, c = canvas.current;
            if (v && c && v.videoWidth) {
              const w = 480, h = Math.round((v.videoHeight / v.videoWidth) * w);
              c.width = w; c.height = h;
              const ctx = c.getContext("2d", { willReadFrequently: true })!;
              ctx.drawImage(v, 0, 0, w, h);
              const q = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: "dontInvert" });
              if (q?.data && q.data !== last.current) { last.current = q.data; lookup(q.data); }
            }
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch { setCam("denied"); }
    })();
    return () => { cancelAnimationFrame(raf); stream?.getTracks().forEach((x) => x.stop()); };
  }, [lookup]);

  const stamp = info?.[FIELD[cp]];
  return (
    <div className="scan">
      <div className="between" style={{ padding: "18px 18px 10px", alignItems: "center" }}>
        <div className="row" style={{ flexWrap: "nowrap" }}>
          <span style={{ color: "var(--prada)" }}><Surya size={34} /></span>
          <div><b className="disp" style={{ fontSize: 18 }}>Scan crew</b><p className="mono" style={{ fontSize: 10, color: "#A9AAB2" }}>{crew} · {cam === "on" ? "kamera aktif" : "kamera mati"}</p></div>
        </div>
        {back ? <Link href="/mjpadmin" className="pill" style={{ background: "rgba(255,255,255,.1)", color: "#fff" }}>Dashboard</Link> : <form action="/mjpadmin/keluar" method="post"><button className="pill" style={{ background: "rgba(255,255,255,.1)", color: "#fff" }}>Keluar</button></form>}
      </div>
      <div className="segd" role="tablist">{(Object.keys(LABEL) as CP[]).map((k) => <button key={k} role="tab" aria-selected={cp === k} className={cp === k ? "on" : ""} onClick={() => setCp(k)}>{LABEL[k]}</button>)}</div>
      <div className="vf">
        <video ref={video} playsInline muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: cam === "on" ? 0.9 : 0 }} />
        <div className="frame"><i /><i /><i /><i /><div className="line" /></div>
        <p style={{ position: "absolute", bottom: 14, fontSize: 13, color: "#fff", zIndex: 2, textShadow: "0 1px 4px #000" }}>{cam === "denied" ? "Kamera tidak diizinkan, pakai kode manual" : "Arahkan kamera ke QR e-ticket"}</p>
      </div>
      <canvas ref={canvas} hidden />
      <form onSubmit={(e) => { e.preventDefault(); if (manual.trim()) lookup(manual); }} className="row" style={{ margin: "0 18px 14px", flexWrap: "nowrap" }}>
        <input value={manual} onChange={(e) => setManual(e.target.value)} placeholder="Kode manual MJP-XXXXX" className="input" style={{ background: "#241A16", color: "#fff", boxShadow: "0 0 0 1px #3A2C26" }} aria-label="Kode tiket manual" autoCapitalize="characters" />
        <button className="btn w" style={{ height: 50 }}>Cek</button>
      </form>
      {err && <p style={{ margin: "0 18px 14px", color: "#FFB3B0", fontWeight: 600 }} role="alert">{err}</p>}
      {info && (
        <div key={info.code + String(stamp)} className={info.paid && !stamp ? "valid" : ""} style={{ margin: "0 18px", background: "#fff", color: "var(--ink)", borderRadius: 26, padding: 20 }}>
          <div className="between" style={{ alignItems: "center" }}><span className={`pill ${!info.paid ? "r" : stamp ? "warn" : "ok"}`}>{!info.paid ? "Belum lunas" : stamp ? `Sudah ${jam(stamp)}` : "✓ Valid, lunas"}</span><span className="mono muted small">{info.code}</span></div>
          <p className="disp" style={{ fontSize: 30, marginTop: 12 }}>{info.name.split(" ")[0]} <span className="it">{info.name.split(" ").slice(1).join(" ")}</span></p>
          <p className="muted small" style={{ marginTop: 4 }}>{info.category} · {info.gender === "P" ? "Perempuan" : "Laki-laki"} · darah {info.blood}</p>
          {cp === "racepack" && (
            <div className="grid2" style={{ gap: 8, marginTop: 14, gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}>
              <div style={{ background: "var(--bg)", borderRadius: 16, padding: 12 }}><p className="eb">Jersey</p><b className="disp" style={{ fontSize: 40 }}>{info.jersey}</b></div>
              <div style={{ background: "var(--bg)", borderRadius: 16, padding: 12 }}><p className="eb">Add on pesanan</p>{info.items.length ? info.items.map((i) => <p key={i.label} style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{i.picked ? "✓ " : ""}{i.label}</p>) : <p style={{ fontSize: 14, marginTop: 8 }}>Tidak ada</p>}</div>
            </div>
          )}
          <button className="btn r full lg" style={{ marginTop: 14 }} onClick={act} disabled={!info.paid || !!stamp}><Icon name="check" size={18} />{stamp ? `${LABEL[cp]} sudah tercatat` : ACTION[cp]}</button>
        </div>
      )}
      <p style={{ textAlign: "center", fontSize: 12, color: "#A9AAB2", marginTop: 14 }}>Sesi ini: {done} tercatat</p>
    </div>
  );
}
