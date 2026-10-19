"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

function hitungNomor() {
  const nomorBersih = (toko.nomorWhatsApp || "").replace(/\D/g, "");
  if (nomorBersih.startsWith("0")) return `62${nomorBersih.slice(1)}`;
  if (nomorBersih.startsWith("8")) return `62${nomorBersih}`;
  return nomorBersih;
}

export default function PemesanProduk({ produk }) {
  const [jumlah, setJumlah] = useState(1);

  if (!produk) return null;

  const nomor = hitungNomor();
  const pesan = encodeURIComponent(
    `Halo, saya ingin memesan ${jumlah} ${produk.nama} seharga ${formatRupiah(produk.harga)} per item (total ${formatRupiah(jumlah * produk.harga)}).`
  );

  const kurang = () => setJumlah((j) => Math.max(1, j - 1));
  const tambah = () => setJumlah((j) => j + 1);

  return (
    <div className="flex flex-col gap-3">
      {/* Pilih jumlah */}
      <label className="text-sm font-semibold">Jumlah</label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={kurang}
          disabled={jumlah <= 1}
          aria-label="Kurangi jumlah"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar text-lg font-bold hover:border-utama hover:text-utama disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>
        <span className="w-8 text-center text-base font-semibold">{jumlah}</span>
        <button
          type="button"
          onClick={tambah}
          aria-label="Tambah jumlah"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar text-lg font-bold hover:border-utama hover:text-utama"
        >
          +
        </button>
      </div>

      {/* Tombol pesan */}
      <a
        href={`https://wa.me/${nomor}?text=${pesan}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp
      </a>
    </div>
  );
}

