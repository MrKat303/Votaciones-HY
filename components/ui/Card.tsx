import { HTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'glass-dark' | 'gradient';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'glass-dark', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl transition-all',
                    variant === 'default' && 'bg-white shadow-lg border border-gray-100 text-gray-900',
                    variant === 'glass' && 'glass-panel',
                    variant === 'glass-dark' && 'glass-card',
                    variant === 'gradient' && 'bg-gradient-to-br from-[#3A1B4E] to-[#2A103D] border border-white/10 shadow-2xl text-white',
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';
