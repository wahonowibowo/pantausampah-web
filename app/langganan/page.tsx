"use client";

import { useActionState } from "react";
import { langgananAction } from "@/actions/langgananAction";

export default function LanggananPage() {
  const [state, action, isPending] = useActionState(langgananAction, undefined);

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.card}>
          <div style={s.header}>
            <div style={s.iconWrapper}>
              <span style={{ fontSize: "32px" }}>🗑️</span>
            </div>
            <h1 style={s.title}>
              Pengajuan <span style={s.titleGreen}>Berlangganan</span>
            </h1>
            <p style={s.subtitle}>Silakan isi form berikut untuk menikmati layanan angkut sampah rutin kami.</p>
          </div>

          <form action={action} style={s.form}>
            {state?.message && (
              <div style={s.errorMessageContainer}>
                {state.message}
              </div>
            )}

            <div style={s.grid}>
              <div style={s.formGroup}>
                <label style={s.label}>Nama Lengkap</label>
                <input type="text" name="nama_lengkap" style={s.input} placeholder="Sesuai KTP" />
                {state?.errors?.nama_lengkap && <p style={s.errorText}>{state.errors.nama_lengkap[0]}</p>}
              </div>

              <div style={s.formGroup}>
                <label style={s.label}>Tempat, Tanggal Lahir</label>
                <input type="text" name="tempat_tanggal_lahir" style={s.input} placeholder="Contoh: Jakarta, 01 Januari 1990" />
                {state?.errors?.tempat_tanggal_lahir && <p style={s.errorText}>{state.errors.tempat_tanggal_lahir[0]}</p>}
              </div>

              <div style={s.formGroup}>
                <label style={s.label}>NIK</label>
                <input type="text" name="nik" style={s.input} placeholder="16 Digit NIK" />
                {state?.errors?.nik && <p style={s.errorText}>{state.errors.nik[0]}</p>}
              </div>

              <div style={s.formGroup}>
                <label style={s.label}>Nomor HP</label>
                <input type="text" name="no_hp" style={s.input} placeholder="Nomor HP/WhatsApp Aktif" />
                {state?.errors?.no_hp && <p style={s.errorText}>{state.errors.no_hp[0]}</p>}
              </div>

              <div style={{ ...s.formGroup, gridColumn: "1 / -1" }}>
                <label style={s.label}>Email</label>
                <input type="email" name="email" style={s.input} placeholder="Alamat email aktif" />
                {state?.errors?.email && <p style={s.errorText}>{state.errors.email[0]}</p>}
              </div>

              <div style={{ ...s.formGroup, gridColumn: "1 / -1" }}>
                <label style={s.label}>Alamat Lengkap (Lokasi Penjemputan)</label>
                <textarea name="alamat_lengkap" style={s.textarea} placeholder="Tuliskan alamat lengkap beserta RT/RW, jalan, patokan..." rows={3} />
                {state?.errors?.alamat_lengkap && <p style={s.errorText}>{state.errors.alamat_lengkap[0]}</p>}
              </div>
            </div>

            <button type="submit" style={s.submitBtn} disabled={isPending}>
              {isPending ? "Mengirim Pengajuan..." : "Ajukan Berlangganan"}
            </button>
          </form>

          <div style={s.footer}>
            <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
              Kembali ke <a href="/profile" style={{ color: "#16a34a", fontWeight: "600", textDecoration: "none" }}>Profil Anda</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", backgroundColor: "#f0fdf4", fontFamily: "'Niramit', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" },
  container: { width: "100%", maxWidth: "600px" },
  card: { backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #bbf7d0", boxShadow: "0 10px 40px rgba(22,163,74,0.08)", overflow: "hidden" },
  header: { padding: "40px 30px 20px", textAlign: "center" as const, borderBottom: "1px solid #f0fdf4" },
  iconWrapper: { width: "70px", height: "70px", borderRadius: "20px", backgroundColor: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  title: { fontSize: "24px", fontWeight: "800", color: "#111827", margin: "0 0 8px", letterSpacing: "-0.5px" },
  titleGreen: { color: "#16a34a" },
  subtitle: { fontSize: "14px", color: "#6b7280", margin: 0, lineHeight: 1.5 },
  form: { padding: "30px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" },
  formGroup: { marginBottom: "20px" },
  label: { display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" },
  input: { width: "100%", padding: "14px 16px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", color: "#111827", outline: "none", backgroundColor: "#fafafa", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "14px 16px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", color: "#111827", outline: "none", backgroundColor: "#fafafa", boxSizing: "border-box", resize: "vertical" },
  errorText: { color: "#ef4444", fontSize: "12px", marginTop: "6px", marginBottom: "0" },
  errorMessageContainer: { padding: "12px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: "8px", fontSize: "13px", marginBottom: "20px", textAlign: "center" as const },
  submitBtn: { width: "100%", padding: "14px", borderRadius: "10px", border: "none", backgroundColor: "#16a34a", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(22,163,74,0.25)", transition: "background-color 0.2s" },
  footer: { padding: "20px", textAlign: "center" as const, backgroundColor: "#f9fafb", borderTop: "1px solid #f0fdf4" },
};