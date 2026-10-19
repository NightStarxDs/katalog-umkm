"use server";

import { redirect } from "next/navigation";
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

