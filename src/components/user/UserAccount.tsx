"use client";

import { FormEvent, useEffect, useState } from "react";
import {
    Loader2,
    AlertCircle,
    User,
    X,
    Pencil,
} from "lucide-react";
import Link from "next/link";

import {
    getUserProfile,
    updateUserProfile,
} from "@/services/userService";

import { User as UserType, UserRequest } from "@/types/user";

export default function UserAccount() {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [form, setForm] = useState<UserRequest>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        tcNo: "",
        password: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userId = localStorage.getItem("userId");

                if (!userId) {
                    setError("Kullanıcı bulunamadı.");
                    return;
                }

                const response = await getUserProfile(Number(userId));
                setUser(response);
            } catch {
                setError("Profil bilgileri alınamadı.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const openEditModal = () => {
        if (!user) return;

        setForm({
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            email: user.email ?? "",
            phone: user.phone ?? "",
            tcNo: user.tcNo ?? "",
            password: "",
        });

        setUpdateError("");
        setSuccessMessage("");
        setIsEditModalOpen(true);
    };

    const handleChange = (field: keyof UserRequest, value: string) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const userId = localStorage.getItem("userId");

        if (!userId) {
            setUpdateError("Kullanıcı bilgisi bulunamadı.");
            return;
        }

        try {
            setUpdating(true);
            setUpdateError("");
            setSuccessMessage("");

            const payload: UserRequest = {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email || null,
                phone: form.phone || null,
                tcNo: form.tcNo || null,
            };

            if (form.password?.trim()) {
                payload.password = form.password;
            }

            const updatedUser = await updateUserProfile(
                Number(userId),
                payload
            );

            setUser(updatedUser);
            setSuccessMessage("Hesap bilgileri güncellendi.");

            setTimeout(() => {
                setIsEditModalOpen(false);
                setSuccessMessage("");
            }, 1000);
        } catch {
            setUpdateError("Hesap bilgileri güncellenemedi.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-slate-950">
                <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-slate-950">
                <div className="text-center">
                    <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
                    <p className="text-rose-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-slate-950 py-16 px-6">
                <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <User className="w-8 h-8 text-violet-500" />

                        <h1 className="text-3xl font-bold text-white">
                            Hesabım
                        </h1>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <Info title="Ad" value={user.firstName} />
                        <Info title="Soyad" value={user.lastName} />
                        <Info title="E-Posta" value={user.email} />
                        <Info title="Telefon" value={user.phone} />
                        <Info title="TC No" value={user.tcNo} />

                        <Info
                            title="E-Posta Doğrulandı"
                            value={user.emailVerified ? "Evet" : "Hayır"}
                        />

                        <Link
                            href="/user-products"
                            className="inline-flex items-center justify-center bg-violet-600 hover:bg-violet-500 text-white font-semibold px-5 py-2.5 rounded-xl transition"
                        >
                            İlan Yönetimi
                        </Link>

                        <button
                            type="button"
                            onClick={openEditModal}
                            className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2.5 rounded-xl transition"
                        >
                            <Pencil className="w-4 h-4" />
                            Hesap Bilgilerini Düzenle
                        </button>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 p-6">
                            <h2 className="text-xl font-bold text-white">
                                Hesap Bilgilerini Düzenle
                            </h2>

                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                disabled={updating}
                                className="text-slate-400 hover:text-white transition"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleUpdate}
                            className="p-6 space-y-4"
                        >
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input
                                    label="Ad"
                                    value={form.firstName ?? ""}
                                    onChange={(value) =>
                                        handleChange("firstName", value)
                                    }
                                    required
                                />

                                <Input
                                    label="Soyad"
                                    value={form.lastName ?? ""}
                                    onChange={(value) =>
                                        handleChange("lastName", value)
                                    }
                                    required
                                />
                            </div>

                            <Input
                                label="E-Posta"
                                type="email"
                                value={form.email ?? ""}
                                onChange={(value) =>
                                    handleChange("email", value)
                                }
                            />

                            <Input
                                label="Telefon"
                                value={form.phone ?? ""}
                                onChange={(value) =>
                                    handleChange("phone", value)
                                }
                            />

                            <Input
                                label="TC No"
                                value={form.tcNo ?? ""}
                                maxLength={11}
                                onChange={(value) =>
                                    handleChange(
                                        "tcNo",
                                        value.replace(/\D/g, "")
                                    )
                                }
                            />

                            <Input
                                label="Yeni Şifre"
                                type="password"
                                value={form.password ?? ""}
                                placeholder="Değiştirmeyecekseniz boş bırakın"
                                onChange={(value) =>
                                    handleChange("password", value)
                                }
                            />

                            {updateError && (
                                <p className="text-sm text-rose-400">
                                    {updateError}
                                </p>
                            )}

                            {successMessage && (
                                <p className="text-sm text-emerald-400">
                                    {successMessage}
                                </p>
                            )}

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsEditModalOpen(false)
                                    }
                                    disabled={updating}
                                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition"
                                >
                                    İptal
                                </button>

                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold transition"
                                >
                                    {updating && (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    )}

                                    Güncelle
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

function Info({
    title,
    value,
}: {
    title: string;
    value?: string | number | null;
}) {
    return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <p className="text-xs uppercase text-slate-500 mb-1">
                {title}
            </p>

            <p className="text-white">
                {value || "-"}
            </p>
        </div>
    );
}

function Input({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    required,
    maxLength,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
}) {
    return (
        <div>
            <label className="block text-sm text-slate-300 mb-2">
                {label}
            </label>

            <input
                type={type}
                value={value}
                required={required}
                maxLength={maxLength}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-violet-500 transition"
            />
        </div>
    );
}