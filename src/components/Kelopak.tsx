// Kelopak merah yang melayang pelan, motif yang sama dengan beranda 3D. Disembunyikan bila pengguna memilih kurangi gerak.
export default function Kelopak({ n = 14 }: { n?: number }) {
  return (
    <div className="kelopak" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <i key={i} style={{ "--x": `${(i * 37 + 11) % 100}%`, "--d": `${((i * 1.7) % 9).toFixed(1)}s`, "--t": `${12 + ((i * 3) % 9)}s`, "--s": `${0.6 + ((i * 7) % 5) / 10}` } as React.CSSProperties} />
      ))}
    </div>
  );
}
