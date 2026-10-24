export const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

// Container berjalan di UTC; semua jam ditampilkan dalam WIB.
export const wib = (d: Date | null | undefined, withDate = true) =>
  d
    ? new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        ...(withDate ? { day: "numeric", month: "short" } : {}),
        hour: "2-digit",
        minute: "2-digit",
      }).format(d) + " WIB"
    : "";
