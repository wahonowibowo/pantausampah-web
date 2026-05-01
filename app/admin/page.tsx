"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { tandaiSelesai } from "@/actions/updateStatusAction";

export default function AdminPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("laporan_sampah")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReports(data);
    } else {
      console.error("Gagal mengambil data laporan:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSelesaikan = async (report: any) => {
    const isConfirm = window.confirm(`Apakah Anda yakin laporan dengan ID ${report.id.substring(0, 8)} sudah selesai? Email notifikasi akan dikirim ke pelapor.`);
    if (!isConfirm) return;

    try {
      await tandaiSelesai(report.id, report.kontak, report.nama || "Warga", report.kategori, report.lokasi);
      alert("Laporan berhasil ditandai selesai!");
      fetchReports(); // Refresh data
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    }
  };

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <h1 style={s.pageTitle}>Panel <span style={s.titleGreen}>Admin</span></h1>
        <p style={s.pageSubtitle}>Kelola laporan masuk dan perbarui status.</p>
      </div>

      <div style={s.container}>
        <div style={s.card}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>Memuat data...</div>
          ) : reports.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>Belum ada laporan masuk.</div>
          ) : (
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
                  {reports.map((r) => (
                    <tr key={r.id} style={s.tr}>
                      <td style={s.td}><span style={{ fontFamily: "monospace", fontSize: "12px" }}>{r.id.substring(0, 8)}</span></td>
                      <td style={s.td}>{new Date(r.created_at).toLocaleDateString("id-ID")}</td>
                      <td style={s.td}>
                        <strong>{r.nama || "Anonim"}</strong><br />
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>{r.kontak}</span>
                      </td>
                      <td style={s.td}>
                        <span style={{ fontWeight: "600", fontSize: "13px" }}>{r.kategori.replace(/_/g, " ")}</span><br />
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>{r.lokasi.substring(0, 40)}...</span>
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
          )}
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", backgroundColor: "#f0fdf4", fontFamily: "'Niramit', sans-serif" },
  pageHeader: { backgroundColor: "#fff", borderBottom: "1px solid #dcfce7", padding: "28px 20px" },
  pageTitle: { fontSize: "clamp(26px, 4vw, 36px)", fontWeight: "800", color: "#111827", margin: "0 0 6px", letterSpacing: "-0.5px" },
  titleGreen: { color: "#16a34a" },
  pageSubtitle: { fontSize: "14px", color: "#6b7280", margin: 0 },
  container: { padding: "40px 20px 60px", maxWidth: "1200px", margin: "0 auto" },
  card: { backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #bbf7d0", boxShadow: "0 2px 16px rgba(22,163,74,0.06)", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "16px", textAlign: "left" as const, fontSize: "13px", fontWeight: "700", color: "#4b5563", backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" },
  tr: { borderBottom: "1px solid #e5e7eb" },
  td: { padding: "16px", fontSize: "14px", color: "#111827", verticalAlign: "middle" as const },
  statusBadge: { padding: "4px 10px", borderRadius: "20px", color: "#fff", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" as const },
  actionBtn: { padding: "6px 12px", borderRadius: "6px", border: "none", backgroundColor: "#16a34a", color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer", boxShadow: "0 2px 4px rgba(22,163,74,0.2)" },
};
