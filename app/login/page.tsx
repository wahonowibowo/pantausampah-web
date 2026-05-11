"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/authAction";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, undefined);

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
            <p style={s.subtitle}>Masuk ke akun Anda untuk mengelola laporan</p>
          </div>

          <form action={action} style={s.form}>
            {state?.message && (
              <div style={s.errorMessageContainer}>
                {state.message}
              </div>
            )}

            {/* Input Email */}
            <div style={s.formGroup}>
              <label style={s.label}>Email</label>
              <input
                type="email"
                name="email"
                style={s.input}
                placeholder="Masukkan alamat email"
                defaultValue={""}
              />
              {state?.errors?.email && (
                <p style={s.errorText}>{state.errors.email[0]}</p>
              )}
            </div>

            {/* Input Password */}
            <div style={s.formGroup}>
              <label style={s.label}>Kata Sandi</label>
              <input
                type="password"
                name="password"
                style={s.input}
                placeholder="Masukkan kata sandi"
                defaultValue={""}
              />
              {state?.errors?.password && (
                <p style={s.errorText}>{state.errors.password[0]}</p>
              )}
            </div>
            
            <div style={s.forgotPasswordContainer}>
              <button 
                type="button" 
                onClick={() => alert("Fitur Lupa Password sedang dalam pengembangan.")}
                style={s.forgotPasswordBtn}
              >
                Lupa Password?
              </button>
            </div>

            <button type="submit" style={s.submitBtn} disabled={isPending}>
              {isPending ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div style={s.footer}>
            <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
              Belum punya akun Pelanggan? <a href="/register" style={{ color: "#16a34a", fontWeight: "600", textDecoration: "none" }}>Daftar sekarang</a>
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
  errorText: {
    color: "#ef4444",
    fontSize: "12px",
    marginTop: "6px",
    marginBottom: "0",
  },
  errorMessageContainer: {
    padding: "12px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "20px",
    textAlign: "center" as const,
  },
  forgotPasswordContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
  },
  forgotPasswordBtn: {
    background: "none",
    border: "none",
    color: "#16a34a",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    padding: 0,
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
    transition: "background-color 0.2s",
  },
  footer: {
    padding: "20px",
    textAlign: "center" as const,
    backgroundColor: "#f9fafb",
    borderTop: "1px solid #f0fdf4",
  },
};