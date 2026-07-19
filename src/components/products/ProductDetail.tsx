"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Loader2,
    AlertCircle,
    Package,
    UserRound,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { getProductById } from "@/services/productService";
import { getUserProfile } from "@/services/userService";

import { Product } from "@/types/product";
import { User } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http")) {
        return imagePath;
    }

    return `${API_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export default function Products() {
    const params = useParams();
    const productId = Number(params.id);

    const [product, setProduct] = useState<Product | null>(null);
    const [owner, setOwner] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        if (!productId || Number.isNaN(productId)) {
            setError("Geçersiz ilan numarası.");
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                const productData = await getProductById(productId);

                setProduct(productData);

                if (productData.userId) {
                    const ownerData = await getUserProfile(
                        productData.userId
                    );

                    setOwner(ownerData);
                }
            } catch (error) {
                console.error(error);
                setError("İlan bilgileri alınamadı.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return (
            <div className="min-h-[70vh] bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-[70vh] bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-4" />

                    <p className="text-rose-400">
                        {error || "İlan bulunamadı."}
                    </p>
                </div>
            </div>
        );
    }

    const imagePaths =
        product.images?.length > 0
            ? product.images
            : product.thumbnail
              ? [product.thumbnail]
              : [];

    const imageUrls = imagePaths.map(getImageUrl);

    const previousImage = () => {
        setActiveImageIndex((previous) =>
            previous === 0
                ? imageUrls.length - 1
                : previous - 1
        );
    };

    const nextImage = () => {
        setActiveImageIndex((previous) =>
            previous === imageUrls.length - 1
                ? 0
                : previous + 1
        );
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
            <div className="max-w-5xl mx-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {imageUrls.length > 0 ? (
                        <div className="relative">
                            <img
                                src={imageUrls[activeImageIndex]}
                                alt={`${product.title} ${
                                    activeImageIndex + 1
                                }`}
                                className="w-full h-80 md:h-[500px] object-cover"
                            />

                            {imageUrls.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={previousImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>

                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                        {imageUrls.map((_, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() =>
                                                    setActiveImageIndex(index)
                                                }
                                                className={`h-2.5 rounded-full transition-all ${
                                                    activeImageIndex === index
                                                        ? "w-8 bg-white"
                                                        : "w-2.5 bg-white/50"
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full text-sm">
                                        {activeImageIndex + 1} /{" "}
                                        {imageUrls.length}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-80 bg-slate-800 flex items-center justify-center">
                            <Package className="w-16 h-16 text-slate-600" />
                        </div>
                    )}

                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Package className="w-7 h-7 text-violet-400" />

                            <h1 className="text-3xl font-bold">
                                {product.title}
                            </h1>
                        </div>

                        <p className="text-slate-400 mb-8">
                            {product.description ||
                                "İlan açıklaması bulunmuyor."}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Detail
                                label="Emlak Tipi"
                                value={product.brand}
                            />

                            <Detail
                                label="Oda Sayısı"
                                value={product.stock}
                            />

                            <Detail
                                label="Adres"
                                value={product.sku}
                            />

                            <Detail
                                label="Fiyat"
                                value={
                                    product.price
                                        ? `${product.price.toLocaleString(
                                              "tr-TR"
                                          )} ₺`
                                        : null
                                }
                            />

                            <Detail
                                label="Kategori"
                                value={product.categoryName}
                            />

                            <Detail
                                label="Alt Kategori"
                                value={product.subCategoryName}
                            />

                            <Detail
                                label="Kat Bilgisi"
                                value={product.size}
                            />

                            <Detail
                                label="Metrekare"
                                value={
                                    product.weight
                                        ? `${product.weight} m²`
                                        : null
                                }
                            />

                            <Detail
                                label="İlan Numarası"
                                value={product.barcode}
                            />

                            <Detail
                                label="İlan Sahibi"
                                value={product.userEmail}
                            />
                        </div>

                        {owner && (
                            <div className="mt-10 border-t border-slate-800 pt-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <UserRound className="w-6 h-6 text-emerald-400" />

                                    <h2 className="text-2xl font-bold">
                                        İlan Sahibi Bilgileri
                                    </h2>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Detail
                                        label="Ad"
                                        value={owner.firstName}
                                    />

                                    <Detail
                                        label="Soyad"
                                        value={owner.lastName}
                                    />

                                    <Detail
                                        label="E-posta"
                                        value={owner.email}
                                    />

                                    <Detail
                                        label="Telefon"
                                        value={owner.phone}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

function Detail({
    label,
    value,
}: {
    label: string;
    value?: string | number | null;
}) {
    return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase mb-1">
                {label}
            </p>

            <p className="text-slate-200">
                {value !== null &&
                value !== undefined &&
                value !== ""
                    ? value
                    : "-"}
            </p>
        </div>
    );
}

