"use client";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";
import Link from "next/link";
import {
    Loader2,
    AlertCircle,
    Plus,
    Trash2,
    Pencil,
    X,
    Upload,
    ImageIcon,
} from "lucide-react";

import api from "@/services/api";

import { getUserProducts } from "@/services/userService";
import { getAllCategories } from "@/services/categoryService";
import { getAllSubCategories } from "@/services/subCategoryService";

import {
    createProduct,
    deleteProduct,
    updateProduct,
    uploadImage,
} from "@/services/productService";

import {
    Product,
    CreateProductRequest,
} from "@/types/product";

const initialFormState: CreateProductRequest = {
    title: "",
    description: "",
    price: 0,
    stock: 1,
    categoryId: 0,
    subCategoryId: 0,
    brand: "",
    sku: "",
    discountPercentage: 0,
    weight: 0,
    size: "",
    dimensions: {
        width: 0,
        height: 0,
        depth: 0,
    },
    images: [],
};

const getImageUrl = (imagePath?: string | null) => {
    if (!imagePath) {
        return "";
    }

    if (
        imagePath.startsWith("http://") ||
        imagePath.startsWith("https://")
    ) {
        return imagePath;
    }

    const baseURL = api.defaults.baseURL ?? "";

    return `${baseURL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export default function UserProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);


    const [editingProduct, setEditingProduct] =
        useState<Product | null>(null);

    const [form, setForm] =
        useState<CreateProductRequest>(initialFormState);

    const getStoredUserId = () => {
        const storedUserId = localStorage.getItem("userId");
        const userId = Number(storedUserId);

        return Number.isNaN(userId) ? 0 : userId;
    };

    const fetchProducts = async () => {
        try {
            setError("");

            const userId = getStoredUserId();

            if (!userId) {
                setError("Kullanıcı bilgisi bulunamadı öncelikle giriş yapmalısınız.");
                return;
            }

            const response = await getUserProducts(userId, 0, 20);

            setProducts(response.content);
        } catch {
            setError("İlanlar yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    setIsLoggedIn(!!token && !!userId);

    if (userId) {
        fetchProducts();
    } else {
        setLoading(false);
    }
}, []);

useEffect(() => {
    const fetchCategoryData = async () => {
        const [categoryData, subCategoryData] = await Promise.all([
            getAllCategories(),
            getAllSubCategories(),
        ]);

        setCategories(categoryData);
        setSubCategories(subCategoryData);
    };

    fetchCategoryData();
}, []);

const filteredSubCategories = subCategories.filter(
    (subCategory) => subCategory.categoryId === form.categoryId
);




    const handleImageUpload = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files ?? []);

        if (files.length === 0) {
            return;
        }

        try {
            setUploading(true);
            setError("");

            const uploadedImages = await Promise.all(
                files.map((file) => uploadImage(file))
            );

            setForm((previous) => ({
                ...previous,
                images: [
                    ...(previous.images ?? []),
                    ...uploadedImages,
                ],
            }));
        } catch {
            setError("Fotoğraflar yüklenemedi.");
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    const removeImage = (imageIndex: number) => {
        setForm((previous) => ({
            ...previous,
            images: (previous.images ?? []).filter(
                (_, index) => index !== imageIndex
            ),
        }));
    };

    const handleCreate = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const userId = getStoredUserId();

            if (!userId) {
                setError("Kullanıcı bilgisi bulunamadı.");
                return;
            }

            const createdProduct = await createProduct(
                userId,
                form
            );

            setProducts((previous) => [
                createdProduct,
                ...previous,
            ]);

            cancelForm();
        } catch {
            setError("İlan oluşturulamadı.");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!editingProduct) {
            return;
        }

        try {
            setSaving(true);
            setError("");

            const updatedProduct = await updateProduct(
                editingProduct.id,
                form
            );

            setProducts((previous) =>
                previous.map((product) =>
                    product.id === editingProduct.id
                        ? updatedProduct
                        : product
                )
            );

            cancelForm();
        } catch {
            setError(
                "İlan güncellenirken bir hata oluştu."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (productId: number) => {
        const confirmed = window.confirm(
            "Bu ilanı silmek istediğinize emin misiniz?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteProduct(productId);

            setProducts((previous) =>
                previous.filter(
                    (product) => product.id !== productId
                )
            );
        } catch {
            setError("İlan silinemedi.");
        }
    };

    const startEdit = (product: Product) => {
        setEditingProduct(product);

        setForm({
            title: product.title || "",
            description: product.description || "",
            price: product.price || 0,
            stock: product.stock || 0,
            categoryId: product.categoryId || 0,
            subCategoryId: product.subCategoryId || 0,
            brand: product.brand || "",
            sku: product.sku || "",
            discountPercentage:
                product.discountPercentage || 0,
            weight: product.weight || 0,
            size: product.size || "",
            dimensions: product.dimensions || {
                width: 0,
                height: 0,
                depth: 0,
            },
            images: product.images || [],
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        setForm(initialFormState);
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold">
                            İlan Yönetimi
                        </h1>

                        <p className="text-slate-400 mt-2">
                            İlanlarınızı ekleyebilir,
                            güncelleyebilir ve silebilirsiniz.
                        </p>
                    </div>

                {isLoggedIn && (
                    <button
                        type="button"
                        onClick={() => {
                            if (showForm) {
                                cancelForm();
                            } else {
                                setEditingProduct(null);
                                setForm(initialFormState);
                                setShowForm(true);
                            }
                        }}
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 px-5 py-2.5 rounded-xl font-semibold transition"
                    >
                        {showForm ? (
                            <>
                                <X className="w-5 h-5" />
                                Kapat
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5" />
                                Yeni İlan
                            </>
                        )}
                    </button>
                )}

                </div>

                {error && (
                    <div className="flex items-center gap-2 bg-rose-950/30 border border-rose-900 text-rose-400 p-4 rounded-xl mb-6">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {showForm && (
                    <form
                        onSubmit={
                            editingProduct
                                ? handleUpdate
                                : handleCreate
                        }
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10"
                    >
                        <h2 className="text-xl font-bold mb-6 text-violet-400">
                            {editingProduct
                                ? "İlanı Düzenle"
                                : "Yeni İlan Oluştur"}
                        </h2>

                        <div className="grid md:grid-cols-2 gap-5">
                            <input
                                type="text"
                                placeholder="İlan başlığı"
                                value={form.title}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        title: event.target.value,
                                    })
                                }
                                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"
                                required
                            />

                            <input
                                type="text"
                                placeholder="Emlak tipi"
                                value={form.brand}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        brand: event.target.value,
                                    })
                                }
                                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"
                            />

                            <input
                                type="number"
                                placeholder="Fiyat"
                                value={form.price || ""}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        price: Number(
                                            event.target.value
                                        ),
                                    })
                                }
                                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"
                            />

                            <input
                                type="number"
                                placeholder="Oda sayısı"
                                value={form.stock || ""}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        stock: Number(
                                            event.target.value
                                        ),
                                    })
                                }
                                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"
                            />

                           <select
                               value={form.categoryId || ""}
                               onChange={(event) =>
                                   setForm({
                                       ...form,
                                       categoryId: Number(event.target.value),
                                       subCategoryId: 0,
                                   })
                               }
                               className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"
                               required
                           >
                               <option value="">Kategori seçin</option>

                               {categories.map((category) => (
                                   <option key={category.id} value={category.id}>
                                       {category.name}
                                   </option>
                               ))}
                           </select>

                           <select
                               value={form.subCategoryId || ""}
                               onChange={(event) =>
                                   setForm({
                                       ...form,
                                       subCategoryId: Number(event.target.value),
                                   })
                               }
                               className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 disabled:opacity-50"
                               disabled={!form.categoryId}
                           >
                               <option value="">Alt kategori seçin</option>

                               {filteredSubCategories.map((subCategory) => (
                                   <option key={subCategory.id} value={subCategory.id}>
                                       {subCategory.name}
                                   </option>
                               ))}
                           </select>

                            <input
                                type="text"
                                placeholder="Adres"
                                value={form.sku}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        sku: event.target.value,
                                    })
                                }
                                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"
                            />

                            <input
                                type="text"
                                placeholder="Kat bilgisi"
                                value={form.size}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        size: event.target.value,
                                    })
                                }
                                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"
                            />

                            <input
                                type="number"
                                placeholder="Metrekare"
                                value={form.weight || ""}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        weight: Number(
                                            event.target.value
                                        ),
                                    })
                                }
                                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"
                            />
                        </div>

                        <textarea
                            placeholder="Açıklama"
                            value={form.description}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    description:
                                        event.target.value,
                                })
                            }
                            className="w-full mt-5 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 min-h-32"
                        />

                        <div className="mt-6">
                            <p className="text-sm font-semibold text-slate-300 mb-3">
                                İlan Fotoğrafları
                            </p>

                            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-700 hover:border-violet-500 bg-slate-950 rounded-xl p-6 cursor-pointer transition">
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                                        Fotoğraflar yükleniyor...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5 text-violet-400" />
                                        Fotoğraf seç
                                    </>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    disabled={uploading}
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>

                            {(form.images?.length ?? 0) > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                                    {form.images?.map(
                                        (image, index) => (
                                            <div
                                                key={`${image}-${index}`}
                                                className="relative group bg-slate-950 border border-slate-800 rounded-xl overflow-hidden"
                                            >
                                                <img
                                                    src={getImageUrl(
                                                        image
                                                    )}
                                                    alt={`İlan fotoğrafı ${
                                                        index + 1
                                                    }`}
                                                    className="w-full h-32 object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImage(
                                                            index
                                                        )
                                                    }
                                                    className="absolute top-2 right-2 p-2 bg-rose-600 hover:bg-rose-500 rounded-lg transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>

                                                {index === 0 && (
                                                    <span className="absolute bottom-2 left-2 bg-black/70 text-xs px-2 py-1 rounded">
                                                        Kapak fotoğrafı
                                                    </span>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 mt-6">
                            <button
                                type="submit"
                                disabled={saving || uploading}
                                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold transition"
                            >
                                {saving
                                    ? "Kaydediliyor..."
                                    : editingProduct
                                      ? "Değişiklikleri Kaydet"
                                      : "İlanı Kaydet"}
                            </button>

                            <button
                                type="button"
                                onClick={cancelForm}
                                disabled={saving}
                                className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold transition"
                            >
                                Vazgeç
                            </button>
                        </div>
                    </form>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => {
                        const imagePath =
                            product.thumbnail ||
                            product.images?.[0];

                        const imageUrl =
                            getImageUrl(imagePath);

                        return (
                            <div
                                key={product.id}
                                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between"
                            >
                                <div>
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={product.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-slate-800 flex items-center justify-center">
                                            <ImageIcon className="w-12 h-12 text-slate-600" />
                                        </div>
                                    )}

                                    <div className="p-5">
                                        <Link
                                            href={`/products/${product.id}`}
                                            className="text-lg font-bold hover:text-violet-400"
                                        >
                                            {product.title}
                                        </Link>

                                        <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-5 pt-4 flex items-center justify-between border-t border-slate-800/50">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            startEdit(product)
                                        }
                                        className="flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-medium transition"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Düzenle
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(
                                                product.id
                                            )
                                        }
                                        className="flex items-center gap-2 text-rose-400 hover:text-rose-300 text-sm font-medium transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Sil
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {products.length === 0 && (
                    <p className="text-slate-500 text-center py-16">
                        Henüz ilan eklenmemiş, ilan eklemek için giriş yapmalısınız.
                    </p>
                )}
            </div>
        </main>
    );
}

