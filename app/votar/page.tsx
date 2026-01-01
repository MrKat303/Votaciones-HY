"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Poll } from "@/types";
import { VotingCard } from "@/components/voting/VotingCard";
import { LiveResults } from "@/components/voting/LiveResults";
import { LucideArrowLeft, LucideShieldCheck, LucideCheckCircle2 } from "lucide-react";
import Link from "next/link";
import { CountdownTimer } from "@/components/voting/CountdownTimer";

export default function VoterPage() {
    const [poll, setPoll] = useState<Poll | null>(null);
    const [voterId, setVoterId] = useState<string>("");
    const [hasVoted, setHasVoted] = useState(false);
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
                const active = await api.getActivePoll();
                setPoll(active);

                if (active) {
                    const votedKey = `has_voted_${active.id}`;
                    if (localStorage.getItem(votedKey)) {
                        setHasVoted(true);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleVoteComplete = () => {
        setHasVoted(true);
        if (poll) {
            localStorage.setItem(`has_voted_${poll.id}`, "true");
        }
    };

    if (loading) return (
        <div className="fixed inset-0 bg-[#3A1B4E] flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-[#FFC100] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="fixed inset-0 bg-[#3A1B4E] text-white flex flex-col items-center justify-center p-6 overflow-hidden">

            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-white/20 hover:text-white transition-colors font-black text-[9px] tracking-[0.2em] uppercase group">
                <LucideArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> VOLVER
            </Link>

            <div className="w-full max-w-sm space-y-6 animate-fade">
                {poll && poll.isActive ? (
                    <>
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 uppercase tracking-widest text-[8px] font-black text-[#FFC100]/60">
                                <LucideShieldCheck className="w-2.5 h-2.5" /> Sesión Verificada
                            </div>
                            <h1 className="text-xl font-black uppercase tracking-tight">{poll.title}</h1>
                            <div className="inline-block bg-white/5 px-4 py-1.5 rounded-lg text-lg font-mono font-black text-[#FFC100]">
                                <CountdownTimer endTime={poll.endTime} />
                            </div>
                        </div>

                        {hasVoted ? (
                            <div className="bg-[#2A103D] border border-white/5 rounded-[2rem] p-8 text-center space-y-6 shadow-2xl">
                                <div className="space-y-2">
                                    <div className="w-12 h-12 bg-[#2EB67D]/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-[#2EB67D]/20">
                                        <LucideCheckCircle2 className="w-6 h-6 text-[#2EB67D]" />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter">¡Voto Registrado!</h2>
                                    <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">Tendencia de la mayoría en tiempo real:</p>
                                </div>
                                <div className="h-[180px] w-full pt-4 border-t border-white/5">
                                    <LiveResults poll={poll} compact={true} />
                                </div>
                            </div>
                        ) : (
                            <VotingCard
                                poll={poll}
                                voterId={voterId}
                                onVoteComplete={handleVoteComplete}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5 shadow-inner animate-pulse">
                            <LucideShieldCheck className="w-8 h-8 text-[#FFC100]/20" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">SALA EN ESPERA</h2>
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-widest leading-relaxed">Aguarda a que el administrador<br />lance la nueva votación.</p>
                        </div>
                    </div>
                )}
            </div>

            <footer className="absolute bottom-8 opacity-10 text-[6px] font-black uppercase tracking-[1em]">
                SECURE ASAMBLEA DIGITAL
            </footer>
        </div>
    );
}
