import Link from 'next/link';
import Section from '@/components/Section';

const IconifyIcon = 'iconify-icon' as any;

export default function Services() {
  return (
    <>
      {/* Hero Section */}
      <section className="banner bg-light py-5">
        <div className="container text-center py-5">
          <h1 className="fw-bold mb-3">Layanan <span className="pantau">Pantau</span><span className="sampah">Sampah</span></h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Solusi cerdas untuk pengelolaan sampah yang lebih transparan, efisien, dan ramah lingkungan untuk masyarakat modern.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section id="Layanan" className="py-5 bg-white">
        <div className="container text-center">
          <div className="row justify-content-center g-4">
            {/* Card 1 */}
            <div className="col-md-5">
              <div className="card layanan-card h-100 p-4 border-0 shadow-sm transition-hover rounded-4">
                <div className="flex justify-center mb-4">
                  <IconifyIcon icon="material-symbols:calendar-month" width="40" height="40" className="bg-success bg-opacity-10 text-success" style={{ padding: "10px", borderRadius: "50px" }}></IconifyIcon>
                </div>
                <h4 className="fw-bold mb-3">Cek Jadwal</h4>
                <p className="text-muted mb-4">
                  Pantau jadwal kedatangan petugas kebersihan di lokasi Anda secara real-time. Jangan biarkan sampah menumpuk karena telat mengeluarkan sampah.
                </p>
                <Link href="#" className="btn btn-success mt-auto py-2 fw-semibold rounded-pill">
                  Cek Sekarang
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-md-5">
              <div className="card layanan-card h-100 p-4 border-0 shadow-sm transition-hover rounded-4">
                <div className="mb-4 bg-success bg-opacity-10 d-inline-flex p-3 rounded-circle text-success">
                  <IconifyIcon icon="material-symbols:flag-2-rounded" width="40" height="40"></IconifyIcon>
                </div>
                <h4 className="fw-bold mb-3">Lapor Masalah</h4>
                <p className="text-muted mb-4">
                  Ada kendala dalam pengangkutan? Laporkan langsung melalui platform kami. Laporan Anda akan diteruskan secara instan ke pihak terkait.
                </p>
                <div className="d-flex flex-column gap-2 mt-auto">
                  <Link href="/lapor" className="btn btn-outline-success py-2 fw-semibold rounded-pill">
                    Kirim Laporan
                  </Link>
                  <Link href="/status" className="btn btn-outline-success py-2 fw-semibold rounded-pill">
                    🔍 Cek Status Laporan
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="row justify-content-center mt-5 pt-4">
            <div className="col-md-10 text-center">
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <span className="badge bg-light text-success border border-success border-opacity-25 px-3 py-2 fs-6 rounded-pill fw-medium">
                  ✨ Mudah digunakan
                </span>
                <span className="badge bg-light text-success border border-success border-opacity-25 px-3 py-2 fs-6 rounded-pill fw-medium">
                  🚛 Terintegrasi DLH
                </span>
                <span className="badge bg-light text-success border border-success border-opacity-25 px-3 py-2 fs-6 rounded-pill fw-medium">
                  🔔 Notifikasi Real-time
                </span>
                <span className="badge bg-light text-success border border-success border-opacity-25 px-3 py-2 fs-6 rounded-pill fw-medium">
                  📊 Monitoring Akurat
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container">
          <div className="bg-success text-white p-5 rounded-5 text-center shadow-lg" style={{ background: 'linear-gradient(135deg, #2e7d32, #43a047)' }}>
            <h2 className="fw-bold mb-3">Mulai Kelola Sampah Sekarang</h2>
            <p className="mb-4 opacity-75">Daftarkan akun Anda dan nikmati seluruh kemudahan layanan PantauSampah di tangan Anda.</p>
            <Link href="/about" className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold text-success shadow-sm">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
