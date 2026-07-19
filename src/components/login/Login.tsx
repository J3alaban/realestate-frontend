"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LoginProps {
    isOpen: boolean;
    onClose: () => void;
}

interface LoginResponse {
    token?: string;
    id?: number;
    role?: string;
    message?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const Login = ({ isOpen, onClose }: LoginProps) => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleClose = () => {
        if (loading || successMessage) return;

        setEmail("");
        setPassword("");
        setError("");
        onClose();
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/v1/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            });

            const data: LoginResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "E-posta veya şifre hatalı.");
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            if (data.id !== undefined) {
                localStorage.setItem("userId", String(data.id));
            }

            if (data.role) {
                localStorage.setItem("role", data.role);
            }

            setSuccessMessage("Giriş başarılı.");
            setEmail("");
            setPassword("");

            setTimeout(() => {
                onClose();
                setSuccessMessage("");
                setLoading(false);
                router.refresh();
            }, 1000);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Giriş işlemi başarısız oldu."
            );

            setLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div
                className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/80 backdrop-blur-md"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-purple-600/10 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-emerald-600/10 blur-2xl" />

                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading || !!successMessage}
                    className="absolute right-4 top-4 text-2xl text-slate-400 transition-colors hover:text-white disabled:opacity-50"
                    aria-label="Giriş penceresini kapat"
                >
                    &times;
                </button>

                <form onSubmit={handleSubmit} className="relative z-10">
                    <div className="mb-6 flex flex-col items-center">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-emerald-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-6 w-6 text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                                />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold tracking-wide text-white">
                            Giriş Yap
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            Hesabınıza erişip ilanlarınızı yönetin
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-xl border border-rose-800 bg-rose-950/50 p-3 text-center text-sm text-rose-400">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-4 rounded-xl border border-emerald-800 bg-emerald-950/50 p-3 text-center text-sm text-emerald-400">
                            {successMessage}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="login-email"
                                className="mb-1.5 block text-xs font-medium tracking-wide text-slate-400"
                            >
                                E-posta
                            </label>

                            <input
                                id="login-email"
                                type="email"
                                placeholder="isim@sirket.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                                disabled={loading || !!successMessage}
                                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-white outline-none transition-colors placeholder:text-slate-600 focus:border-violet-500 disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="login-password"
                                className="mb-1.5 block text-xs font-medium tracking-wide text-slate-400"
                            >
                                Şifre
                            </label>

                            <input
                                id="login-password"
                                type="password"
                                placeholder="••••••"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                                disabled={loading || !!successMessage}
                                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-white outline-none transition-colors placeholder:text-slate-600 focus:border-violet-500 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !!successMessage}
                        className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 p-3.5 font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                    >
                        {successMessage
                            ? "Giriş başarılı"
                            : loading
                              ? "Giriş yapılıyor..."
                              : "Giriş Yap"}
                    </button>
                    <p className="mt-5 text-center text-sm text-slate-400">
                        Henüz hesabınız yok mu?{" "}
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                router.push("/register");
                            }}
                            disabled={loading || !!successMessage}
                            className="font-semibold text-violet-400 transition-colors hover:text-violet-300 disabled:opacity-50"
                        >
                            Hemen kaydolun
                        </button>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default Login;