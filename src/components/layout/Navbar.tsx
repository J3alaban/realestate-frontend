"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import Login from "@/components/login/Login";
import { searchService } from "@/services/searchService";
import type { Product } from "@/types/product";
import { getAllCategories } from "@/services/categoryService";
import { getAllSubCategories } from "@/services/subcategoryService";

import type { Category } from "@/types/category";
import type { SubCategory } from "@/types/subcategory";

const Navbar = () => {
    const router = useRouter();

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMobileCategory, setExpandedMobileCategory] = useState<number | null>(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const [query, setQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [categoryLoading, setCategoryLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        setIsLoggedIn(!!token);
        setIsAdmin(role?.toUpperCase() === "ADMIN");
    }, [isLoginOpen]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoryLoading(true);

                const [categoryData, subCategoryData] =
                    await Promise.all([
                        getAllCategories(),
                        getAllSubCategories(),
                    ]);

                setCategories(categoryData);
                setSubCategories(subCategoryData);
            } catch (error) {
                console.error("Kategoriler alınamadı:", error);
            } finally {
                setCategoryLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeSearchModal();
                setIsMobileMenuOpen(false);
            }
        };

        if (isSearchOpen || isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEscape);
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isSearchOpen, isMobileMenuOpen]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");

        setIsLoggedIn(false);
        setIsAdmin(false);
        setShowToast(true);
        setIsMobileMenuOpen(false);

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
        setIsMobileMenuOpen(false);
        router.push(`/products/${productId}`);
    };

    const toggleMobileCategory = (categoryId: number) => {
        setExpandedMobileCategory((prev) => (prev === categoryId ? null : categoryId));
    };

    return (
        <>
            {/* Toast Notification */}
            <div
                className={`fixed bottom-5 right-5 left-5 sm:left-auto z-[110] flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl border border-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/40 transition-all duration-300 transform ${
                    showToast
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4 pointer-events-none"
                }`}
            >
                <div className="w-6 h-6 shrink-0 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
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
                    <p className="text-slate-200">Başarıyla çıkış yapıldı</p>
                    <p className="text-xs text-slate-400 font-normal">
                        Oturumunuz güvenli bir şekilde sonlandırıldı.
                    </p>
                </div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-xl shadow-2xl shadow-slate-950/20">
                <nav className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-8">
                    {/* Logo */}
                    <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group flex items-center gap-2 text-xl sm:text-2xl font-black tracking-tight text-white transition-all duration-300 hover:opacity-95"
                    >
                        <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                            Vista
                            <span className="font-light text-slate-200 group-hover:text-violet-400 transition-colors">
                                Home
                            </span>
                        </span>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                    </Link>

                    {/* Masaüstü Menü */}
                    <div className="hidden md:flex items-center gap-3 bg-slate-900/40 p-1.5 rounded-2xl border border-slate-900 backdrop-blur-md">
                        <Link
                            href="/"
                            className="text-sm font-medium px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all duration-200"
                        >
                            Ana Sayfa
                        </Link>

                        {/* Mega Dropdown - Masaüstü */}
                        <div className="group relative">
                            <Link
                                href="/categories"
                                className="flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all duration-200"
                            >
                                Kategoriler
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-transform duration-200 group-hover:rotate-180"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </Link>

                            <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                                <div className="w-[600px] rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl shadow-black/60">
                                    {categoryLoading ? (
                                        <p className="text-sm text-slate-400">
                                            Kategoriler yükleniyor...
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-5">
                                            {categories.map((category) => {
                                                const relatedSubCategories =
                                                    subCategories.filter(
                                                        (subCategory) =>
                                                            subCategory.categoryId === category.id
                                                    );

                                                return (
                                                    <div key={category.id}>
                                                        <Link
                                                            href={`/products?categoryId=${category.id}`}
                                                            className="mb-2 block rounded-lg px-2 py-1.5 font-semibold text-white transition hover:bg-slate-900 hover:text-violet-400"
                                                        >
                                                            {category.name}
                                                        </Link>

                                                        <div className="space-y-1">
                                                            {relatedSubCategories.map(
                                                                (subCategory) => (
                                                                    <Link
                                                                        key={subCategory.id}
                                                                        href={`/products?categoryId=${category.id}&subCategoryId=${subCategory.id}`}
                                                                        className="block rounded-lg px-2 py-1.5 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-emerald-400"
                                                                    >
                                                                        {subCategory.name}
                                                                    </Link>
                                                                )
                                                            )}

                                                            {relatedSubCategories.length === 0 && (
                                                                <span className="block px-2 text-xs text-slate-600">
                                                                    Alt kategori bulunmuyor
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/products"
                            className="text-sm font-medium px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all duration-200"
                        >
                            İlanlar
                        </Link>
                    </div>

                    {/* Sağ Taraf: Arama, Giriş/Profil & Mobil Hamburger */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Arama Butonu */}
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="İlan ara"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 transition-all duration-200 hover:border-violet-500/50 hover:text-white active:scale-95"
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

                        {/* Masaüstü Kullanıcı Alanı */}
                        <div className="hidden md:flex items-center gap-3">
                            {isLoggedIn ? (
                                <>
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
                                </>
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

                        {/* Mobil Hamburger Menü Tetikleyici */}
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                            aria-label="Mobil Menüyü Aç/Kapat"
                            className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 transition-all duration-200 hover:text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {isMobileMenuOpen ? (
                                    <>
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </>
                                ) : (
                                    <>
                                        <line x1="4" x2="20" y1="12" y2="12" />
                                        <line x1="4" x2="20" y1="6" y2="6" />
                                        <line x1="4" x2="20" y1="18" y2="18" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobil Yan Menü (Drawer / Off-Canvas) */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[90] flex md:hidden">
                    {/* Arka Plan Karartması */}
                    <div
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Menü Paneli */}
                    <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto border-l border-slate-800 bg-slate-950 p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                            <span className="text-lg font-bold text-white">Menü</span>
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 text-slate-400 hover:text-white"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
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

                        {/* Mobil Navigasyon Linkleri */}
                        <div className="flex flex-col gap-2 py-6">
                            <Link
                                href="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center rounded-xl px-4 py-3 text-base font-medium text-slate-200 transition hover:bg-slate-900 hover:text-white"
                            >
                                Ana Sayfa
                            </Link>

                            <Link
                                href="/products"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center rounded-xl px-4 py-3 text-base font-medium text-slate-200 transition hover:bg-slate-900 hover:text-white"
                            >
                                İlanlar
                            </Link>

                            {/* Mobil Akordeon Kategoriler */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-slate-200 transition hover:bg-slate-900">
                                    <Link
                                        href="/categories"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="hover:text-white"
                                    >
                                        Kategoriler
                                    </Link>
                                </div>

                                <div className="ml-2 border-l border-slate-800 pl-3 space-y-1">
                                    {categoryLoading ? (
                                        <p className="px-3 py-2 text-xs text-slate-500">
                                            Yükleniyor...
                                        </p>
                                    ) : (
                                        categories.map((category) => {
                                            const relatedSubCategories = subCategories.filter(
                                                (sub) => sub.categoryId === category.id
                                            );
                                            const isExpanded = expandedMobileCategory === category.id;

                                            return (
                                                <div key={category.id} className="space-y-1">
                                                    <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-900">
                                                        <Link
                                                            href={`/products?categoryId=${category.id}`}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="hover:text-violet-400 font-medium"
                                                        >
                                                            {category.name}
                                                        </Link>

                                                        {relatedSubCategories.length > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleMobileCategory(category.id)}
                                                                className="p-1 text-slate-500 hover:text-white"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="14"
                                                                    height="14"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className={`transition-transform duration-200 ${
                                                                        isExpanded ? "rotate-180" : ""
                                                                    }`}
                                                                >
                                                                    <path d="m6 9 6 6 6-6" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Alt Kategoriler */}
                                                    {isExpanded && relatedSubCategories.length > 0 && (
                                                        <div className="ml-3 border-l border-slate-800/80 pl-2 space-y-1">
                                                            {relatedSubCategories.map((subCategory) => (
                                                                <Link
                                                                    key={subCategory.id}
                                                                    href={`/products?categoryId=${category.id}&subCategoryId=${subCategory.id}`}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className="block rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-900 hover:text-emerald-400"
                                                                >
                                                                    {subCategory.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobil Kullanıcı Aksiyonları */}
                        <div className="mt-auto border-t border-slate-800 pt-6 space-y-3">
                            {isLoggedIn ? (
                                <>
                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block w-full text-center text-sm font-semibold text-emerald-400 bg-emerald-950/20 border border-emerald-900/50 py-3 rounded-xl"
                                        >
                                            Admin Paneli
                                        </Link>
                                    )}

                                    <Link
                                        href="/user-account"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full text-center text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-800 py-3 rounded-xl"
                                    >
                                        Hesabım
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full text-center text-sm font-semibold text-rose-400 bg-rose-950/20 border border-rose-950/50 py-3 rounded-xl"
                                    >
                                        Çıkış Yap
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsLoginOpen(true);
                                    }}
                                    className="w-full text-center text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 py-3 rounded-xl shadow-lg"
                                >
                                    Giriş Yap
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Arama Modalı */}
            {isSearchOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/80 px-4 pt-16 sm:pt-24 backdrop-blur-sm"
                    onMouseDown={closeSearchModal}
                >
                    <div
                        className="w-full max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/60"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4 sm:px-6 sm:py-5">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-white">İlan Ara</h2>
                                <p className="text-xs sm:text-sm text-slate-400">
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
                                    width="18"
                                    height="18"
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

                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 p-4 sm:p-6">
                            <input
                                type="search"
                                autoFocus
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Örn: İstanbul, Kadıköy, satılık daire"
                                className="min-w-0 flex-1 rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 sm:px-5 sm:py-3.5 text-sm sm:text-base text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                            />

                            <button
                                type="submit"
                                disabled={searchLoading}
                                className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {searchLoading ? "Aranıyor..." : "Ara"}
                            </button>
                        </form>

                        <div className="max-h-[60vh] sm:max-h-[420px] overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6">
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

                            <div className="space-y-2.5 sm:space-y-3">
                                {products.map((product) => (
                                    <button
                                        key={product.id}
                                        type="button"
                                        onClick={() => handleProductClick(product.id)}
                                        className="w-full rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 sm:p-4 text-left transition hover:border-violet-500/50 hover:bg-slate-900"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                                            <div className="min-w-0">
                                                <h3 className="truncate text-sm sm:text-base font-semibold text-white">
                                                    {product.title}
                                                </h3>
                                                <p className="mt-1 line-clamp-1 text-xs sm:text-sm text-slate-400">
                                                    {product.description}
                                                </p>
                                            </div>

                                            {product.price != null && (
                                                <span className="shrink-0 text-xs sm:text-sm font-bold text-emerald-400">
                                                    {product.price.toLocaleString("tr-TR")} TL
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

            <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
};

export default Navbar;