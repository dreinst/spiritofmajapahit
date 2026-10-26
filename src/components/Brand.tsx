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
export const WARNA_RUTE = ["#E2A63B", "#D9503B", "#4FB8A6"];

// Peta lintasan di atas ilustrasi medan buatan sendiri (relief prosedural dengan garis kontur). Jalur tiap
// kategori masih ilustrasi dengan panjang yang diukur pada skala peta, rute resmi diumumkan setelah survei.
const RUTE = [
  { d: "M442 567 C444 549 469 521 490 507 C512 493 554 476 573 482 C592 487 608 519 605 539 C602 559 575 590 554 603 C533 615 496 621 478 615 C459 609 440 585 442 567Z", len: 472 },
  { d: "M442 567 C420 539 451 472 474 432 C497 392 544 353 579 327 C613 302 654 273 683 279 C712 284 747 327 753 362 C758 397 742 448 718 488 C693 527 652 586 606 599 C560 612 464 595 442 567Z", len: 1010 },
  { d: "M442 567 C418 536 394 486 392 442 C390 398 407 346 429 303 C451 259 492 215 525 180 C558 144 600 110 627 89 C655 67 667 52 690 51 C713 50 738 59 766 83 C794 107 837 150 857 196 C878 241 896 305 889 356 C882 407 854 458 814 501 C775 543 700 592 654 613 C607 634 571 637 536 629 C501 621 466 598 442 567Z", len: 1677 },
];
const AIR: [number, number][] = [[605, 539], [615, 302], [889, 356]];
const MEDIS: [number, number][] = [[739, 445], [429, 303]];
const TEKS = { fontFamily: "sans-serif", paintOrder: "stroke" as const };
export function PetaLintasan() {
  return (
    <svg viewBox="0 0 1200 694" role="img" aria-label="Peta ilustrasi lintasan di kaki Gunung Penanggungan">
      <defs>
        <linearGradient id="peta-vignet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity=".25" /><stop offset=".3" stopColor="#000" stopOpacity="0" /><stop offset=".82" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".35" /></linearGradient>
      </defs>
      <image href="/foto/peta-ilustrasi.webp" x="0" y="0" width="1200" height="694" preserveAspectRatio="xMidYMid slice" />
      <rect width="1200" height="694" fill="url(#peta-vignet)" />
      {RUTE.map((r) => <path key={"b" + r.len} d={r.d} fill="none" stroke="#120A08" strokeOpacity=".5" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />)}
      {RUTE.map((r, i) => <path key={r.len} className="jalur" d={r.d} fill="none" stroke={WARNA_RUTE[i]} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" style={{ ["--len" as string]: r.len, ["--d" as string]: i }} />)}
      {AIR.map(([x, y]) => <g key={`a${x}${y}`}><circle cx={x} cy={y} r="12" fill="#FFF6EF" stroke="#2A1A18" strokeOpacity=".4" /><text x={x} y={y + 4.5} textAnchor="middle" fontSize="12" fontWeight="700" fill="#2A1A18" style={TEKS}>A</text></g>)}
      {MEDIS.map(([x, y]) => <g key={`m${x}${y}`}><circle cx={x} cy={y} r="12" fill="#FFF6EF" stroke="#2A1A18" strokeOpacity=".4" /><text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill="#A33A2C" style={TEKS}>+</text></g>)}
      <path d="M663 80 L674 61 L685 80Z" fill="#FFF6EF" stroke="#2A1A18" strokeOpacity=".5" />
      <text x="694" y="77" fontSize="13" letterSpacing="1.5" fontWeight="600" fill="#FFF6EF" stroke="#120A08" strokeOpacity=".55" strokeWidth="3" style={TEKS}>G. PENANGGUNGAN · 1.653 MDPL</text>
      <g transform="translate(442 567)"><circle r="17" fill="#A33A2C" stroke="#FFF6EF" strokeWidth="2.5" /><path d="M-5 -7 L8 0 L-5 7Z" fill="#FFF6EF" /></g>
      <text x="442" y="605" textAnchor="middle" fontSize="13" letterSpacing="1.5" fontWeight="600" fill="#FFF6EF" stroke="#120A08" strokeOpacity=".55" strokeWidth="3" style={TEKS}>AONE TRAWAS</text>
      <g transform="translate(1150 50)" fill="#FFF6EF"><path d="M0 -20 L8 6 L0 0 L-8 6Z" /><text y="24" textAnchor="middle" fontSize="12" fontWeight="700" style={TEKS}>U</text></g>
      <g transform="translate(36 652)"><rect width="66" height="5" fill="#FFF6EF" /><rect x="33" width="33" height="5" fill="#2A1A18" fillOpacity=".6" /><text y="-8" fontSize="11" fill="#FFF6EF" style={TEKS}>1 km</text></g>
    </svg>
  );
}

