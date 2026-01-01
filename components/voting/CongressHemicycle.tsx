"use client";

import { useMemo } from "react";
import { Poll } from "@/types";

interface CongressHemicycleProps {
    poll: Poll;
}

export function CongressHemicycle({ poll }: CongressHemicycleProps) {
    const { seats, assignedColors } = useMemo(() => {
        const totalSeats = poll.maxVoters || 100;
        const centerX = 250;
        const centerY = 280;

        const rows = Math.max(5, Math.ceil(totalSeats / 20));
        const generatedSeats = [];

        let seatCount = 0;
        for (let row = 0; row < rows; row++) {
            const radius = 60 + (row * 22);
            const circumference = Math.PI * radius;
            const seatWidth = 14;
            const seatsInRow = Math.min(
                Math.floor(circumference / seatWidth * 0.8),
                totalSeats - seatCount
            );

            if (seatsInRow <= 0) continue;

            const angleStep = Math.PI / (seatsInRow + 1);

            for (let s = 1; s <= seatsInRow; s++) {
                const angle = Math.PI - (s * angleStep);
                const x = centerX + radius * Math.cos(angle);
                const y = centerY - radius * Math.sin(angle);

                generatedSeats.push({ x, y, id: `seat-${row}-${s}` });
                seatCount++;
            }
            if (seatCount >= totalSeats) break;
        }

        const assignedColors = new Array(generatedSeats.length).fill("rgba(255,255,255,0.15)");
        let currentIndex = 0;

        const getBooleanColor = (text: string) => {
            const lower = text.toLowerCase();
            if (lower.includes("favor")) return "#2EB67D";
            if (lower.includes("contra")) return "#9333EA";
            if (lower.includes("abst")) return "#FFC100";
            return "#529CE8";
        };

        const defaultColors = ["#2EB67D", "#C22359", "#529CE8", "#FFC100", "#9333EA"];

        poll.options.forEach((option, idx) => {
            const color = poll.type === "BOOLEAN"
                ? getBooleanColor(option.text)
                : defaultColors[idx % defaultColors.length];

            for (let i = 0; i < option.votes; i++) {
                if (currentIndex < generatedSeats.length) {
                    assignedColors[currentIndex] = color;
                    currentIndex++;
                }
            }
        });

        return { seats: generatedSeats, assignedColors };
    }, [poll]);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="relative w-full max-w-[500px] aspect-[5/3]">
                <svg viewBox="0 0 500 300" className="w-full h-full drop-shadow-xl bg-white/5 rounded-2xl border border-white/10">
                    {/* Podium */}
                    <path d="M 220 280 L 280 280 L 270 260 L 230 260 Z" fill="#FFC100" opacity="0.4" />

                    {seats.map((seat, index) => (
                        <circle
                            key={seat.id}
                            cx={seat.x}
                            cy={seat.y}
                            r="5"
                            fill={assignedColors[index]}
                            className="transition-all duration-700 ease-out"
                            stroke={assignedColors[index] === "rgba(255,255,255,0.15)" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.2)"}
                            strokeWidth="1"
                        />
                    ))}

                    <text x="50%" y="295" textAnchor="middle" fill="white" opacity="0.2" fontSize="9" fontWeight="900" className="uppercase tracking-[0.2em]">
                        {poll.totalVotes} / {poll.maxVoters} OCUPADOS
                    </text>
                </svg>
            </div>
        </div>
    );
}
