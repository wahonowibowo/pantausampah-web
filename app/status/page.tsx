"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function StatusPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;

    setLoading(true);
    setSearched(false);

    try {
      // Cari berdasarkan ID atau Kontak (Email)
      const { data, error } = await supabase
        .from("laporan_sampah")
        .select("*")
        .or(`id.eq.${keyword},kontak.ilike.%${keyword}%`)
        .order("created_at", { ascending: false });

      if (error) {
        // Abaikan error format UUID jika pengguna mencari berdasarkan email
        if (error.code !== "22P02") {
          console.error("❌ Error fetching status:", error);
          alert("Gagal mengambil data laporan.");
        }
      }

      // Jika error 22P02 (invalid input syntax for type uuid), berarti keyword bukan UUID
      // Kita coba fetch ulang HANYA berdasarkan kontak
      let finalData = data;
      if (error && error.code === "22P02") {
        const { data: fallbackData } = await supabase
          .from("laporan_sampah")
          .select("*")
          .ilike("kontak", `%${keyword}%`)
          .order("created_at", { ascending: false });
        finalData = fallbackData;
      }

      setReports(finalData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.breadcrumb}>
          <a href="/" style={s.bcLink}>Beranda</a>
          <span style={s.bcSep}>›</span>
          <span style={s.bcCurrent}>Cek Status Laporan</span>
        </div>
        <h1 style={s.pageTitle}>
          Cek Status <span style={s.titleGreen}>Laporan</span>
        </h1>
        <p style={s.pageSubtitle}>
          Lacak perkembangan laporan Anda menggunakan ID Laporan atau Email.
        </p>
      </div>

      <div style={s.container}>
        <div style={s.card}>
          <form style={s.searchForm} onSubmit={handleSearch}>
            <input
              type="text"
              style={s.input}
              placeholder="Masukkan ID Laporan atau Email Anda..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              required
            />
            <button type="submit" style={s.submitBtn} disabled={loading}>
              {loading ? "Mencari..." : "🔍 Cari Laporan"}
            </button>
          </form>
        </div>

        {searched && (
          <div style={s.resultsContainer}>
            <h3 style={s.resultsTitle}>
              Hasil Pencarian: {reports.length} Laporan Ditemukan
            </h3>

            {reports.length === 0 ? (
              <div style={s.emptyState}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>📭</div>
                <h4>Laporan Tidak Ditemukan</h4>
                <p>Pastikan ID Laporan atau Email yang Anda masukkan sudah benar.</p>
              </div>
            ) : (
              <div style={s.grid}>
                {reports.map((report) => (
                  <div key={report.id} style={s.reportCard}>
                    <div style={s.reportHeader}>
                      <span style={s.reportId}>ID: {report.id.substring(0, 8)}...</span>
                      <span
                        style={{
                          ...s.statusBadge,
                          backgroundColor:
                            report.status === "Selesai"
                              ? "#16a34a"
                              : report.status === "Diproses"
                              ? "#3b82f6"
                              : "#eab308",
                        }}
                      >
                        {report.status}
                      </span>
                    </div>
                    <div style={s.reportBody}>
                      <h4 style={s.reportCategory}>{report.kategori.replace(/_/g, " ").toUpperCase()}</h4>
                      <p style={s.reportDesc}>{report.deskripsi}</p>
                      <div style={s.reportMeta}>
                        <span>📍 {report.lokasi}</span>
                        <span>📅 {new Date(report.created_at).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", backgroundColor: "#f0fdf4", fontFamily: "'Niramit', sans-serif" },
  pageHeader: { backgroundColor: "#fff", borderBottom: "1px solid #dcfce7", padding: "28px 20px" },
  breadcrumb: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" },
  bcLink: { fontSize: "13px", color: "#16a34a", textDecoration: "none" },
  bcSep: { fontSize: "13px", color: "#9ca3af" },
  bcCurrent: { fontSize: "13px", color: "#6b7280" },
  pageTitle: { fontSize: "clamp(26px, 4vw, 36px)", fontWeight: "800", color: "#111827", margin: "0 0 6px", letterSpacing: "-0.5px" },
  titleGreen: { color: "#16a34a" },
  pageSubtitle: { fontSize: "14px", color: "#6b7280", margin: 0 },
  container: { padding: "40px 20px 60px", maxWidth: "900px", margin: "0 auto" },
  card: { backgroundColor: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #bbf7d0", boxShadow: "0 2px 16px rgba(22,163,74,0.06)", marginBottom: "30px" },
  searchForm: { display: "flex", gap: "12px", flexWrap: "wrap" as const },
  input: { flex: 1, padding: "14px 18px", borderRadius: "9px", border: "1.5px solid #e5e7eb", fontSize: "15px", color: "#111827", outline: "none", backgroundColor: "#fafafa" },
  submitBtn: { padding: "14px 28px", borderRadius: "9px", border: "none", backgroundColor: "#16a34a", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(22,163,74,0.28)", whiteSpace: "nowrap" as const },
  resultsContainer: { marginTop: "20px" },
  resultsTitle: { fontSize: "18px", fontWeight: "700", color: "#14532d", marginBottom: "20px" },
  emptyState: { textAlign: "center", padding: "50px 20px", backgroundColor: "#fff", borderRadius: "16px", border: "1px dashed #bbf7d0", color: "#6b7280" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" },
  reportCard: { backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden", display: "flex", flexDirection: "column" as const, transition: "transform 0.2s", cursor: "default" },
  reportHeader: { padding: "12px 16px", backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" },
  reportId: { fontSize: "12px", color: "#6b7280", fontFamily: "monospace" },
  statusBadge: { padding: "4px 10px", borderRadius: "20px", color: "#fff", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" as const },
  reportBody: { padding: "16px", flex: 1 },
  reportCategory: { margin: "0 0 8px 0", fontSize: "15px", fontWeight: "700", color: "#111827" },
  reportDesc: { fontSize: "13.5px", color: "#4b5563", lineHeight: "1.6", margin: "0 0 16px 0", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" },
  reportMeta: { display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#9ca3af", marginTop: "auto" }
};
