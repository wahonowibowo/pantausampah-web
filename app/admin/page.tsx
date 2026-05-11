import { supabase } from "@/lib/supabase";
import { tandaiSelesai } from "@/actions/updateStatusAction";

import AdminTable from "@/components/AdminTable";
import SearchAdmin from "@/components/SearchAdmin";
import { logoutAction } from "@/actions/authAction";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const query = typeof params?.query === "string" ? params.query : "";

  let queryBuilder = supabase
    .from("laporan_sampah")
    .select("*")
    .order("created_at", { ascending: false });

  if (query) {
    // Pencarian dengan case-insensitive di Supabase
    queryBuilder = queryBuilder.or(`nama.ilike.%${query}%,lokasi.ilike.%${query}%`);
  }

  const { data: reports, error } = await queryBuilder;

  if (error) {
    console.error("Gagal mengambil data laporan:", error);
  }

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={s.pageTitle}>Panel <span style={s.titleGreen}>Admin</span></h1>
            <p style={s.pageSubtitle}>Kelola laporan masuk dan perbarui status.</p>
          </div>
          <form action={logoutAction}>
            <button type="submit" style={s.logoutBtn}>Logout</button>
          </form>
        </div>
      </div>

      <div style={s.container}>
        <SearchAdmin />
        
        <div style={s.card}>
          <AdminTable initialReports={reports || []} />
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
  logoutBtn: { padding: "8px 16px", borderRadius: "8px", border: "1px solid #ef4444", backgroundColor: "#fef2f2", color: "#ef4444", fontWeight: "600", cursor: "pointer" },
};