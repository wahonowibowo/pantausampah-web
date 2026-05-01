"use server";

import { sendStatusEmail } from "@/lib/email";

export async function sendEmailNotification(
  to: string,
  status: "Pending" | "Diproses" | "Selesai",
  reportId: string,
  namaPelapor: string,
  kategori: string,
  lokasi: string
) {
  // Hanya kirim jika itu email valid
  if (to && to.includes("@")) {
    await sendStatusEmail(to, status, reportId, namaPelapor, kategori, lokasi);
  }
}
