"use client";

import { useState } from "react";

type Plan = {
    name: "BASIC" | "PRO" | "PREMIUM";
    price: number;
    listings: string;
    description: string;
    features: string[];
    popular?: boolean;
};

const plans: Plan[] = [
    {
        name: "BASIC",
        price: 299,
        listings: "10 ilan",
        description: "Bireysel kullanıcılar ve küçük portföyler için.",
        features: [
            "10 aktif ilan",
            "Temel ilan yönetimi",
            "İlan fotoğraf yükleme",
            "Kullanıcı paneli",
            "Temel destek",
        ],
    },
    {
        name: "PRO",
        price: 599,
        listings: "20 ilan",
        description: "Daha geniş portföy yöneten kullanıcılar için.",
        popular: true,
        features: [
            "20 aktif ilan",
            "Gelişmiş ilan yönetimi",
            "Sınırsız fotoğraf",
            "Gelişmiş arama ve filtreleme",
            "AI destekli ilan analizi",
            "Öncelikli destek",
        ],
    },
    {
        name: "PREMIUM",
        price: 999,
        listings: "Sınırsız ilan",
        description: "Profesyonel emlakçılar ve işletmeler için.",
        features: [
            "Sınırsız aktif ilan",
            "Tüm Pro özellikleri",
            "Gelişmiş AI özellikleri",
            "İlan performans analizleri",
            "Öncelikli ilan görünürlüğü",
            "Profesyonel müşteri desteği",
        ],
    },
];

export default function SubscriptionPlan() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const handleSubscribe = (plan: Plan) => {
        setSelectedPlan(plan.name);

        // Burada ödeme sayfasına yönlendirme yapılabilir.
        // Örn: router.push(`/payment?plan=${plan.name}`);
        console.log("Seçilen paket:", plan.name);
    };

    const currentSelectedPlanData = plans.find((p) => p.name === selectedPlan);

    return (
        <section className="w-full px-4 py-12">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-bold text-white md:text-4xl">
                        Abonelik Planınızı Seçin
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400 md:text-base">
                        İlanlarınızı daha profesyonel şekilde yönetmek için
                        ihtiyacınıza uygun abonelik paketini seçin.
                    </p>
                </div>

                {/* Plans */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {plans.map((plan) => {
                        const isSelected = selectedPlan === plan.name;

                        return (
                            <div
                                key={plan.name}
                                className={`
                                    relative flex flex-col rounded-2xl border
                                    bg-gray-950/60 p-6 transition-all duration-300
                                    ${
                                        plan.popular
                                            ? "border-violet-700 shadow-lg shadow-violet-950/30"
                                            : "border-gray-800"
                                    }
                                    ${
                                        isSelected
                                            ? "border-violet-500 ring-2 ring-violet-500/20"
                                            : "hover:border-violet-900/50"
                                    }
                                    hover:-translate-y-1
                                `}
                            >
                                {/* Popular */}
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="rounded-full bg-violet-700 px-4 py-1 text-xs font-semibold text-white shadow-sm shadow-violet-900/50">
                                            En Popüler
                                        </span>
                                    </div>
                                )}

                                {/* Plan name */}
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-white">
                                        {plan.name}
                                    </h2>

                                    <p className="mt-2 min-h-[40px] text-sm text-gray-400">
                                        {plan.description}
                                    </p>
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-end gap-1">
                                        <span className="text-4xl font-bold text-white">
                                            {plan.price.toLocaleString("tr-TR")}
                                        </span>

                                        <span className="mb-1 text-gray-400">
                                            ₺ / ay
                                        </span>
                                    </div>

                                    <p className="mt-2 text-sm font-medium text-violet-400">
                                        {plan.listings}
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="mb-8 flex-1">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-start gap-3 text-sm text-gray-300"
                                            >
                                                <span className="mt-0.5 text-violet-500">
                                                    ✓
                                                </span>

                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Button */}
                                <button
                                    type="button"
                                    onClick={() => handleSubscribe(plan)}
                                    className={`
                                        w-full rounded-xl px-4 py-3
                                        text-sm font-semibold transition-all
                                        ${
                                            plan.popular
                                                ? "bg-violet-700 text-white hover:bg-violet-600 shadow-md shadow-violet-950/50"
                                                : "border border-gray-700 bg-gray-900 text-white hover:border-violet-700 hover:bg-violet-950/30"
                                        }
                                    `}
                                >
                                    {isSelected
                                        ? "Seçildi"
                                        : `${plan.name} Paketini Seç`}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Ödeme Yönlendirme Alanı (Stil Güncellendi) */}
                {selectedPlan && (
                    <div className="mt-12 flex animate-in fade-in slide-in-from-bottom-4 duration-300 justify-center">
                        <div className="flex w-full max-w-xl flex-col items-center justify-between gap-4 rounded-2xl border border-violet-800/50 bg-gradient-to-r from-gray-950/90 via-violet-950/20 to-gray-950/90 p-5 backdrop-blur-md sm:flex-row shadow-xl shadow-violet-950/20">
                            <div className="flex flex-col text-center sm:text-left">
                                <span className="text-xs font-semibold tracking-wider text-violet-400 uppercase">
                                    Seçilen Abonelik
                                </span>
                                <div className="mt-0.5 flex items-center justify-center sm:justify-start gap-2">
                                    <span className="text-lg font-bold text-white">
                                        {currentSelectedPlanData?.name} Paketi
                                    </span>
                                    <span className="text-sm font-medium text-gray-400">
                                        ({currentSelectedPlanData?.price.toLocaleString("tr-TR")} ₺/ay)
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    console.log("Ödeme sayfasına gidiliyor:", selectedPlan);

                                    // Ödeme sayfasına yönlendirme:
                                    // router.push(`/payment?plan=${selectedPlan}`);
                                }}
                                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition-all duration-300 hover:bg-violet-500 hover:shadow-violet-800/60 hover:-translate-y-0.5 sm:w-auto">
                                <span>Ödemeye Geç</span>
                                <svg
                                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}