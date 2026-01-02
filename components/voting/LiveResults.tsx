"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Poll, WordVote } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CHART_COLORS = [
    "#3A1B4E", "#2EB67D", "#529CE8", "#C22359", "#FFC100",
    "#9063AD", "#FC84AA", "#EE6352", "#343A40", "#F7A3B1",
];

interface LiveResultsProps {
    poll: Poll;
    compact?: boolean;
}

const WordCloudItem = ({ wv, fontSize, color }: { wv: WordVote, fontSize: number, color: string }) => {
    return (
        <span
            className="font-black transition-all duration-500 ease-out animate-fade select-none leading-[0.9] tracking-tighter inline-block"
            style={{
                fontSize: `${fontSize}px`,
                color: color,
                whiteSpace: 'nowrap',
                textShadow: 'none',
                filter: 'none',
            }}
        >
            {wv.text}
        </span>
    );
};

const WordCloudView = ({ poll, compact, transform, isDragging, handleWheel, handleMouseDown, containerRef }: any) => {
    const renderedWords = useMemo(() => {
        const words = [...(poll.wordVotes || [])].sort((a, b) => b.count - a.count);
        if (words.length === 0) return [];

        const maxCount = words[0]?.count || 1;

        return words.map((wv, i) => {
            const freqRatio = wv.count / maxCount;

            // Hierarchy: Clear size difference
            let baseSize = compact ? 12 : 24;
            let maxSize = compact ? 26 : 96;
            let fontSize = baseSize + (maxSize - baseSize) * Math.pow(freqRatio, 0.5);

            return {
                wv,
                fontSize,
                color: CHART_COLORS[i % CHART_COLORS.length]
            };
        });
    }, [poll.wordVotes, compact]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 overflow-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} bg-[#F4EDE4] flex items-center justify-center p-8`}
            style={{
                fontFamily: "var(--font-poppins), sans-serif",
                touchAction: 'none',
                scrollbarWidth: 'none', // Hide scrollbars for cleaner look
                msOverflowStyle: 'none'
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
                div::-webkit-scrollbar { display: none; }
            `}} />

            <div
                className="w-full max-w-6xl mx-auto transition-transform duration-700 ease-out flex flex-wrap justify-center items-center"
                style={{
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    transformOrigin: 'center center',
                    gap: '24px 16px' // Clean fixed spacing
                }}
            >
                {renderedWords.map((item, i) => (
                    <WordCloudItem
                        key={`${item.wv.text}-${i}`}
                        wv={item.wv}
                        fontSize={item.fontSize}
                        color={item.color}
                    />
                ))}
            </div>
        </div>
    );
};

const ChartView = ({ poll, compact }: { poll: Poll, compact: boolean }) => {
    const data = useMemo(() => {
        return poll.options.map((opt, i) => {
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
    }, [poll.options, poll.type]);

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
                        {Math.round((data[0].value / (poll.totalVotes || 1)) * 100)}%
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
};

export function LiveResults({ poll, compact = false }: LiveResultsProps) {
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleWheel = (e: React.WheelEvent) => {
        if (compact) return;
        const delta = e.deltaY > 0 ? 0.92 : 1.08;
        setTransform(prev => ({
            ...prev,
            scale: Math.max(0.1, Math.min(5, prev.scale * delta))
        }));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (compact) return;
        setIsDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        const dx = (e.clientX - lastMousePos.x);
        const dy = (e.clientY - lastMousePos.y);
        setTransform(prev => ({
            ...prev,
            x: prev.x + dx,
            y: prev.y + dy
        }));
        setLastMousePos({ x: e.clientX, y: e.clientY });
    }, [isDragging, lastMousePos]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    if (poll.type === "WORDCLOUD") {
        return (
            <WordCloudView
                poll={poll}
                compact={compact}
                transform={transform}
                isDragging={isDragging}
                handleWheel={handleWheel}
                handleMouseDown={handleMouseDown}
                containerRef={containerRef}
            />
        );
    }

    return <ChartView poll={poll} compact={compact} />;
}
