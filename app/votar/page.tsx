"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Poll } from "@/types";
import { VotingCard } from "@/components/voting/VotingCard";
import { LiveResults } from "@/components/voting/LiveResults";
import { CongressHemicycle } from "@/components/voting/CongressHemicycle";
import { LucideArrowLeft, LucideShieldCheck, LucideCheckCircle2, LucideLayoutGrid, LucideMonitorPlay, LucideX, LucidePieChart } from "lucide-react";
import Link from "next/link";
import { CountdownTimer } from "@/components/voting/CountdownTimer";
import { QRCodeSVG } from "qrcode.react";

export default function VoterPage() {
    const [activePolls, setActivePolls] = useState<Poll[]>([]);
    const [voterId, setVoterId] = useState<string>("");
    const [votedIds, setVotedIds] = useState<string[]>([]);
    const [fullscreenPollId, setFullscreenPollId] = useState<string | null>(null);
    const [fsViewMode, setFsViewMode] = useState<'pastel' | 'hemiciclo' | 'ideas'>('pastel');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let id = localStorage.getItem("voter_device_id");
        if (!id) {
            id = Math.random().toString(36).substr(2, 16);
            localStorage.setItem("voter_device_id", id);
        }
        setVoterId(id);

        const fetchData = async () => {
            try {
                const active = await api.getActivePolls();
                const now = new Date();

                // Filtrar las que ya caducaron por tiempo
                const validActive = active.filter(p => {
                    const isExpired = p.endTime && new Date(p.endTime) < now;
                    return !isExpired;
                });

                setActivePolls(validActive);

                const alreadyVoted: string[] = [];
                validActive.forEach(p => {
                    if (p.type !== 'WORDCLOUD' && localStorage.getItem(`has_voted_${p.id}`)) {
                        alreadyVoted.push(p.id);
                    }
                });
                setVotedIds(alreadyVoted);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 4000);
        return () => clearInterval(interval);
    }, []);

    const fullscreenPoll = activePolls.find(p => p.id === fullscreenPollId);

    const handleVoteComplete = (pollId: string, pollType: string) => {
        if (pollType !== 'WORDCLOUD') {
            setVotedIds(prev => [...prev, pollId]);
            localStorage.setItem(`has_voted_${pollId}`, "true");
        }
    };

    if (loading) return (
        <div className="fixed inset-0 bg-[#3A1B4E] flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-[#2EB67D] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="fixed inset-0 bg-[#3A1B4E] text-white flex flex-col items-center p-6 overflow-y-auto">
            {/* FULLSCREEN RESULTS MODAL */}
            {fullscreenPoll && (
                <div className="fixed inset-0 z-[100] animate-fade overflow-hidden flex flex-col font-poppins text-white">
                    {fullscreenPoll.type === 'WORDCLOUD' ? (
                        /* PRESENTATION MODE FOR WORDCLOUD (IDEAS) - FULL PANTALLA PASTEL */
                        <div className="fixed inset-0 bg-[#F4EDE4] flex flex-col">
                            <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20 pointer-events-none">
                                <div className="bg-[#3A1B4E] px-4 py-2 rounded-xl shadow-2xl pointer-events-auto border border-white/10 flex items-center gap-4">
                                    <div className="w-2 h-2 bg-[#2EB67D] rounded-full animate-pulse shadow-[0_0_8px_#2EB67D]" />
                                    <h2 className="text-white font-black uppercase text-[10px] tracking-[0.3em]">{fullscreenPoll.title}</h2>
                                </div>
                                <button
                                    onClick={() => setFullscreenPollId(null)}
                                    className="p-3 bg-[#3A1B4E] text-white rounded-full shadow-2xl hover:scale-110 transition-all pointer-events-auto"
                                >
                                    <LucideX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 w-full relative">
                                <LiveResults poll={fullscreenPoll} />
                            </div>

                            <div className="absolute bottom-12 right-12 bg-[#3A1B4E] text-[#FFC100] px-10 py-5 rounded-[2.5rem] font-mono text-4xl font-black shadow-2xl z-20 flex items-center gap-4">
                                <div className="w-3 h-3 bg-[#FFC100] rounded-full animate-pulse" />
                                <CountdownTimer endTime={fullscreenPoll.endTime!} />
                            </div>

                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20">
                                <span className="text-[12px] font-black uppercase tracking-[1em] text-[#3A1B4E]">version V2.9</span>
                            </div>
                        </div>
                    ) : (
                        /* DASHBOARD MODE FOR BOOLEAN/MULTIPLE */
                        <div className="fixed inset-0 bg-[#1A0826] flex flex-col">
                            <header className="h-24 border-b border-white/5 px-8 flex items-center justify-between shrink-0 bg-[#1A0826]/80 backdrop-blur-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-4 h-4 bg-[#2EB67D] rounded-full animate-pulse shadow-[0_0_15px_#2EB67D]" />
                                    <span className="text-[12px] font-black uppercase tracking-[0.4em] text-[#2EB67D]">Transmisión en Vivo</span>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10">
                                        <div className="bg-white p-2 rounded-xl">
                                            <QRCodeSVG value={`${typeof window !== 'undefined' ? window.location.origin : ''}/votar`} size={48} fgColor="#1A0826" />
                                        </div>
                                        <div className="flex flex-col pr-4">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-0.5">Vota en vivo</span>
                                            <span className="text-[10px] font-black text-[#FFC100] tracking-tighter">{typeof window !== 'undefined' ? window.location.hostname : ''}/votar</span>
                                        </div>
                                    </div>

                                    {fullscreenPoll.type === 'BOOLEAN' && (
                                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                                            <button
                                                onClick={() => setFsViewMode('pastel')}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${fsViewMode === 'pastel' ? 'bg-[#FFC100] text-[#1A0826]' : 'text-white/40 hover:text-white'}`}
                                            >
                                                <LucidePieChart className="w-4 h-4" /> Pastel
                                            </button>
                                            <button
                                                onClick={() => setFsViewMode('hemiciclo')}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${fsViewMode === 'hemiciclo' ? 'bg-[#FFC100] text-[#1A0826]' : 'text-white/40 hover:text-white'}`}
                                            >
                                                <LucideLayoutGrid className="w-4 h-4" /> Hemiciclo
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setFullscreenPollId(null)}
                                        className="px-6 py-2 border border-white/10 rounded-xl text-[10px] font-black uppercase text-white/30 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        Salir
                                    </button>
                                </div>
                            </header>

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 relative flex flex-col p-12 overflow-hidden">
                                    <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[3rem] relative overflow-hidden flex items-center justify-center">
                                        {fullscreenPoll.type === 'BOOLEAN' && fsViewMode === 'hemiciclo'
                                            ? <CongressHemicycle poll={fullscreenPoll} />
                                            : <LiveResults poll={fullscreenPoll} />}
                                    </div>
                                </div>

                                <aside className="w-[380px] border-l border-white/5 flex flex-col p-10 space-y-6 bg-[#1A0826]/30">
                                    <div className="space-y-3">
                                        <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">{fullscreenPoll.title}</h2>
                                        <div className="w-12 h-1 bg-[#FFC100] rounded-full" />
                                    </div>

                                    <div className="space-y-5 flex-1">
                                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                                            <div className="relative z-10 flex items-center justify-between">
                                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Total Votos</span>
                                                <span className="text-4xl font-black text-[#FFC100] tracking-tighter group-hover:scale-110 transition-transform">{fullscreenPoll.totalVotes}</span>
                                            </div>
                                        </div>

                                        {fullscreenPoll.type === 'BOOLEAN' && (
                                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                                                <div className="relative z-10 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Quórum 2/3</span>
                                                        <span className="text-3xl font-black text-white tracking-tighter">{Math.ceil((fullscreenPoll.maxVoters || 100) * 0.66)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-1">
                                                        <div className="h-1 bg-white/10 flex-1 rounded-full overflow-hidden mr-4">
                                                            <div className="h-full bg-white transition-all duration-700" style={{ width: `${Math.min(100, (fullscreenPoll.totalVotes / (fullscreenPoll.maxVoters || 100)) * 100)}%` }} />
                                                        </div>
                                                        <span className="text-[8px] font-black text-[#C22359] uppercase whitespace-nowrap">Faltan {Math.max(0, Math.ceil((fullscreenPoll.maxVoters || 100) * 0.66) - fullscreenPoll.totalVotes)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-white/5 border border-[#FFC100]/20 p-8 rounded-[2rem] relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-[#FFC100]/20" />
                                            <div className="relative z-10 flex flex-col items-center gap-3">
                                                <span className="text-[10px] font-black text-[#FFC100] uppercase tracking-[0.4em]">Temporizador</span>
                                                <div className="text-6xl font-black tracking-tighter leading-none group-hover:scale-105 transition-transform text-white">
                                                    <CountdownTimer endTime={fullscreenPoll.endTime!} />
                                                </div>
                                                <div className="w-full h-1 bg-white/5 mt-2 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#FFC100] animate-pulse" style={{ width: '100%' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <footer className="pt-6 border-t border-white/5 flex flex-col items-center gap-2 opacity-30">
                                        <p className="text-[9px] font-black uppercase tracking-[0.6em]">version V2.9</p>
                                    </footer>
                                </aside>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <Link href="/" className="fixed top-8 left-8 flex items-center gap-2 text-white/20 hover:text-white transition-colors font-black text-[9px] tracking-[0.2em] uppercase group z-40">
                <LucideArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> VOLVER
            </Link>

            <header className="w-full max-w-sm text-center space-y-2 mb-12 shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 uppercase tracking-widest text-[8px] font-black text-[#2EB67D]">
                    <LucideShieldCheck className="w-2.5 h-2.5" /> Sala de Votación Habilitada
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter">Asamblea Activa</h1>
            </header>

            <div className="w-full max-w-lg grid grid-cols-1 gap-12 animate-fade pb-20">
                {activePolls.filter(p => !p.settings.hideResults || !votedIds.includes(p.id)).length > 0 ? (
                    activePolls
                        .filter(p => {
                            // Si ocultar resultados está activo Y ya votó -> NO MOSTRAR NADA
                            if (p.settings.hideResults && votedIds.includes(p.id)) return false;
                            return true;
                        })
                        .map(poll => (
                            <div key={poll.id} className="space-y-6">
                                <div className="text-center space-y-2 relative">
                                    <h2 className="text-xl font-black uppercase tracking-tight line-clamp-2">{poll.title}</h2>
                                    <div className="inline-block bg-white/5 px-4 py-1.5 rounded-lg text-lg font-mono font-black text-[#2EB67D] shadow-sm">
                                        <CountdownTimer endTime={poll.endTime!} />
                                    </div>
                                </div>

                                {votedIds.includes(poll.id) ? (
                                    /* ESTO SOLO SE MUESTRA SI hideResults es FALSE (por el filtro de arriba) */
                                    <div className="bg-[#2A103D]/60 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 text-center space-y-6 shadow-2xl relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-[#2EB67D]" />

                                        <div className="space-y-4 w-full">
                                            <div className="w-16 h-16 bg-[#2EB67D]/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-[#2EB67D]/20">
                                                <LucideCheckCircle2 className="w-8 h-8 text-[#2EB67D]" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">Voto Registrado</h3>
                                                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Su idea ha sido enviada exitosamente</p>
                                            </div>

                                            {!fullscreenPollId ? (
                                                <button
                                                    onClick={() => setFullscreenPollId(poll.id)}
                                                    className="w-full mt-6 py-4 bg-[#2EB67D] text-[#1A0826] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg"
                                                >
                                                    <LucideMonitorPlay className="w-4 h-4" /> Ver Transmisión en Vivo
                                                </button>
                                            ) : (
                                                <div className="pt-6 w-full opacity-50 italic text-[10px] tracking-widest uppercase text-center">
                                                    Observando en pantalla completa...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <VotingCard
                                            poll={poll}
                                            voterId={voterId}
                                            onVoteComplete={() => handleVoteComplete(poll.id, poll.type)}
                                        />
                                        {poll.type === 'WORDCLOUD' && (
                                            <button
                                                onClick={() => setFullscreenPollId(poll.id)}
                                                className="w-full py-4 bg-[#FFC100]/10 text-[#FFC100] border border-[#FFC100]/20 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#FFC100] hover:text-[#3A1B4E] transition-all shadow-lg"
                                            >
                                                <LucideMonitorPlay className="w-4 h-4" /> Ver Transmisión en Vivo (Ideas)
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                ) : (
                    <div className="col-span-full py-20 text-center space-y-6 opacity-30">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5 animate-pulse">
                            <LucideLayoutGrid className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">SALA EN ESPERA</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Sin votaciones activas</p>
                        </div>
                    </div>
                )}
            </div>

            <footer className="w-full py-12 flex flex-col items-center justify-center border-t border-white/5 mt-10">
                <p className="text-[8px] font-black uppercase tracking-[1em] opacity-20">version V2.9</p>
            </footer>
        </div>
    );
}
