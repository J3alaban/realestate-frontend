"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "@/components/login/Login";

const Navbar = () => {
    const router = useRouter();

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        setIsLoggedIn(!!token);
        setIsAdmin(role?.toUpperCase() === "ADMIN");
    }, [isLoginOpen]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");

        setIsLoggedIn(false);
        setIsAdmin(false);

        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
            router.refresh();
        }, 3000);
    };

    return (
        <>
            {/* Toast */}
            <div
                className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl border border-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/40 transition-all duration-300 transform ${
                    showToast
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4 pointer-events-none"
                }`}
            >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>

                <div className="text-sm font-medium">
                    <p className="text-slate-200">
                        Başarıyla çıkış yapıldı
                    </p>
                    <p className="text-xs text-slate-400 font-normal">
                        Oturumunuz güvenli bir şekilde sonlandırıldı.
                    </p>
                </div>
            </div>

            <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/75 backdrop-blur-xl shadow-2xl shadow-slate-950/20">
                <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">

                    {/* Logo */}
                    <Link
                        href="/"
                        className="group flex items-center gap-2.5 text-2xl font-black tracking-tight text-white transition-all duration-300 hover:opacity-95"
                    >
                        <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                            Vista
                            <span className="font-light text-slate-200 group-hover:text-violet-400 transition-colors">
                                Home
                            </span>
                        </span>

                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                    </Link>

                    <div className="flex items-center gap-6">

                        {/* Menü */}
                        <div className="hidden md:flex items-center gap-3 bg-slate-900/40 p-1.5 rounded-2xl border border-slate-900 backdrop-blur-md">
                            <Link
                                href="/"
                                className="text-sm font-medium px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all duration-200"
                            >
                                Ana Sayfa
                            </Link>

                            <Link
                                href="/categories"
                                className="text-sm font-medium px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all duration-200"
                            >
                                Kategoriler
                            </Link>

                            <Link
                                href="/products"
                                className="text-sm font-medium px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all duration-200"
                            >
                                İlanlar
                            </Link>
                        </div>

                        <span className="hidden md:block h-5 w-px bg-slate-800" />

                        {/* Kullanıcı */}
                        <div className="flex items-center gap-4">
                            {isLoggedIn ? (
                                <div className="flex items-center gap-3">

                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            className="text-sm font-semibold text-emerald-400 bg-emerald-950/10 border border-emerald-900/50 hover:border-emerald-500/50 hover:text-emerald-300 px-4 py-2.5 rounded-xl transition-all duration-200"
                                        >
                                            Admin Paneli
                                        </Link>
                                    )}

                                    <Link
                                        href="/user-account"
                                        className="text-sm font-semibold text-slate-200 bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-xl hover:border-violet-500/50 hover:text-white transition-all duration-200"
                                    >
                                        Hesabım
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="text-sm font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/10 border border-rose-950/50 hover:border-rose-900/60 px-4 py-2.5 rounded-xl transition-all duration-200"
                                    >
                                        Çıkış Yap
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsLoginOpen(true)}
                                    className="text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 px-5 py-2.5 rounded-xl shadow-lg shadow-violet-600/10 hover:opacity-95 active:scale-[0.97] transition-all duration-200"
                                >
                                    Giriş Yap
                                </button>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            <Login
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
            />
        </>
    );
};

export default Navbar;