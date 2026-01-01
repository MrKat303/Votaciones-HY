"use client";

import { Card } from "@/components/ui/Card";
import { Poll } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface LiveResultsProps {
    poll: Poll;
}

export function LiveResults({ poll }: LiveResultsProps) {
    const data = poll.options.map((opt) => ({
        name: opt.text,
        value: opt.votes,
    }));

    const COLORS = {
        "A favor": "#2EB67D", // Success
        "En contra": "#C22359", // Error
        "Abstención": "#529CE8", // Info
    };

    // Default color fallback
    const getColor = (name: string) => (COLORS as any)[name] || "#3A1B4E";

    return (
        <Card className="w-full max-w-md mx-auto">
            <h3 className="text-lg font-bold text-primary mb-4 text-center">Resultados en Tiempo Real</h3>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 text-center">
                <span className="text-sm text-gray-500">Total Votos: </span>
                <span className="text-xl font-bold text-primary">{poll.totalVotes}</span>
            </div>
        </Card>
    );
}
