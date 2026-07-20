"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import Login from "@/components/login/Login";
import { searchService } from "@/services/searchService";
import type { Product } from "@/types/product";

const Navbar = () => {
    const router = useRouter();

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const [query, setQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        setIsLoggedIn(!!token);
        setIsAdmin(role?.toUpperCase() === "ADMIN");
    }, [isLoginOpen]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeSearchModal();
            }
        };

        if (isSearchOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isSearchOpen]);

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

    const handleSearch = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const searchQuery = query.trim();

        if (!searchQuery) {
            setProducts([]);
            setSearchError("");
            return;
        }

        try {
            setSearchLoading(true);
            setSearchError("");

            const response = await searchService(searchQuery);
            setProducts(response.content);
        } catch (error) {
            console.error("Arama hatası:", error);
            setProducts([]);
            setSearchError("Arama sırasında bir hata oluştu.");
        } finally {
            setSearchLoading(false);
        }
    };

    const closeSearchModal = () => {
        setIsSearchOpen(false);
        setQuery("");
        setProducts([]);
        setSearchError("");
    };

    const handleProductClick = (productId: number) => {
        closeSearchModal();
        router.push(`/products/${productId}`);
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
                        <polyline points="20 6 9 17 4 12" />
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

                        {/* Arama */}
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="İlan ara"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 transition-all duration-200 hover:border-violet-500/50 hover:text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="19"
                                height="19"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </button>

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

            {/* Arama Modalı */}
            {isSearchOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/80 px-4 pt-24 backdrop-blur-sm"
                    onMouseDown={closeSearchModal}
                >
                    <div
                        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/60"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
                            <div>
                                <h2 className="text-lg font-bold text-white">
                                    İlan Ara
                                </h2>
                                <p className="text-sm text-slate-400">
                                    Başlık, şehir veya adres üzerinden arayın.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeSearchModal}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>

                        <form
                            onSubmit={handleSearch}
                            className="flex gap-3 p-6"
                        >
                            <input
                                type="search"
                                autoFocus
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Örneğin: İstanbul, Kadıköy, satılık daire"
                                className="min-w-0 flex-1 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-3.5 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                            />

                            <button
                                type="submit"
                                disabled={searchLoading}
                                className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {searchLoading ? "Aranıyor..." : "Ara"}
                            </button>
                        </form>

                        <div className="max-h-[420px] overflow-y-auto px-6 pb-6">
                            {searchError && (
                                <div className="rounded-2xl border border-rose-900/50 bg-rose-950/20 px-4 py-3 text-sm text-rose-400">
                                    {searchError}
                                </div>
                            )}

                            {!searchLoading &&
                                !searchError &&
                                query.trim() &&
                                products.length === 0 && (
                                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-8 text-center text-sm text-slate-400">
                                        Arama sonucu bulunamadı.
                                    </div>
                                )}

                            <div className="space-y-3">
                                {products.map((product) => (
                                    <button
                                        key={product.id}
                                        type="button"
                                        onClick={() =>
                                            handleProductClick(product.id)
                                        }
                                        className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left transition hover:border-violet-500/50 hover:bg-slate-900"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="truncate font-semibold text-white">
                                                    {product.title}
                                                </h3>

                                                <p className="mt-1 line-clamp-1 text-sm text-slate-400">
                                                    {product.description}
                                                </p>
                                            </div>

                                            {product.price != null && (
                                                <span className="shrink-0 text-sm font-bold text-emerald-400">
                                                    {product.price.toLocaleString(
                                                        "tr-TR"
                                                    )}{" "}
                                                    TL
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Login
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
            />
        </>
    );
};

export default Navbar;