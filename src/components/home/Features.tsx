"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Search } from "lucide-react";

const FEATURE_ITEMS = [
  {
    code: "SYS-01",
    icon: <Zap className="h-5 w-5 text-amber-500" />,
    accentClass: "border-amber-500/30 text-amber-500 bg-amber-500/5",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    title: "Hızlı & Kolay İlan Yönetimi",
    description: "Saniyeler içinde ilanınızı hazırlayın, fotoğrafları yükleyin ve yayına alın. Gecikme süresi sıfıra indirgendi.",
  },
  {
    code: "SYS-02",
    icon: <Search className="h-5 w-5 text-cyan-400" />,
    accentClass: "border-cyan-500/30 text-cyan-400 bg-cyan-500/5",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]",
    title: "Gelişmiş Arama",
    description: "Kriterlerinize en uygun evi gelişmiş filtreleme ve akıllı tarama algoritmalarıyla saniyeler içinde bulun.",
  },
  {
    code: "SYS-03",
    icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
    accentClass: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]",
    title: "Güvenli Platform",
    description: "Doğrulanmış kullanıcı profilleri ve uçtan uca şifrelenmiş altyapımızla veri bütünlüğünü ve güvenliği koruyun.",
  },
];

export default function Features() {
  return (
    <section className="relative bg-[#0b0f17] text-slate-100 px-4 py-24 sm:px-6 lg:px-8 overflow-hidden font-sans">

      {/* Endüstriyel Grid (Izgara) Arka Plan Deseni */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141b2b_1px,transparent_1px),linear-gradient(to_bottom,#141b2b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl z-10">

        {/* Başlık Bölümü (Teknik Göstergelerle) */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-950/80 text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />

          </div>

          <h2 className="text-3xl font-black tracking-tight sm:text-5xl uppercase font-mono text-white">
            Neden <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">VistaHome</span>?
          </h2>

          <p className="mt-4 text-base font-mono text-slate-500 max-w-xl mx-auto uppercase">
             Emlak süreçlerinizi modernize eden endüstriyel standartta altyapı çözümleri.
          </p>
        </div>

        {/* Endüstriyel Kart Grid Yapısı */}
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURE_ITEMS.map((feature, index) => (
            <motion.div
              key={feature.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`group relative flex flex-col justify-between p-8 rounded-lg border border-slate-800 bg-[#0d1321]/90 backdrop-blur-md transition-all duration-300 hover:border-slate-700 hover:-translate-y-1 ${feature.glowClass}`}
            >
              {/* Kart Köşelerindeki Endüstriyel Çizgiler (Corner Brackets) */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-slate-700 pointer-events-none group-hover:border-slate-500 transition-colors" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-slate-700 pointer-events-none group-hover:border-slate-500 transition-colors" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-slate-700 pointer-events-none group-hover:border-slate-500 transition-colors" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-slate-700 pointer-events-none group-hover:border-slate-500 transition-colors" />

              <div>
                {/* Kod ve İkon Başlığı */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs font-bold text-slate-600 group-hover:text-slate-400 tracking-widest transition-colors">
                    [{feature.code}]
                  </span>

                  <div className={`p-3 rounded border ${feature.accentClass}`}>
                    {feature.icon}
                  </div>
                </div>

                {/* Başlık */}
                <h3 className="text-lg font-bold font-mono tracking-wide uppercase text-slate-200 group-hover:text-white transition-colors mb-3">
                  {feature.title}
                </h3>

                {/* Açıklama */}
                <p className="text-sm text-slate-400 font-sans leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Teknik Durum Çubuğu (Kartın Altındaki İnce Detay) */}
              <div className="mt-8 pt-4 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-600">
                <span>STATUS: OPERATIONAL</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}