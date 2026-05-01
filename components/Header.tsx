"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Otomatis menutup menu hamburger saat halaman di-scroll secara disengaja
  useEffect(() => {
    if (!isOpen) return; // Hanya jalankan listener jika menu sedang terbuka

    const initialScrollY = window.scrollY;

    const handleScroll = () => {
      // Hanya tutup jika user benar-benar men-scroll lebih dari 20px
      if (Math.abs(window.scrollY - initialScrollY) > 20) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  // Fungsi untuk menutup menu saat link diklik
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky-top bg-white z-50">
      <nav className="navbar navbar-expand-lg shadow-sm bg-white">
        <div className="container">
          <Link className="navbar-brand" href="/" onClick={closeMenu}>
            <img 
              src="/assets/img/logo.png" 
              alt="Logo" 
              width="70" 
              height="60" 
              className="d-inline-block align-text-center" 
            />
            <span className="pantau">Pantau</span><span className="sampah">Sampah</span>
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen} 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNavAltMarkup">
            <div className="navbar-nav ms-auto">
              <Link className="nav-link" href="/" onClick={closeMenu}>Beranda</Link>
              <Link className="nav-link" href="/about" onClick={closeMenu}>Tentang Kami</Link>
              <Link className="nav-link" href="/services" onClick={closeMenu}>Layanan</Link>
              <Link className="nav-link" href="/blog" onClick={closeMenu}>Berita</Link>
              <Link className="nav-link" href="/contact" onClick={closeMenu}>Kontak Kami</Link>
              <Link className="nav-link" href="/login" onClick={closeMenu} style={{ color: "#16a34a", fontWeight: "bold" }}>Login</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
