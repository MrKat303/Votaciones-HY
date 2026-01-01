import { HTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl p-6 transition-all',
                    variant === 'default' && 'bg-white shadow-lg border border-gray-100',
                    variant === 'glass' && 'bg-white/70 backdrop-blur-md border border-white/50 shadow-xl',
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';
