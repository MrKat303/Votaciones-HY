"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LucideLock, LucideUser, LucideLoader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
    const [rut, setRut] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const success = await login(rut, password);
            if (success) {
                router.push("/admin");
            } else {
                setError("Credenciales inválidas. Verifique RUT y contraseña.");
            }
        } catch (err) {
            setError("Error al intentar iniciar sesión.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#3A1B4E] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#2EB67D]" />

                <div className="text-center mb-8 relative z-10">
                    <div className="w-16 h-16 bg-[#F4EDE4] rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <LucideLock className="w-8 h-8 text-[#3A1B4E]" />
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Administración</h1>
                    <p className="text-white/40 text-[10px] font-black tracking-widest uppercase">SISTEMA DE VOTACIONES HIVEYOUNG</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-[#FFC100] ml-2">RUT Administrador</label>
                        <div className="relative">
                            <LucideUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="text"
                                value={rut}
                                onChange={(e) => setRut(e.target.value)}
                                className="w-full bg-[#1A0826]/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFC100] transition-colors text-sm font-medium"
                                placeholder="Ej: 12345678-9"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-[#FFC100] ml-2">Contraseña</label>
                        <div className="relative">
                            <LucideLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#1A0826]/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFC100] transition-colors text-sm font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-[#9063AD] text-white font-black uppercase tracking-widest py-6 rounded-xl hover:bg-white hover:text-[#3A1B4E] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        disabled={isLoading}
                    >
                        {isLoading ? <LucideLoader2 className="w-5 h-5 animate-spin" /> : "Ingresar"}
                    </Button>
                </form>

            </div>
        </div>
    );
}
