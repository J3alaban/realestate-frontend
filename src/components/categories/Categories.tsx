"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    LayoutGrid,
    Loader2,
    AlertCircle,
    ArrowUpRight,
    ChevronRight,
    Package,
} from "lucide-react";

import { getAllCategories } from "@/services/categoryService";
import { getAllSubCategories } from "@/services/subcategoryService";
import { getProductsBySubCategory } from "@/services/productService";

import { Category } from "@/types/category";
import { SubCategory } from "@/types/subcategory";
import { Product } from "@/types/product";

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

    const [selectedSubCategoryId, setSelectedSubCategoryId] =
        useState<number | null>(null);

    const [productsBySubCategory, setProductsBySubCategory] = useState<
        Record<number, Product[]>
    >({});

    const [productLoadingId, setProductLoadingId] =
        useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesData, subCategoriesData] = await Promise.all([
                    getAllCategories(),
                    getAllSubCategories(),
                ]);

                setCategories(categoriesData);
                setSubCategories(subCategoriesData);
            } catch {
                setError(
                    "Kategoriler ve alt kategoriler yüklenirken bir hata oluştu."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubCategoryClick = async (subCategoryId: number) => {
        if (selectedSubCategoryId === subCategoryId) {
            setSelectedSubCategoryId(null);
            return;
        }

        setSelectedSubCategoryId(subCategoryId);

        if (productsBySubCategory[subCategoryId]) {
            return;
        }

        try {
            setProductLoadingId(subCategoryId);

            const response = await getProductsBySubCategory(
                subCategoryId,
                0,
                20
            );

            setProductsBySubCategory((previous) => ({
                ...previous,
                [subCategoryId]: response.content,
            }));
        } catch {
            setProductsBySubCategory((previous) => ({
                ...previous,
                [subCategoryId]: [],
            }));
        } finally {
            setProductLoadingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-950 gap-4">
                <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
                <p className="text-slate-400 text-sm">
                    Kategoriler yükleniyor...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-slate-950 p-4">
                <div className="w-full max-w-md bg-slate-900 border border-rose-950 p-8 rounded-2xl text-center">
                    <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-4" />

                    <h2 className="text-lg font-bold text-white mb-2">
                        Sistemsel Bir Hata
                    </h2>

                    <p className="text-rose-400 text-sm mb-6">{error}</p>

                    <button
                        onClick={() => window.location.reload()}
                        className="bg-slate-950 border border-slate-800 text-white rounded-xl px-5 py-2.5"
                    >
                        Yeniden Dene
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] bg-slate-950 text-slate-100 py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="w-12 h-12 bg-gradient-to-tr from-violet-600 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                        <LayoutGrid className="w-5 h-5 text-white" />
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                        Kategoriler
                    </h1>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => {
                        const filteredSubs = subCategories.filter(
                            (sub) => sub.categoryId === category.id
                        );

                        return (
                            <div
                                key={category.id}
                                className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <Link href={`/category/${category.slug}`}>
                                        <h2 className="text-lg font-bold text-white hover:text-violet-400">
                                            {category.name}
                                        </h2>
                                    </Link>


                                </div>

                                <div className="border-t border-slate-800 pt-4">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">
                                        Alt Kategoriler ({filteredSubs.length})
                                    </h3>

                                    <div className="flex flex-col gap-2">
                                        {filteredSubs.map((sub) => {
                                            const isSelected =
                                                selectedSubCategoryId === sub.id;

                                            const products =
                                                productsBySubCategory[sub.id] ??
                                                [];

                                            return (
                                                <div key={sub.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleSubCategoryClick(
                                                                sub.id
                                                            )
                                                        }
                                                        className="w-full flex items-center justify-between text-sm text-slate-400 hover:text-emerald-400 bg-slate-950/30 hover:bg-slate-950 px-3 py-2 rounded-lg"
                                                    >
                                                        <span>{sub.name}</span>

                                                        <ChevronRight
                                                            className={`w-4 h-4 transition-transform ${
                                                                isSelected
                                                                    ? "rotate-90"
                                                                    : ""
                                                            }`}
                                                        />
                                                    </button>

                                                    {isSelected && (
                                                        <div className="mt-2 ml-3 border-l border-slate-700 pl-3 space-y-2">
                                                            {productLoadingId ===
                                                            sub.id ? (
                                                                <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                    Ürünler
                                                                    yükleniyor...
                                                                </div>
                                                            ) : products.length >
                                                              0 ? (
                                                                products.map(
                                                                    (
                                                                        product
                                                                    ) => (
                                                                        <Link
                                                                            key={
                                                                                product.id
                                                                            }
                                                                            href={`/products/${product.id}`}
                                                                            className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-lg hover:bg-slate-950"
                                                                        >
                                                                            <Package className="w-4 h-4 text-violet-400" />

                                                                            <div>
                                                                                <p className="text-sm text-white">
                                                                                    {
                                                                                        product.title
                                                                                    }
                                                                                </p>

                                                                                <p className="text-xs text-slate-500">
                                                                                    {
                                                                                        product.brand
                                                                                    }{" "}
                                                                                    - Stok:{" "}
                                                                                    {
                                                                                        product.stock
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </Link>
                                                                    )
                                                                )
                                                            ) : (
                                                                <p className="text-xs text-slate-600 py-2">
                                                                    Bu alt
                                                                    kategoriye
                                                                    ait ürün
                                                                    bulunmuyor.
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {filteredSubs.length === 0 && (
                                            <p className="text-xs text-slate-600 italic">
                                                Henüz alt kategori bulunmuyor.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}