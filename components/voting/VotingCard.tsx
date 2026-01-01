"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { VoteButton } from "./VoteButton";
import { Poll } from "@/types";
import { api } from "@/lib/api";

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
            setError("Error al enviar el voto. Intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-2 text-center">{poll.title}</h2>
            {error && (
                <div className="bg-error/10 text-error p-3 rounded-lg mb-4 text-center text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="space-y-3 mb-6">
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

            <Button
                className="w-full"
                variant="accent"
                size="lg"
                disabled={!selectedOption || isSubmitting}
                onClick={handleVote}
            >
                {isSubmitting ? "Enviando..." : "Confirmar Voto"}
            </Button>
        </Card>
    );
}
