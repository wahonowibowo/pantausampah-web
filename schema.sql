-- =============================================
-- Jalankan script ini di SQL Editor Supabase Anda
-- =============================================

-- 1. Buat tabel pengguna
CREATE TABLE IF NOT EXISTS pengguna (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  no_hp TEXT,
  alamat_lengkap TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'petugas', 'user')),
  foto_profil TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Buat tabel langganan
CREATE TABLE IF NOT EXISTS langganan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES pengguna(id) ON DELETE CASCADE,
  nama_lengkap TEXT NOT NULL,
  tempat_tanggal_lahir TEXT NOT NULL,
  nik TEXT NOT NULL,
  alamat_lengkap TEXT NOT NULL,
  email TEXT NOT NULL,
  no_hp TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'aktif', 'ditolak')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. RLS POLICIES (PENTING! Tanpa ini query akan kosong)
-- =============================================

-- Aktifkan RLS
ALTER TABLE pengguna ENABLE ROW LEVEL SECURITY;
ALTER TABLE langganan ENABLE ROW LEVEL SECURITY;

-- Policy: Izinkan semua operasi pada tabel pengguna untuk anon/authenticated
CREATE POLICY "Allow full access to pengguna" ON pengguna
  FOR ALL USING (true) WITH CHECK (true);

-- Policy: Izinkan semua operasi pada tabel langganan untuk anon/authenticated  
CREATE POLICY "Allow full access to langganan" ON langganan
  FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 4. Insert Dummy Users
-- =============================================

-- Admin (email: admin@pantausampah.com, password: admin123)
INSERT INTO pengguna (nama, email, password, role)
VALUES ('Super Admin', 'admin@pantausampah.com', 'admin123', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Petugas Lapangan (email: petugas@pantausampah.com, password: petugas123)
INSERT INTO pengguna (nama, email, password, role)
VALUES ('Petugas A', 'petugas@pantausampah.com', 'petugas123', 'petugas')
ON CONFLICT (email) DO NOTHING;