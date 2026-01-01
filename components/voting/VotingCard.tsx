"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { VoteButton } from "./VoteButton";
import { Poll } from "@/types";
import { api } from "@/lib/api";
import { LucideCheckCircle2, LucideAlertCircle, LucideShield } from "lucide-react";

interface VotingCardProps {
    poll: Poll;
    voterId: string;
    onVoteComplete: () => void;
}

export function VotingCard({ poll, voterId, onVoteComplete }: VotingCardProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVote = async () => {
        if (!selectedOption) return;
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await api.vote({
                pollId: poll.id,
                optionId: selectedOption,
                voterId,
            });

            if (res.success) {
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
        <div className="premium-card max-w-lg mx-auto !p-6 md:!p-8 relative overflow-hidden">
            <div className="relative z-10 space-y-6">

                {error && (
                    <div className="bg-red-500/20 text-red-200 border border-red-500/30 p-3 rounded-xl flex items-center gap-2 text-xs font-bold animate-fade">
                        <LucideAlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

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

                <button
                    className="w-full btn-brand py-4 text-lg"
                    disabled={!selectedOption || isSubmitting}
                    onClick={handleVote}
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-[#3A1B4E] border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>Emitir Voto <LucideCheckCircle2 className="w-5 h-5" /></>
                    )}
                </button>

                <div className="flex items-center justify-center gap-2 pt-4 opacity-30">
                    <LucideShield className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Voto Encriptado</span>
                </div>
            </div>
        </div>
    );
}
