"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PollType } from "@/types";
import { LucideX, LucideArrowLeft, LucideShieldCheck, LucideEyeOff, LucideRefreshCcw, LucideCheckCircle2, LucideLayoutGrid, LucidePieChart, LucideType, LucideTrash2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function CreateVotingForm() {
    const [title, setTitle] = useState("");
    const [type, setType] = useState<PollType>("BOOLEAN");
    const [duration, setDuration] = useState(1);
    const [maxVoters, setMaxVoters] = useState(100);
    const [options, setOptions] = useState<string[]>(["A favor", "En contra", "Abstención"]);
    const [loading, setLoading] = useState(false);

    // Opciones adicionales
    const [hideResults, setHideResults] = useState(false);
    const [allowChange, setAllowChange] = useState(false);
    const { admin, loading: authLoading } = useAuth();
    const router = useRouter();

    if (!authLoading && !admin) {
        router.push("/admin/login");
        return null;
    }

    const handleTypeChange = (newType: PollType) => {
        setType(newType);
        if (newType === "BOOLEAN") {
            setOptions(["A favor", "En contra", "Abstención"]);
        } else if (newType === "MULTIPLE") {
            setOptions(["Opción A", "Opción B"]);
        } else {
            setOptions([]); // Wordcloud doesn't need predefined options
        }
    };

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
        if (type !== "WORDCLOUD" && options.some(opt => !opt.trim())) return;
        setLoading(true);
        try {
            await api.createPoll(title, duration, type, options, maxVoters, { hideResults, allowEdit: allowChange }, admin?.id);
            router.push("/admin");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#3A1B4E] text-white py-4 lg:py-8 px-4 lg:px-6 relative overflow-y-auto custom-scroll">
            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2EB67D] to-transparent opacity-30 pointer-events-none" />
            <div className="fixed -top-24 -left-24 w-96 h-96 bg-[#2EB67D]/10 rounded-full blur-[120px] pointer-events-none" />

            <Link href="/admin" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-all font-black text-[8px] lg:text-[9px] uppercase tracking-[0.2rem] group mb-4 ml-2 lg:ml-8">
                <LucideArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> VOLVER AL PANEL
            </Link>

            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-5 lg:space-y-6 animate-fade pb-12 relative z-10">
                <div className="text-center space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-1">
                        <LucideShieldCheck className="w-3 h-3 text-[#2EB67D]" />
                        <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/50">Configuración</span>
                    </div>
                    <h1 className="text-lg lg:text-2xl font-black uppercase tracking-tighter leading-none">Nueva Votación</h1>
                </div>

                <div className="space-y-8">
                    {/* Selector de Tipo */}
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] block ml-1">Tipo de Escrutinio</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => handleTypeChange("BOOLEAN")}
                                className={`flex flex-col items-center justify-center gap-2 p-3 lg:p-4 rounded-xl border transition-all duration-300 ${type === "BOOLEAN" ? 'bg-[#2EB67D] text-[#1A0826] border-[#2EB67D] shadow-[0_0_20px_rgba(46,182,125,0.3)] scale-105' : 'bg-white/5 border-white/10 text-white/30 hover:bg-white/10 hover:border-white/20'}`}
                            >
                                <LucideCheckCircle2 className={`w-4 h-4 lg:w-5 lg:h-5 ${type === "BOOLEAN" ? 'animate-bounce' : ''}`} />
                                <span className="text-[7px] lg:text-[8px] font-black uppercase tracking-widest">Booleana</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeChange("MULTIPLE")}
                                className={`flex flex-col items-center justify-center gap-2 p-3 lg:p-4 rounded-xl border transition-all duration-300 ${type === "MULTIPLE" ? 'bg-[#2EB67D] text-[#1A0826] border-[#2EB67D] shadow-[0_0_20px_rgba(46,182,125,0.3)] scale-105' : 'bg-white/5 border-white/10 text-white/30 hover:bg-white/10 hover:border-white/20'}`}
                            >
                                <LucidePieChart className={`w-4 h-4 lg:w-5 lg:h-5 ${type === "MULTIPLE" ? 'animate-bounce' : ''}`} />
                                <span className="text-[7px] lg:text-[8px] font-black uppercase tracking-widest">Múltiple</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeChange("WORDCLOUD")}
                                className={`flex flex-col items-center justify-center gap-2 p-3 lg:p-4 rounded-xl border transition-all duration-300 ${type === "WORDCLOUD" ? 'bg-[#2EB67D] text-[#1A0826] border-[#2EB67D] shadow-[0_0_20px_rgba(46,182,125,0.3)] scale-105' : 'bg-white/5 border-white/10 text-white/30 hover:bg-white/10 hover:border-white/20'}`}
                            >
                                <LucideType className={`w-4 h-4 lg:w-5 lg:h-5 ${type === "WORDCLOUD" ? 'animate-bounce' : ''}`} />
                                <span className="text-[7px] lg:text-[8px] font-black uppercase tracking-widest text-center">Idea</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1 group">
                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] block ml-1">Asunto de la Consulta</label>
                        <input
                            placeholder="Ej: ¿Aprueba la gestión anual?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-white/5 border-b-2 border-white/10 focus:border-[#2EB67D] py-2 lg:py-3 px-1 text-lg lg:text-xl font-black outline-none transition-all placeholder:text-white/5"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                        <div className="bg-white/5 p-4 lg:p-5 rounded-3xl border border-white/10 space-y-2 hover:border-white/20 transition-colors">
                            <label className="text-[8px] font-black text-[#2EB67D] uppercase tracking-[0.2em]">Tiempo (Minutos)</label>
                            <div className="flex items-end gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={duration}
                                    onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                                    className="w-full bg-transparent text-2xl lg:text-3xl font-black text-white outline-none"
                                />
                            </div>
                        </div>
                        {type === "BOOLEAN" && (
                            <div className="bg-white/5 p-4 lg:p-5 rounded-3xl border border-white/10 space-y-2 animate-fade hover:border-white/20 transition-colors">
                                <label className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Asientos</label>
                                <div className="flex items-end gap-2">
                                    <input
                                        type="number"
                                        min="1"
                                        value={maxVoters}
                                        onChange={(e) => setMaxVoters(parseInt(e.target.value) || 100)}
                                        className="w-full bg-transparent text-2xl lg:text-3xl font-black text-white/60 outline-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {type !== "WORDCLOUD" && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] block ml-1">Alternativas</label>
                            <div className="grid grid-cols-1 gap-3 max-h-[300px] lg:max-h-none overflow-y-auto pr-2 custom-scroll">
                                {options.map((opt, i) => (
                                    <div key={i} className="flex gap-3 group animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 font-black text-white/30">
                                            {i + 1}
                                        </div>
                                        <input
                                            type="text"
                                            value={opt}
                                            disabled={type === "BOOLEAN"}
                                            onChange={(e) => {
                                                const newOpts = [...options];
                                                newOpts[i] = e.target.value;
                                                setOptions(newOpts);
                                            }}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base font-bold outline-none focus:border-[#2EB67D] focus:bg-white/10 transition-all disabled:opacity-50"
                                        />
                                        {type === "MULTIPLE" && options.length > 2 && (
                                            <button type="button" onClick={() => setOptions(options.filter((_, idx) => idx !== i))} className="p-2 text-white/20 hover:text-[#C22359] transition-colors">
                                                <LucideTrash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {type === "MULTIPLE" && options.length < 6 && (
                                    <button
                                        type="button"
                                        onClick={() => setOptions([...options, ""])}
                                        className="w-full py-3 lg:py-4 border shadow-xl border-dashed border-white/10 rounded-2xl text-[10px] lg:text-[11px] font-black text-white/30 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all uppercase tracking-widest mt-2"
                                    >
                                        + AÑADIR NUEVA POSIBILIDAD
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="pt-2 grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setHideResults(!hideResults)}
                            className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${hideResults ? 'bg-[#C22359] text-white border-[#C22359]' : 'bg-white/5 border-white/10 text-white/30 hover:bg-white/10'}`}
                        >
                            <LucideEyeOff className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Ocultar Votos</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setAllowChange(!allowChange)}
                            className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${allowChange ? 'bg-[#529CE8] text-white border-[#529CE8]' : 'bg-white/5 border-white/10 text-white/30 hover:bg-white/10'}`}
                        >
                            <LucideRefreshCcw className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Cambiar Voto</span>
                        </button>
                    </div>
                </div>

                <div className="flex justify-center pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 lg:py-5 bg-[#2EB67D] text-[#1A0826] rounded-2xl text-sm lg:text-base font-black transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(46,182,125,0.4)] uppercase tracking-[0.2em] relative overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative z-10">{loading ? "CREANDO..." : "CREAR Y LANZAR"}</span>
                    </button>
                </div>
            </form>
            <div className="text-center pb-8 opacity-5 text-[7px] font-black uppercase tracking-[1.5em] relative z-10">hiveyoung scm v3.0</div>
        </div>
    );
}
