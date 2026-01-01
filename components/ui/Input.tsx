"use client";

import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    'w-full bg-white border-2 border-gray-100 focus:border-[#3A1B4E] text-[#3A1B4E] rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-400 font-medium',
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';
