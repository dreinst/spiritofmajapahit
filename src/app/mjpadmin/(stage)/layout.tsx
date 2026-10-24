// Layar penuh panitia (scan, undian, 403) tanpa sidebar; tetap dibungkus main untuk pembaca layar.
export default function StageLayout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}
