"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(1, { message: "Kata sandi tidak boleh kosong." }),
});

const registerSchema = z.object({
  nama: z.string().min(3, { message: "Nama minimal 3 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Kata sandi minimal 6 karakter." }),
  no_hp: z.string().min(10, { message: "Nomor HP tidak valid." }),
});

export type ActionState = {
  errors?: any;
  message?: string | null;
};

export async function loginAction(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validasi gagal. Silakan periksa kembali input Anda.",
    };
  }

  // Cek ke Supabase tabel pengguna
  const { data: user, error } = await supabase
    .from("pengguna")
    .select("id, role, nama, password")
    .eq("email", email)
    .single();

  if (error || !user) {
    console.error("Login Error:", error);
    return { message: "Akun tidak ditemukan. Detail: " + (error?.message || "User tidak ada.") };
  }

  // NOTE: Di aplikasi produksi, gunakan bcrypt.compareSync.
  // Untuk MVP ini, kita pakai pengecekan string langsung.
  if (user.password !== password) {
    return { message: "Kata sandi salah." };
  }

  // Set auth cookie
  const sessionData = JSON.stringify({ id: user.id, role: user.role, nama: user.nama });
  const cookieStore = await cookies();
  cookieStore.set("user_session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  // Redirect berdasarkan role
  if (user.role === "admin") {
    redirect("/admin");
  } else if (user.role === "petugas") {
    redirect("/admin"); // Atau halaman petugas
  } else {
    redirect("/profile");
  }
}

export async function registerAction(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const nama = formData.get("nama");
  const email = formData.get("email");
  const password = formData.get("password");
  const no_hp = formData.get("no_hp");

  const validatedFields = registerSchema.safeParse({ nama, email, password, no_hp });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validasi gagal. Pastikan semua data benar.",
    };
  }

  const { data, error } = await supabase
    .from("pengguna")
    .insert([
      {
        nama,
        email,
        password, // Simpan sbg string untuk MVP, di produksi wajib HASH!
        no_hp,
        role: "user",
      },
    ])
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return { message: "Email sudah terdaftar." };
    }
    return { message: "Terjadi kesalahan saat mendaftar: " + error.message };
  }

  // Langsung login-kan
  const sessionData = JSON.stringify({ id: data.id, role: data.role, nama: data.nama });
  const cookieStore = await cookies();
  cookieStore.set("user_session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  redirect("/profile");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
  // Kalau ada auth_token lama, hapus juga
  cookieStore.delete("auth_token");
  redirect("/login");
}