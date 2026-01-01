"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Poll } from "@/types";
import { VotingCard } from "@/components/voting/VotingCard";
import { LiveResults } from "@/components/voting/LiveResults";
import { LucideArrowLeft, LucideShieldCheck, LucideCheckCircle2, LucideLayoutGrid } from "lucide-react";
import Link from "next/link";
import { CountdownTimer } from "@/components/voting/CountdownTimer";

export default function VoterPage() {
    const [activePolls, setActivePolls] = useState<Poll[]>([]);
    const [voterId, setVoterId] = useState<string>("");
    const [votedIds, setVotedIds] = useState<string[]>([]);
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
                setActivePolls(active);

                const alreadyVoted: string[] = [];
                active.forEach(p => {
                    if (localStorage.getItem(`has_voted_${p.id}`)) {
                        alreadyVoted.push(p.id);
                    }
                });
                setVotedIds(alreadyVoted);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleVoteComplete = (pollId: string, pollType: string) => {
        if (pollType !== 'WORDCLOUD') {
            setVotedIds(prev => [...prev, pollId]);
            localStorage.setItem(`has_voted_${pollId}`, "true");
        }
    };

    if (loading) return (
        <div className="fixed inset-0 bg-[#3A1B4E] flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-[#FFC100] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="fixed inset-0 bg-[#3A1B4E] text-white flex flex-col items-center p-8 overflow-y-auto">

            <Link href="/" className="fixed top-8 left-8 flex items-center gap-2 text-white/20 hover:text-white transition-colors font-black text-[9px] tracking-[0.2em] uppercase group z-50">
                <LucideArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> VOLVER
            </Link>

            <header className="w-full max-w-sm text-center space-y-2 mb-12 shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 uppercase tracking-widest text-[8px] font-black text-[#FFC100]/60">
                    <LucideShieldCheck className="w-2.5 h-2.5" /> Sala de Votación Segura
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter">Asamblea Activa</h1>
            </header>

            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 animate-fade pb-20">
                {activePolls.length > 0 ? activePolls.map(poll => (
                    <div key={poll.id} className="space-y-6">
                        <div className="text-center space-y-2 relative">
                            <h2 className="text-xl font-black uppercase tracking-tight line-clamp-2">{poll.title}</h2>
                            <div className="inline-block bg-white/5 px-4 py-1.5 rounded-lg text-lg font-mono font-black text-[#FFC100] shadow-sm">
                                <CountdownTimer endTime={poll.endTime!} />
                            </div>
                        </div>

                        {votedIds.includes(poll.id) ? (
                            <div className="bg-[#2A103D]/60 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-[#2EB67D]" />
                                <div className="space-y-2">
                                    <div className="w-10 h-10 bg-[#2EB67D]/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-[#2EB67D]/20">
                                        <LucideCheckCircle2 className="w-5 h-5 text-[#2EB67D]" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter leading-none">Voto Registrado</h3>
                                    <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.3em]">Resultados en vivo:</p>
                                </div>
                                <div className="h-[200px] w-full pt-4 border-t border-white/5">
                                    <LiveResults poll={poll} compact={true} />
                                </div>
                            </div>
                        ) : (
                            <VotingCard
                                poll={poll}
                                voterId={voterId}
                                onVoteComplete={() => handleVoteComplete(poll.id, poll.type)}
                            />
                        )}
                    </div>
                )) : (
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

            <footer className="fixed bottom-8 opacity-10 text-[6px] font-black uppercase tracking-[1.2em] pointer-events-none">
                SECURE ASAMBLEA DIGITAL HIVEYOUNG
            </footer>
        </div>
    );
}
