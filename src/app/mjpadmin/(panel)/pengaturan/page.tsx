import { requireAdmin, SUPER } from "@/lib/admin-auth";
import { getSettings } from "@/lib/settings";
import { saveSettingsAction } from "../../actions";

const f = (label: string, el: React.ReactNode, style?: React.CSSProperties) => <label className="field" style={style}><span className="lbl">{label}</span>{el}</label>;

export default async function Pengaturan({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  await requireAdmin(SUPER);
  const [s, { ok }] = await Promise.all([getSettings(), searchParams]);
  const kosong = { id: "", nama: "", harga: 0, ket: "" };
  const kat = [...s.kategori, { ...kosong, jarak: "", elevasi: "", kuota: 0 }];
  const kamar = [...s.kamar, { ...kosong, tamu: 2 }];
  const merch = [...s.merch, { ...kosong, ukuran: false }, { ...kosong, ukuran: false }];
  return (
    <>
      <p className="eb">Pengaturan · superadmin</p><h1 style={{ marginTop: 10 }}>Kategori, harga, <span className="it">add on.</span></h1>
      <p className="muted" style={{ marginTop: 8 }}>Perubahan berlaku untuk pesanan baru. Tagihan yang sudah dibuat tidak berubah. Kosongkan nama untuk menghapus baris.</p>
      <form action={saveSettingsAction} style={{ marginTop: 24, maxWidth: 1000, display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="card" style={{ padding: 28 }}>
          <label className="row" style={{ fontWeight: 600 }}><input type="checkbox" name="dibuka" defaultChecked={s.dibuka} style={{ width: 20, height: 20, accentColor: "var(--bata)" }} />Pendaftaran dibuka</label>
          <div className="grid2" style={{ gap: 12, marginTop: 16 }}>
            {f("Periode pendaftaran (tampil di jadwal)", <input name="jadwalDaftar" className="input" defaultValue={s.jadwalDaftar} maxLength={120} />)}
            {f("Pengambilan racepack", <input name="jadwalRacepack" className="input" defaultValue={s.jadwalRacepack} maxLength={120} />)}
          </div>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 22 }}>Kategori lomba</h3>
          {kat.map((k, i) => (
            <div key={i} className="setrow" style={{ gridTemplateColumns: "1.3fr .6fr .8fr 1fr .7fr" }}>
              <input type="hidden" name="katId" value={k.id} />
              {f(`Nama ${i + 1}`, <input name="katNama" className="input" defaultValue={k.nama} maxLength={40} placeholder="Contoh: Trail" />)}
              {f("Jarak", <input name="katJarak" className="input" defaultValue={k.jarak} maxLength={10} placeholder="15K" />)}
              {f("Elevasi", <input name="katElevasi" className="input" defaultValue={k.elevasi} maxLength={20} />)}
              {f("Harga (Rp)", <input name="katHarga" className="input" defaultValue={k.harga || ""} inputMode="numeric" />)}
              {f("Kuota", <input name="katKuota" className="input" defaultValue={k.kuota || ""} inputMode="numeric" />)}
              {f("Keterangan", <input name="katKet" className="input" defaultValue={k.ket} maxLength={200} />, { gridColumn: "1/-1" })}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 22 }}>Kamar Aone Trawas</h3>
          <div className="grid2" style={{ gap: 12, marginTop: 12 }}>
            {f("Tanggal check in", <input name="checkIn" className="input" defaultValue={s.checkIn} maxLength={60} />)}
            {f("Maksimal malam per pesanan", <input name="maksMalam" className="input" defaultValue={s.maksMalam} inputMode="numeric" />)}
          </div>
          {kamar.map((k, i) => (
            <div key={i} className="setrow" style={{ gridTemplateColumns: "1.4fr 1fr .6fr" }}>
              <input type="hidden" name="kamarId" value={k.id} />
              {f(`Tipe kamar ${i + 1}`, <input name="kamarNama" className="input" defaultValue={k.nama} maxLength={60} />)}
              {f("Harga per malam (Rp)", <input name="kamarHarga" className="input" defaultValue={k.harga || ""} inputMode="numeric" />)}
              {f("Maks. tamu", <input name="kamarTamu" className="input" defaultValue={k.tamu} inputMode="numeric" />)}
              {f("Keterangan", <input name="kamarKet" className="input" defaultValue={k.ket} maxLength={200} />, { gridColumn: "1/-1" })}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 22 }}>Merchandise</h3>
          {merch.map((m, i) => (
            <div key={i} className="setrow" style={{ gridTemplateColumns: "1.4fr 1fr .8fr" }}>
              <input type="hidden" name="merchId" value={m.id} />
              {f(`Produk ${i + 1}`, <input name="merchNama" className="input" defaultValue={m.nama} maxLength={60} />)}
              {f("Harga (Rp)", <input name="merchHarga" className="input" defaultValue={m.harga || ""} inputMode="numeric" />)}
              {f("Pakai ukuran", <select name="merchUkuran" className="input" defaultValue={m.ukuran ? "1" : "0"}><option value="0">Tidak</option><option value="1">Ya, XS sampai 5XL</option></select>)}
              {f("Keterangan", <input name="merchKet" className="input" defaultValue={m.ket} maxLength={200} />, { gridColumn: "1/-1" })}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 22 }}>Pembayaran</h3>
          <p className="muted small" style={{ marginTop: 4 }}>GoPay memotong MDR dari tagihan di atas batas. Biaya ini ditambahkan ke tagihan di atas batas supaya harga panitia utuh. Isi 0 kalau panitia menanggung sendiri.</p>
          <div className="grid3" style={{ gap: 12, marginTop: 12 }}>
            {f("MDR GoPay (%)", <input name="mdrPersen" className="input" defaultValue={String(s.mdrPersen).replace(".", ",")} inputMode="decimal" />)}
            {f("Berlaku untuk tagihan di atas (Rp)", <input name="mdrBatas" className="input" defaultValue={s.mdrBatas} inputMode="numeric" />)}
            {f("Rekening transfer manual", <input name="rekening" className="input" defaultValue={s.rekening} maxLength={160} />)}
          </div>
        </div>
        {ok && <p className="note">Tersimpan.</p>}
        <button className="btn r lg" style={{ alignSelf: "flex-start" }}>Simpan pengaturan</button>
      </form>
    </>
  );
}
