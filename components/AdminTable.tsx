"use client";

import { useOptimistic, startTransition } from "react";
import { tandaiSelesai } from "@/actions/updateStatusAction";

export default function AdminTable({ initialReports }: { initialReports: any[] }) {
  const [optimisticReports, addOptimisticReport] = useOptimistic(
    initialReports,
    (state: any[], updatedId: string) => {
      return state.map((r) =>
        r.id === updatedId ? { ...r, status: "Selesai" } : r
      );
    }
  );

  const handleSelesaikan = async (report: any) => {
    const isConfirm = window.confirm(
      `Apakah Anda yakin laporan dengan ID ${report.id.substring(0, 8)} sudah selesai? Email notifikasi akan dikirim ke pelapor.`
    );
    if (!isConfirm) return;

    // 1. Optimistic Update UI (instan)
    startTransition(() => {
      addOptimisticReport(report.id);
    });

    // 2. Lakukan Server Action di background
    try {
      await tandaiSelesai(report.id, report.kontak, report.nama || "Warga", report.kategori, report.lokasi);
      // Data akan otomatis refresh setelah Server Action karena Next.js revalidates.
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memproses data.");
    }
  };

  if (optimisticReports.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
        Belum ada laporan masuk atau tidak ada hasil pencarian.
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>ID</th>
            <th style={s.th}>Tanggal</th>
            <th style={s.th}>Pelapor (Kontak)</th>
            <th style={s.th}>Kategori & Lokasi</th>
            <th style={s.th}>Status</th>
            <th style={s.th}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {optimisticReports.map((r) => (
            <tr key={r.id} style={s.tr}>
              <td style={s.td}><span style={{ fontFamily: "monospace", fontSize: "12px" }}>{r.id.substring(0, 8)}</span></td>
              <td style={s.td}>{new Date(r.created_at).toLocaleDateString("id-ID")}</td>
              <td style={s.td}>
                <strong>{r.nama || "Anonim"}</strong><br />
                <span style={{ fontSize: "12px", color: "#6b7280" }}>{r.kontak}</span>
              </td>
              <td style={s.td}>
                <span style={{ fontWeight: "600", fontSize: "13px" }}>{r.kategori?.replace(/_/g, " ")}</span><br />
                <span style={{ fontSize: "12px", color: "#6b7280" }}>{r.lokasi?.substring(0, 40)}...</span>
              </td>
              <td style={s.td}>
                <span
                  style={{
                    ...s.statusBadge,
                    backgroundColor: r.status === "Selesai" ? "#16a34a" : r.status === "Diproses" ? "#3b82f6" : "#eab308",
                  }}
                >
                  {r.status}
                </span>
              </td>
              <td style={s.td}>
                {r.status !== "Selesai" && (
                  <button style={s.actionBtn} onClick={() => handleSelesaikan(r)}>
                    ✓ Selesai
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "16px", textAlign: "left" as const, fontSize: "13px", fontWeight: "700", color: "#4b5563", backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" },
  tr: { borderBottom: "1px solid #e5e7eb" },
  td: { padding: "16px", fontSize: "14px", color: "#111827", verticalAlign: "middle" as const },
  statusBadge: { padding: "4px 10px", borderRadius: "20px", color: "#fff", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" as const },
  actionBtn: { padding: "6px 12px", borderRadius: "6px", border: "none", backgroundColor: "#16a34a", color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer", boxShadow: "0 2px 4px rgba(22,163,74,0.2)" },
};