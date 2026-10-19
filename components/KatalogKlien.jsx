"use client";

import { useState, useMemo } from "react";
import KartuProduk from "@/components/KartuProduk";

export default function KatalogKlien({ daftarProduk }) {
  const [cari, setCari] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  // Kumpulkan daftar kategori unik dari produk
  const daftarKategori = useMemo(() => {
    const set = new Set();
    daftarProduk.forEach((p) => {
      if (p.kategori) set.add(p.kategori);
    });
    return ["Semua", ...Array.from(set).sort()];
  }, [daftarProduk]);

  // Filter berdasarkan kategori dan kata pencarian
  const produkTampil = useMemo(() => {
    const kataCari = cari.toLowerCase().trim();
    return daftarProduk.filter((p) => {
      const cocokKategori =
        kategoriAktif === "Semua" || p.kategori === kategoriAktif;
      const cocokCari =
        !kataCari || p.nama.toLowerCase().includes(kataCari);
      return cocokKategori && cocokCari;
    });
  }, [daftarProduk, kategoriAktif, cari]);

  return (
    <div className="flex flex-col gap-5">
      {/* Kolom pencarian */}
      <input
        type="search"
        value={cari}
        onChange={(e) => setCari(e.target.value)}
        placeholder="Cari produk..."
        className="w-full max-w-sm rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        aria-label="Cari produk"
      />

      {/* Filter kategori */}
      {daftarKategori.length > 1 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
          {daftarKategori.map((kat) => (
            <button
              key={kat}
              type="button"
              onClick={() => setKategoriAktif(kat)}
              className={
                `rounded-full border px-3 py-1 text-sm font-semibold transition-colors ` +
                (kategoriAktif === kat
                  ? "border-utama bg-utama text-white"
                  : "border-garis bg-latar text-teks hover:border-utama hover:text-utama")
              }
            >
              {kat}
            </button>
          ))}
        </div>
      )}

      {/* Grid produk */}
      {produkTampil.length === 0 ? (
        <p className="text-teks-lembut">
          Tidak ada produk yang sesuai dengan pencarianmu.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {produkTampil.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}

