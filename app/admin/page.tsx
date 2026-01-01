"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Poll } from "@/types";
import { LiveResults } from "@/components/voting/LiveResults";
import { CongressHemicycle } from "@/components/voting/CongressHemicycle";
import { CountdownTimer } from "@/components/voting/CountdownTimer";
import Link from "next/link";
import { LucideBarChart3, LucideUsers, LucideRefreshCw, LucideLayoutGrid, LucidePieChart, LucideExternalLink, LucidePlay, LucideHistory, LucideArchive, LucideTrash2, LucideAlertCircle, LucideType, LucideX } from "lucide-react";

export default function AdminPage() {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'chart' | 'congress'>('chart');
    const [lastPollSummary, setLastPollSummary] = useState<Poll | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchPolls = async () => {
        if (isProcessing) return;
        try {
            const allPolls = await api.getPolls();
            setPolls(allPolls);

            const active = allPolls.find(p => p.status === "ACTIVE");
            if (active && (!selectedPollId || allPolls.find(p => p.id === selectedPollId)?.status !== "ACTIVE")) {
                setSelectedPollId(active.id);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolls();
        const interval = setInterval(fetchPolls, 2000);
        return () => clearInterval(interval);
    }, [selectedPollId]);

    const handleLaunchPoll = async (id: string, duration: number) => {
        await api.startPoll(id, duration);
        setSelectedPollId(id);
        fetchPolls();
    };

    const handleClosePoll = async (id: string) => {
        setIsProcessing(true);
        try {
            const poll = polls.find(p => p.id === id);
            if (poll) {
                const updatedPoll: Poll = { ...poll, status: "CLOSED" as const };
                setLastPollSummary(updatedPoll);
                await api.closePoll(id);
                setFullscreenResults(false);
                // Force local update to avoid flickering while polling
                setPolls(prev => prev.map(p => p.id === id ? { ...p, status: "CLOSED" as const } : p));
            }
        } finally {
            setIsProcessing(false);
            fetchPolls();
        }
    };

    const handleDeletePoll = async (id: string) => {
        await api.deletePoll(id);
        if (selectedPollId === id) setSelectedPollId(null);
        fetchPolls();
    };

    const currentPoll = polls.find(p => p.id === selectedPollId);
    const draftPolls = polls.filter(p => p.status === "DRAFT");
    const closedPolls = polls.filter(p => p.status === "CLOSED");

    const [fullscreenResults, setFullscreenResults] = useState(false);

    if (loading) return (
        <div className="fixed inset-0 bg-[#3A1B4E] flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-[#FFC100] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="fixed inset-0 bg-[#3A1B4E] text-white flex flex-col overflow-hidden">

            {/* MODO TRANSMISIÓN PRO (REDISEÑADO) */}
            {fullscreenResults && currentPoll && (
                <div
                    className="fixed inset-0 z-[200] bg-[#1A0826] animate-fade overflow-hidden cursor-pointer"
                    onClick={() => setFullscreenResults(false)}
                >
                    {currentPoll.type === 'WORDCLOUD' ? (
                        /* VISTA INMERSIVA PARA MAPA DE IDEAS */
                        <div className="w-full h-full relative group cursor-default" onClick={(e) => e.stopPropagation()}>
                            <LiveResults poll={currentPoll} />

                            {/* Overlay de Control Sutil */}
                            <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-[#3A1B4E] px-4 py-2 rounded-xl shadow-2xl pointer-events-auto border border-white/10">
                                    <h2 className="text-white font-black uppercase text-[10px] tracking-[0.3em]">{currentPoll.title}</h2>
                                </div>
                                <button
                                    onClick={() => setFullscreenResults(false)}
                                    className="p-3 bg-red-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all pointer-events-auto"
                                >
                                    <LucideX className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Mini Temporizador Flotante */}
                            <div className="absolute bottom-8 right-8 bg-[#3A1B4E] text-[#FFC100] px-6 py-3 rounded-2xl font-mono text-3xl font-black shadow-2xl border-2 border-[#FFC100]/20 flex items-center gap-3">
                                <div className="w-3 h-3 bg-[#FFC100] rounded-full animate-pulse" />
                                <CountdownTimer endTime={currentPoll.endTime!} />
                            </div>

                            {/* Total Votos Discreto */}
                            <div className="absolute bottom-8 left-8 bg-[#3A1B4E]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                                <span className="block text-[8px] font-black text-white/30 uppercase tracking-widest">Total Ideas</span>
                                <span className="text-xl font-black text-white">{currentPoll.totalVotes}</span>
                            </div>
                        </div>
                    ) : (
                        /* VISTA PRO PARA BOOLEAN Y MULTIPLE */
                        <div className="w-full h-full flex flex-col p-6 cursor-default" onClick={(e) => e.stopPropagation()}>
                            {/* Header Transmisión */}
                            <div className="flex items-center justify-between px-6 py-4 bg-white/2 rounded-2xl border border-white/5 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-[#2EB67D] rounded-full animate-pulse shadow-[0_0_10px_#2EB67D]" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2EB67D]">Transmisión en Vivo</span>
                                </div>

                                <div className="flex items-center gap-8">
                                    {/* Selector de Vista en Fullscreen */}
                                    {currentPoll.type === 'BOOLEAN' && (
                                        <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
                                            <button
                                                onClick={() => setViewMode('chart')}
                                                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${viewMode === 'chart' ? 'bg-[#FFC100] text-[#3A1B4E]' : 'text-white/30 hover:text-white'}`}
                                            >
                                                <div className="flex items-center gap-2"><LucidePieChart className="w-3 h-3" /> Pastel</div>
                                            </button>
                                            <button
                                                onClick={() => setViewMode('congress')}
                                                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${viewMode === 'congress' ? 'bg-[#FFC100] text-[#3A1B4E]' : 'text-white/30 hover:text-white'}`}
                                            >
                                                <div className="flex items-center gap-2"><LucideLayoutGrid className="w-3 h-3" /> Hemiciclo</div>
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setFullscreenResults(false)}
                                        className="text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-[#C22359] transition-all"
                                    >
                                        Detener Transmisión
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 flex gap-8 items-stretch min-h-0">
                                {/* Lado Izquierdo: Visualización Centrada */}
                                <div className="flex-[2] bg-[#2A103D]/30 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center p-12 relative shadow-inner overflow-hidden">
                                    <div className="w-full h-full flex items-center justify-center">
                                        {(currentPoll.type === 'BOOLEAN' && viewMode === 'congress')
                                            ? <div className="w-full transform scale-125 origin-center"><CongressHemicycle poll={currentPoll} /></div>
                                            : <div className="w-full h-full max-w-[600px]"><LiveResults poll={currentPoll} /></div>}
                                    </div>
                                </div>

                                {/* Lado Derecho: Panel de Datos */}
                                <div className="w-[350px] flex flex-col justify-between py-4">
                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <h2 className="text-4xl font-black uppercase tracking-tighter leading-tight text-white/90">{currentPoll.title}</h2>
                                            <div className="h-0.5 w-12 bg-[#FFC100]/40 rounded-full" />
                                        </div>

                                        <div className="grid gap-4">
                                            <div className="bg-white/3 p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                                                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Total Votos</span>
                                                <span className="text-4xl font-black text-[#FFC100]">{currentPoll.totalVotes}</span>
                                            </div>
                                            {currentPoll.type === 'BOOLEAN' && (
                                                <div className="bg-white/3 p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Quórum 2/3</span>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-3xl font-black text-white/40">{Math.ceil(currentPoll.maxVoters * (2 / 3))}</span>
                                                        <span className={`${currentPoll.totalVotes >= (currentPoll.maxVoters * 2 / 3) ? 'text-[#2EB67D]' : 'text-[#C22359]'} text-[8px] font-black uppercase`}>
                                                            {currentPoll.totalVotes >= (currentPoll.maxVoters * 2 / 3) ? 'Alcanzado' : 'Faltan ' + (Math.ceil(currentPoll.maxVoters * 2 / 3) - currentPoll.totalVotes)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-[#2A103D] border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col items-center">
                                        <span className="text-[10px] font-black text-[#FFC100]/40 uppercase tracking-[0.5em] mb-4">Temporizador</span>
                                        <div className="text-8xl font-black font-mono tracking-tighter text-white">
                                            <CountdownTimer endTime={currentPoll.endTime!} />
                                        </div>
                                        <div className="absolute bottom-0 left-0 h-1 bg-[#FFC100]" style={{ width: '100%' }} />
                                    </div>

                                    <div className="text-center">
                                        <p className="opacity-10 text-[7px] font-black uppercase tracking-[1.5em]">HIVEYOUNG ASAMBLEA</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <nav className="bg-[#2A103D] border-b border-white/10 py-3 px-8 shrink-0 flex items-center justify-between z-50">
                <div className="flex items-center gap-3">
                    <LucideBarChart3 className="w-4 h-4 text-[#FFC100]" />
                    <h1 className="text-[11px] font-bold uppercase tracking-widest">Panel de Control HY</h1>
                </div>
                <div className="flex items-center gap-6">
                    {currentPoll && (
                        <button
                            onClick={() => setFullscreenResults(true)}
                            className="text-[9px] font-black text-[#FFC100] uppercase flex items-center gap-2 bg-[#FFC100]/5 border border-[#FFC100]/20 px-3 py-1.5 rounded-lg hover:bg-[#FFC100] hover:text-[#3A1B4E] transition-all"
                        >
                            Ver en Pantalla Completa <LucideExternalLink className="w-3 h-3" />
                        </button>
                    )}
                    <Link href="/votar" target="_blank" className="text-[9px] font-bold text-white/40 hover:text-white uppercase flex items-center gap-2">
                        Sala Pública <LucideExternalLink className="w-3 h-3" />
                    </Link>
                    <Link href="/" className="text-[10px] font-bold text-[#C22359] hover:text-white uppercase">Salir</Link>
                </div>
            </nav>

            <main className="flex-1 p-6 overflow-hidden flex gap-6 min-h-0">

                {/* MODAL RESUMEN */}
                {lastPollSummary && (
                    <div
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade cursor-pointer"
                        onClick={() => setLastPollSummary(null)}
                    >
                        <div
                            className="bg-[#2A103D] border border-white/20 p-8 rounded-2xl max-w-xl w-full flex flex-col gap-6 shadow-2xl relative cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center space-y-1">
                                <span className="text-[10px] font-black text-[#FFC100] uppercase tracking-[0.4em]">Escrutinio Finalizado</span>
                                <h2 className="text-3xl font-black truncate">{lastPollSummary.title}</h2>
                            </div>

                            {(lastPollSummary.type === 'BOOLEAN' || lastPollSummary.type === 'MULTIPLE') ? (
                                <>
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
                                    <div className={`p-4 rounded-xl flex items-center gap-4 ${lastPollSummary.totalVotes >= (lastPollSummary.maxVoters * (2 / 3)) ? 'bg-green-500/10 border border-green-500/30 text-green-500' : 'bg-red-500/10 border border-red-500/30 text-red-500'}`}>
                                        {lastPollSummary.totalVotes >= (lastPollSummary.maxVoters * (2 / 3)) ? <LucideUsers className="w-5 h-5" /> : <LucideAlertCircle className="w-5 h-5" />}
                                        <div className="text-left font-black uppercase text-xs">
                                            {lastPollSummary.totalVotes >= (lastPollSummary.maxVoters * (2 / 3)) ? "QUÓRUM ALCANZADO - ACEPTADA" : "QUÓRUM INSUFICIENTE - RECHAZADA"}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-6">
                                        <div className="text-center">
                                            <span className="text-[10px] font-black text-[#FFC100] uppercase tracking-[0.4em]">Resumen de Ideas</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-2 custom-scroll">
                                            {lastPollSummary.wordVotes?.sort((a, b) => b.count - a.count).map((wv, i) => (
                                                <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 group hover:bg-white/10 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-[#FFC100] text-[#3A1B4E]' : 'bg-white/10 text-white/40'}`}>
                                                            {i + 1}
                                                        </span>
                                                        <span className="text-sm font-bold uppercase tracking-tight">{wv.text}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl font-black text-[#FFC100]">{wv.count}</span>
                                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Menciones</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30">
                                            <span>Total de Aportes</span>
                                            <span className="text-[#FFC100]">{lastPollSummary.totalVotes}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-[#3A1B4E] rounded-xl p-4 h-[220px]">
                                <LiveResults poll={lastPollSummary} compact={true} />
                            </div>
                            <button className="w-full py-3 bg-[#FFC100] text-[#3A1B4E] rounded-xl font-black uppercase tracking-widest text-xs" onClick={() => setLastPollSummary(null)}>CERRAR ACTA Y ARCHIVAR</button>
                        </div>
                    </div>
                )}

                {/* Sidebar Izquierda: Archivo y Pendientes */}
                <aside className="w-80 flex flex-col gap-6 shrink-0 h-full overflow-hidden">
                    <div className="flex-1 bg-[#2A103D]/50 border border-white/5 rounded-2xl flex flex-col min-h-0 shadow-inner">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                                <LucideArchive className="w-3 h-3" /> Pendientes
                            </span>
                            <Link href="/admin/crear" className="text-[9px] font-black text-[#FFC100] uppercase hover:underline">+ Crear Nueva</Link>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {draftPolls.length > 0 ? draftPolls.map(p => (
                                <div key={p.id} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3 group hover:bg-white/10 transition-all">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                {p.type === "BOOLEAN" && <LucideAlertCircle className="w-2.5 h-2.5 text-[#FFC100]" />}
                                                {p.type === "MULTIPLE" && <LucidePieChart className="w-2.5 h-2.5 text-[#529CE8]" />}
                                                {p.type === "WORDCLOUD" && <LucideType className="w-2.5 h-2.5 text-[#2EB67D]" />}
                                                <span className="text-[8px] font-bold uppercase opacity-30">{p.type}</span>
                                            </div>
                                            <h3 className="text-xs font-bold leading-tight">{p.title}</h3>
                                        </div>
                                        <button onClick={() => handleDeletePoll(p.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-[#C22359] transition-all">
                                            <LucideTrash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleLaunchPoll(p.id, 5)}
                                        className="w-full py-1.5 bg-[#FFC100] text-[#3A1B4E] rounded-lg font-black text-[8px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-colors"
                                    >
                                        <LucidePlay className="w-2.5 h-2.5" fill="currentColor" /> Lanzar
                                    </button>
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2 opacity-20">
                                    <LucideArchive className="w-8 h-8" />
                                    <p className="text-[10px] font-bold uppercase">No hay votaciones<br />archivadas</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-48 bg-[#2A103D]/30 border border-white/5 rounded-2xl flex flex-col shrink-0 min-h-0">
                        <div className="p-3 border-b border-white/5">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                                <LucideHistory className="w-3 h-3" /> Recientes
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-1">
                            {closedPolls.map(p => (
                                <div key={p.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => setSelectedPollId(p.id)}>
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className={`text-[10px] font-medium truncate max-w-[140px] ${selectedPollId === p.id ? 'text-[#FFC100]' : 'opacity-60'}`}>{p.title}</span>
                                        <span className="text-[7px] font-black text-white/20 uppercase">{p.totalVotes} votos</span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePoll(p.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-all"
                                    >
                                        <LucideTrash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main: Monitor de Votación Seleccionada */}
                <section className="flex-1 min-w-0 h-full flex flex-col gap-4">
                    {currentPoll ? (
                        <>
                            <div className="flex items-center justify-between shrink-0">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${currentPoll.status === 'ACTIVE' ? 'bg-[#2EB67D] text-[#3A1B4E]' : 'bg-white/10 text-white/40'}`}>
                                            {currentPoll.status}
                                        </span>
                                        <span className="text-[9px] font-bold text-[#FFC100] uppercase tracking-widest opacity-60">{currentPoll.type}</span>
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tight uppercase leading-none">{currentPoll.title}</h2>
                                </div>

                                {currentPoll.type === 'BOOLEAN' && currentPoll.status === 'ACTIVE' && (
                                    <div className="flex bg-white/5 rounded-lg border border-white/10 overflow-hidden shrink-0">
                                        <button onClick={() => setViewMode('chart')} className={`p-2 transition-all ${viewMode === 'chart' ? 'bg-[#FFC100] text-[#3A1B4E]' : 'text-white/20'}`}><LucidePieChart className="w-5 h-5" /></button>
                                        <button onClick={() => setViewMode('congress')} className={`p-2 transition-all ${viewMode === 'congress' ? 'bg-[#FFC100] text-[#3A1B4E]' : 'text-white/20'}`}><LucideLayoutGrid className="w-5 h-5" /></button>
                                    </div>
                                )}
                            </div>

                            {/* TABS DE VOTACIONES ACTIVAS */}
                            {polls.filter(p => p.status === "ACTIVE").length > 1 && (
                                <div className="flex gap-2 p-4 bg-[#2A103D]/80 border-b border-white/5 overflow-x-auto shrink-0 z-10">
                                    {polls.filter(p => p.status === "ACTIVE").map((p, idx) => (
                                        <button
                                            key={p.id}
                                            onClick={() => setSelectedPollId(p.id)}
                                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border flex items-center gap-2 ${selectedPollId === p.id ? 'bg-[#FFC100] text-[#3A1B4E] border-[#FFC100] shadow-lg shadow-[#FFC100]/20' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${selectedPollId === p.id ? 'bg-[#3A1B4E]' : 'bg-[#FFC100] animate-pulse'}`} />
                                            Sesión {idx + 1}: {p.title}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="flex-1 relative flex flex-col overflow-hidden">
                                {/* Stats Floating Overlay */}
                                <div className="absolute top-6 left-6 flex gap-3 z-10">
                                    <div className="bg-black/20 backdrop-blur-md border border-white/5 px-4 py-2 rounded-xl">
                                        <span className="block text-[8px] font-black text-white/30 uppercase tracking-tighter">Escrutado</span>
                                        <span className="text-xl font-black text-[#FFC100]">{currentPoll.totalVotes}</span>
                                    </div>
                                    {currentPoll.type === 'BOOLEAN' && (
                                        <div className="bg-black/20 backdrop-blur-md border border-white/5 px-4 py-2 rounded-xl">
                                            <span className="block text-[8px] font-black text-white/30 uppercase tracking-tighter">Asientos</span>
                                            <span className="text-xl font-black text-white">{currentPoll.maxVoters}</span>
                                        </div>
                                    )}
                                </div>

                                {currentPoll.status === "ACTIVE" && (
                                    <div className="absolute top-6 right-6 bg-[#FFC100] text-[#3A1B4E] px-4 py-2 rounded-xl font-mono text-2xl font-black shadow-xl z-20">
                                        <CountdownTimer endTime={currentPoll.endTime!} />
                                    </div>
                                )}

                                <div className={`flex-1 w-full h-full relative ${currentPoll.type === 'WORDCLOUD' ? 'p-0' : 'p-12'}`}>
                                    {(currentPoll.type === 'BOOLEAN' && viewMode === 'congress')
                                        ? <CongressHemicycle poll={currentPoll} />
                                        : <LiveResults poll={currentPoll} />}
                                </div>

                                {currentPoll.status === "ACTIVE" && (
                                    <div className="p-4 bg-black/10 border-t border-white/5 flex justify-center shrink-0">
                                        <button
                                            onClick={() => handleClosePoll(currentPoll.id)}
                                            className="px-8 py-3 bg-[#C22359] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-red-700 transition-all flex items-center gap-2"
                                        >
                                            Finalizar Votación
                                        </button>
                                    </div>
                                )}
                            </div>

                            {currentPoll.status === "CLOSED" && (
                                <div
                                    className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center p-12 space-y-8 animate-fade z-30 cursor-pointer"
                                    onClick={() => setSelectedPollId(null)}
                                >
                                    <div className="text-center space-y-2 cursor-default" onClick={(e) => e.stopPropagation()}>
                                        <span className="text-[120px] font-black text-white/5 uppercase -rotate-12 select-none tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">ARCHIVADA</span>
                                        <h2 className="text-3xl font-black uppercase tracking-widest relative z-10">Sesión Finalizada</h2>
                                        <p className="text-white/40 text-xs font-medium relative z-10">El escrutinio ha sido validado y guardado en el historial.</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLastPollSummary(currentPoll);
                                        }}
                                        className="relative z-10 px-10 py-4 bg-[#FFC100] text-[#3A1B4E] rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
                                    >
                                        <LucideBarChart3 className="w-5 h-5" /> Ver Acta de Resultados
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                            <div className="w-32 h-32 bg-white/2 rounded-full flex items-center justify-center border border-white/5 relative">
                                <LucideArchive className="w-12 h-12 text-white/10" />
                                <div className="absolute inset-0 rounded-full border border-[#FFC100]/20 animate-ping opacity-20" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black uppercase tracking-tighter">Monitor Desconectado</h2>
                                <p className="text-white/20 text-sm max-w-xs mx-auto font-medium">Selecciona una votación del archivo o lanza una nueva sesión para comenzar el monitoreo.</p>
                            </div>
                            <Link href="/admin/crear" className="px-12 py-5 bg-[#FFC100] text-[#3A1B4E] rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:scale-105 transition-all">
                                + EMPEZAR NUEVA SESIÓN
                            </Link>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
