"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { sendEmailNotification } from "./sendEmailAction";

export async function tandaiSelesai(
  id: string,
  kontak: string,
  nama: string,
  kategori: string,
  lokasi: string
) {
  // 1. Update status di database
  const { error } = await supabase
    .from("laporan_sampah")
    .update({
      status: "Selesai",
    })
    .eq("id", id);

  // Jika gagal update DB
  if (error) {
    console.error("Gagal update status:", error);
    throw new Error("Gagal mengupdate status di database.");
  }

  // 2. Refresh cache halaman admin
  revalidatePath("/admin");

  // 3. Kirim email notifikasi
  try {
    await sendEmailNotification(
      kontak,
      "Selesai",
      id,
      nama,
      kategori,
      lokasi
    );
  } catch (emailErr) {
    console.error(
      "Gagal mengirim email notifikasi selesai:",
      emailErr
    );

    // Tidak throw error agar status tetap berubah
  }

  return {
    success: true,
  };
}
