"use server";

import { supabase } from "@/lib/supabase";
import { sendEmailNotification } from "./sendEmailAction";

export async function tandaiSelesai(id: string, kontak: string, nama: string, kategori: string, lokasi: string) {
  // 1. Update status di database
  const { error } = await supabase
    .from("laporan_sampah")
    .update({ status: "Selesai" })
    .eq("id", id);

  if (error) {
    console.error("Gagal update status:", error);
    throw new Error("Gagal mengupdate status di database.");
  }

  // 2. Kirim email notifikasi bahwa laporan selesai
  try {
    await sendEmailNotification(kontak, "Selesai", id, nama, kategori, lokasi);
  } catch (emailErr) {
    console.error("Gagal mengirim email Selesai:", emailErr);
    // Kita tidak melempar error agar status DB tetap terupdate meski email gagal
  }
}
