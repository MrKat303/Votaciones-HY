"use client";

import { useMemo } from "react";
import { Poll } from "@/types";

interface CongressHemicycleProps {
    poll: Poll;
}

export function CongressHemicycle({ poll }: CongressHemicycleProps) {
    const { seats, assignedColors } = useMemo(() => {
        const totalSeats = poll.maxVoters || 100; // Fallback
        const centerX = 250;
        const centerY = 280; // Lower center for hemicycle

        // Calculate rows based on density roughly
        const rows = Math.max(5, Math.ceil(totalSeats / 20));
        const generatedSeats = [];

        let seatCount = 0;
        for (let row = 0; row < rows; row++) {
            const radius = 60 + (row * 22);
            const circumference = Math.PI * radius; // Half circle length
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

        // Color Logic
        const assignedColors = new Array(generatedSeats.length).fill("#E5E7EB");
        let currentIndex = 0;
        const colors = [
            "#2EB67D", // Option 1
            "#C22359", // Option 2
            "#529CE8", // Option 3
            "#FFC100", // Option 4
            "#9333EA", // Option 5
        ];

        poll.options.forEach((option, idx) => {
            const color = colors[idx % colors.length];
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
                    <path d="M 220 280 L 280 280 L 270 260 L 230 260 Z" fill="#3A1B4E" opacity="0.8" />

                    {seats.map((seat, index) => (
                        <circle
                            key={seat.id}
                            cx={seat.x}
                            cy={seat.y}
                            r="5"
                            fill={assignedColors[index]}
                            className="transition-all duration-500 ease-in-out"
                            stroke={assignedColors[index] === "#E5E7EB" ? "rgba(0,0,0,0.1)" : "none"}
                            strokeWidth="1"
                        />
                    ))}

                    <text x="50%" y="295" textAnchor="middle" fill="#9CA3AF" fontSize="12">
                        Escaños ocupados: {poll.totalVotes} / {poll.maxVoters}
                    </text>
                </svg>
            </div>
        </div>
    );
}
