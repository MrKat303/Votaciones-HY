"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Poll } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LiveResults } from "@/components/voting/LiveResults";
import { CountdownTimer } from "@/components/voting/CountdownTimer";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const [poll, setPoll] = useState<Poll | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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
        const interval = setInterval(fetchPoll, 2000); // Polling for updates
        return () => clearInterval(interval);
    }, []);

    const handleClosePoll = async () => {
        await api.closePoll();
        fetchPoll();
    };

    if (loading) return <div className="p-8 text-center">Cargando...</div>;

    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary">Panel de Administración</h1>
                <Link href="/">
                    <Button variant="ghost">Volver al Inicio</Button>
                </Link>
            </header>

            {poll && poll.isActive ? (
                <div className="space-y-6">
                    <Card className="p-6 border-l-4 border-l-success">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Votación en Curso</h2>
                                <p className="text-2xl text-primary font-bold mt-2">{poll.title}</p>
                            </div>
                            <CountdownTimer endTime={poll.endTime} />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mt-8">
                            <LiveResults poll={poll} />

                            <div className="flex flex-col justify-center space-y-4">
                                <div className="bg-info/10 p-4 rounded-xl">
                                    <span className="block text-sm text-gray-500">Total Votos</span>
                                    <span className="text-3xl font-bold text-info">{poll.totalVotes}</span>
                                </div>

                                <Button
                                    variant="primary"
                                    className="bg-error hover:bg-error/90 w-full py-4"
                                    onClick={handleClosePoll}
                                >
                                    Cerrar Votación
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-gray-400">No hay votación activa</h2>
                        <p className="text-gray-500">Crea una nueva votación para comenzar.</p>
                    </div>

                    <Link href="/admin/crear">
                        <Button size="lg" variant="accent" className="px-8 shadow-xl">
                            + Nueva Votación
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
