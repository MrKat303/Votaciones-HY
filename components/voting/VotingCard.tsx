"use client";

import { useState } from "react";
import { VoteButton } from "./VoteButton";
import { Poll } from "@/types";
import { api } from "@/lib/api";
import { LucideCheckCircle2, LucideAlertCircle, LucideShield, LucideSend } from "lucide-react";

interface VotingCardProps {
    poll: Poll;
    voterId: string;
    onVoteComplete: () => void;
}

export function VotingCard({ poll, voterId, onVoteComplete }: VotingCardProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [wordInput, setWordInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVote = async () => {
        if (poll.type === 'WORDCLOUD' && !wordInput.trim()) return;
        if (poll.type !== 'WORDCLOUD' && !selectedOption) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const res = await api.vote({
                pollId: poll.id,
                optionId: selectedOption || undefined,
                word: poll.type === 'WORDCLOUD' ? wordInput : undefined,
                voterId,
            });

            if (res.success) {
                if (poll.type === 'WORDCLOUD') {
                    setWordInput("");
                }
                onVoteComplete();
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError("Error al enviar el voto.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="premium-card max-w-lg mx-auto !p-6 md:!p-8 relative overflow-hidden backdrop-blur-xl bg-[#2A103D]/80 border border-white/10 shadow-2xl rounded-[2.5rem]">
            <div className="relative z-10 space-y-6">

                {error && (
                    <div className="bg-red-500/20 text-red-200 border border-red-500/30 p-3 rounded-xl flex items-center gap-2 text-xs font-bold animate-fade">
                        <LucideAlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {poll.type === "WORDCLOUD" ? (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2EB67D]">Tu Respuesta</label>
                            <input
                                type="text"
                                maxLength={50}
                                value={wordInput}
                                onChange={(e) => setWordInput(e.target.value)}
                                placeholder="Escribe tus conceptos..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xl font-black outline-none focus:border-[#2EB67D] transition-all"
                            />
                        </div>
                        <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest text-center">Máximo 50 caracteres por envío</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {poll.options.map((option) => (
                            <VoteButton
                                key={option.id}
                                optionId={option.id}
                                label={option.text}
                                isSelected={selectedOption === option.id}
                                onClick={() => setSelectedOption(option.id)}
                                disabled={isSubmitting}
                            />
                        ))}
                    </div>
                )}

                <button
                    className="w-full h-16 bg-[#2EB67D] text-[#1A0826] rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:grayscale"
                    disabled={(poll.type === 'WORDCLOUD' ? !wordInput.trim() : !selectedOption) || isSubmitting}
                    onClick={handleVote}
                >
                    {isSubmitting ? (
                        <div className="w-6 h-6 border-4 border-[#3A1B4E]/20 border-t-[#3A1B4E] rounded-full animate-spin" />
                    ) : (
                        <>
                            {poll.type === 'WORDCLOUD' ? "ENVIAR IDEA" : "CONFIRMAR VOTO"}
                            {poll.type === 'WORDCLOUD' ? <LucideSend className="w-5 h-5" /> : <LucideCheckCircle2 className="w-5 h-5" />}
                        </>
                    )}
                </button>


            </div>
        </div>
    );
}
