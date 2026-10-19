import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  if (!produk) return null;

  const nomorBersih = (toko.nomorWhatsApp || "").replace(/\D/g, "");
  const nomor = nomorBersih.startsWith("0")
    ? `62${nomorBersih.slice(1)}`
    : nomorBersih.startsWith("8")
    ? `62${nomorBersih}`
    : nomorBersih;

  const pesan = encodeURIComponent(
    `Halo, saya ingin memesan ${produk.nama} seharga ${formatRupiah(produk.harga)}.`
  );

  return (
    <a
      href={`https://wa.me/${nomor}?text=${pesan}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
    >
      Pesan via WhatsApp
    </a>
  );
}
