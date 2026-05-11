import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { logoutAction } from "@/actions/authAction";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user_session")?.value;

  if (!sessionCookie) {
    redirect("/login");
  }

  let userSession;
  try {
    userSession = JSON.parse(sessionCookie);
  } catch (e) {
    redirect("/login");
  }

  // Ambil data pengguna
  const { data: user, error: userError } = await supabase
    .from("pengguna")
    .select("*")
    .eq("id", userSession.id)
    .single();

  if (userError || !user) {
    redirect("/login");
  }

  // Ambil status langganan
  const { data: langganan } = await supabase
    .from("langganan")
    .select("status")
    .eq("user_id", userSession.id)
    .single();

  const statusLangganan = langganan ? langganan.status : "Belum Berlangganan";

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.headerContent}>
          <h1 style={s.title}>Profil <span style={{ color: "#16a34a" }}>Saya</span></h1>
          <form action={logoutAction}>
            <button type="submit" style={s.logoutBtn}>Logout</button>
          </form>
        </div>
      </div>

      <div style={s.container}>
        <div style={s.grid}>
          {/* Card Info Profil */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <h2 style={s.cardTitle}>Informasi Akun</h2>
            </div>
            <div style={s.cardBody}>
              <div style={s.avatarWrapper}>
                {user.foto_profil ? (
                  <img src={user.foto_profil} alt="Avatar" style={s.avatar} />
                ) : (
                  <div style={s.avatarPlaceholder}>
                    {user.nama.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div style={s.infoList}>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Nama</span>
                  <span style={s.infoValue}>{user.nama}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Email</span>
                  <span style={s.infoValue}>{user.email}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Nomor HP</span>
                  <span style={s.infoValue}>{user.no_hp || "-"}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Alamat Lengkap</span>
                  <span style={s.infoValue}>{user.alamat_lengkap || "-"}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Status Langganan</span>
                  <span style={{
                    ...s.badge,
                    backgroundColor: statusLangganan === "aktif" ? "#16a34a" : statusLangganan === "pending" ? "#eab308" : "#9ca3af"
                  }}>
                    {statusLangganan.toUpperCase()}
                  </span>
                </div>
              </div>

              {statusLangganan === "Belum Berlangganan" && (
                <a href="/langganan" style={s.primaryBtn}>
                  Ajukan Layanan Berlangganan
                </a>
              )}
            </div>
          </div>

          {/* Card Pengaturan */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <h2 style={s.cardTitle}>Pengaturan Keamanan</h2>
            </div>
            <div style={s.cardBody}>
              <ProfileClient />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", backgroundColor: "#f0fdf4", fontFamily: "'Niramit', sans-serif" },
  header: { backgroundColor: "#fff", borderBottom: "1px solid #dcfce7", padding: "20px 0" },
  headerContent: { maxWidth: "1000px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: "24px", fontWeight: "800", color: "#111827", margin: 0 },
  logoutBtn: { padding: "8px 16px", borderRadius: "8px", border: "1px solid #ef4444", backgroundColor: "#fef2f2", color: "#ef4444", fontWeight: "600", cursor: "pointer" },
  container: { maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" },
  card: { backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #bbf7d0", overflow: "hidden", boxShadow: "0 4px 20px rgba(22,163,74,0.05)" },
  cardHeader: { padding: "20px", borderBottom: "1px solid #f0fdf4", backgroundColor: "#fafafa" },
  cardTitle: { fontSize: "16px", fontWeight: "700", color: "#111827", margin: 0 },
  cardBody: { padding: "24px" },
  avatarWrapper: { display: "flex", justifyContent: "center", marginBottom: "24px" },
  avatar: { width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "4px solid #f0fdf4" },
  avatarPlaceholder: { width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", fontWeight: "800", border: "4px solid #f0fdf4" },
  infoList: { display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" },
  infoItem: { display: "flex", flexDirection: "column", gap: "4px" },
  infoLabel: { fontSize: "12px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase" as const },
  infoValue: { fontSize: "15px", color: "#111827", fontWeight: "500" },
  badge: { display: "inline-block", padding: "4px 10px", borderRadius: "20px", color: "#fff", fontSize: "11px", fontWeight: "700", alignSelf: "flex-start" },
  primaryBtn: { display: "block", width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#16a34a", color: "#fff", textAlign: "center" as const, fontWeight: "600", textDecoration: "none", boxSizing: "border-box" },
};