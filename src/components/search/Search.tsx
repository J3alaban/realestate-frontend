"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { searchService } from "@/services/searchService";
import type { Product } from "@/types/product";

export default function ProductSearch() {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!query.trim()) {
            setProducts([]);
            return;
        }

        try {
            setLoading(true);

            const response = await searchService(query.trim());
            setProducts(response.content);
        } catch (error) {
            console.error("Arama hatası:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form
                onSubmit={handleSearch}
                className="flex gap-2"
            >
                <input
                    type="search"
                    value={query}
                    onChange={(event) =>
                        setQuery(event.target.value)
                    }
                    placeholder="İlan başlığı, şehir veya adres ara"
                    className="border rounded-lg px-4 py-3 flex-1"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                    {loading ? "Aranıyor..." : "Ara"}
                </button>
            </form>

            <div className="mt-6">
                {products.map((product) => (
                    <div key={product.id}>
                        {product.title}
                    </div>
                ))}
            </div>
        </div>
    );
}