import nodemailer from "nodemailer";
import { Article } from "./api"; // Just to verify we are in the right folder, though not needed

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g. kelompokut4@gmail.com
    pass: process.env.EMAIL_PASS, // App Password
  },
});

export async function sendStatusEmail(
  to: string,
  status: "Pending" | "Diproses" | "Selesai",
  reportId: string,
  namaPelapor: string,
  kategori: string,
  lokasi: string
) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️ Konfigurasi Email belum disetel di .env.local. Email tidak dikirim.");
    return;
  }

  const isSelesai = status === "Selesai";
  
  const subject = isSelesai 
    ? `✅ Laporan Selesai Ditangani (ID: ${reportId}) - PantauSampah`
    : `📩 Laporan Diterima (ID: ${reportId}) - PantauSampah`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #dcfce7; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #16a34a; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">PantauSampah</h2>
      </div>
      <div style="padding: 30px;">
        <h3 style="color: #111827;">Halo, ${namaPelapor}!</h3>
        <p style="color: #4b5563; line-height: 1.6;">
          ${isSelesai 
            ? "Terima kasih atas laporan Anda. Kami ingin menginformasikan bahwa laporan masalah sampah yang Anda ajukan <strong>telah selesai ditangani</strong> oleh petugas lapangan kami."
            : "Terima kasih telah berpartisipasi menjaga lingkungan. Laporan Anda <strong>telah kami terima</strong> dan sedang dalam antrean untuk diproses oleh petugas."}
        </p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #14532d; font-size: 14px;">Detail Laporan:</h4>
          <table style="width: 100%; color: #374151; font-size: 14px; line-height: 1.5;">
            <tr>
              <td style="padding: 4px 0; width: 100px; color: #6b7280;">ID Laporan</td>
              <td style="padding: 4px 0; font-weight: bold;">: ${reportId}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #6b7280;">Kategori</td>
              <td style="padding: 4px 0;">: ${kategori}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #6b7280;">Lokasi</td>
              <td style="padding: 4px 0;">: ${lokasi}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #6b7280;">Status Saat Ini</td>
              <td style="padding: 4px 0;">: <span style="background-color: ${isSelesai ? '#16a34a' : '#eab308'}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${status}</span></td>
            </tr>
          </table>
        </div>
        
        <p style="color: #4b5563; font-size: 13px; line-height: 1.6;">
          Anda dapat melacak status terbaru laporan Anda kapan saja melalui website PantauSampah pada halaman <strong>Cek Status</strong> menggunakan ID Laporan di atas.
        </p>
      </div>
      <div style="background-color: #f9fafb; padding: 15px; text-align: center; color: #9ca3af; font-size: 12px;">
        &copy; ${new Date().getFullYear()} PantauSampah. Pesan ini dikirim secara otomatis, mohon tidak membalas.
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"PantauSampah" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log(`✅ Email notifikasi terkirim ke: ${to}`);
  } catch (error) {
    console.error("❌ Gagal mengirim email:", error);
  }
}
