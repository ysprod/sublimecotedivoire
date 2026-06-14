'use client';
import { motion } from "framer-motion";
import { memo } from "react";

interface ValidateButtonProps {
    onClick: () => void;
    disabled?: boolean;
    texte?: string;
}

const ValidateButton: React.FC<ValidateButtonProps> = memo(({ onClick, disabled, texte = "Afficher" }) => (
    <motion.button
        onClick={onClick} disabled={disabled}
        className={`w-full md:w-auto px-6 py-2 rounded-full shadow-lg 
            text-lg font-semibold flex items-center justify-center space-x-2
             ${disabled ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-800 text-white hover:bg-gray-800'}`}
        whileHover={!disabled ? { scale: 1.03 } : {}}
        whileTap={!disabled ? { scale: 0.97 } : {}} aria-label={texte}
    >

        <span>{texte}</span>
    </motion.button>
));

ValidateButton.displayName = "ValidateButton";

export default ValidateButton;