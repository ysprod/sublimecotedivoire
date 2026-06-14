'use client';
import { motion } from "framer-motion";
import { memo } from "react";

interface BackButtonProps {
  onClick: () => void;
}

const BackButton = memo(({ onClick }: BackButtonProps) => (
  <motion.button
    onClick={onClick}
    className="flex items-center justify-center bg-gray-200 px-4 py-2 rounded-full text-blue-600 hover:text-blue-800 transition-colors"
    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-label="Retour"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    <span className="ml-1">Retour</span>
  </motion.button>
));

BackButton.displayName = "BackButton";

export default BackButton;