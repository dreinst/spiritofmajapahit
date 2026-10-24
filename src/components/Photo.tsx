import Image from "next/image";

// Foto dalam bingkai: next/image mengirim WebP/AVIF seukuran layar dan menunda yang di luar layar.
export default function Photo({ src, alt, sizes = "(max-width: 900px) 100vw, 50vw", className = "", style, priority, children }: {
  src: string; alt: string; sizes?: string; className?: string; style?: React.CSSProperties; priority?: boolean; children?: React.ReactNode;
}) {
  return (
    <div className={`photo ${className}`} style={style}>
      <Image src={`/foto/${src}.webp`} alt={alt} fill sizes={sizes} priority={priority} />
      {children}
    </div>
  );
}
