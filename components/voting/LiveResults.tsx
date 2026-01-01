"use client";

import { Poll } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { LucideTrophy } from "lucide-react";

interface LiveResultsProps {
    poll: Poll;
    compact?: boolean;
}

export function LiveResults({ poll, compact = false }: LiveResultsProps) {
    const data = poll.options.map((opt) => ({
        name: opt.text,
        value: opt.votes,
    }));

    const maxVotes = Math.max(...data.map(d => d.value));
    const leadingOptions = data.filter(d => d.value === maxVotes && d.value > 0);
    const winner = leadingOptions.length === 1 ? leadingOptions[0] : null;
    const isTie = leadingOptions.length > 1;

    const COLORS = [
        "#2EB67D", // Success
        "#C22359", // Error
        "#529CE8", // Info
        "#FFC100", // Accent
        "#9333EA", // Purple
        "#F97316", // Orange
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1A0826] border border-white/10 p-2 rounded-lg shadow-2xl text-white">
                    <p className="text-[10px] font-bold uppercase opacity-60">{payload[0].name}</p>
                    <p className="text-[#FFC100] font-black">{payload[0].value} VOTOS</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Winner Highlight - Solo si no es compacto o hay espacio */}
            {!compact && (winner || isTie) && (
                <div className="mb-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 flex items-center gap-2 animate-fade tracking-tight">
                    <LucideTrophy className="w-3 h-3 text-[#FFC100]" />
                    <span className="text-white font-bold text-[10px] uppercase">
                        {isTie ? "Empate" : winner?.name}
                    </span>
                </div>
            )}

            <div className="w-full h-full min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={compact ? 45 : 60}
                            outerRadius={compact ? 65 : 85}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={4}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        {!compact && (
                            <Legend
                                verticalAlign="bottom"
                                iconType="circle"
                                formatter={(value) => <span className="text-[9px] font-bold text-white/40 uppercase ml-1">{value}</span>}
                            />
                        )}
                    </PieChart>
                </ResponsiveContainer>

                {/* Total info in the middle */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-[-10px]">
                    <span className="text-[7px] font-bold text-white/30 uppercase tracking-widest">VOTOS</span>
                    <span className={compact ? "text-xl font-black" : "text-3xl font-black"}>{poll.totalVotes}</span>
                </div>
            </div>
        </div>
    );
}
