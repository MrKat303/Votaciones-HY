"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Poll, WordVote } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface LiveResultsProps {
    poll: Poll;
    compact?: boolean;
}

const WordCloudItem = ({ wv, index, compact }: { wv: WordVote, index: number, compact: boolean }) => {
    const [prevCount, setPrevCount] = useState(wv.count);
    const [isPulsing, setIsPulsing] = useState(false);

    const COLORS = [
        "#3A1B4E", "#2EB67D", "#529CE8", "#C22359", "#FFC100",
        "#9063AD", "#FC84AA", "#EE6352", "#343A40", "#F7A3B1"
    ];

    useEffect(() => {
        if (wv.count > prevCount) {
            setIsPulsing(true);
            const timer = setTimeout(() => setIsPulsing(false), 600);
            setPrevCount(wv.count);
            return () => clearTimeout(timer);
        }
    }, [wv.count, prevCount]);

    const hash = useMemo(() => wv.text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0), [wv.text]);

    const rotation = useMemo(() => {
        if (index === 0) return 'rotate-0';
        return hash % 12 === 0 ? '-rotate-90' : hash % 15 === 0 ? 'rotate-90' : 'rotate-0';
    }, [hash, index]);

    const fontSize = useMemo(() => {
        const baseSize = compact ? 12 : 18;
        const growthFactor = compact ? 4 : 14;
        const max = compact ? 45 : 95;
        return Math.min(baseSize + (wv.count * growthFactor), max);
    }, [wv.count, compact]);

    return (
        <span
            className={`
                inline-block font-black tracking-tighter transition-all duration-700 ease-out word-glow animate-fade organic-float
                ${rotation}
                ${isPulsing ? 'animate-pulse-word' : ''}
            `}
            style={{
                fontSize: `${fontSize}px`,
                color: COLORS[hash % COLORS.length],
                padding: compact ? '0.1em 0.2em' : '0.15em 0.3em',
                lineHeight: '0.85',
                animationDelay: `${index * 50}ms`,
                filter: `drop-shadow(0 4px 6px rgba(0,0,0,${0.02 + (wv.count * 0.01)}))`
            }}
        >
            {wv.text}
        </span>
    );
};

export function LiveResults({ poll, compact = false }: LiveResultsProps) {
    if (poll.type === "WORDCLOUD") {
        const sortedWords = useMemo(() =>
            [...(poll.wordVotes || [])].sort((a, b) => b.count - a.count),
            [poll.wordVotes]);

        return (
            <div
                className="absolute inset-0 flex flex-wrap items-center justify-center p-12 overflow-hidden"
                style={{
                    fontFamily: "var(--font-poppins), sans-serif",
                    backgroundColor: "#F4EDE4",
                    alignContent: 'center',
                    gap: compact ? '1rem' : '2rem 3.5rem'
                }}
            >
                {sortedWords.map((wv, i) => (
                    <WordCloudItem
                        key={wv.text}
                        wv={wv}
                        index={i}
                        compact={compact}
                    />
                ))}
                {(!poll.wordVotes || poll.wordVotes.length === 0) && (
                    <div className="flex flex-col items-center gap-4 animate-fade">
                        <div className="w-12 h-12 rounded-full border-4 border-[#3A1B4E]/10 border-t-[#3A1B4E] animate-spin" />
                        <p className="text-[12px] font-black uppercase tracking-[0.5em] text-[#3A1B4E]/40">Esperando conceptos...</p>
                    </div>
                )}
            </div>
        );
    }

    const data = poll.options.map((opt, i) => {
        return {
            name: opt.text,
            value: opt.votes || 0,
            color: poll.type === 'BOOLEAN'
                ? (opt.text.toUpperCase() === 'SÍ' ? '#2EB67D' : opt.text.toUpperCase() === 'ABSTENCIÓN' ? '#FFC100' : '#C22359')
                : (opt.color as string || `hsl(${(i * 360) / poll.options.length}, 70%, 50%)`)
        };
    }).sort((a, b) => b.value - a.value);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={compact ? 45 : 80}
                        outerRadius={compact ? 70 : 130}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    {!compact && <Tooltip
                        contentStyle={{ backgroundColor: '#1A0826', border: 'none', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />}
                    {!compact && <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        formatter={(value, entry: any) => (
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-2">
                                {value} ({entry.payload.value})
                            </span>
                        )}
                    />}
                </PieChart>
            </ResponsiveContainer>

            {data[0].value > 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <span className="block text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Tendencia</span>
                    <span className="text-3xl font-black text-white tabular-nums drop-shadow-lg">
                        {Math.round((data[0].value / poll.totalVotes) * 100)}%
                    </span>
                    <span className="block text-[10px] font-bold text-white/40 uppercase mt-1">{data[0].name}</span>
                </div>
            )}

            {data[0].value === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-[-10px]">
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.5em]">Esperando...</span>
                    <span className={compact ? "text-xl font-black" : "text-3xl font-black"}>0</span>
                </div>
            )}
        </div>
    );
}
