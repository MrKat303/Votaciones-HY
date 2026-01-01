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
        <motion.div whileTap={{ scale: 0.95 }}>
            <Button
                variant={isSelected ? "primary" : "outline"}
                className={`w-full py-4 text-lg justify-start ${isSelected ? 'ring-4 ring-primary/20' : ''}`}
                onClick={onClick}
                disabled={disabled}
            >
                <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3">
                    {isSelected && <div className="w-3 h-3 bg-current rounded-full" />}
                </span>
                {label}
            </Button>
        </motion.div>
    );
}
