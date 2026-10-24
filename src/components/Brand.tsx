// Gambar vektor yang ditulis untuk situs ini: lambang Surya Majapahit, siluet Gunung Penanggungan, dan peta lintasan.

// Surya Majapahit: cakram, delapan sinar utama, delapan sinar kecil di antaranya.
export function Surya({ size = 28, className }: { size?: number; className?: string }) {
  const pt = (r: number, deg: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return `${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`;
  };
  const rays = Array.from({ length: 16 }, (_, i) => {
    const d = i * 22.5, long = i % 2 === 0, w = long ? 7 : 5;
    return `M${pt(24, d - w)} L${pt(long ? 49 : 39, d)} L${pt(24, d + w)}Z`;
  });
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ flex: "none" }}>
      <g fill="currentColor">{rays.map((d) => <path key={d} d={d} />)}</g>
      <circle cx="50" cy="50" r="23" fill="currentColor" />
      <circle cx="50" cy="50" r="16" fill="none" stroke="var(--surya-dalam, #120C0A)" strokeWidth="2.4" />
      {Array.from({ length: 8 }, (_, i) => { const [x, y] = pt(16, i * 45).split(" "); return <circle key={i} cx={x} cy={y} r="2.6" fill="var(--surya-dalam, #120C0A)" />; })}
      <circle cx="50" cy="50" r="5" fill="var(--surya-dalam, #120C0A)" />
    </svg>
  );
}

// Penanggungan dengan empat bukit pengapitnya, digambar tiga lapis supaya ada kedalaman saat fajar.
export function Pegunungan({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1600 520" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <path fill="#7A4252" opacity=".55" d="M0 380 C120 350 210 300 320 318 C420 334 470 290 560 300 C650 310 700 360 800 352 C930 340 1010 300 1120 306 C1240 312 1320 350 1430 336 C1500 328 1560 340 1600 350 V520 H0Z" />
      <path fill="#5A2C3E" d="M0 430 C90 420 160 392 240 360 C300 336 330 300 380 296 C430 292 460 330 520 318 C600 300 650 230 720 160 C760 120 790 84 818 70 C836 62 850 64 866 78 C900 108 930 160 980 214 C1020 258 1050 262 1090 252 C1140 240 1170 270 1210 300 C1260 336 1320 344 1400 360 C1480 376 1550 400 1600 410 V520 H0Z" />
      <path fill="#3C1C2C" d="M0 470 C80 456 150 430 230 420 C300 412 350 380 420 386 C490 392 520 420 600 424 C680 428 740 400 830 404 C940 410 990 440 1080 436 C1180 432 1240 404 1330 410 C1430 416 1510 446 1600 452 V520 H0Z" />
    </svg>
  );
}

// Peta ilustrasi lintasan di kaki Penanggungan. Rute final diumumkan setelah survei jalur,
// jadi garis di sini hanya gambaran arah tiap kategori dari titik start di Aone Trawas.
const RUTE = [
  { d: "M300 520 C360 470 430 460 470 420 C520 370 600 380 640 420 C680 460 640 520 580 540 C500 566 380 580 300 520Z", c: "#D3A44C", len: 1100 },
  { d: "M300 520 C330 430 420 360 520 330 C620 300 720 320 780 280 C840 240 900 260 920 320 C940 390 860 460 760 500 C640 548 420 600 300 520Z", c: "#B4472B", len: 1700 },
  { d: "M300 520 C280 400 360 280 470 230 C580 180 640 140 720 150 C800 160 860 210 900 180 C960 140 1040 150 1060 220 C1080 300 1000 360 940 420 C860 500 720 560 580 570 C460 578 350 570 300 520Z", c: "#5A2C3E", len: 2400 },
];
export function PetaLintasan() {
  const kontur = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => <ellipse key={i} cx="820" cy="190" rx={90 + i * 62} ry={58 + i * 44} fill="none" stroke="#C9B48F" strokeOpacity={0.55 - i * 0.04} strokeWidth="1.3" />);
  return (
    <svg viewBox="0 0 1200 680" role="img" aria-label="Peta ilustrasi lintasan di kaki Gunung Penanggungan">
      <rect width="1200" height="680" fill="#EFE4D0" />
      {kontur}
      <path d="M0 610 C200 590 360 640 560 620 C760 600 980 640 1200 610" fill="none" stroke="#9DB7A6" strokeWidth="10" strokeLinecap="round" opacity=".7" />
      <g fill="#A8B98F" opacity=".55">{[[150, 200], [190, 240], [120, 300], [1050, 470], [1100, 420], [1010, 520], [420, 130], [470, 100]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="26" />)}</g>
      <path d="M760 160 L820 112 L880 168Z" fill="#5A2C3E" opacity=".85" />
      <text x="820" y="92" textAnchor="middle" fontSize="15" fontWeight="700" fill="#5A2C3E" fontFamily="sans-serif">G. Penanggungan</text>
      {RUTE.map((r, i) => <path key={r.c} className="jalur" d={r.d} fill="none" stroke={r.c} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ ["--len" as string]: r.len, ["--d" as string]: i }} />)}
      {[[470, 420, "#2F7FA8", "A"], [780, 280, "#2F7FA8", "A"], [900, 180, "#2F7FA8", "A"], [640, 420, "#B4472B", "+"], [920, 320, "#B4472B", "+"]].map(([x, y, c, t]) => (
        <g key={`${x}${y}`}><circle cx={x as number} cy={y as number} r="15" fill={c as string} stroke="#fff" strokeWidth="3" /><text x={x as number} y={(y as number) + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily="sans-serif">{t}</text></g>
      ))}
      <g transform="translate(300 520)"><circle r="22" fill="#1C1310" stroke="#fff" strokeWidth="4" /><path d="M-7 -9 L9 0 L-7 9Z" fill="#fff" /></g>
      <rect x="226" y="556" width="148" height="34" rx="17" fill="#1C1310" />
      <text x="300" y="579" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff" fontFamily="sans-serif">Aone Trawas</text>
    </svg>
  );
}
