"use client";

import { useEffect, useState } from "react";

import {
    getAllCategories,
    createCategory,
} from "@/services/categoryService";

import {
    getAllSubCategories,
    createSubCategory,
} from "@/services/subcategoryService";

import {
    Category,
    CreateCategoryRequest,
} from "@/types/category";

import {
    SubCategory,
    CreateSubCategoryRequest,
} from "@/types/subcategory";

export default function AdminPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

    const [categoryName, setCategoryName] = useState("");
    const [categorySlug, setCategorySlug] = useState("");

    const [subCategoryName, setSubCategoryName] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");

    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [cats, subs] = await Promise.all([
                getAllCategories(),
                getAllSubCategories(),
            ]);

            setCategories(cats);
            setSubCategories(subs);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateCategory = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const body: CreateCategoryRequest = {
            name: categoryName,
            slug: categorySlug,
        };

        await createCategory(body);

        setCategoryName("");
        setCategorySlug("");

        loadData();
    };

    const handleCreateSubCategory = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const body: CreateSubCategoryRequest = {
            name: subCategoryName,
            categoryId: Number(selectedCategoryId),
        };

        await createSubCategory(body);

        setSubCategoryName("");
        setSelectedCategoryId("");

        loadData();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                <div className="text-sm font-medium text-slate-400 tracking-wide animate-pulse">
                    Veriler Yükleniyor...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6 sm:px-8">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Sayfa Başlığı */}
                <div className="flex items-center gap-3 border-b border-slate-900 pb-6">
                    <div className="h-2 w-2 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50" />
                    <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        Admin Yönetim Paneli
                    </h1>
                </div>

                {/* Grid Form Alanları */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Kategori Ekle Formu */}
                    <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-xl shadow-xl shadow-black/10 hover:border-slate-800/80 transition-all duration-300">
                        <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                            Yeni Kategori Ekle
                        </h2>

                        <form onSubmit={handleCreateCategory} className="space-y-4">
                            <input
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
                                placeholder="Kategori Adı (Örn: Villa)"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />

                            <input
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
                                placeholder="Slug (Örn: villa-ilanlari)"
                                value={categorySlug}
                                onChange={(e) => setCategorySlug(e.target.value)}
                            />

                            <button className="w-full text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 rounded-xl shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 hover:opacity-95 active:scale-[0.99] transition-all duration-200">
                                Kategori Oluştur
                            </button>
                        </form>
                    </div>

                    {/* Alt Kategori Formu */}
                    <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-xl shadow-xl shadow-black/10 hover:border-slate-800/80 transition-all duration-300">
                        <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Yeni Alt Kategori Ekle
                        </h2>

                        <form onSubmit={handleCreateSubCategory} className="space-y-4">
                            <input
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                                placeholder="Alt Kategori Adı (Örn: Havuzlu Villa)"
                                value={subCategoryName}
                                onChange={(e) => setSubCategoryName(e.target.value)}
                            />

                            <select
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all cursor-pointer appearance-none"
                                value={selectedCategoryId}
                                onChange={(e) => setSelectedCategoryId(e.target.value)}
                            >
                                <option value="" className="bg-slate-950 text-slate-500">
                                    Bağlı Olduğu Kategoriyi Seçin
                                </option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id} className="bg-slate-900 text-slate-200">
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <button className="w-full text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3.5 rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 hover:opacity-95 active:scale-[0.99] transition-all duration-200">
                                Alt Kategori Oluştur
                            </button>
                        </form>
                    </div>
                </div>

                {/* Grid Listeleme Alanları */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Mevcut Kategoriler */}
                    <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6">
                        <h2 className="text-base font-bold text-slate-300 mb-4 flex items-center gap-2">
                            Mevcut Kategoriler ({categories.length})
                        </h2>

                        {categories.length === 0 ? (
                            <div className="text-sm text-slate-600 italic py-4 text-center border border-dashed border-slate-900 rounded-xl">Kategori bulunmuyor.</div>
                        ) : (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                                {categories.map((category) => (
                                    <li
                                        key={category.id}
                                        className="bg-slate-950/60 border border-slate-900/60 rounded-xl p-3.5 hover:border-slate-800 transition-colors group"
                                    >
                                        <div className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">
                                            {category.name}
                                        </div>
                                        <div className="text-xs text-slate-500 font-mono mt-1 tracking-tight">
                                            /{category.slug}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Mevcut Alt Kategoriler */}
                    <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6">
                        <h2 className="text-base font-bold text-slate-300 mb-4 flex items-center gap-2">
                            Mevcut Alt Kategoriler ({subCategories.length})
                        </h2>

                        {subCategories.length === 0 ? (
                            <div className="text-sm text-slate-600 italic py-4 text-center border border-dashed border-slate-900 rounded-xl">Alt kategori bulunmuyor.</div>
                        ) : (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                                {subCategories.map((sub) => (
                                    <li
                                        key={sub.id}
                                        className="bg-slate-950/60 border border-slate-900/60 rounded-xl p-3.5 hover:border-slate-800 transition-colors group"
                                    >
                                        <div className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">
                                            {sub.name}
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800/60 text-[11px] font-medium text-slate-400">
                                            <span className="h-1 w-1 rounded-full bg-slate-600" />
                                            {sub.categoryName}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}