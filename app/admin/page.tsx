"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Poll } from "@/types";
import { LiveResults } from "@/components/voting/LiveResults";
import { CongressHemicycle } from "@/components/voting/CongressHemicycle";
import { CountdownTimer } from "@/components/voting/CountdownTimer";
import Link from "next/link";
import { LucideBarChart3, LucideUsers, LucideRefreshCw, LucideLayoutGrid, LucidePieChart, LucideExternalLink, LucideAlertCircle } from "lucide-react";

export default function AdminPage() {
    const [poll, setPoll] = useState<Poll | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'chart' | 'congress'>('chart');
    const [lastPollSummary, setLastPollSummary] = useState<Poll | null>(null);

    const fetchPoll = async () => {
        try {
            const active = await api.getActivePoll();
            setPoll(active);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPoll();
        const interval = setInterval(fetchPoll, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleClosePoll = async () => {
        if (poll) setLastPollSummary({ ...poll, isActive: false });
        await api.closePoll();
        fetchPoll();
    };

    if (loading) return (
        <div className="fixed inset-0 bg-[#3A1B4E] flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-[#FFC100] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="fixed inset-0 bg-[#3A1B4E] text-white flex flex-col overflow-hidden">

            {/* Navbar Sobria */}
            <nav className="bg-[#2A103D] border-b border-white/10 py-3 px-8 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <LucideBarChart3 className="w-4 h-4 text-[#FFC100]" />
                    <h1 className="text-[11px] font-bold uppercase tracking-widest">Panel de Control HY</h1>
                </div>
                <Link href="/" className="text-[10px] font-bold text-white/30 hover:text-white uppercase px-2">Salir</Link>
            </nav>

            <main className="flex-1 p-6 overflow-hidden min-h-0">

                {lastPollSummary && !poll?.isActive && (
                    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade">
                        <div className="bg-[#2A103D] border border-white/20 p-8 rounded-2xl max-w-xl w-full flex flex-col gap-6 shadow-2xl overflow-hidden relative">
                            {/* Marca de agua decorativa */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                            <div className="text-center space-y-1">
                                <span className="text-[10px] font-black text-[#FFC100] uppercase tracking-[0.4em]">Resumen de Escrutinio</span>
                                <h2 className="text-3xl font-black truncate">{lastPollSummary.title}</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                                    <span className="block text-[8px] font-bold text-white/30 uppercase mb-1">Total Votos</span>
                                    <span className="text-2xl font-black">{lastPollSummary.totalVotes}</span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                                    <span className="block text-[8px] font-bold text-white/30 uppercase mb-1">Mínimo (2/3)</span>
                                    <span className="text-2xl font-black text-white/60">{Math.ceil(lastPollSummary.maxVoters * (2 / 3))}</span>
                                </div>
                            </div>

                            {/* Lógica de Quórum */}
                            {lastPollSummary.totalVotes >= (lastPollSummary.maxVoters * (2 / 3)) ? (
                                <div className="bg-[#2EB67D]/10 border border-[#2EB67D]/30 p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#2EB67D] rounded-full flex items-center justify-center shrink-0">
                                        <LucideUsers className="w-5 h-5 text-[#3A1B4E]" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black text-[#2EB67D] uppercase leading-none">VOTACIÓN ACEPTADA</p>
                                        <p className="text-[10px] font-bold text-[#2EB67D]/60 uppercase tracking-tight">El quórum ha sido alcanzado satisfactoriamente.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#C22359]/10 border border-[#C22359]/30 p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#C22359] rounded-full flex items-center justify-center shrink-0">
                                        <LucideAlertCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black text-[#C22359] uppercase leading-none">VOTACIÓN RECHAZADA</p>
                                        <p className="text-[10px] font-bold text-[#C22359]/60 uppercase tracking-tight">Votos insuficientes para validar la asamblea.</p>
                                    </div>
                                </div>
                            )}

                            <div className="bg-[#3A1B4E] rounded-xl p-4 h-[220px] flex items-center justify-center">
                                <LiveResults poll={lastPollSummary} compact={true} />
                            </div>

                            <button
                                className="w-full py-4 bg-[#FFC100] text-[#3A1B4E] rounded-xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                                onClick={() => setLastPollSummary(null)}
                            >
                                FINALIZAR Y ARCHIVAR
                            </button>
                        </div>
                    </div>
                )}

                <div className="h-full flex gap-6">
                    {poll && poll.isActive ? (
                        <>
                            {/* Lado Izquierdo: Monitor */}
                            <div className="flex-1 flex flex-col gap-4 min-w-0">
                                <div className="flex items-center justify-between shrink-0">
                                    <div>
                                        <span className="text-[9px] font-bold text-[#FFC100] uppercase tracking-widest">En curso</span>
                                        <h2 className="text-3xl font-black tracking-tight">{poll.title}</h2>
                                    </div>
                                    <div className="flex bg-white/5 rounded-lg border border-white/10">
                                        <button onClick={() => setViewMode('chart')} className={`p-2 transition-all ${viewMode === 'chart' ? 'text-[#FFC100]' : 'text-white/20'}`}><LucidePieChart className="w-5 h-5" /></button>
                                        <button onClick={() => setViewMode('congress')} className={`p-2 transition-all ${viewMode === 'congress' ? 'text-[#FFC100]' : 'text-white/20'}`}><LucideLayoutGrid className="w-5 h-5" /></button>
                                    </div>
                                </div>

                                <div className="flex-1 bg-[#2A103D] rounded-2xl border border-white/10 relative flex items-center justify-center overflow-hidden">
                                    {/* Stats Compactas */}
                                    <div className="absolute top-4 left-4 flex gap-4">
                                        <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-lg">
                                            <span className="block text-[8px] font-bold text-white/30 uppercase">Votos</span>
                                            <span className="text-xl font-black text-[#FFC100]">{poll.totalVotes}</span>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-lg">
                                            <span className="block text-[8px] font-bold text-white/30 uppercase">Cuórum</span>
                                            <span className="text-xl font-black text-white">{Math.round((poll.totalVotes / poll.maxVoters) * 100)}%</span>
                                        </div>
                                    </div>

                                    <div className="absolute top-4 right-4 bg-[#FFC100] text-[#3A1B4E] px-5 py-2.5 rounded-xl font-mono text-2xl font-black">
                                        <CountdownTimer endTime={poll.endTime} />
                                    </div>

                                    <div className="w-full h-full p-10 flex items-center justify-center">
                                        {viewMode === 'chart' ? <LiveResults poll={poll} /> : <CongressHemicycle poll={poll} />}
                                    </div>
                                </div>
                            </div>

                            {/* Lado Derecho: Controles */}
                            <div className="w-64 flex flex-col gap-4 shrink-0">
                                <div className="bg-[#2A103D] border border-white/10 p-5 rounded-2xl space-y-4">
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block mb-1">Mesa de Control</span>
                                    <button onClick={handleClosePoll} className="w-full py-3 bg-[#C22359] text-white rounded-xl font-bold text-[10px] uppercase hover:bg-[#A01D4A] transition-all">
                                        Finalizar Sesión
                                    </button>
                                    <button className="w-full py-1.5 bg-white/5 text-white/30 rounded-lg text-[8px] font-bold uppercase flex items-center justify-center gap-2">
                                        <LucideRefreshCw className="w-3 h-3" /> Refrescar
                                    </button>
                                </div>

                                {/* Votantes Habilitados - Más Compacto Todavía */}
                                <div className="bg-[#2EB67D] p-4 rounded-xl flex items-center justify-between text-[#3A1B4E]">
                                    <div className="space-y-0.5">
                                        <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Asientos</span>
                                        <p className="text-xl font-black leading-none">{poll.maxVoters}</p>
                                    </div>
                                    <LucideUsers className="w-6 h-6 opacity-20" />
                                </div>

                                <Link href="/votar" target="_blank" className="bg-white/5 border border-white/10 p-3.5 rounded-xl flex items-center justify-between text-white/40 hover:text-white transition-all group">
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Sala Pública</span>
                                    <LucideExternalLink className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 text-white/10">
                                <LucidePieChart className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black uppercase">Sin Sesión Activa</h2>
                                <p className="text-white/30 text-xs">Inicia una nueva votación para comenzar la asamblea.</p>
                            </div>
                            <Link href="/admin/crear" className="px-10 py-4 bg-[#FFC100] text-[#3A1B4E] rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-all">
                                + NUEVA SESIÓN
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <div className="py-2.5 text-center border-t border-white/5 bg-[#2A103D]/50 shrink-0">
                <p className="text-[7px] font-bold text-white/10 uppercase tracking-[0.8em]">HiveYoung Admin System</p>
            </div>
        </div>
    );
}
