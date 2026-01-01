"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Poll } from "@/types";
import { VotingCard } from "@/components/voting/VotingCard";
import { LiveResults } from "@/components/voting/LiveResults";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CountdownTimer } from "@/components/voting/CountdownTimer";

export default function VoterPage() {
    const [poll, setPoll] = useState<Poll | null>(null);
    const [voterId, setVoterId] = useState<string>("");
    const [hasVoted, setHasVoted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Device Fingerprinting
        let id = localStorage.getItem("voter_device_id");
        if (!id) {
            id = Math.random().toString(36).substr(2, 16);
            localStorage.setItem("voter_device_id", id);
        }
        setVoterId(id);

        // 2. Poll Data & Logic
        const fetchData = async () => {
            try {
                const active = await api.getActivePoll();
                setPoll(active);

                // Check if already voted for this specific poll
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
        const interval = setInterval(fetchData, 3000); // Poll for updates
        return () => clearInterval(interval);
    }, []);

    const handleVoteComplete = () => {
        setHasVoted(true);
        if (poll) {
            localStorage.setItem(`has_voted_${poll.id}`, "true");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-primary">Cargando asamblea...</div>;

    return (
        <div className="min-h-screen p-4 sm:p-8 max-w-xl mx-auto flex flex-col items-center">
            <Link href="/" className="self-start mb-6">
                <span className="text-primary font-bold">← Inicio</span>
            </Link>

            <div className="w-full space-y-8">
                <header className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-primary">Sala de Votación</h1>
                    {poll && poll.isActive && (
                        <div className="flex justify-center">
                            <CountdownTimer endTime={poll.endTime} />
                        </div>
                    )}
                </header>

                {poll && poll.isActive ? (
                    hasVoted ? (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-success/10 p-6 rounded-2xl text-center border border-success/20">
                                <h3 className="text-xl font-bold text-success mb-2">¡Voto Registrado!</h3>
                                <p className="text-gray-600">Tu participación ha sido guardada.</p>
                            </div>
                            <LiveResults poll={poll} />
                        </div>
                    ) : (
                        <VotingCard
                            poll={poll}
                            voterId={voterId}
                            onVoteComplete={handleVoteComplete}
                        />
                    )
                ) : (
                    <div className="text-center py-12 glass-panel">
                        <h2 className="text-xl text-gray-500 font-medium">No hay votación activa</h2>
                        <p className="text-gray-400 mt-2">Espera a que el administrador inicie una nueva votación.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
