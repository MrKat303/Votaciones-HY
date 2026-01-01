import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

interface VoteButtonProps {
    optionId: string;
    label: string;
    isSelected?: boolean;
    onClick: () => void;
    disabled?: boolean;
}

export function VoteButton({ label, isSelected, onClick, disabled }: VoteButtonProps) {
    return (
        <motion.div whileTap={!disabled ? { scale: 0.98 } : {}} whileHover={!disabled ? { scale: 1.02 } : {}}>
            <Button
                variant="ghost"
                className={`w-full py-6 text-xl justify-start relative overflow-hidden transition-all duration-300 border-2
          ${isSelected
                        ? 'bg-[#FFC100] border-[#FFC100] text-[#3A1B4E] font-bold shadow-lg shadow-orange-500/20'
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/30'
                    }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
                onClick={onClick}
                disabled={disabled}
            >
                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 transition-colors
          ${isSelected ? 'border-[#3A1B4E]' : 'border-white/50 group-hover:border-white'}
        `}>
                    {isSelected && <div className="w-4 h-4 bg-[#3A1B4E] rounded-full" />}
                </span>
                {label}
            </Button>
        </motion.div>
    );
}
