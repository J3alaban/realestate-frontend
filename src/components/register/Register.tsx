"use client";

import { useState } from "react";
import axios from "axios";
import { registerUser } from "@/services/authService";

type RegisterForm = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
};

const initialForm: RegisterForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
};

export default function Register() {
    const [form, setForm] = useState<RegisterForm>(initialForm);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setMessage("");
        setSuccess(false);
        setLoading(true);

        // Backend'in beklediği JSON formatı
        const requestBody: RegisterForm = {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
            phone: form.phone.trim(),
        };

        try {
            await registerUser(requestBody);

            setSuccess(true);
            setMessage("Kayıt başarılı. E-posta adresinizi doğrulayın.");
            setForm(initialForm);
        } catch (error: unknown) {
            setSuccess(false);

            if (axios.isAxiosError(error)) {
                const responseMessage = error.response?.data?.message;

                if (responseMessage === "Email already taken") {
                    setMessage("Bu e-posta adresi zaten kullanılıyor.");
                } else {
                    setMessage(responseMessage || "Kayıt başarısız.");
                }
            } else {
                setMessage("Beklenmeyen bir hata oluştu.");
            }

            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            <form
                onSubmit={handleSubmit}
                className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-2xl shadow-black/50"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-tr from-violet-600 to-emerald-500 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-violet-500/20">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6 text-white"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                            />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-white tracking-wide">
                        Emlak Yönetim Paneli
                    </h1>

                    <p className="text-slate-400 text-sm mt-1">
                        Hesabınızı oluşturup portföyünüzü yönetin
                    </p>
                </div>

                <div className="space-y-4">
                    {/* 1. INPUT: AD (firstName) */}
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Ad"
                        value={form.firstName}
                        onChange={handleChange}
                        className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl p-3.5 outline-none focus:border-violet-500 transition-colors"
                        required
                    />

                    {/* 2. INPUT: SOYAD (lastName) */}
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Soyad"
                        value={form.lastName}
                        onChange={handleChange}
                        className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl p-3.5 outline-none focus:border-violet-500 transition-colors"
                        required
                    />

                    {/* 3. INPUT: E-POSTA (email) */}
                    <input
                        type="email"
                        name="email"
                        placeholder="isim@sirket.com"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl p-3.5 outline-none focus:border-violet-500 transition-colors"
                        required
                    />

                    {/* 4. INPUT: ŞİFRE (password) */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Şifre"
                        value={form.password}
                        onChange={handleChange}
                        minLength={6}
                        className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl p-3.5 outline-none focus:border-violet-500 transition-colors"
                        required
                    />

                    {/* 5. INPUT: TELEFON (phone) */}
                    <input
                        type="tel"
                        name="phone"
                        placeholder="0555 555 5555"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl p-3.5 outline-none focus:border-violet-500 transition-colors"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold p-3.5 rounded-xl disabled:opacity-50 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                    {loading ? "Kaydediliyor..." : "Kayıt Ol"}
                </button>

                {message && (
                    <div
                        className={`mt-4 p-3 rounded-xl text-sm text-center border ${
                            success
                                ? "bg-emerald-950/50 border-emerald-800 text-emerald-400"
                                : "bg-rose-950/50 border-rose-800 text-rose-400"
                        }`} 
                    >
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}