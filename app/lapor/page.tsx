"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { sendEmailNotification } from "@/actions/sendEmailAction";

const categories = [
  { value: "sampah_berserakan", label: "🗑️ Sampah Berserakan", color: "#16a34a" },
  { value: "tps_penuh", label: "📦 TPS Penuh / Meluber", color: "#dc2626" },
  { value: "pembakaran", label: "🔥 Pembakaran Sampah Liar", color: "#ea580c" },
  { value: "selokan", label: "🌊 Selokan Tersumbat", color: "#2563eb" },
  { value: "b3", label: "⚠️ Sampah B3 / Berbahaya", color: "#7c3aed" },
  { value: "lainnya", label: "📋 Lainnya", color: "#4b5563" },
];

export default function LaporPage() {
  const [category, setCategory] = useState("sampah_berserakan");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [reportId, setReportId] = useState("");

  const handleLocation = () => {
    if (!navigator.geolocation) return;
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddress(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        setGettingLocation(false);
      },
      () => setGettingLocation(false)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("🚀 Memulai proses pengiriman laporan...");

    try {
      let foto_url = "";

      // 1. Upload Foto jika ada
      if (photo) {
        console.log("📸 Mengunggah foto:", photo.name);
        const fileExt = photo.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `laporan/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from("laporan") // Pastikan bucket "laporan" sudah dibuat & public
          .upload(filePath, photo);

        if (uploadError) {
          console.error("❌ Gagal upload foto:", uploadError);
          throw new Error("Gagal mengunggah foto: " + uploadError.message);
        }

        console.log("✅ Foto berhasil diunggah:", data.path);

        // Ambil Public URL
        const { data: urlData } = supabase.storage
          .from("laporan")
          .getPublicUrl(filePath);
        
        foto_url = urlData.publicUrl;
        console.log("🔗 URL Foto:", foto_url);
      }

      // 2. Insert ke Tabel Supabase
      console.log("📝 Memasukkan data ke database...");
      const { data: insertedData, error: insertError } = await supabase
        .from("laporan_sampah")
        .insert([
          {
            nama: name,
            kontak: contact,
            kategori: category,
            lokasi: address,
            deskripsi: description,
            foto_url: foto_url,
            status: "Pending",
          },
        ])
        .select();

      if (insertError) {
        console.error("❌ Gagal insert database:", insertError);
        throw new Error("Gagal menyimpan laporan: " + insertError.message);
      }

      const generatedId = insertedData?.[0]?.id || `PS-${Math.floor(Math.random() * 90000) + 10000}`;
      setReportId(generatedId);

      // 3. Kirim Email Notifikasi
      try {
        await sendEmailNotification(contact, "Pending", generatedId, name || "Warga", category, address);
      } catch (emailErr) {
        console.error("Gagal mengirim email:", emailErr);
      }

      console.log("✅ Laporan Berhasil Terkirim ke Supabase!");
      setSubmitted(true);
    } catch (err: any) {
      console.error("💥 Error fatal:", err.message);
      alert(err.message || "Terjadi kesalahan saat mengirim laporan.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={s.page}>
        <div style={s.successWrap}>
          <div style={s.successIcon}>✓</div>
          <h2 style={s.successTitle}>Laporan Terkirim!</h2>
          <p style={s.successText}>
            Terima kasih telah melaporkan masalah sampah. Tim kami akan segera
            menindaklanjuti laporan Anda dalam 1×24 jam.
          </p>
          <div style={{ marginBottom: "24px" }}>
            <span style={s.successBadge}>
              ID Laporan: <strong>{reportId}</strong>
            </span>
          </div>
          <button
            style={s.newBtn}
            onClick={() => {
              setSubmitted(false);
              setDescription("");
              setAddress("");
              setName("");
              setContact("");
              setPhoto(null);
            }}
          >
            Buat Laporan Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* Page header — matches the site's white header style */}
      <div style={s.pageHeader}>
        <div style={s.breadcrumb}>
          <a href="/" style={s.bcLink}>Beranda</a>
          <span style={s.bcSep}>›</span>
          <span style={s.bcCurrent}>Laporkan Masalah</span>
        </div>
        <h1 style={s.pageTitle}>
          Laporkan Masalah <span style={s.titleGreen}>Sampah</span>
        </h1>
        <p style={s.pageSubtitle}>
          Sampaikan laporan Anda dengan cepat dan mudah &nbsp;•&nbsp; Pantau &nbsp;•&nbsp; Kelola &nbsp;•&nbsp; Jaga Bumi
        </p>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 md:px-12 py-8 max-w-[1180px]">
        <div className="flex flex-col lg:flex-row gap-6 items-start w-full">

          {/* ── FORM ── */}
          <form className="flex-1 w-full" style={s.card} onSubmit={handleSubmit}>

            {/* 01 Kategori */}
            <div style={s.section}>
              <div style={s.stepHead}>
                <span style={s.stepNum}>01</span>
                <div>
                  <div style={s.stepTitle}>Kategori Masalah</div>
                  <div style={s.stepSub}>Pilih jenis masalah yang ingin dilaporkan</div>
                </div>
              </div>
              <div style={s.catGrid}>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    style={{
                      ...s.catBtn,
                      ...(category === cat.value
                        ? { borderColor: cat.color, backgroundColor: `${cat.color}12`, color: cat.color, fontWeight: "600" }
                        : {}),
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={s.hr} />

            {/* 02 Deskripsi */}
            <div style={s.section}>
              <div style={s.stepHead}>
                <span style={s.stepNum}>02</span>
                <div>
                  <div style={s.stepTitle}>Deskripsi Kondisi</div>
                  <div style={s.stepSub}>Jelaskan kondisi di lapangan secara detail</div>
                </div>
              </div>
              <textarea
                style={s.textarea}
                placeholder="Ceritakan kondisi di lapangan: seberapa parah, sudah berapa lama, dampak yang terlihat..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
              <div style={s.charCount}>{description.length} / 500 karakter</div>
            </div>

            <div style={s.hr} />

            {/* 03 Foto */}
            <div style={s.section}>
              <div style={s.stepHead}>
                <span style={s.stepNum}>03</span>
                <div>
                  <div style={s.stepTitle}>
                    Foto Bukti <span style={s.optTag}>Opsional</span>
                  </div>
                  <div style={s.stepSub}>Tambahkan foto untuk memperkuat laporan</div>
                </div>
              </div>
              <div
                style={{ ...s.dropzone, ...(dragOver ? s.dropActive : {}) }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setPhoto(f); }}
                onClick={() => document.getElementById("photoInput")?.click()}
              >
                <input id="photoInput" type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setPhoto(f); }} />
                {photo ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
                    <span style={{ fontSize: "20px" }}>📷</span>
                    <span style={{ fontSize: "13.5px", color: "#374151", fontWeight: "500" }}>{photo.name}</span>
                    <button type="button" style={s.removeBtn}
                      onClick={(e) => { e.stopPropagation(); setPhoto(null); }}>✕</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: "22px", color: "#16a34a", marginBottom: "6px" }}>⬆</div>
                    <p style={{ fontSize: "13.5px", color: "#4b5563", margin: "0 0 4px" }}>
                      Seret foto ke sini atau <span style={{ color: "#16a34a", fontWeight: "600" }}>pilih file</span>
                    </p>
                    <p style={{ fontSize: "11.5px", color: "#9ca3af", margin: 0 }}>JPG, PNG, WEBP hingga 10MB</p>
                  </div>
                )}
              </div>
            </div>

            <div style={s.hr} />

            {/* 04 Lokasi */}
            <div style={s.section}>
              <div style={s.stepHead}>
                <span style={s.stepNum}>04</span>
                <div>
                  <div style={s.stepTitle}>Lokasi Kejadian</div>
                  <div style={s.stepSub}>Masukkan lokasi atau gunakan GPS otomatis</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const }}>
                <input type="text" style={{ ...s.input, flex: 1, minWidth: "140px" }}
                  placeholder="Masukkan alamat lengkap atau nama tempat..."
                  value={address} onChange={(e) => setAddress(e.target.value)} required />
                <button type="button" style={s.gpsBtn} onClick={handleLocation} disabled={gettingLocation}>
                  {gettingLocation ? "⊙ Mencari..." : "📍 Gunakan Lokasi"}
                </button>
              </div>
            </div>

            <div style={s.hr} />

            {/* 05 Kontak */}
            <div style={s.section}>
              <div style={s.stepHead}>
                <span style={s.stepNum}>05</span>
                <div>
                  <div style={s.stepTitle}>
                    Nama & Kontak <span style={s.optTag}>Opsional</span>
                  </div>
                  <div style={s.stepSub}>Identitas Anda bersifat rahasia</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <input type="text" style={s.input} placeholder="Nama Anda"
                  value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" style={s.input} placeholder="Email Aktif (Untuk Notifikasi)"
                  value={contact} onChange={(e) => setContact(e.target.value)} required />
              </div>
              <div style={s.privacyNote}>
                🔒 Data Anda bersifat rahasia dan hanya digunakan untuk keperluan tindak lanjut laporan.
              </div>
            </div>

            {/* Submit bar */}
            <div style={{ ...s.submitBar, display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                ⏱ Laporan diproses dalam <strong>1×24 jam</strong>
              </div>
              <button type="submit" style={s.submitBtn} disabled={loading} className="w-full sm:w-auto flex justify-center">
                {loading
                  ? <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={s.spinner} /> Mengirim...</span>
                  : "Kirim Laporan →"}
              </button>
            </div>
          </form>

          {/* ── SIDEBAR ── */}
          <aside className="w-full lg:w-[290px] flex flex-col gap-4">

            {/* Stats */}
            <div style={s.sideCard}>
              <div style={s.sideHead}>
                <span>📊</span><span style={s.sideTitle}>Statistik Laporan</span>
              </div>
              {[
                { num: "7.896", label: "Pengguna Bergabung" },
                { num: "3.876", label: "Berlangganan DLH" },
                { num: "2.847", label: "Total Laporan Masuk" },
                { num: "94%", label: "Berhasil Ditindaklanjuti" },
              ].map((item) => (
                <div key={item.label} style={s.statRow}>
                  <div style={s.statNum}>{item.num}</div>
                  <div style={s.statLabel}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div style={s.sideCard}>
              <div style={s.sideHead}>
                <span>💡</span><span style={s.sideTitle}>Tips Laporan Efektif</span>
              </div>
              {[
                "Sertakan foto untuk mempercepat verifikasi petugas",
                "Berikan lokasi yang akurat agar petugas mudah menemukan",
                "Deskripsikan kondisi secara jelas dan lengkap",
                "Pantau status laporan Anda di halaman Beranda",
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", padding: "5px 0" }}>
                  <span style={{ color: "#22c55e", fontWeight: "700", flexShrink: 0 }}>•</span>
                  <span style={{ fontSize: "12.5px", color: "#4b5563", lineHeight: "1.5" }}>{tip}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={s.ctaCard}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>🌿</div>
              <div style={{ fontSize: "13px", color: "#bbf7d0", lineHeight: "1.6", marginBottom: "10px" }}>
                Bersama kita jaga kebersihan lingkungan untuk generasi mendatang.
              </div>
              <div style={{ fontSize: "11px", color: "#22c55e", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" as const }}>
                Pantau • Kelola • Jaga Bumi
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ─── Design tokens (matches PantauSampah site) ─── */
const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0fdf4",
    fontFamily: "'Niramit', sans-serif",
  },

  // Page header — white, matches the site's header aesthetic
  pageHeader: {
    backgroundColor: "#fff",
    borderBottom: "1px solid #dcfce7",
    padding: "28px 20px", // Reduced padding for mobile
  },
  breadcrumb: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" },
  bcLink: { fontSize: "13px", color: "#16a34a", textDecoration: "none" },
  bcSep: { fontSize: "13px", color: "#9ca3af" },
  bcCurrent: { fontSize: "13px", color: "#6b7280" },
  pageTitle: { fontSize: "clamp(26px, 4vw, 36px)", fontWeight: "800", color: "#111827", margin: "0 0 6px", letterSpacing: "-0.5px" },
  titleGreen: { color: "#16a34a" },
  pageSubtitle: { fontSize: "14px", color: "#6b7280", margin: 0 },

  // Layout
  container: { padding: "28px 48px 60px", maxWidth: "1180px", margin: "0 auto" },
  layout: { display: "grid", gridTemplateColumns: "1fr 290px", gap: "24px", alignItems: "start" },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #bbf7d0",
    boxShadow: "0 2px 16px rgba(22,163,74,0.06)",
    overflow: "hidden",
  },
  section: { padding: "22px 26px" },
  hr: { height: "1px", backgroundColor: "#f0fdf4", margin: "0 26px" },

  stepHead: { display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" },
  stepNum: {
    flexShrink: 0, width: "26px", height: "26px", borderRadius: "7px",
    backgroundColor: "#f0fdf4", border: "1.5px solid #bbf7d0",
    color: "#16a34a", fontSize: "10.5px", fontWeight: "700",
    display: "flex", alignItems: "center", justifyContent: "center",
    letterSpacing: "0.3px", marginTop: "2px",
  },
  stepTitle: { fontSize: "14.5px", fontWeight: "700", color: "#111827", marginBottom: "2px" },
  stepSub: { fontSize: "12px", color: "#9ca3af" },
  optTag: {
    fontSize: "10.5px", fontWeight: "500", color: "#9ca3af",
    backgroundColor: "#f3f4f6", borderRadius: "4px", padding: "1px 5px",
    marginLeft: "5px", verticalAlign: "middle",
  },

  catGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))", gap: "7px" },
  catBtn: {
    padding: "9px 12px", borderRadius: "9px",
    border: "1.5px solid #e5e7eb", backgroundColor: "#fafafa",
    color: "#374151", fontSize: "13px", fontWeight: "500",
    cursor: "pointer", textAlign: "left", transition: "all 0.15s",
    fontFamily: "inherit",
  },

  textarea: {
    width: "100%", padding: "11px 13px", borderRadius: "9px",
    border: "1.5px solid #e5e7eb", fontSize: "13.5px", color: "#111827",
    resize: "vertical", outline: "none", fontFamily: "inherit",
    lineHeight: "1.6", boxSizing: "border-box", backgroundColor: "#fafafa",
  },
  charCount: { fontSize: "11px", color: "#9ca3af", textAlign: "right", marginTop: "4px" },

  dropzone: {
    border: "2px dashed #d1fae5", borderRadius: "10px", padding: "24px",
    textAlign: "center", cursor: "pointer", transition: "all 0.2s", backgroundColor: "#fafafa",
  },
  dropActive: { borderColor: "#22c55e", backgroundColor: "#f0fdf4" },

  removeBtn: {
    background: "none", border: "none", color: "#9ca3af",
    cursor: "pointer", fontSize: "14px", padding: "0 4px", fontFamily: "inherit",
  },

  input: {
    padding: "11px 13px", borderRadius: "9px", border: "1.5px solid #e5e7eb",
    fontSize: "13.5px", color: "#111827", outline: "none",
    fontFamily: "inherit", backgroundColor: "#fafafa", boxSizing: "border-box",
  },
  gpsBtn: {
    padding: "11px 16px", borderRadius: "9px", border: "1.5px solid #22c55e",
    backgroundColor: "#f0fdf4", color: "#15803d", fontWeight: "600",
    fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
  },

  privacyNote: {
    fontSize: "12px", color: "#6b7280", marginTop: "10px",
    backgroundColor: "#f0fdf4", border: "1px solid #dcfce7",
    borderRadius: "8px", padding: "8px 11px", lineHeight: "1.5",
  },

  submitBar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 26px", backgroundColor: "#f0fdf4",
    borderTop: "1px solid #dcfce7", flexWrap: "wrap", gap: "12px",
  },
  submitBtn: {
    padding: "12px 26px", borderRadius: "9px", border: "none",
    backgroundColor: "#16a34a", color: "#fff", fontSize: "14px",
    fontWeight: "700", cursor: "pointer", fontFamily: "inherit",
    boxShadow: "0 4px 12px rgba(22,163,74,0.28)", display: "flex", alignItems: "center",
  },
  spinner: {
    display: "inline-block", width: "13px", height: "13px",
    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
    borderRadius: "50%",
  },

  // Sidebar
  sideCard: {
    backgroundColor: "#fff", borderRadius: "13px",
    border: "1px solid #bbf7d0", padding: "18px",
    boxShadow: "0 2px 10px rgba(22,163,74,0.04)",
  },
  sideHead: {
    display: "flex", alignItems: "center", gap: "7px",
    marginBottom: "14px", paddingBottom: "11px", borderBottom: "1px solid #f0fdf4",
  },
  sideTitle: { fontSize: "13.5px", fontWeight: "700", color: "#14532d" },
  statRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "7px 0", borderBottom: "1px solid #f0fdf4",
  },
  statNum: { fontSize: "17px", fontWeight: "800", color: "#16a34a" },
  statLabel: { fontSize: "11.5px", color: "#6b7280", textAlign: "right", maxWidth: "120px" },

  ctaCard: {
    backgroundColor: "#15803d", borderRadius: "13px",
    padding: "20px", textAlign: "center",
  },

  // Success screen
  successWrap: {
    maxWidth: "460px", margin: "80px auto", backgroundColor: "#fff",
    borderRadius: "20px", border: "1px solid #bbf7d0",
    padding: "44px 36px", textAlign: "center",
    boxShadow: "0 8px 32px rgba(22,163,74,0.1)",
  },
  successIcon: {
    width: "58px", height: "58px", borderRadius: "50%",
    backgroundColor: "#22c55e", color: "#fff", fontSize: "24px", fontWeight: "700",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 18px", boxShadow: "0 4px 16px rgba(34,197,94,0.35)",
  },
  successTitle: { fontSize: "23px", fontWeight: "800", color: "#14532d", margin: "0 0 10px" },
  successText: { fontSize: "14px", color: "#4b5563", lineHeight: "1.7", margin: "0 0 18px" },
  successBadge: {
    display: "inline-block", padding: "7px 14px", borderRadius: "8px",
    backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0",
    fontSize: "12.5px", color: "#14532d",
  },
  newBtn: {
    width: "100%", padding: "12px", borderRadius: "9px", border: "none",
    backgroundColor: "#16a34a", color: "#fff", fontSize: "14px",
    fontWeight: "700", cursor: "pointer", fontFamily: "inherit",
  },
};