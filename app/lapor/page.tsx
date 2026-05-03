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
          .from("laporan") 
          .upload(filePath, photo);

        if (uploadError) {
          console.error("❌ Gagal upload foto:", uploadError);
          throw new Error("Gagal mengunggah foto: " + uploadError.message);
        }

        const { data: urlData } = supabase.storage
          .from("laporan")
          .getPublicUrl(filePath);
        
        foto_url = urlData.publicUrl;
      }

      // 2. Insert ke Tabel Supabase (Backend Wahono Style)
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

      // Ambil ID asli dari database atau fallback ke generator
      const generatedId = insertedData?.[0]?.id || `PS-${Math.floor(Math.random() * 90000) + 10000}`;
      setReportId(generatedId);

      // 3. Kirim Email Notifikasi (Fitur Wahono)
      try {
        await sendEmailNotification(contact, "Pending", generatedId, name || "Warga", category, address);
      } catch (emailErr) {
        console.error("Gagal mengirim email:", emailErr);
      }

      console.log("✅ Laporan Berhasil Terkirim!");
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

      <div style={s.container}>
        <div style={s.layout}>

          {/* ── FORM (Sekar UI) ── */}
          <form style={s.card} onSubmit={handleSubmit}>

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
                placeholder="Ceritakan kondisi di lapangan..."
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
                  <div style={s.stepTitle}>Foto Bukti <span style={s.optTag}>Opsional</span></div>
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
                    <span>📷</span>
                    <span style={{ fontSize: "13.5px", fontWeight: "500" }}>{photo.name}</span>
                    <button type="button" style={s.removeBtn} onClick={(e) => { e.stopPropagation(); setPhoto(null); }}>✕</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: "22px", color: "#16a34a", marginBottom: "6px" }}>⬆</div>
                    <p style={{ fontSize: "13.5px", color: "#4b5563" }}>Pilih foto bukti</p>
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
                  <div style={s.stepSub}>Gunakan GPS otomatis untuk akurasi tinggi</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input type="text" style={{ ...s.input, flex: 1, minWidth: "140px" }}
                  placeholder="Alamat lengkap..."
                  value={address} onChange={(e) => setAddress(e.target.value)} required />
                <button type="button" style={s.gpsBtn} onClick={handleLocation} disabled={gettingLocation}>
                  {gettingLocation ? "⊙ Mencari..." : "📍 Lokasi"}
                </button>
              </div>
            </div>

            <div style={s.hr} />

            {/* 05 Kontak */}
            <div style={s.section}>
              <div style={s.stepHead}>
                <span style={s.stepNum}>05</span>
                <div>
                  <div style={s.stepTitle}>Kontak <span style={s.optTag}>Opsional</span></div>
                  <div style={s.stepSub}>Identitas Anda bersifat rahasia</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <input type="text" style={s.input} placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" style={s.input} placeholder="Email" value={contact} onChange={(e) => setContact(e.target.value)} />
              </div>
            </div>

            <div style={s.submitBar}>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>⏱ Respon cepat 1×24 jam</div>
              <button type="submit" style={s.submitBtn} disabled={loading}>
                {loading ? "Mengirim..." : "Kirim Laporan →"}
              </button>
            </div>
          </form>

          {/* ── SIDEBAR (Sekar UI) ── */}
          <aside style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={s.sideCard}>
              <div style={s.sideHead}>📊 <span style={s.sideTitle}>Statistik</span></div>
              <div style={s.statRow}><span style={s.statNum}>2.847</span> <span style={s.statLabel}>Laporan</span></div>
              <div style={s.statRow}><span style={s.statNum}>94%</span> <span style={s.statLabel}>Selesai</span></div>
            </div>

            <div style={s.ctaCard}>
              <div style={{ fontSize: "28px" }}>🌿</div>
              <div style={{ color: "#bbf7d0", fontSize: "13px" }}>Mari jaga bumi kita.</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", backgroundColor: "#f0fdf4", fontFamily: "inherit" },
  pageHeader: { backgroundColor: "#fff", borderBottom: "1px solid #dcfce7", padding: "28px 48px" },
  breadcrumb: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" },
  bcLink: { fontSize: "13px", color: "#16a34a", textDecoration: "none" },
  bcSep: { fontSize: "13px", color: "#9ca3af" },
  bcCurrent: { fontSize: "13px", color: "#6b7280" },
  pageTitle: { fontSize: "32px", fontWeight: "800", color: "#111827", margin: "0" },
  titleGreen: { color: "#16a34a" },
  pageSubtitle: { fontSize: "14px", color: "#6b7280" },
  container: { padding: "28px 48px", maxWidth: "1180px", margin: "0 auto" },
  layout: { display: "grid", gridTemplateColumns: "1fr 290px", gap: "24px" },
  card: { backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #bbf7d0", overflow: "hidden" },
  section: { padding: "22px 26px" },
  hr: { height: "1px", backgroundColor: "#f0fdf4", margin: "0 26px" },
  stepHead: { display: "flex", gap: "12px", marginBottom: "14px" },
  stepNum: { width: "26px", height: "26px", borderRadius: "7px", backgroundColor: "#f0fdf4", border: "1.5px solid #bbf7d0", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700" },
  stepTitle: { fontSize: "14.5px", fontWeight: "700" },
  stepSub: { fontSize: "12px", color: "#9ca3af" },
  optTag: { fontSize: "10px", backgroundColor: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" },
  catGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "8px" },
  catBtn: { padding: "10px", borderRadius: "9px", border: "1.5px solid #e5e7eb", textAlign: "left", cursor: "pointer", fontSize: "13px" },
  textarea: { width: "100%", padding: "12px", borderRadius: "9px", border: "1.5px solid #e5e7eb", backgroundColor: "#fafafa" },
  charCount: { fontSize: "11px", color: "#9ca3af", textAlign: "right", marginTop: "4px" },
  dropzone: { border: "2px dashed #d1fae5", borderRadius: "10px", padding: "20px", textAlign: "center", cursor: "pointer" },
  dropActive: { borderColor: "#22c55e", backgroundColor: "#f0fdf4" },
  removeBtn: { background: "none", border: "none", color: "#ef4444", cursor: "pointer" },
  input: { padding: "11px", borderRadius: "9px", border: "1.5px solid #e5e7eb", backgroundColor: "#fafafa" },
  gpsBtn: { padding: "11px 16px", borderRadius: "9px", border: "1.5px solid #22c55e", color: "#15803d", fontWeight: "600", cursor: "pointer" },
  submitBar: { padding: "20px 26px", backgroundColor: "#f0fdf4", display: "flex", justifyContent: "space-between", alignItems: "center" },
  submitBtn: { padding: "12px 24px", backgroundColor: "#16a34a", color: "#fff", borderRadius: "9px", border: "none", fontWeight: "700", cursor: "pointer" },
  sideCard: { backgroundColor: "#fff", borderRadius: "13px", border: "1px solid #bbf7d0", padding: "18px" },
  sideTitle: { fontSize: "14px", fontWeight: "700", color: "#14532d" },
  statRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0fdf4" },
  statNum: { fontWeight: "800", color: "#16a34a" },
  statLabel: { fontSize: "12px", color: "#6b7280" },
  ctaCard: { backgroundColor: "#15803d", borderRadius: "13px", padding: "20px", textAlign: "center" },
  successWrap: { maxWidth: "460px", margin: "80px auto", padding: "40px", textAlign: "center", backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #bbf7d0" },
  successIcon: { width: "60px", height: "60px", backgroundColor: "#22c55e", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "24px" },
  successTitle: { fontSize: "22px", fontWeight: "800", color: "#14532d" },
  successText: { fontSize: "14px", color: "#4b5563", marginBottom: "20px" },
  successBadge: { padding: "8px 16px", backgroundColor: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" },
  newBtn: { width: "100%", marginTop: "20px", padding: "12px", backgroundColor: "#16a34a", color: "#fff", borderRadius: "9px", border: "none", fontWeight: "700", cursor: "pointer" }
};
