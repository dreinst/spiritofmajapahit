"use client";
export default function PrintButton() {
  return <button type="button" className="btn w noprint" onClick={() => window.print()}>Simpan PDF</button>;
}
