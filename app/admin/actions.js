"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase";

export async function login(prevStateOrFormData, maybeFormData) {
  const formData =
    maybeFormData instanceof FormData
      ? maybeFormData
      : prevStateOrFormData instanceof FormData
      ? prevStateOrFormData
      : null;

  if (!formData) {
    return { error: "Data form tidak valid." };
  }

  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  let isSuccess = false;
  let pesanError = null;

  try {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error) {
      if (error.message?.toLowerCase().includes("invalid login credentials")) {
        pesanError = "Email atau password salah. Periksa kembali akun Anda.";
      } else {
        pesanError = error.message || "Gagal masuk. Silakan coba lagi.";
      }
    } else {
      isSuccess = true;
    }
  } catch (err) {
    pesanError = err.message || "Terjadi kesalahan pada server.";
  }

  if (pesanError) {
    return { error: pesanError };
  }

  if (isSuccess) {
    redirect("/admin");
  }
}

export async function logout() {
  try {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Gagal keluar:", err);
  }

  redirect("/admin/login");
}

export async function gantiPassword(prevStateOrFormData, maybeFormData) {
  const formData =
    maybeFormData instanceof FormData
      ? maybeFormData
      : prevStateOrFormData instanceof FormData
      ? prevStateOrFormData
      : null;

  if (!formData) {
    return { error: "Data form tidak valid." };
  }

  const passwordBaru = formData.get("password_baru");
  const konfirmasiPassword = formData.get("konfirmasi_password");

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password harus sama dengan password baru." };
  }

  try {
    const supabase = await createSessionClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Sesi telah berakhir. Silakan login kembali." };
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordBaru,
    });

    if (error) {
      return { error: error.message || "Gagal mengganti password." };
    }

    return { sukses: "Password berhasil diganti." };
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan pada server." };
  }
}

export async function tambahProduk(prevStateOrFormData, maybeFormData) {
  const formData =
    maybeFormData instanceof FormData
      ? maybeFormData
      : prevStateOrFormData instanceof FormData
      ? prevStateOrFormData
      : null;

  if (!formData) {
    return { error: "Data form tidak valid." };
  }

  const nama = formData.get("nama");
  const hargaRaw = formData.get("harga");
  const kategori = formData.get("kategori");
  const foto_url = formData.get("foto_url");
  const deskripsi = formData.get("deskripsi");

  if (!nama || !String(nama).trim()) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk harus berupa angka tidak negatif." };
  }

  let isSuccess = false;
  let pesanError = null;

  try {
    const supabase = await createSessionClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Sesi telah berakhir atau Anda belum login." };
    }

    const { error } = await supabase.from("produk").insert({
      nama: String(nama).trim(),
      harga,
      kategori: String(kategori || "").trim() || null,
      foto_url: String(foto_url || "").trim() || null,
      deskripsi: String(deskripsi || "").trim() || null,
    });

    if (error) {
      pesanError = error.message || "Gagal menyimpan produk ke database.";
    } else {
      isSuccess = true;
    }
  } catch (err) {
    pesanError = err.message || "Terjadi kesalahan pada server.";
  }

  if (pesanError) {
    return { error: pesanError };
  }

  if (isSuccess) {
    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin");
  }
}

export async function ubahProduk(prevStateOrFormData, maybeFormData) {
  const formData =
    maybeFormData instanceof FormData
      ? maybeFormData
      : prevStateOrFormData instanceof FormData
      ? prevStateOrFormData
      : null;

  if (!formData) {
    return { error: "Data form tidak valid." };
  }

  const id = formData.get("id");
  const nama = formData.get("nama");
  const hargaRaw = formData.get("harga");
  const kategori = formData.get("kategori");
  const foto_url = formData.get("foto_url");
  const deskripsi = formData.get("deskripsi");

  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  if (!nama || !String(nama).trim()) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk harus berupa angka tidak negatif." };
  }

  let isSuccess = false;
  let pesanError = null;

  try {
    const supabase = await createSessionClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Sesi telah berakhir atau Anda belum login." };
    }

    const { error } = await supabase
      .from("produk")
      .update({
        nama: String(nama).trim(),
        harga,
        kategori: String(kategori || "").trim() || null,
        foto_url: String(foto_url || "").trim() || null,
        deskripsi: String(deskripsi || "").trim() || null,
      })
      .eq("id", id);

    if (error) {
      pesanError = error.message || "Gagal mengubah produk di database.";
    } else {
      isSuccess = true;
    }
  } catch (err) {
    pesanError = err.message || "Terjadi kesalahan pada server.";
  }

  if (pesanError) {
    return { error: pesanError };
  }

  if (isSuccess) {
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/produk/${id}`);
    redirect("/admin");
  }
}
