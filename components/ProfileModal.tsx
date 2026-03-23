'use client';

import { useState, useEffect } from "react";
import { X, User, Lock, Loader2, KeyRound } from "lucide-react";
import { apiFetch } from "@/lib/api";
import Button from "./ui/Button";

type ProfileModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialName: string;
    userId?: string;
};

export default function ProfileModal({
    isOpen,
    onClose,
    initialName,
    userId
}: Readonly<ProfileModalProps>) {
    const [name, setName] = useState(initialName);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setOldPassword("");
            setNewPassword("");
            setMessage(null);
        }
    }, [isOpen, initialName]);

    if (!isOpen) return null;

    const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (name !== initialName) {
                await apiFetch(`/api/users/${userId}`, {
                    method: "PUT",
                    body: JSON.stringify({ name }),
                });
            }

            if (newPassword) {
                if (!oldPassword) {
                    throw new Error("Current password is required to set a new one.");
                }

                await apiFetch(`/api/users/${userId}/password`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        oldPassword,
                        newPassword
                    }),
                });
            }

            setMessage({ type: 'success', text: "Changes saved successfully!" });
            setTimeout(() => {
                onClose();
                globalThis.location.reload();
            }, 1500);

        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || "An unexpected error occurred."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Account Settings</h2>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleUpdate} className="p-6 space-y-5">
                    {message && (
                        <div className={`p-3 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-1 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div>
                        <label htmlFor="text" className="block text-xs font-bold uppercase text-gray-500 mb-1.5 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Change Password</p>
                        <div className="space-y-3">
                            <div>
                                <label htmlFor="password" className="block text-xs font-medium text-gray-500 mb-1 ml-1">Current Password</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-xs font-medium text-gray-500 mb-1 ml-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button variant="outline" className="w-full" onClick={onClose} type="button">
                            Cancel
                        </Button>
                        <Button variant="secondary" className="w-full" disabled={loading} type="submit">
                            {loading ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}