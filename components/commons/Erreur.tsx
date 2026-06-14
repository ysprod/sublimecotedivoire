'use client';
import { memo } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { ERROR_MESSAGE } from "@/lib/libs/constants";

interface ErreurProps {
    message: string | null;
    id?: string;
    className?: string;
}

const Erreur: React.FC<ErreurProps> = memo(({ message = ERROR_MESSAGE, id = "error-msg", className }: ErreurProps) => {

    const animationProps = {
        exit: { opacity: 0, y: 15 }, initial: { opacity: 0, y: -15 }, animate: { opacity: 1, y: 0 },
        transition: { type: "spring", stiffness: 100, damping: 10, duration: 0.3 },
    };

    return (
        <motion.p
            key="error" {...animationProps} role="alert"
            aria-live="assertive" aria-atomic="true" aria-describedby={id}
            className={clsx("text-red-600 text-center text-lg font-semibold uppercase",
                "mt-20 mb-20 p-4 bg-red-50 border-l-4 border-red-600 rounded-lg shadow-sm",
                "hover:bg-red-100 transition-colors duration-200", className
            )} id={id}
        >
            {message}
        </motion.p>
    );
});

Erreur.displayName = "Erreur";

export default Erreur;