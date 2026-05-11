"use client";

import { useTransition, useState } from "react";
import { updatePasswordAction } from "@/actions/profileAction";

export default function ProfileClient() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updatePasswordAction(formData);
      if (res.error) {
        setMessage({ type: "error", text: res.error });
      } else if (res.success) {
        setMessage({ type: "success", text: "Kata sandi berhasil diperbarui!" });
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={s.formGroup}>
          <label style={s.label}>Kata Sandi Baru</label>
          <input
            type="password"
            name="password"
            style={s.input}
            placeholder="Minimal 6 karakter"
            required
            minLength={6}
          />
        </div>
        <button type="submit" style={s.submitBtn} disabled={isPending}>
          {isPending ? "Menyimpan..." : "Ubah Kata Sandi"}
        </button>
      </form>
      {message && (
        <div style={{ ...s.messageBox, backgroundColor: message.type === "error" ? "#fef2f2" : "#f0fdf4", color: message.type === "error" ? "#ef4444" : "#16a34a", border: `1px solid ${message.type === "error" ? "#fecaca" : "#bbf7d0"}` }}>
          {message.text}
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  formGroup: { marginBottom: "16px" },
  label: { display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" },
  input: { width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#111827", outline: "none", backgroundColor: "#fafafa", boxSizing: "border-box" },
  submitBtn: { width: "100%", padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#1f2937", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "background-color 0.2s" },
  messageBox: { marginTop: "16px", padding: "12px", borderRadius: "8px", fontSize: "13px", textAlign: "center" as const },
};