"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sebagai mockup/purwarupa, kita langsung mengarahkan pengguna berdasarkan peran.
    if (role === "admin") {
      router.push("/admin");
    } else if (role === "petugas") {
      alert("Halaman Dasbor Petugas Lapangan belum tersedia. Anda akan diarahkan ke Beranda.");
      router.push("/");
    } else if (role === "pelanggan") {
      alert("Halaman Dasbor Pelanggan belum tersedia. Anda akan diarahkan ke Beranda.");
      router.push("/");
    }
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.loginCard}>
          <div style={s.header}>
            <div style={s.iconWrapper}>
              <span style={{ fontSize: "32px" }}>🌿</span>
            </div>
            <h1 style={s.title}>
              Masuk ke <span style={s.titleGreen}>PantauSampah</span>
            </h1>
            <p style={s.subtitle}>Silakan pilih peran dan masuk ke akun Anda</p>
          </div>

          <form onSubmit={handleLogin} style={s.form}>
            {/* Pemilihan Peran */}
            <div style={s.formGroup}>
              <label style={s.label}>Masuk Sebagai</label>
              <div style={s.roleGrid}>
                {[
                  { id: "admin", label: "Admin" },
                  { id: "petugas", label: "Petugas Lapangan" },
                  { id: "pelanggan", label: "Pelanggan" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    style={{
                      ...s.roleBtn,
                      ...(role === r.id ? s.roleBtnActive : {}),
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Email */}
            <div style={s.formGroup}>
              <label style={s.label}>Email</label>
              <input
                type="email"
                style={s.input}
                placeholder="Masukkan alamat email (opsional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Input Password */}
            <div style={s.formGroup}>
              <label style={s.label}>Kata Sandi</label>
              <input
                type="password"
                style={s.input}
                placeholder="Masukkan kata sandi (opsional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" style={s.submitBtn}>
              Masuk
            </button>
          </form>

          <div style={s.footer}>
            <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
              Belum punya akun Pelanggan? <a href="/lapor" style={{ color: "#16a34a", fontWeight: "600", textDecoration: "none" }}>Daftar sekarang</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0fdf4",
    fontFamily: "'Niramit', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px"
  },
  container: {
    width: "100%",
    maxWidth: "460px",
  },
  loginCard: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    border: "1px solid #bbf7d0",
    boxShadow: "0 10px 40px rgba(22,163,74,0.08)",
    overflow: "hidden",
  },
  header: {
    padding: "40px 30px 20px",
    textAlign: "center" as const,
    borderBottom: "1px solid #f0fdf4",
  },
  iconWrapper: {
    width: "70px",
    height: "70px",
    borderRadius: "20px",
    backgroundColor: "#dcfce7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#111827",
    margin: "0 0 8px",
    letterSpacing: "-0.5px",
  },
  titleGreen: { color: "#16a34a" },
  subtitle: { fontSize: "14px", color: "#6b7280", margin: 0 },
  form: { padding: "30px" },
  formGroup: { marginBottom: "20px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "8px",
  },
  roleGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "8px",
  },
  roleBtn: {
    padding: "10px",
    borderRadius: "10px",
    border: "1.5px solid #e5e7eb",
    backgroundColor: "#fafafa",
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "center" as const,
  },
  roleBtnActive: {
    borderColor: "#16a34a",
    backgroundColor: "#f0fdf4",
    color: "#16a34a",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1.5px solid #e5e7eb",
    fontSize: "14px",
    color: "#111827",
    outline: "none",
    backgroundColor: "#fafafa",
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#16a34a",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(22,163,74,0.25)",
    marginTop: "10px",
    transition: "background-color 0.2s",
  },
  footer: {
    padding: "20px",
    textAlign: "center" as const,
    backgroundColor: "#f9fafb",
    borderTop: "1px solid #f0fdf4",
  },
};
