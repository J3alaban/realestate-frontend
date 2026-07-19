
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, Package } from "lucide-react";

import { getAllProducts } from "@/services/productService";
import { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProducts(0, 20);
                setProducts(response.content);
            } catch {
                setError("Ürünler yüklenirken bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-slate-950">
                <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-slate-950">
                <div className="text-center">
                    <AlertCircle className="w-10 h-10 mx-auto text-red-500 mb-4" />
                    <p className="text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-10">
                    Tüm İlanlar
                </h1>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => {
                        const imagePath =
                            product.thumbnail || product.images?.[0];

                        const imageUrl = imagePath
                            ? imagePath.startsWith("http")
                                ? imagePath
                                : `${API_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`
                            : null;

                        return (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500 transition"
                            >
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={product.title}
                                        className="w-full h-56 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-56 bg-slate-800 flex items-center justify-center">
                                        <Package className="w-12 h-12 text-slate-600" />
                                    </div>
                                )}

                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Package className="w-5 h-5 text-violet-400" />

                                        <h2 className="font-semibold text-white line-clamp-1">
                                            {product.title}
                                        </h2>
                                    </div>

                                    <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                                        {product.description}
                                    </p>

                                    <div className="space-y-1 text-sm text-slate-500">
                                        <p>Kategori: {product.categoryName}</p>
                                        <p>
                                            Alt Kategori:{" "}
                                            {product.subCategoryName}
                                        </p>
                                        <p>Marka: {product.brand}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

