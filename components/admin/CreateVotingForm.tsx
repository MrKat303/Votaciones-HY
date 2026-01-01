"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PollType } from "@/types";
import { LucideX, LucideArrowLeft, LucideShieldCheck, LucideEyeOff, LucideRefreshCcw, LucideCheckCircle2, LucideLayoutGrid, LucidePieChart, LucideType, LucideTrash2 } from "lucide-react";
import Link from "next/link";

export function CreateVotingForm() {
    const [title, setTitle] = useState("");
    const [type, setType] = useState<PollType>("BOOLEAN");
    const [duration, setDuration] = useState(5);
    const [maxVoters, setMaxVoters] = useState(100);
    const [options, setOptions] = useState<string[]>(["A favor", "En contra", "Abstención"]);
    const [loading, setLoading] = useState(false);

    // Opciones adicionales
    const [hideResults, setHideResults] = useState(false);
    const [allowChange, setAllowChange] = useState(false);

    const router = useRouter();

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
            await api.createPoll(title, duration, type, options, maxVoters, { hideResults, allowEdit: allowChange });
            router.push("/admin");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#3A1B4E] text-white overflow-y-auto py-12 px-6">

            <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFC100] to-transparent opacity-20 pointer-events-none" />

            <Link href="/admin" className="absolute top-8 left-8 flex items-center gap-2 text-white/30 hover:text-[#FFC100] transition-colors font-black text-[10px] uppercase tracking-[0.2em] group z-10">
                <LucideArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> VOLVER AL PANEL
            </Link>

            <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-8 animate-fade pb-12">
                <div className="text-center space-y-2 pt-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
                        <LucideShieldCheck className="w-3 h-3 text-[#FFC100]" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Configuración de Asamblea</span>
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter">Nueva Votación</h1>
                </div>

                <div className="space-y-6">
                    {/* Selector de Tipo */}
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Tipo de Escrutinio</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => handleTypeChange("BOOLEAN")}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${type === "BOOLEAN" ? 'bg-[#FFC100] text-[#3A1B4E] border-[#FFC100]' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                            >
                                <LucideCheckCircle2 className="w-5 h-5" />
                                <span className="text-[8px] font-black uppercase">Booleana</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeChange("MULTIPLE")}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${type === "MULTIPLE" ? 'bg-[#FFC100] text-[#3A1B4E] border-[#FFC100]' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                            >
                                <LucidePieChart className="w-5 h-5" />
                                <span className="text-[8px] font-black uppercase">Múltiple</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeChange("WORDCLOUD")}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${type === "WORDCLOUD" ? 'bg-[#FFC100] text-[#3A1B4E] border-[#FFC100]' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                            >
                                <LucideType className="w-5 h-5" />
                                <span className="text-[8px] font-black uppercase">Mapa Ideas</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#FFC100] uppercase tracking-widest opacity-50">Tema de la Consulta</label>
                        <input
                            placeholder="Ej: ¿Aprueba el presupuesto 2024?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-white/5 border-b-2 border-white/10 focus:border-[#FFC100] py-3 px-1 text-xl font-bold outline-none transition-all placeholder:text-white/5"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                            <label className="text-[8px] font-black text-white/40 uppercase tracking-widest text-[#FFC100]">Duración (Mín. 5 Minutos)</label>
                            <input
                                type="number"
                                min="5"
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value) || 5)}
                                className="w-full bg-transparent text-2xl font-black text-[#FFC100] outline-none"
                            />
                        </div>
                        {type === "BOOLEAN" && (
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2 animate-fade">
                                <label className="text-[8px] font-black text-white/40 uppercase tracking-widest">Asientos (Quorum)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={maxVoters}
                                    onChange={(e) => setMaxVoters(parseInt(e.target.value) || 100)}
                                    className="w-full bg-transparent text-2xl font-black text-white outline-none"
                                />
                            </div>
                        )}
                    </div>

                    {type !== "WORDCLOUD" && (
                        <div className="space-y-3">
                            <label className="text-[8px] font-black text-white/40 uppercase tracking-widest">Opciones / Alternativas</label>
                            <div className="grid grid-cols-1 gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scroll">
                                {options.map((opt, i) => (
                                    <div key={i} className="flex gap-2 group">
                                        <input
                                            type="text"
                                            value={opt}
                                            disabled={type === "BOOLEAN"}
                                            onChange={(e) => {
                                                const newOpts = [...options];
                                                newOpts[i] = e.target.value;
                                                setOptions(newOpts);
                                            }}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-[#FFC100] disabled:opacity-50"
                                        />
                                        {type === "MULTIPLE" && options.length > 2 && (
                                            <button onClick={() => setOptions(options.filter((_, idx) => idx !== i))} className="p-2 text-white/20 hover:text-red-500 transition-colors">
                                                <LucideTrash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {type === "MULTIPLE" && options.length < 6 && (
                                    <button
                                        onClick={() => setOptions([...options, ""])}
                                        className="w-full py-2 border border-dashed border-white/10 rounded-xl text-[10px] font-bold text-white/20 hover:text-white hover:border-white/30 transition-all"
                                    >
                                        + AGREGAR ALTERNATIVA
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

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

                <div className="flex justify-center pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full max-w-sm py-4 bg-[#FFC100] text-[#3A1B4E] rounded-xl text-base font-black transition-all hover:scale-[1.02] shadow-2xl uppercase tracking-widest"
                    >
                        {loading ? "ARCHIVANDO..." : "ARCHIVAR Y CONFIGURAR"}
                    </button>
                </div>
            </form>
            <div className="text-center pb-8 opacity-10 text-[7px] font-black uppercase tracking-[1em]">HIVEYOUNG ASAMBLEA DIGITAL</div>
        </div>
    );
}
