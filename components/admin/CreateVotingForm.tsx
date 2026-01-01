"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { LucideX, LucideArrowLeft, LucideShieldCheck, LucideEyeOff, LucideRefreshCcw } from "lucide-react";
import Link from "next/link";

export function CreateVotingForm() {
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState(5);
    const [maxVoters, setMaxVoters] = useState(100);
    const [options, setOptions] = useState<string[]>(["A favor", "En contra", "Abstención"]);
    const [loading, setLoading] = useState(false);

    // Opciones adicionales
    const [hideResults, setHideResults] = useState(false);
    const [allowChange, setAllowChange] = useState(false);

    const router = useRouter();

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length >= 6) return;
        setOptions([...options, ""]);
    };

    const removeOption = (index: number) => {
        if (options.length <= 2) return;
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (options.some(opt => !opt.trim())) return;
        setLoading(true);
        try {
            await api.createPoll(title, duration, options, maxVoters);
            router.push("/admin");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#3A1B4E] text-white flex flex-col items-center justify-center p-6 overflow-hidden">

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFC100] to-transparent opacity-20" />

            <Link href="/admin" className="absolute top-8 left-8 flex items-center gap-2 text-white/30 hover:text-[#FFC100] transition-colors font-black text-[10px] uppercase tracking-[0.2em] group">
                <LucideArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> VOLVER AL PANEL
            </Link>

            <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-8 animate-fade">

                {/* Encabezado Compacto */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
                        <LucideShieldCheck className="w-3 h-3 text-[#FFC100]" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Nueva Sesión de Escrutinio</span>
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter">Configurar Votación</h1>
                </div>

                <div className="space-y-6">
                    {/* Título */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#FFC100] uppercase tracking-widest opacity-50">Tema de la Asamblea</label>
                        <input
                            placeholder="Escribe la pregunta aquí..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-white/5 border-b-2 border-white/10 focus:border-[#FFC100] py-3 px-1 text-xl font-bold outline-none transition-all placeholder:text-white/5"
                        />
                    </div>

                    {/* Parámetros */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                            <label className="text-[8px] font-black text-white/40 uppercase tracking-widest">Duración (Min)</label>
                            <input
                                type="number"
                                min="1"
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value))}
                                className="w-full bg-transparent text-2xl font-black text-[#FFC100] outline-none"
                            />
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                            <label className="text-[8px] font-black text-white/40 uppercase tracking-widest">Cupo (Sillas)</label>
                            <input
                                type="number"
                                min="1"
                                value={maxVoters}
                                onChange={(e) => setMaxVoters(parseInt(e.target.value))}
                                className="w-full bg-transparent text-2xl font-black text-white outline-none"
                            />
                        </div>
                    </div>

                    {/* Opciones */}
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Alternativas</label>
                        <div className="grid gap-2">
                            {options.map((option, index) => (
                                <div key={index} className="flex gap-2 items-center bg-white/5 p-1.5 rounded-xl border border-white/5 group transition-colors focus-within:bg-white/10">
                                    <span className="w-8 text-center text-[10px] font-black text-[#FFC100]/50">{index + 1}</span>
                                    <input
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Opción ${index + 1}`}
                                        required
                                        className="flex-1 bg-transparent py-1.5 font-bold text-sm outline-none"
                                    />
                                    {options.length > 2 && (
                                        <button type="button" onClick={() => removeOption(index)} className="p-2 text-white/10 hover:text-red-400 transition-colors">
                                            <LucideX className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {options.length < 6 && (
                            <button type="button" onClick={addOption} className="w-full py-2 border border-dashed border-white/10 rounded-xl text-[8px] font-black text-white/20 hover:text-white hover:border-white/30 transition-all uppercase">+ Agregar Alternativa</button>
                        )}
                    </div>

                    {/* Opciones Avanzadas (Nuevas) */}
                    <div className="pt-2 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setHideResults(!hideResults)}
                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${hideResults ? 'bg-[#FFC100] text-[#3A1B4E] border-[#FFC100]' : 'bg-white/5 border-white/10 text-white/40'}`}
                        >
                            <LucideEyeOff className="w-3 h-3" />
                            <span className="text-[8px] font-black uppercase">Ocultar Resultados</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setAllowChange(!allowChange)}
                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${allowChange ? 'bg-[#FFC100] text-[#3A1B4E] border-[#FFC100]' : 'bg-white/5 border-white/10 text-white/40'}`}
                        >
                            <LucideRefreshCcw className="w-3 h-3" />
                            <span className="text-[8px] font-black uppercase">Permitir Edición</span>
                        </button>
                    </div>
                </div>

                {/* Lanzar */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-[#FFC100] text-[#3A1B4E] rounded-2xl text-lg font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-black/40 uppercase tracking-widest mt-4"
                >
                    {loading ? "Iniciando..." : "Lanzar Votación"}
                </button>
            </form>

            <div className="absolute bottom-6 opacity-10 text-[7px] font-black uppercase tracking-[1em]">HIVEYOUNG ASAMBLEA DIGITAL</div>
        </div>
    );
}
