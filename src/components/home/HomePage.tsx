"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, MapPin, Sparkles } from "lucide-react";

import HeroSlideshow from "@/components/home/HeroSlideshow";
import Features from "@/components/home/Features";

import { getAllProducts } from "@/services/productService";
import { Product } from "@/types/product";
import { getImageUrl } from "@/utils/image";

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProducts(0, 8);
                setProducts(response.content ?? []);
            } catch (error) {
                console.error("İlanlar yüklenemedi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
            {/* Hero */}
            <HeroSlideshow />

            <main className="space-y-24 pb-24">
                {/* Özellikler */}
                <Features />

                {/* Öne Çıkan İlanlar */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-400/20">
                                <Sparkles size={12} className="animate-pulse" />
                                Öne Çıkan Fırsatlar
                            </span>

                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                Son Eklenen İlanlar
                            </h2>

                            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
                                Sizin için özenle seçilmiş en güncel ve popüler ilanları keşfedin.
                            </p>
                        </div>

                        <Link
                            href="/products"
                            className="group hidden items-center gap-1.5 font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 md:flex"
                        >
                            Tümünü Gör
                            <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium text-slate-500">İlanlar yükleniyor...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.id}`}
                                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-200 hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900/50 dark:hover:border-slate-700"
                                    >
                                        {/* Görsel Alanı */}
                                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            <img
                                                src={getImageUrl(product.thumbnail || product.images?.[0])}
                                                alt={product.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {/* Karartma Gradinet */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                            {/* Kategori Etiketi */}
                                            <div className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-sm dark:bg-slate-950/95 dark:text-white">
                                                {product.categoryName}
                                            </div>
                                        </div>

                                        {/* İçerik Alanı */}
                                        <div className="flex flex-1 flex-col p-5">
                                            {/* Fiyat */}
                                            <p className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-black text-transparent dark:from-blue-400 dark:to-indigo-400">
                                                {product.price?.toLocaleString("tr-TR")} ₺
                                            </p>

                                            {/* Başlık */}
                                            <h3 className="mt-2.5 line-clamp-1 text-base font-bold text-slate-800 transition-colors duration-200 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                                                {product.title}
                                            </h3>

                                            {/* Açıklama */}
                                            <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                                {product.description}
                                            </p>

                                            {/* Divider */}
                                            <div className="my-4 border-t border-slate-100 dark:border-slate-800" />

                                            {/* Konum */}
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                                                <MapPin size={14} className="text-slate-400 dark:text-slate-500" />
                                                <span className="truncate">
                                                    {product.subCategoryName ?? product.categoryName}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Mobil için Buton */}
                            <div className="mt-12 text-center md:hidden">
                                <Link
                                    href="/products"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 active:scale-[0.98]"
                                >
                                    Tüm İlanları Gör
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </>
                    )}
                </section>

                {/* Modern CTA (Bento Box Tarzı) */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 shadow-2xl dark:bg-slate-900/80 dark:ring-1 dark:ring-white/10 sm:px-16 md:py-20 lg:flex lg:items-center lg:justify-between lg:px-24">
                        {/* Arka Plan Efektleri */}
                        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />
                        <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

                        <div className="relative z-10 lg:w-0 lg:flex-1">
                            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                Kendi Evinizi Listelemeye Hazır mısınız?
                            </h2>
                            <p className="mt-4 max-w-xl text-lg text-slate-300">
                                Hemen ücretsiz üye olun, dakikalar içinde ilanınızı oluşturarak milyonlarca alıcı ve kiracıyla buluşun.
                            </p>
                        </div>

                        <div className="relative z-10 mt-10 flex flex-wrap gap-4 sm:flex-nowrap lg:mt-0 lg:ml-8">
                            <Link
                                href="/register"
                                className="flex w-full items-center justify-center rounded-xl bg-white px-6 py-4 text-center font-semibold text-slate-900 shadow-md transition-all duration-200 hover:scale-[1.02] hover:bg-slate-50 active:scale-100 sm:w-auto"
                            >
                                Hemen Kayıt Ol
                            </Link>

                            <Link
                                href="/products"
                                className="flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-center font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 active:scale-100 sm:w-auto"
                            >
                                İlanları Keşfet
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}