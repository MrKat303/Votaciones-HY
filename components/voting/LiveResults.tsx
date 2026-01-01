"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Poll, WordVote } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface LiveResultsProps {
    poll: Poll;
    compact?: boolean;
}

const WordCloudItem = ({ wv, index, style, compact }: { wv: WordVote, index: number, style: React.CSSProperties, compact: boolean }) => {
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
        const rotOptions = ['rotate-0', 'rotate-0', 'rotate-0', 'rotate-90', '-rotate-90'];
        return rotOptions[hash % rotOptions.length];
    }, [hash, index]);

    const fontSize = useMemo(() => {
        const baseSize = compact ? 9 : 14;
        const growthFactor = compact ? 2 : 7;
        const max = compact ? 28 : 70;
        return Math.min(baseSize + (wv.count * growthFactor), max);
    }, [wv.count, compact]);

    return (
        <span
            className={`
                absolute font-black tracking-tighter transition-all duration-1000 ease-in-out word-glow animate-fade organic-float
                ${rotation}
                ${isPulsing ? 'animate-pulse-word' : ''}
                select-none
            `}
            style={{
                ...style,
                fontSize: `${fontSize}px`,
                color: COLORS[hash % COLORS.length],
                animationDelay: `${index * 80}ms`,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                whiteSpace: 'nowrap',
                transform: `${style.transform} ${rotation === 'rotate-90' ? 'rotate(90deg)' : rotation === '-rotate-90' ? 'rotate(-90deg)' : ''}`
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

        const positionedWords = useMemo(() => {
            const centerX = 50;
            const centerY = 50;
            const goldenAngle = 137.5 * (Math.PI / 180);

            return sortedWords.map((wv, i) => {
                if (i === 0) return { wv, style: { left: '50%', top: '48%', transform: 'translate(-50%, -50%)' } };

                // Incremento de radio mucho más controlado (en %)
                // i=0 es el centro. i=1, 2, ...
                const spread = compact ? 4 : 7;
                const radius = Math.pow(i, 0.65) * spread;

                // Limitar radio para que no salga de la pantalla (área segura central de 80% total)
                const safeRadius = Math.min(radius, 35);

                const angle = i * goldenAngle;

                const x = centerX + safeRadius * Math.cos(angle);
                const y = centerY + (safeRadius * 0.75) * Math.sin(angle);

                return {
                    wv,
                    style: {
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)'
                    }
                };
            });
        }, [sortedWords, compact]);

        return (
            <div
                className="absolute inset-0 overflow-hidden"
                style={{
                    fontFamily: "var(--font-poppins), sans-serif",
                    backgroundColor: "#F4EDE4",
                }}
            >
                <div className="relative w-full h-full">
                    {positionedWords.map((item, i) => (
                        <WordCloudItem
                            key={item.wv.text}
                            wv={item.wv}
                            index={i}
                            style={item.style}
                            compact={compact}
                        />
                    ))}
                </div>
                {(!poll.wordVotes || poll.wordVotes.length === 0) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 animate-fade">
                        <div className="w-12 h-12 rounded-full border-4 border-[#3A1B4E]/5 border-t-[#3A1B4E]/20 animate-spin" />
                        <p className="text-[12px] font-black uppercase tracking-[0.5em] text-[#3A1B4E]/20">Capturando ideas...</p>
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
                ? (() => {
                    const t = opt.text.toUpperCase();
                    if (t.includes('SÍ') || t.includes('FAVOR')) return '#2EB67D';
                    if (t.includes('ABSTENCIÓN') || t.includes('ABSTENCION')) return '#FFC100';
                    return '#C22359';
                })()
                : (opt.color || `hsl(${(i * 360) / poll.options.length}, 70%, 50%)`)
        };
    }).sort((a, b) => b.value - a.value);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={compact ? 40 : 80}
                        outerRadius={compact ? 60 : 130}
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

            {data.length > 0 && data[0].value > 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <span className="block text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Tendencia</span>
                    <span className={compact ? "text-xl font-black text-white tabular-nums drop-shadow-lg" : "text-3xl font-black text-white tabular-nums drop-shadow-lg"}>
                        {Math.round((data[0].value / poll.totalVotes) * 100)}%
                    </span>
                    <span className="block text-[9px] font-bold text-white/40 uppercase mt-1">{data[0].name}</span>
                </div>
            )}

            {(data.length === 0 || data[0].value === 0) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-[-10px]">
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.5em]">Esperando...</span>
                    <span className={compact ? "text-xl font-black" : "text-3xl font-black"}>0</span>
                </div>
            )}
        </div>
    );
}
