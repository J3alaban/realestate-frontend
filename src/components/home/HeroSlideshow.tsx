"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    title: "Hayalinizdeki Evi VistaHome ile Bulun",
    description: "Satılık ve kiralık en seçkin emlak ilanlarını kolayca inceleyin.",
  },
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    title: "Modern ve Konforlu Yaşam Alanları",
    description: "Kriterlerinize en uygun, bütçe dostu seçenekler burada.",
  },
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    title: "Kendi İlanınızı Saniyeler İçinde Ekleyin",
    description: "Evinizi veya iş yerinizi milyonlarca alıcıyla buluşturun.",
  },
];

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="relative h-[600px] md:h-[680px] w-full overflow-hidden bg-slate-950">
      {/* Slaytlar */}
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
        >
          {/* Arka Plan Görseli */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] scale-110 motion-safe:group-hover:scale-100"
            style={{ backgroundImage: `url(${slide.image})` }}
          />

          {/* Gradyan Karartma Katmanı (Hem alt tarafa hem üste yumuşak geçişli) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/30" />

          {/* İçerik */}
          <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="max-w-4xl space-y-6">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
                {slide.title}
              </h1>

              <p className="mx-auto max-w-2xl text-base sm:text-xl text-slate-200/90 drop-shadow">
                {slide.description}
              </p>

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <Link
                  href="/products"
                  className="rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:bg-blue-700 hover:scale-[1.03] active:scale-100"
                >
                  İlanları İncele
                </Link>
                <Link
                  href="/user-products"
                  className="rounded-xl border border-white/30 bg-white/10 backdrop-blur-md px-7 py-3.5 font-bold text-white transition-all duration-200 hover:bg-white hover:text-slate-900 hover:scale-[1.03] active:scale-100"
                >
                  Ücretsiz İlan Ekle
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigasyon Okları (Glassmorphic) */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-2.5 text-white hover:bg-white/20 transition-all active:scale-95 hidden sm:block"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-2.5 text-white hover:bg-white/20 transition-all active:scale-95 hidden sm:block"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Slayt Noktaları (Modern İndikatörler) */}
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2.5">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-blue-500 w-8" : "bg-white/40 w-2.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
}