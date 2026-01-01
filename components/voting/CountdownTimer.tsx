"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";

interface CountdownTimerProps {
    endTime: string | null;
    onExpire?: () => void;
}

export function CountdownTimer({ endTime, onExpire }: CountdownTimerProps) {
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

    return (
        <Card className="flex items-center justify-center p-4 bg-primary/5 border-primary/10">
            <div className="text-3xl font-bold font-mono text-primary flex items-center gap-2">
                <span>⏱</span>
                <span>
                    {String(timeLeft.m).padStart(2, "0")}:{String(timeLeft.s).padStart(2, "0")}
                </span>
            </div>
        </Card>
    );
}
