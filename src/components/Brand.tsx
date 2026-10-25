// Gambar vektor yang ditulis untuk situs ini: lambang Surya Majapahit dan peta lintasan.

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

// Warna tiap kategori: dipakai di kartu kategori, garis rute di peta, dan legenda.
export const WARNA_RUTE = ["#C9A45C", "#B86A4C", "#5A8F85"];

// Peta ilustrasi lintasan di kaki Penanggungan. Rute final diumumkan setelah survei jalur,
// jadi garis di sini hanya gambaran arah tiap kategori dari titik start di Aone Trawas.
const RUTE = [
  { d: "M300 520 C360 470 430 460 470 420 C520 370 600 380 640 420 C680 460 640 520 580 540 C500 566 380 580 300 520Z", len: 1100 },
  { d: "M300 520 C330 430 420 360 520 330 C620 300 720 320 780 280 C840 240 900 260 920 320 C940 390 860 460 760 500 C640 548 420 600 300 520Z", len: 1700 },
  { d: "M300 520 C280 400 360 280 470 230 C580 180 640 140 720 150 C800 160 860 210 900 180 C960 140 1040 150 1060 220 C1080 300 1000 360 940 420 C860 500 720 560 580 570 C460 578 350 570 300 520Z", len: 2400 },
];
export function PetaLintasan() {
  const kontur = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => <ellipse key={i} cx="820" cy="190" rx={90 + i * 62} ry={58 + i * 44} fill="none" stroke="#C9A45C" strokeOpacity={0.26 - i * 0.025} strokeWidth="1" />);
  return (
    <svg viewBox="0 0 1200 680" role="img" aria-label="Peta ilustrasi lintasan di kaki Gunung Penanggungan">
      <rect width="1200" height="680" fill="#13100E" />
      {kontur}
      <path d="M0 610 C200 590 360 640 560 620 C760 600 980 640 1200 610" fill="none" stroke="#35505A" strokeWidth="8" strokeLinecap="round" opacity=".8" />
      <g fill="#24302A" opacity=".9">{[[150, 200], [190, 240], [120, 300], [1050, 470], [1100, 420], [1010, 520], [420, 130], [470, 100]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="26" />)}</g>
      <path d="M760 160 L820 112 L880 168Z" fill="none" stroke="#E6CF9C" strokeWidth="1.5" />
      <text x="820" y="92" textAnchor="middle" fontSize="13" letterSpacing="2" fill="#E6CF9C" fontFamily="sans-serif">G. PENANGGUNGAN</text>
      {RUTE.map((r, i) => <path key={r.len} className="jalur" d={r.d} fill="none" stroke={WARNA_RUTE[i]} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ ["--len" as string]: r.len, ["--d" as string]: i }} />)}
      {[[470, 420, "A"], [780, 280, "A"], [900, 180, "A"], [640, 420, "+"], [920, 320, "+"]].map(([x, y, t]) => (
        <g key={`${x}${y}`}><circle cx={x as number} cy={y as number} r="13" fill="#0D0B0A" stroke="#E6CF9C" strokeWidth="1.5" /><text x={x as number} y={(y as number) + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#E6CF9C" fontFamily="sans-serif">{t}</text></g>
      ))}
      <g transform="translate(300 520)"><circle r="20" fill="#F2ECE2" /><path d="M-6 -8 L8 0 L-6 8Z" fill="#0D0B0A" /></g>
      <text x="300" y="584" textAnchor="middle" fontSize="13" letterSpacing="2" fill="#F2ECE2" fontFamily="sans-serif">AONE TRAWAS</text>
    </svg>
  );
}
