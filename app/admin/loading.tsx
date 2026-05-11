export default function Loading() {
  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.skeletonTitle}></div>
        <div style={s.skeletonSubtitle}></div>
      </div>

      <div style={s.container}>
        {/* Search Bar Skeleton */}
        <div style={s.skeletonSearch}></div>

        {/* Table Skeleton */}
        <div style={s.card}>
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
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} style={s.tr}>
                    <td style={s.td}><div style={{ ...s.skeletonText, width: "60px" }}></div></td>
                    <td style={s.td}><div style={{ ...s.skeletonText, width: "80px" }}></div></td>
                    <td style={s.td}>
                      <div style={{ ...s.skeletonText, width: "120px", marginBottom: "4px" }}></div>
                      <div style={{ ...s.skeletonText, width: "90px" }}></div>
                    </td>
                    <td style={s.td}>
                      <div style={{ ...s.skeletonText, width: "140px", marginBottom: "4px" }}></div>
                      <div style={{ ...s.skeletonText, width: "180px" }}></div>
                    </td>
                    <td style={s.td}><div style={{ ...s.skeletonBadge }}></div></td>
                    <td style={s.td}><div style={{ ...s.skeletonBtn }}></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", backgroundColor: "#f0fdf4", fontFamily: "'Niramit', sans-serif" },
  pageHeader: { backgroundColor: "#fff", borderBottom: "1px solid #dcfce7", padding: "28px 20px" },
  skeletonTitle: { height: "36px", width: "200px", backgroundColor: "#e5e7eb", borderRadius: "8px", marginBottom: "8px", animation: "pulse 1.5s infinite" },
  skeletonSubtitle: { height: "16px", width: "300px", backgroundColor: "#f3f4f6", borderRadius: "4px", animation: "pulse 1.5s infinite" },
  container: { padding: "40px 20px 60px", maxWidth: "1200px", margin: "0 auto" },
  skeletonSearch: { height: "40px", width: "100%", maxWidth: "400px", backgroundColor: "#e5e7eb", borderRadius: "10px", marginBottom: "20px", animation: "pulse 1.5s infinite" },
  card: { backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #bbf7d0", boxShadow: "0 2px 16px rgba(22,163,74,0.06)", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "16px", textAlign: "left" as const, fontSize: "13px", fontWeight: "700", color: "#4b5563", backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" },
  tr: { borderBottom: "1px solid #e5e7eb" },
  td: { padding: "16px" },
  skeletonText: { height: "14px", backgroundColor: "#e5e7eb", borderRadius: "4px", animation: "pulse 1.5s infinite" },
  skeletonBadge: { height: "22px", width: "70px", backgroundColor: "#e5e7eb", borderRadius: "20px", animation: "pulse 1.5s infinite" },
  skeletonBtn: { height: "28px", width: "80px", backgroundColor: "#e5e7eb", borderRadius: "6px", animation: "pulse 1.5s infinite" },
};