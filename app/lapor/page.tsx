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

    try {
      let foto_url = "";

      // Upload foto
      if (photo) {
        const fileExt = photo.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `laporan/${fileName}`;

        const { error } = await supabase.storage
          .from("laporan")
          .upload(filePath, photo);

        if (error) throw new Error(error.message);

        const { data } = supabase.storage
          .from("laporan")
          .getPublicUrl(filePath);

        foto_url = data.publicUrl;
      }

      // Insert DB
      const { data: insertedData, error } = await supabase
        .from("laporan_sampah")
        .insert([
          {
            nama: name,
            kontak: contact,
            kategori: category,
            lokasi: address,
            deskripsi: description,
            foto_url,
            status: "Pending",
          },
        ])
        .select();

      if (error) throw new Error(error.message);

      const generatedId = insertedData?.[0]?.id;
      setReportId(generatedId);

      // Email
      try {
        await sendEmailNotification(
          contact,
          "Pending",
          generatedId,
          name || "Warga",
          category,
          address
        );
      } catch (e) {
        console.error("Email gagal:", e);
      }

      setSubmitted(true);
    } catch (err: any) {
      alert(err.message);
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
            Laporan Anda akan diproses dalam 1×24 jam.
          </p>
          <span style={s.successBadge}>
            ID: <strong>{reportId}</strong>
          </span>

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
        <h1 style={s.pageTitle}>
          Laporkan <span style={s.titleGreen}>Sampah</span>
        </h1>
      </div>

      {/* RESPONSIVE CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">

        {/* FORM */}
        <form onSubmit={handleSubmit} style={s.card} className="flex-1">

          {/* Kategori */}
          <div style={s.section}>
            <div style={s.catGrid}>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  style={{
                    ...s.catBtn,
                    ...(category === cat.value && {
                      borderColor: cat.color,
                      backgroundColor: `${cat.color}12`,
                      color: cat.color,
                    }),
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Deskripsi */}
          <div style={s.section}>
            <textarea
              style={s.textarea}
              placeholder="Deskripsi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Foto */}
          <div style={s.section}>
            <input
              type="file"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
          </div>

          {/* Lokasi */}
          <div style={s.section}>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                style={s.input}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <button type="button" onClick={handleLocation} style={s.gpsBtn}>
                📍 GPS
              </button>
            </div>
          </div>

          {/* Kontak */}
          <div style={s.section}>
            <input
              style={s.input}
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              style={s.input}
              placeholder="Email"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>

          <div style={s.submitBar}>
            <button type="submit" style={s.submitBtn} disabled={loading}>
              {loading ? "Mengirim..." : "Kirim"}
            </button>
          </div>
        </form>

        {/* SIDEBAR */}
        <div className="w-full lg:w-[280px]">
          <div style={s.sideCard}>
            <b>Tips:</b>
            <ul>
              <li>Tambahkan foto</li>
              <li>Gunakan lokasi akurat</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
