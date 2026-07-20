"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Package } from "lucide-react";

import {
    filterProducts,
    getAllProducts,
} from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import { getAllSubCategories } from "@/services/subCategoryService";

import type {
    Product,
    ProductPage,
} from "@/types/product";
import type { Category } from "@/types/category";
import type { SubCategory } from "@/types/subcategory";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface FilterForm {
    title: string;
    categoryId: string;
    subCategoryId: string;
    propertyType: string;
    roomCount: string;
    address: string;
    floor: string;
    minSquareMeter: string;
    maxSquareMeter: string;
    minPrice: string;
    maxPrice: string;
    sort: string;
}

const initialFilters: FilterForm = {
    title: "",
    categoryId: "",
    subCategoryId: "",
    propertyType: "",
    roomCount: "",
    address: "",
    floor: "",
    minSquareMeter: "",
    maxSquareMeter: "",
    minPrice: "",
    maxPrice: "",
    sort: "id,desc",
};

export default function FilterPage() {
    const router = useRouter();

    const [filters, setFilters] = useState<FilterForm>(initialFilters);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const filteredSubCategories = useMemo(() => {
        if (!filters.categoryId) {
            return [];
        }

        const categoryId = Number(filters.categoryId);

        return subCategories.filter(
            (subCategory) => subCategory.categoryId === categoryId
        );
    }, [filters.categoryId, subCategories]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                setError("");

                const [categoryData, subCategoryData, productData] =
                    await Promise.all([
                        getAllCategories(),
                        getAllSubCategories(),
                        getAllProducts(0, 20),
                    ]);

                setCategories(categoryData);
                setSubCategories(subCategoryData);
                setProducts(productData.content);
                setTotalPages(productData.totalPages);
            } catch (error) {
                console.error(error);
                setError("Veriler alınamadı.");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const fetchFilteredProducts = async (selectedPage: number) => {
        try {
            setLoading(true);
            setError("");

            const response: ProductPage = await filterProducts({
                title: filters.title.trim() || undefined,
                categoryId: filters.categoryId
                    ? Number(filters.categoryId)
                    : undefined,
                subCategoryId: filters.subCategoryId
                    ? Number(filters.subCategoryId)
                    : undefined,
                propertyType: filters.propertyType.trim() || undefined,
                roomCount: filters.roomCount
                    ? Number(filters.roomCount)
                    : undefined,
                address: filters.address.trim() || undefined,
                floor: filters.floor.trim() || undefined,
                minSquareMeter: filters.minSquareMeter
                    ? Number(filters.minSquareMeter)
                    : undefined,
                maxSquareMeter: filters.maxSquareMeter
                    ? Number(filters.maxSquareMeter)
                    : undefined,
                minPrice: filters.minPrice
                    ? Number(filters.minPrice)
                    : undefined,
                maxPrice: filters.maxPrice
                    ? Number(filters.maxPrice)
                    : undefined,
                page: selectedPage,
                size: 20,
                sort: filters.sort,
            });

            setProducts(response.content);
            setTotalPages(response.totalPages);
            setPage(response.number);
        } catch (error) {
            console.error(error);
            setProducts([]);
            setError("Filtreleme sırasında hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await fetchFilteredProducts(0);
    };

    const handleReset = async () => {
        setFilters(initialFilters);
        setPage(0);

        try {
            setLoading(true);
            setError("");

            const response = await getAllProducts(0, 20);

            setProducts(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error(error);
            setError("İlanlar alınamadı.");
        } finally {
            setLoading(false);
        }
    };

    const changeFilter = (field: keyof FilterForm, value: string) => {
        setFilters((current) => ({
            ...current,
            [field]: value,
        }));
    };

    return (
        <section className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 border-b border-slate-800 pb-5">
                    <h1 className="text-3xl font-black">İlanlar & Filtreleme</h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Fiyat, adres, kategori ve emlak özelliklerine göre detaylı arama yapın.
                    </p>
                </div>

                {/* Main Content Layout: Sidebar + Product Grid */}
                <div className="flex flex-col gap-8 lg:flex-row items-start">
                    {/* Sol Taraf: Filtreleme Paneli */}
                    <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-6">
                        <form
                            onSubmit={handleSubmit}
                            className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5 space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <h2 className="font-bold text-lg">Filtrele</h2>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="text-xs text-slate-400 hover:text-slate-200 underline"
                                >
                                    Temizle
                                </button>
                            </div>

                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={filters.title}
                                    onChange={(e) => changeFilter("title", e.target.value)}
                                    placeholder="İlan başlığı"
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                                />

                                <input
                                    type="text"
                                    value={filters.address}
                                    onChange={(e) => changeFilter("address", e.target.value)}
                                    placeholder="Adres"
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                                />

                                <select
                                    value={filters.categoryId}
                                    onChange={(event) => {
                                        setFilters((current) => ({
                                            ...current,
                                            categoryId: event.target.value,
                                            subCategoryId: "",
                                        }));
                                    }}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                                >
                                    <option value="">Tüm kategoriler</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.subCategoryId}
                                    disabled={!filters.categoryId}
                                    onChange={(e) => changeFilter("subCategoryId", e.target.value)}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm outline-none disabled:opacity-50 focus:border-violet-500"
                                >
                                    <option value="">Tüm alt kategoriler</option>
                                    {filteredSubCategories.map((subCategory) => (
                                        <option key={subCategory.id} value={subCategory.id}>
                                            {subCategory.name}
                                        </option>
                                    ))}
                                </select>

                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        value={filters.propertyType}
                                        onChange={(e) => changeFilter("propertyType", e.target.value)}
                                        placeholder="Emlak tipi"
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-violet-500"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        value={filters.roomCount}
                                        onChange={(e) => changeFilter("roomCount", e.target.value)}
                                        placeholder="Oda sayısı"
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-violet-500"
                                    />
                                </div>

                                <input
                                    type="text"
                                    value={filters.floor}
                                    onChange={(e) => changeFilter("floor", e.target.value)}
                                    placeholder="Kat bilgisi"
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                                />

                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={filters.minPrice}
                                        onChange={(e) => changeFilter("minPrice", e.target.value)}
                                        placeholder="Min Fiyat"
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-violet-500"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        value={filters.maxPrice}
                                        onChange={(e) => changeFilter("maxPrice", e.target.value)}
                                        placeholder="Maks Fiyat"
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-violet-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={filters.minSquareMeter}
                                        onChange={(e) => changeFilter("minSquareMeter", e.target.value)}
                                        placeholder="Min m²"
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-violet-500"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        value={filters.maxSquareMeter}
                                        onChange={(e) => changeFilter("maxSquareMeter", e.target.value)}
                                        placeholder="Maks m²"
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-violet-500"
                                    />
                                </div>

                                <select
                                    value={filters.sort}
                                    onChange={(e) => changeFilter("sort", e.target.value)}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                                >
                                    <option value="id,desc">En yeni ilanlar</option>
                                    <option value="price,asc">Fiyat: düşükten yükseğe</option>
                                    <option value="price,desc">Fiyat: yüksekten düşüğe</option>
                                    <option value="weight,desc">Metrekare: büyükten küçüğe</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition"
                            >
                                {loading ? "Filtreleniyor..." : "Uygula"}
                            </button>
                        </form>
                    </aside>

                    {/* Sağ Taraf: Ürün/İlan Listesi */}
                    <main className="flex-1 w-full">
                        {error && (
                            <div className="mb-6 rounded-2xl border border-rose-900/50 bg-rose-950/20 px-5 py-4 text-rose-400 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {loading && products.length === 0 ? (
                            <div className="min-h-[400px] flex items-center justify-center">
                                <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
                            </div>
                        ) : !loading && products.length === 0 ? (
                            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 py-16 text-center text-slate-400">
                                Filtrelere uygun ilan bulunamadı.
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                {products.map((product) => {
                                    const imagePath =
                                        product.thumbnail || product.images?.[0];

                                    const imageUrl = imagePath
                                        ? imagePath.startsWith("http")
                                            ? imagePath
                                            : `${API_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`
                                        : null;

                                    return (
                                        <button
                                            key={product.id}
                                            type="button"
                                            onClick={() => router.push(`/products/${product.id}`)}
                                            className="group flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 text-left transition hover:-translate-y-1 hover:border-violet-500/50"
                                        >
                                            {/* Görsel Alanı */}
                                            <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={product.title}
                                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Package className="h-10 w-10 text-slate-600" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* İçerik Alanı */}
                                            <div className="flex flex-1 flex-col p-5">
                                                <div className="mb-2 flex items-start justify-between gap-2">
                                                    <h2 className="line-clamp-1 font-bold text-white text-base group-hover:text-violet-400 transition">
                                                        {product.title}
                                                    </h2>
                                                    {product.price !== null && (
                                                        <span className="shrink-0 font-bold text-emerald-400 text-sm">
                                                            {product.price.toLocaleString("tr-TR")} TL
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-xs text-violet-400 font-medium mb-2">
                                                    {product.categoryName}
                                                    {product.subCategoryName && ` / ${product.subCategoryName}`}
                                                </p>

                                                <p className="line-clamp-2 text-xs text-slate-400 mb-4 flex-1">
                                                    {product.description}
                                                </p>

                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div className="rounded-xl bg-slate-950 px-3 py-2">
                                                        <span className="text-slate-500">Tip:</span>{" "}
                                                        {product.brand || "-"}
                                                    </div>
                                                    <div className="rounded-xl bg-slate-950 px-3 py-2">
                                                        <span className="text-slate-500">Oda:</span>{" "}
                                                        {product.stock}
                                                    </div>
                                                    <div className="rounded-xl bg-slate-950 px-3 py-2">
                                                        <span className="text-slate-500">Kat:</span>{" "}
                                                        {product.size || "-"}
                                                    </div>
                                                    <div className="rounded-xl bg-slate-950 px-3 py-2">
                                                        <span className="text-slate-500">m²:</span>{" "}
                                                        {product.weight ?? "-"}
                                                    </div>
                                                </div>

                                                <p className="mt-3 line-clamp-1 text-xs text-slate-500 border-t border-slate-800/80 pt-2">
                                                    {product.sku || "Adres belirtilmemiş"}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Sayfalama (Pagination) */}
                        {totalPages > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-4">
                                <button
                                    type="button"
                                    disabled={page === 0 || loading}
                                    onClick={() => fetchFilteredProducts(page - 1)}
                                    className="rounded-xl border border-slate-800 px-5 py-2.5 text-sm disabled:opacity-40 hover:bg-slate-900"
                                >
                                    Önceki
                                </button>

                                <span className="text-sm text-slate-400">
                                    {page + 1} / {totalPages}
                                </span>

                                <button
                                    type="button"
                                    disabled={page + 1 >= totalPages || loading}
                                    onClick={() => fetchFilteredProducts(page + 1)}
                                    className="rounded-xl border border-slate-800 px-5 py-2.5 text-sm disabled:opacity-40 hover:bg-slate-900"
                                >
                                    Sonraki
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </section>
    );
}