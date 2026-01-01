"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api";

export function CreateVotingForm() {
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState(5);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.createPoll(title, duration);
            router.push("/admin");
        } catch (error) {
            console.error("Failed to create poll", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-md mx-auto p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Nueva Votación</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Título de la votación</label>
                    <Input
                        placeholder="Ej: Aprobación de Presupuesto 2024"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Duración (minutos)</label>
                    <Input
                        type="number"
                        min="1"
                        max="60"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        required
                    />
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? "Creando..." : "Iniciar Votación"}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
