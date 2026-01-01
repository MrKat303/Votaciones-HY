"use client";

import { useEffect, useState, useMemo } from "react";

interface CountdownTimerProps {
    endTime: string | null;
    onExpire?: () => void;
    className?: string;
}

export function CountdownTimer({ endTime, onExpire, className }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    // Memoize the target time to avoid unnecessary recalculations
    const targetDate = useMemo(() => (endTime ? new Date(endTime).getTime() : null), [endTime]);

    useEffect(() => {
        if (!targetDate) {
            setTimeLeft(0);
            return;
        }

        const updateTimer = () => {
            const now = Date.now();
            const difference = Math.max(0, Math.floor((targetDate - now) / 1000));

            setTimeLeft(difference);

            if (difference === 0 && onExpire) {
                onExpire();
            }
        };

        updateTimer();
        const intervalId = setInterval(updateTimer, 1000);

        return () => clearInterval(intervalId);
    }, [targetDate, onExpire]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const isUrgent = timeLeft > 0 && timeLeft < 20;

    return (
        <span className={`tabular-nums transition-colors duration-500 ${isUrgent ? 'text-red-500 animate-pulse' : ''} ${className}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
    );
}
