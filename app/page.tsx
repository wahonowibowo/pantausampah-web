import Link from 'next/link';
import { getArticles } from '@/lib/api';
import SearchArticles from '@/components/SearchArticles';

export const dynamic = 'force-dynamic';

const IconifyIcon = 'iconify-icon' as any;

export default async function Home() {
  let articles: any[] = [];
  try {
    articles = await getArticles();
  } catch (e) {
    console.error('[Home] Failed to fetch articles:', e);
    articles = [];
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section id="Beranda" className="banner">
        <div className="container">
          <h1>
            <span className="pantau">Pantau</span><span className="sampah">Sampah</span>
          </h1>
          <h2>di daerahmu!</h2>

          <div className="slogan">
            <span>Pantau</span>
            <span className="dot"></span>
            <span>Kelola</span>
            <span className="dot"></span>
            <span>Jaga Bumi</span>
          </div>

          <div className="banner-card">
            <p className="text-center mb-4">
              Mari ikut jaga bumi dengan pantau &amp; kelola sampah <br />
              di daerahmu di <b>PantauSampah</b>
            </p>
            <div className="row text-center">
              <div className="col">
                <div className="stat-box">
                  <IconifyIcon icon="material-symbols:person" width="30"></IconifyIcon>
                  <h5>7896</h5>
                  <p>Bergabung</p>
                </div>
              </div>
              <div className="col">
                <div className="stat-box">
                  <IconifyIcon icon="material-symbols:person" width="30"></IconifyIcon>
                  <h5>3876</h5>
                  <p>Berlangganan DLH</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Sign Up ──────────────────────────────────────── */}
      <section id="DaftarAkun" className="daftar-akun py-5">
        <div className="container d-flex justify-content-center">
          <div className="cta-dlh shadow-sm p-5">
            <div className="row align-items-center">
              <div className="col-md-5 text-center mb-4 mb-md-0">
                <img
                  src="/assets/img/SignUp.png"
                  alt="Ilustrasi Pantau Sampah"
                  className="img-fluid img-dlh"
                />
              </div>
              <div className="col-md-7">
                <h2 className="fw-bold mb-3">Kelola Sampah Lebih Mudah &amp; Praktis</h2>
                <p className="mb-4 text-muted">
                  Daftar sekarang untuk menikmati layanan pengangkutan resmi DLH,
                  pembayaran iuran yang praktis, serta notifikasi jadwal secara real-time.
                </p>
                <div className="fitur-highlight mb-4">
                  <span>🚛 DLH Resmi</span>
                  <span>💳 Bayar Iuran</span>
                  <span>🔔 Notifikasi</span>
                </div>
                <Link href="/about" className="btn btn-success px-4 me-2">Daftar</Link>
                <Link href="#" className="btn btn-outline-success px-4">Masuk</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── News with Search (Client Component) ─────────────── */}
      <section id="Berita" className="berita py-5">
        <div className="container">
          <h2 className="fw-bold mb-2">Edukasi &amp; Berita Lingkungan</h2>
          <p className="text-muted mb-5">
            Temukan informasi terbaru seputar pengelolaan sampah dan keberlanjutan.
          </p>
          <SearchArticles initialArticles={articles} />
        </div>
      </section>
    </>
  );
}
