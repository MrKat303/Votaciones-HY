"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
    endTime: string | null;
    onExpire?: () => void;
    className?: string; // Allow overrides
}

export function CountdownTimer({ endTime, onExpire, className }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{ m: number; s: number } | null>(null);

    useEffect(() => {
        if (!endTime) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(endTime).getTime();
            const diff = end - now;

            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft({ m: 0, s: 0 });
                if (onExpire) onExpire();
            } else {
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft({ m, s });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime, onExpire]);

    if (!timeLeft) return null;

    // Visual urgency
    const isUrgent = timeLeft.m === 0 && timeLeft.s < 60;

    return (
        <div className={`
      flex items-center gap-2 font-mono text-2xl font-bold tracking-widest
      ${isUrgent ? 'text-[#C22359] animate-pulse' : ''}
      ${className}
    `}>
            <span>
                {String(timeLeft.m).padStart(2, "0")}:{String(timeLeft.s).padStart(2, "0")}
            </span>
        </div>
    );
}
