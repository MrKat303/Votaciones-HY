"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Poll } from "@/types";
import { LiveResults } from "@/components/voting/LiveResults";
import { CongressHemicycle } from "@/components/voting/CongressHemicycle";
import { CountdownTimer } from "@/components/voting/CountdownTimer";
import Link from "next/link";
import { LucideBarChart3, LucideUsers, LucideRefreshCw, LucideLayoutGrid, LucidePieChart, LucideExternalLink, LucidePlay, LucideHistory, LucideArchive, LucideTrash2, LucideAlertCircle, LucideType, LucideX, LucideQrCode, LucideEye, LucideEyeOff, LucidePlusCircle, LucideMenu } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'chart' | 'congress'>('chart');
    const [lastPollSummary, setLastPollSummary] = useState<Poll | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [fullscreenResults, setFullscreenResults] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const { admin, loading: authLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !admin) {
            router.push("/admin/login");
        }
    }, [admin, authLoading, router]);

    const fetchPolls = async () => {
        if (isProcessing || !admin) return;
        try {
            const allPolls = await api.getPolls(admin.id);
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
        if (admin) {
            fetchPolls();
            const interval = setInterval(fetchPolls, 2000);
            return () => clearInterval(interval);
        }
    }, [selectedPollId, admin]);

    const handleLaunchPoll = async (id: string, duration: number) => {
        await api.startPoll(id, duration);
        setSelectedPollId(id);
        fetchPolls();
    };

    const handleExtendPoll = async (id: string, minutes: number = 2) => {
        setIsProcessing(true);
        try {
            await api.extendPoll(id, minutes);
            setLastPollSummary(null);
            setSelectedPollId(id);
        } finally {
            setIsProcessing(false);
            fetchPolls();
        }
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
                setPolls(prev => prev.map(p => p.id === id ? { ...p, status: "CLOSED" as const } : p));
            }
        } finally {
            setIsProcessing(false);
            fetchPolls();
        }
    };

    const toggleHideResults = async (id: string, current: boolean) => {
        await api.setHideResults(id, !current);
        fetchPolls();
    };

    const handleDeletePoll = async (id: string) => {
        await api.deletePoll(id);
        if (selectedPollId === id) setSelectedPollId(null);
        fetchPolls();
    };

    const currentPoll = polls.find(p => p.id === selectedPollId);
    const activePolls = polls.filter(p => p.status === "ACTIVE");
    const draftPolls = polls.filter(p => p.status === "DRAFT");
    const closedPolls = polls.filter(p => p.status === "CLOSED");

    if (loading || authLoading) return (
        <div className="fixed inset-0 bg-[#3A1B4E] flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-[#FFC100] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!admin) return null; // Wait for redirect

    return (
        <div className="fixed inset-0 bg-[#3A1B4E] text-white flex flex-col overflow-hidden">
            {/* FULLSCREEN TRANSMISSION FOR ADMIN */}
            {fullscreenResults && currentPoll && (
                <div className="fixed inset-0 z-[200] animate-fade overflow-hidden flex flex-col font-poppins text-white">
                    {currentPoll.type === 'WORDCLOUD' ? (
                        /* PRESENTATION MODE FOR WORDCLOUD (IDEAS) - FULL PANTALLA PASTEL */
                        <div className="fixed inset-0 bg-[#F4EDE4] flex flex-col">
                            <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20 pointer-events-none">
                                <div className="bg-[#3A1B4E] px-4 py-2 rounded-xl shadow-2xl pointer-events-auto border border-white/10 flex items-center gap-4">
                                    <div className="w-2 h-2 bg-[#2EB67D] rounded-full animate-pulse shadow-[0_0_8px_#2EB67D]" />
                                    <h2 className="text-white font-black uppercase text-[10px] tracking-[0.3em]">{currentPoll.title}</h2>
                                </div>
                                <button
                                    onClick={() => setFullscreenResults(false)}
                                    className="p-3 bg-[#3A1B4E] text-white rounded-full shadow-2xl hover:scale-110 transition-all pointer-events-auto"
                                >
                                    <LucideX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 w-full relative">
                                <LiveResults poll={currentPoll} />
                            </div>

                            <div className="absolute bottom-4 lg:bottom-12 right-4 lg:right-12 bg-[#3A1B4E] text-[#FFC100] px-6 lg:px-10 py-3 lg:py-5 rounded-2xl lg:rounded-[2.5rem] font-mono text-2xl lg:text-4xl font-black shadow-2xl z-20 flex items-center gap-3 lg:gap-4">
                                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-[#FFC100] rounded-full animate-pulse" />
                                <CountdownTimer endTime={currentPoll.endTime!} />
                            </div>

                            <div className="absolute bottom-4 lg:bottom-12 left-4 lg:left-12 bg-white/40 lg:bg-[#3A1B4E]/10 backdrop-blur-md px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl border border-[#3A1B4E]/10 z-20">
                                <span className="block text-[7px] lg:text-[8px] font-black text-[#3A1B4E]/40 uppercase tracking-widest">Total Ideas</span>
                                <span className="text-xl lg:text-3xl font-black text-[#3A1B4E]">{currentPoll.totalVotes}</span>
                            </div>

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-20 hidden lg:block">
                                <span className="text-[12px] font-black uppercase tracking-[1em] text-[#3A1B4E]">version V2.9</span>
                            </div>
                        </div>
                    ) : (
                        /* DASHBOARD MODE FOR BOOLEAN/MULTIPLE */
                        <div className="fixed inset-0 bg-[#1A0826] flex flex-col">
                            <header className="h-16 lg:h-24 border-b border-white/5 px-4 lg:px-8 flex items-center justify-between shrink-0 bg-[#1A0826]/80 backdrop-blur-xl z-50">
                                <div className="flex items-center gap-3 lg:gap-4 truncate">
                                    <div className="w-3 h-3 lg:w-4 lg:h-4 bg-[#2EB67D] rounded-full animate-pulse shadow-[0_0_15px_#2EB67D]" />
                                    <span className="text-[9px] lg:text-[12px] font-black uppercase tracking-[0.2em] lg:tracking-[0.4em] text-[#2EB67D] whitespace-nowrap">En Vivo</span>
                                </div>

                                <div className="flex items-center gap-2 lg:gap-8">
                                    <div className="hidden md:flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10">
                                        <div className="bg-white p-2 rounded-xl">
                                            <QRCodeSVG value={`${typeof window !== 'undefined' ? window.location.origin : ''}/votar`} size={48} fgColor="#1A0826" />
                                        </div>
                                        <div className="flex flex-col pr-4">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-0.5">Vota en vivo</span>
                                            <span className="text-[10px] font-black text-[#FFC100] tracking-tighter">{typeof window !== 'undefined' ? window.location.hostname : ''}/votar</span>
                                        </div>
                                    </div>

                                    {currentPoll.type === 'BOOLEAN' && (
                                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                                            <button
                                                onClick={() => setViewMode('chart')}
                                                className={`flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-[8px] lg:text-[10px] font-black uppercase transition-all ${viewMode === 'chart' ? 'bg-[#FFC100] text-[#1A0826]' : 'text-white/40 hover:text-white'}`}
                                            >
                                                <LucidePieChart className="w-3 h-3 lg:w-4 lg:h-4" /> <span className="hidden xs:inline">Pastel</span>
                                            </button>
                                            <button
                                                onClick={() => setViewMode('congress')}
                                                className={`flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-[8px] lg:text-[10px] font-black uppercase transition-all ${viewMode === 'congress' ? 'bg-[#FFC100] text-[#1A0826]' : 'text-white/40 hover:text-white'}`}
                                            >
                                                <LucideLayoutGrid className="w-3 h-3 lg:w-4 lg:h-4" /> <span className="hidden xs:inline">Hemi</span>
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setFullscreenResults(false)}
                                        className="px-3 lg:px-6 py-1.5 lg:py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[8px] lg:text-[10px] font-black uppercase text-red-500 hover:bg-red-500 hover:text-white transition-all whitespace-nowrap"
                                    >
                                        Detener
                                    </button>
                                </div>
                            </header>

                            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                                <div className="flex-1 relative flex flex-col p-4 lg:p-12 overflow-hidden">
                                    <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[2rem] lg:rounded-[3rem] relative overflow-hidden flex items-center justify-center p-4">
                                        {currentPoll.type === 'BOOLEAN' && viewMode === 'congress'
                                            ? <div className="w-full h-full scale-75 lg:scale-100"><CongressHemicycle poll={currentPoll} /></div>
                                            : <LiveResults poll={currentPoll} />}
                                    </div>
                                </div>

                                <aside className="w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col p-6 lg:p-10 space-y-4 lg:space-y-6 bg-[#1A0826]/30 shrink-0">
                                    <div className="space-y-2 lg:space-y-3">
                                        <h2 className="text-xl lg:text-3xl font-black uppercase tracking-tighter leading-none truncate">{currentPoll.title}</h2>
                                        <div className="w-12 h-1 bg-[#FFC100] rounded-full" />
                                    </div>

                                    <div className="flex lg:flex-col gap-4 overflow-hidden">
                                        <div className="flex-1 bg-white/5 border border-white/10 p-4 lg:p-6 rounded-2xl relative overflow-hidden group">
                                            <div className="relative z-10 flex items-center justify-between">
                                                <span className="text-[8px] lg:text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Votos</span>
                                                <span className="text-2xl lg:text-4xl font-black text-[#FFC100] tracking-tighter">{currentPoll.totalVotes}</span>
                                            </div>
                                        </div>

                                        {currentPoll.type === 'BOOLEAN' && (
                                            <div className="flex-1 bg-white/5 border border-white/10 p-4 lg:p-6 rounded-2xl relative overflow-hidden group">
                                                <div className="relative z-10 space-y-1 lg:space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[8px] lg:text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Quórum</span>
                                                        <span className="text-xl lg:text-3xl font-black text-white tracking-tighter">{Math.ceil((currentPoll.maxVoters || 100) * 0.66)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-white/5 border border-[#FFC100]/20 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-[#FFC100]/20" />
                                        <div className="relative z-10 flex flex-col items-center gap-2 lg:gap-3">
                                            <span className="text-[8px] lg:text-[10px] font-black text-[#FFC100] uppercase tracking-[0.4em]">Temporizador</span>
                                            <div className="text-3xl lg:text-6xl font-black tracking-tighter leading-none text-white">
                                                <CountdownTimer endTime={currentPoll.endTime!} />
                                            </div>
                                        </div>
                                    </div>

                                    <footer className="pt-4 border-t border-white/5 flex flex-col items-center gap-2 opacity-30 mt-auto hidden lg:flex">
                                        <p className="text-[9px] font-black uppercase tracking-[0.6em]">version V2.9</p>
                                    </footer>
                                </aside>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <nav className="bg-[#2A103D] border-b border-white/10 py-3 px-4 lg:px-8 shrink-0 flex items-center justify-between z-50">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="lg:hidden p-2 text-[#FFC100] hover:bg-white/5 rounded-lg"
                    >
                        <LucideMenu className="w-5 h-5" />
                    </button>
                    <LucideBarChart3 className="w-4 h-4 text-[#FFC100] hidden xs:block" />
                    <h1 className="text-[10px] lg:text-[11px] font-bold uppercase tracking-widest truncate max-w-[120px] xs:max-w-none">ADMINISTRACIÓN</h1>
                </div>
                <div className="flex items-center gap-3 lg:gap-6">
                    {currentPoll && (
                        <button
                            onClick={() => setFullscreenResults(true)}
                            className="text-[8px] lg:text-[9px] font-black text-[#FFC100] uppercase flex items-center gap-1.5 lg:gap-2 bg-[#FFC100]/5 border border-[#FFC100]/20 px-2 lg:px-3 py-1.5 rounded-lg hover:bg-[#FFC100] hover:text-[#3A1B4E] transition-all"
                        >
                            <span className="hidden xs:inline">TRANSMITIR</span> <LucideExternalLink className="w-3 h-3" />
                        </button>
                    )}
                    <Link href="/votar" target="_blank" className="text-[9px] font-bold text-white/40 hover:text-white uppercase flex items-center gap-2 hidden sm:flex">
                        Público <LucideExternalLink className="w-3 h-3" />
                    </Link>
                    <button onClick={logout} className="text-[9px] lg:text-[10px] font-bold text-[#C22359] hover:text-white uppercase transition-colors px-2">
                        SALIR
                    </button>
                    <span className="text-[9px] lg:text-[10px] text-white/40 font-mono hidden md:inline">{admin.rut}</span>
                </div>
            </nav>

            <main className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col lg:flex-row gap-6 min-h-0 relative">
                {/* Overlay para cerrar sidebar en móvil */}
                {showSidebar && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[35] lg:hidden"
                        onClick={() => setShowSidebar(false)}
                    />
                )}
                {/* MODAL RESUMEN */}
                {lastPollSummary && (
                    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade cursor-pointer" onClick={() => setLastPollSummary(null)}>
                        <div className="bg-[#2A103D] border border-white/20 p-8 rounded-2xl max-w-xl w-full flex flex-col gap-6 shadow-2xl relative cursor-default" onClick={(e) => e.stopPropagation()}>
                            <div className="text-center space-y-1">
                                <span className="text-[10px] font-black text-[#FFC100] uppercase tracking-[0.4em]">Escrutinio Finalizado</span>
                                <h2 className="text-3xl font-black truncate">{lastPollSummary.title}</h2>
                            </div>

                            {(lastPollSummary.type === 'BOOLEAN' || lastPollSummary.type === 'MULTIPLE') ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                                        <span className="block text-[8px] font-bold text-white/30 uppercase mb-1">Total Votos</span>
                                        <span className="text-2xl font-black">{lastPollSummary.totalVotes}</span>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                                        <span className="block text-[8px] font-bold text-white/30 uppercase mb-1">Quórum (2/3)</span>
                                        <span className="text-2xl font-black text-white/60">{Math.ceil((lastPollSummary.maxVoters || 100) * 0.66)}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                                    <span className="block text-[8px] font-bold text-white/30 uppercase mb-1">Total Ideas</span>
                                    <span className="text-2xl font-black">{lastPollSummary.totalVotes}</span>
                                </div>
                            )}

                            <div className="bg-[#3A1B4E] rounded-xl p-4 h-[220px]">
                                <LiveResults poll={lastPollSummary} compact={true} />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    className="flex-1 py-3 bg-[#2EB67D] text-[#3A1B4E] rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white transition-all"
                                    onClick={() => handleExtendPoll(lastPollSummary.id, 2)}
                                >
                                    <LucideRefreshCw className="w-4 h-4" /> Reanudar +2min
                                </button>
                                <button
                                    className="flex-1 py-3 bg-[#FFC100] text-[#3A1B4E] rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all"
                                    onClick={() => setLastPollSummary(null)}
                                >
                                    Cerrar y Archivar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <aside className={`
                    fixed lg:relative inset-y-0 left-0 w-80 bg-[#1A0826] lg:bg-transparent z-40 
                    transform transition-transform duration-300 ease-in-out
                    ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    flex flex-col gap-6 shrink-0 h-full p-6 lg:p-0 border-r lg:border-none border-white/10
                `}>
                    <div className="lg:hidden flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-[#FFC100] tracking-widest uppercase">Panel de Control</span>
                        <button onClick={() => setShowSidebar(false)} className="p-2 text-white/40"><LucideX className="w-5 h-5" /></button>
                    </div>
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
                                    <p className="text-[10px] font-bold uppercase">No hay votaciones archivadas</p>
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
                                    <span className={`text-[10px] font-medium truncate max-w-[120px] ${selectedPollId === p.id ? 'text-[#FFC100]' : 'opacity-60'}`}>{p.title}</span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleExtendPoll(p.id, 2); }}
                                            className="p-1 hover:text-[#2EB67D] rounded"
                                            title="Reanudar +2min"
                                        >
                                            <LucideRefreshCw className="w-3 h-3" />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeletePoll(p.id); }} className="p-1 hover:text-red-500 rounded">
                                            <LucideTrash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <section className="flex-1 min-w-0 h-full flex flex-col gap-4 relative">
                    {/* TABS PARA MÚLTIPLES TRANSMISIONES ACTIVAS */}
                    {activePolls.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 shrink-0 scrollbar-hide">
                            {activePolls.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedPollId(p.id)}
                                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase whitespace-nowrap transition-all border flex items-center gap-2 ${selectedPollId === p.id
                                        ? 'bg-[#FFC100] text-[#3A1B4E] border-[#FFC100] shadow-lg scale-105'
                                        : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white'}`}
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full ${selectedPollId === p.id ? 'bg-[#3A1B4E] animate-pulse' : 'bg-[#2EB67D]'}`} />
                                    {p.title}
                                </button>
                            ))}
                        </div>
                    )}

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
                                    <h2 className="text-xl lg:text-3xl font-black tracking-tight uppercase leading-none truncate">{currentPoll.title}</h2>
                                </div>

                                {currentPoll.status === 'ACTIVE' && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleHideResults(currentPoll.id, currentPoll.settings.hideResults)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${currentPoll.settings.hideResults ? 'bg-red-500/20 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-[#2EB67D]/20 text-[#2EB67D] border border-[#2EB67D]/20 hover:bg-[#2EB67D] hover:text-[#3A1B4E]'}`}
                                        >
                                            {currentPoll.settings.hideResults ? <><LucideEyeOff className="w-3 h-3" /> Privado</> : <><LucideEye className="w-3 h-3" /> Público</>}
                                        </button>
                                        {currentPoll.type === 'BOOLEAN' && (
                                            <div className="flex bg-white/5 rounded-lg border border-white/10 overflow-hidden shrink-0">
                                                <button onClick={() => setViewMode('chart')} className={`p-2 transition-all ${viewMode === 'chart' ? 'bg-[#FFC100] text-[#3A1B4E]' : 'text-white/20'}`}><LucidePieChart className="w-5 h-5" /></button>
                                                <button onClick={() => setViewMode('congress')} className={`p-2 transition-all ${viewMode === 'congress' ? 'bg-[#FFC100] text-[#3A1B4E]' : 'text-white/20'}`}><LucideLayoutGrid className="w-5 h-5" /></button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 relative flex flex-col overflow-hidden bg-black/10 rounded-3xl border border-white/5">
                                <div className="absolute top-6 left-6 flex gap-3 z-10">
                                    <div className="bg-black/20 backdrop-blur-md border border-white/5 px-4 py-2 rounded-xl">
                                        <span className="block text-[8px] font-black text-white/30 uppercase tracking-tighter">Votos</span>
                                        <span className="text-xl font-black text-[#FFC100]">{currentPoll.totalVotes}</span>
                                    </div>
                                </div>

                                {currentPoll.status === "ACTIVE" && (
                                    <div className="absolute top-6 right-6 bg-[#FFC100] text-[#3A1B4E] px-4 py-2 rounded-xl font-mono text-2xl font-black shadow-xl z-10">
                                        <CountdownTimer endTime={currentPoll.endTime!} />
                                    </div>
                                )}

                                <div className="flex-1 w-full h-full relative p-4 lg:p-12">
                                    {currentPoll.type === 'BOOLEAN' && viewMode === 'congress'
                                        ? <CongressHemicycle poll={currentPoll} />
                                        : <LiveResults poll={currentPoll} />}
                                </div>

                                {currentPoll.status === "ACTIVE" && (
                                    <div className="p-4 bg-black/40 border-t border-white/5 flex flex-wrap justify-center items-center gap-4 shrink-0">
                                        <button onClick={() => setFullscreenResults(true)} className="flex-1 lg:flex-none px-4 lg:px-6 py-3 bg-[#FFC100] text-[#3A1B4E] rounded-xl font-black text-[9px] lg:text-[10px] uppercase tracking-[0.15em] lg:tracking-[0.2em] shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2">
                                            <LucidePlay className="w-3 h-3 lg:w-4 lg:h-4 fill-current" /> <span className="whitespace-nowrap">PRESENTAR</span>
                                        </button>

                                        <div className="hidden sm:block bg-white p-1.5 rounded-lg">
                                            <QRCodeSVG value={`${typeof window !== 'undefined' ? window.location.origin : ''}/votar`} size={38} fgColor="#3A1B4E" />
                                        </div>

                                        <div className="flex items-center gap-2 w-full lg:w-auto">
                                            <button
                                                onClick={() => handleClosePoll(currentPoll.id)}
                                                className="flex-1 lg:flex-none px-4 lg:px-6 py-3 bg-[#C22359]/20 text-[#C22359] border border-[#C22359]/20 rounded-xl font-black text-[9px] lg:text-[10px] uppercase tracking-[0.15em] hover:bg-[#C22359] hover:text-white transition-all text-center"
                                            >
                                                CERRAR
                                            </button>

                                            <button
                                                onClick={() => handleExtendPoll(currentPoll.id, 2)}
                                                disabled={isProcessing}
                                                className="flex-1 lg:flex-none px-4 lg:px-6 py-3 bg-[#2EB67D]/20 text-[#2EB67D] border border-[#2EB67D]/20 rounded-xl font-black text-[9px] lg:text-[10px] uppercase tracking-[0.15em] hover:bg-[#2EB67D] hover:text-white transition-all flex items-center justify-center gap-2"
                                            >
                                                <LucidePlusCircle className="w-3 h-3 lg:w-4 lg:h-4" /> +2M
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                            <LucideArchive className="w-16 h-16 text-white/10" />
                            <h2 className="text-3xl font-black uppercase tracking-tighter">Monitor Desconectado</h2>
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
