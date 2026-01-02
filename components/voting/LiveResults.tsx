"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Poll, WordVote } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Paleta de colores definida por el usuario (excluyendo gris #343A40, pastel #F7A3B1 y morado oscuro #3A1B4E)
const CHART_COLORS = [
    "#3A1B4E", // Dark Purple
    "#2EB67D", // Green
    "#529CE8", // Blue
    "#C22359", // Magenta/Red
    "#FFC100", // Yellow
    "#9063AD", // Lighter Purple
    "#FC84AA", // Pink
    "#EE6352", // Orange
    "#343A40", // Dark Gray
    "#F7A3B1", // Pastel Pink
];

interface LiveResultsProps {
    poll: Poll;
    compact?: boolean;
}

const WordCloudItem = ({ wv, index, style, color, rotation, compact }: { wv: WordVote, index: number, style: React.CSSProperties, color: string, rotation: string, compact: boolean }) => {
    const [prevCount, setPrevCount] = useState(wv.count);
    const [isPulsing, setIsPulsing] = useState(false);

    useEffect(() => {
        if (wv.count > prevCount) {
            setIsPulsing(true);
            const timer = setTimeout(() => setIsPulsing(false), 600);
            setPrevCount(wv.count);
            return () => clearTimeout(timer);
        }
    }, [wv.count, prevCount]);

    const fontSize = useMemo(() => {
        const baseSize = compact ? 10 : 16;
        const growthFactor = compact ? 3 : 8;
        const max = compact ? 32 : 72;
        return Math.min(baseSize + (wv.count * growthFactor), max);
    }, [wv.count, compact]);

    return (
        <span
            className={`
                absolute font-bold transition-all duration-700 ease-out animate-fade organic-float
                ${rotation}
                ${isPulsing ? 'animate-pulse-word' : ''}
                select-none
            `}
            style={{
                ...style,
                fontSize: `${fontSize}px`,
                color: color,
                animationDelay: `${index * 50}ms`,
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
            const placedRects: { x: number; y: number; w: number; h: number }[] = [];
            const centerX = 50;
            const centerY = 50;

            return sortedWords.map((wv, i) => {
                const fontSize = compact ? 10 + (wv.count * 3) : 16 + (wv.count * 8);
                const maxFontSize = compact ? 32 : 72;
                const actualFontSize = Math.min(fontSize, maxFontSize);

                // Determine rotation early to adjust bounding box
                const hash = wv.text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const rotOptions = ['rotate-0', 'rotate-0', 'rotate-0', 'rotate-90', '-rotate-90'];
                const rotation = i === 0 ? 'rotate-0' : rotOptions[hash % rotOptions.length];
                const isVertical = rotation === 'rotate-90' || rotation === '-rotate-90';

                // Estimate width and height (rough bounding box)
                // We use a divisor to convert to roughly % of container
                const rawW = (wv.text.length * actualFontSize * 0.5) / (compact ? 3 : 5);
                const rawH = (actualFontSize * 1.0) / (compact ? 3 : 5);

                // If rotated 90deg, swap dimensions
                const w = isVertical ? rawH : rawW;
                const h = isVertical ? rawW : rawH;

                // Add padding to prevent tight packing
                const padding = compact ? 1.5 : 2.5;
                const paddedW = w + padding;
                const paddedH = h + padding;

                let x = centerX;
                let y = centerY;

                if (i > 0) {
                    let angle = hash % 360; // Randomize start angle per word
                    let radius = 2;
                    let found = false;
                    const step = 0.5;
                    const angleStep = 0.2;

                    // Spiral search for a free spot
                    while (!found && radius < 45) {
                        x = centerX + radius * Math.cos(angle);
                        y = centerY + (radius * 0.6) * Math.sin(angle); // Elliptical spiral

                        // Check collision with padding
                        const currentRect = { x: x - paddedW / 2, y: y - paddedH / 2, w: paddedW, h: paddedH };
                        const hasCollision = placedRects.some(r => {
                            return !(currentRect.x + currentRect.w < r.x ||
                                currentRect.x > r.x + r.w ||
                                currentRect.y + currentRect.h < r.y ||
                                currentRect.y > r.y + r.h);
                        });

                        if (!hasCollision) {
                            found = true;
                        } else {
                            angle += angleStep;
                            radius += step / (2 * Math.PI);
                        }
                    }
                }

                placedRects.push({ x: x - paddedW / 2, y: y - paddedH / 2, w: paddedW, h: paddedH });

                // Balanced color assignment
                const colorIndex = i % CHART_COLORS.length;

                return {
                    wv,
                    color: CHART_COLORS[colorIndex],
                    rotation,
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
                            color={item.color}
                            rotation={item.rotation}
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
                : (opt.color || CHART_COLORS[i % CHART_COLORS.length])
        };
    }).sort((a, b) => b.value - a.value);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative min-h-[250px] p-4">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={compact ? "40%" : 80}
                        outerRadius={compact ? "70%" : 130}
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
                </PieChart>
            </ResponsiveContainer>

            {data.length > 0 && data[0].value > 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-full">
                    <span className="block text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Tendencia</span>
                    <span className={compact ? "text-xl font-black text-white tabular-nums" : "text-3xl font-black text-white tabular-nums"}>
                        {Math.round((data[0].value / poll.totalVotes) * 100)}%
                    </span>
                    <span className="block text-[9px] font-bold text-white/40 uppercase mt-1 truncate px-10">{data[0].name}</span>
                </div>
            )}

            {!compact && data.length > 0 && (
                <div className="w-full mt-4 flex flex-wrap justify-center gap-4 animate-fade">
                    {data.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-[10px] font-black uppercase text-white/60 tracking-tighter">
                                {entry.name}: {entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
