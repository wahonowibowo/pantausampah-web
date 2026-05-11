"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

const langgananSchema = z.object({
  nama_lengkap: z.string().min(3, { message: "Nama lengkap wajib diisi." }),
  tempat_tanggal_lahir: z.string().min(5, { message: "Tempat dan tanggal lahir wajib diisi." }),
  nik: z.string().min(16, { message: "NIK harus 16 digit." }),
  alamat_lengkap: z.string().min(10, { message: "Alamat lengkap wajib diisi dengan jelas." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  no_hp: z.string().min(10, { message: "Nomor HP tidak valid." }),
});

export type ActionState = {
  errors?: any;
  message?: string | null;
  success?: boolean;
};

export async function langgananAction(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user_session")?.value;
  
  if (!sessionCookie) {
    return { message: "Sesi tidak ditemukan. Silakan login kembali." };
  }

  let userSession;
  try {
    userSession = JSON.parse(sessionCookie);
  } catch (e) {
    return { message: "Sesi tidak valid." };
  }

  const rawData = {
    nama_lengkap: formData.get("nama_lengkap"),
    tempat_tanggal_lahir: formData.get("tempat_tanggal_lahir"),
    nik: formData.get("nik"),
    alamat_lengkap: formData.get("alamat_lengkap"),
    email: formData.get("email"),
    no_hp: formData.get("no_hp"),
  };

  const validatedFields = langgananSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validasi gagal. Pastikan semua data terisi dengan benar.",
    };
  }

  // Cek apakah sudah pernah mengajukan (status pending/aktif)
  const { data: existing, error: checkError } = await supabase
    .from("langganan")
    .select("status")
    .eq("user_id", userSession.id)
    .single();

  if (existing) {
    if (existing.status === 'pending') {
      return { message: "Anda sudah memiliki pengajuan langganan yang sedang diproses (pending)." };
    }
    if (existing.status === 'aktif') {
      return { message: "Anda sudah terdaftar sebagai pelanggan aktif." };
    }
  }

  // Insert pengajuan langganan
  const { error } = await supabase
    .from("langganan")
    .insert([
      {
        user_id: userSession.id,
        ...validatedFields.data,
        status: "pending",
      },
    ]);

  if (error) {
    return { message: "Terjadi kesalahan saat menyimpan data: " + error.message };
  }

  redirect("/profile?langganan=success");
}