"use client";

import { useState } from "react";
import Link from "next/link";
import Login from "@/components/login/login";

export default function Footer() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <footer className="relative bg-slate-950 text-slate-400 border-t border-slate-900 overflow-hidden">
      {/* Tasarımdaki derinlik veren arka plan neon ışık süzmeleri */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 sm:px-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-slate-900">

          {/* 1. Kısım: Logo ve Açıklama */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                VistaHome
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Yapay zeka destekli altyapımızla hayalinizdeki evi bulun ya da portföyünüzü saniyeler içinde tüm dünyaya ilan edin.
            </p>
          </div>

          {/* 2. Kısım: Hızlı Linkler */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Hızlı Erişim
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products" className="hover:text-violet-400 transition-colors">
                  Tüm İlanlar
                </Link>
              </li>
              <li>
                <Link href="/user-products" className="hover:text-violet-400 transition-colors">
                  İlan Oluştur
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(true)}
                  className="hover:text-violet-400 transition-colors text-left"
                >
                  Giriş Yap
                </button>
                <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
              </li>
              <li>
                <Link href="/register" className="hover:text-violet-400 transition-colors">
                  Yeni Hesap Aç
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Kısım: İletişim ve Sosyal Medya (Saf SVG İkonlar) */}
          <div className="md:col-span-4 space-y-5">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Bizimle İletişime Geçin
            </h3>

            {/* Sosyal Medya İkonları */}
            <div className="flex items-center gap-3">
              {/* WhatsApp */}
              <a
                href="https://wa.me/905000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/vistahome"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-500 hover:border-pink-500/30 transition-all hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/vistahome"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>
            </div>

            {/* Ofis Konumu Bilgisi */}
            <div className="pt-2">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-900 hover:border-slate-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-500 shrink-0 group-hover:translate-y-[-2px] transition-transform">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div className="text-xs space-y-1">
                  <p className="font-medium text-slate-300">Merkez Ofis</p>
                  <p className="text-slate-400 leading-relaxed">
                    Levent Mah. Büyükdere Cad. No:123, Şişli / İstanbul
                  </p>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Alt Bilgi / Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs gap-4">
          <p>© 2026 VistaHome Emlak Teknolojileri. Tüm Hakları Saklıdır.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Kullanım Koşulları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}