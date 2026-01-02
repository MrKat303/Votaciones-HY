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

const WordCloudItem = ({ wv, style, color, isBig }: { wv: WordVote, style: React.CSSProperties, color: string, isBig: boolean }) => {
    return (
        <span
            className={`
                absolute font-black transition-all duration-1000 ease-out animate-fade 
                select-none leading-[0.85] tracking-tighter
                ${isBig ? 'z-20' : 'z-10'}
            `}
            style={{
                ...style,
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
    const sortedWords = useMemo(() =>
        [...(poll.wordVotes || [])].sort((a, b) => b.count - a.count),
        [poll.wordVotes]);

    const positionedWords = useMemo(() => {
        if (sortedWords.length === 0) return [];

        const placedRects: { x: number, y: number, w: number, h: number }[] = [];
        const centerX = 50;
        const centerY = 50;

        // Grid Occupancy Map (discrete 100x100 grid for perfect collision)
        // We actually use a higher resolution grid for precision 200x200
        const gridRes = 200;
        const occupied = Array(gridRes).fill(null).map(() => new Uint8Array(gridRes));

        return sortedWords.map((wv, i) => {
            const maxCount = sortedWords[0]?.count || 1;
            const freqRatio = wv.count / maxCount;

            // 1. Font Size Calibration (More aggressive center)
            let baseSize = compact ? 12 : 26;
            let maxSize = compact ? 30 : 130;
            let fontSize = baseSize + (maxSize - baseSize) * Math.pow(freqRatio, 0.45);

            // Long words protection
            if (wv.text.length > 10) fontSize *= 0.9;
            if (wv.text.length > 20) fontSize *= 0.75;

            // 2. Box size in Grid Units
            const pFactor = compact ? 0.6 : 0.32;
            const w = Math.ceil((wv.text.length * fontSize * 0.58) * pFactor);
            const h = Math.ceil((fontSize * 0.95) * pFactor);

            // Mandatory "Air" padding (TIGHTER: Removed x3 and x2 multipliers)
            const padding = Math.max(1, Math.floor(h * 0.15));
            const pw = w + padding;
            const ph = h + padding;

            // 3. Digital Packing Search (Center-Out Outward Search)
            let found = false;
            let finalX = centerX;
            let finalY = centerY;

            // High Precision Spiral Search
            let angle = (i * 2.4) % (2 * Math.PI);
            let radius = 0;
            const radiusStep = 0.5; // Finer Steps
            const angleStep = 0.1;  // Higher Precision

            if (i > 0) {
                let attempts = 0;
                while (!found && attempts < 5000) {
                    // Ellipse: 1.6x for a more natural screen fit without over-spreading
                    const vx = Math.round(gridRes / 2 + radius * Math.cos(angle) * 1.6);
                    const vy = Math.round(gridRes / 2 + radius * Math.sin(angle));

                    // Check if block is inside grid and free
                    if (vx - pw / 2 >= 0 && vx + pw / 2 < gridRes && vy - ph / 2 >= 0 && vy + ph / 2 < gridRes) {
                        let collision = false;
                        const startX = Math.floor(vx - pw / 2);
                        const startY = Math.floor(vy - ph / 2);

                        // Grid Collision Check
                        for (let r = startY; r < startY + ph; r++) {
                            for (let c = startX; c < startX + pw; c++) {
                                if (occupied[r][c]) {
                                    collision = true;
                                    break;
                                }
                            }
                            if (collision) break;
                        }

                        if (!collision) {
                            // Mark grid occupied
                            for (let r = startY; r < startY + ph; r++) {
                                for (let c = startX; c < startX + pw; c++) {
                                    occupied[r][c] = 1;
                                }
                            }
                            finalX = (vx / gridRes) * 100;
                            finalY = (vy / gridRes) * 100;
                            found = true;
                        }
                    }

                    angle += angleStep;
                    radius += radiusStep / 20;
                    attempts++;
                }
            } else {
                // First word: Center it and mark grid
                const startX = Math.floor((gridRes / 2) - pw / 2);
                const startY = Math.floor((gridRes / 2) - ph / 2);
                for (let r = startY; r < startY + ph; r++) {
                    for (let c = startX; c < startX + pw; c++) {
                        occupied[r][c] = 1;
                    }
                }
                found = true;
            }

            return {
                wv,
                color: CHART_COLORS[i % CHART_COLORS.length],
                style: {
                    left: `${finalX}%`,
                    top: `${finalY}%`,
                    fontSize: `${fontSize}px`,
                    transform: 'translate(-50%, -50%)',
                }
            };
        });
    }, [sortedWords, compact]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} bg-[#F4EDE4] flex items-center justify-center`}
            style={{
                fontFamily: "var(--font-poppins), sans-serif",
                touchAction: 'none'
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
        >
            <div
                className="relative w-full h-full transition-transform duration-700 ease-out"
                style={{
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    transformOrigin: '50% 50%'
                }}
            >
                {positionedWords.map((item, i) => (
                    <WordCloudItem
                        key={`${item.wv.text}-${i}`}
                        wv={item.wv}
                        style={item.style}
                        color={item.color}
                        isBig={item.wv.count > 1}
                    />
                ))}
            </div>

            {!compact && (
                <div className="absolute bottom-6 left-6 pointer-events-none opacity-20 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A0826] animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#3A1B4E]">Distribución Orgánica Activa</p>
                </div>
            )}
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
