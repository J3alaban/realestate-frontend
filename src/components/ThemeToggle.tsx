"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Next.js hydration eşleşmesi için mounted kontrolü şarttır
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-xl bg-slate-900/40 border border-slate-800/50" />; // Yüklenirken boş alan tutucu
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-10 h-10 rounded-xl bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-100 border border-slate-800/50 dark:border-slate-800/50 light:border-slate-200 flex items-center justify-center text-slate-400 hover:text-violet-500 hover:border-violet-500/50 dark:hover:text-violet-400 dark:hover:border-violet-500/30 transition-all duration-300 active:scale-95"
      aria-label="Temayı Değiştir"
    >
      {/* İkonlar arası tatlı bir dönüş animasyonu */}
      <div className="relative w-5 h-5">
        <Sun className="absolute inset-0 h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute inset-0 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-violet-400" />
      </div>
    </button>
  );
}