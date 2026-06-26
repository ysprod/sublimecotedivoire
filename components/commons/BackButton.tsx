'use client';
import { motion } from "framer-motion";
import { memo } from "react";
import { ArrowLeft, Home, ChevronLeft } from "lucide-react";
import clsx from "clsx";

interface BackButtonProps {
  onClick: () => void;
  variant?: 'default' | 'minimal' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  icon?: 'arrow' | 'chevron' | 'home';
  className?: string;
}

const BackButton = memo(({ 
  onClick, 
  variant = 'default',
  size = 'md',
  showLabel = true,
  label = 'Retour',
  icon = 'arrow',
  className = ''
}: BackButtonProps) => {
  
  // Configuration des tailles
  const sizeConfig = {
    sm: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      icon: 'w-4 h-4',
      gap: 'gap-1.5'
    },
    md: {
      padding: 'px-4 py-2.5',
      text: 'text-base',
      icon: 'w-5 h-5',
      gap: 'gap-2'
    },
    lg: {
      padding: 'px-6 py-3.5',
      text: 'text-lg',
      icon: 'w-6 h-6',
      gap: 'gap-2.5'
    }
  };

  // Configuration des variantes
  const variantConfig = {
    default: {
      base: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl',
      hover: 'hover:from-blue-700 hover:to-indigo-700 hover:scale-105',
      border: 'border-0'
    },
    minimal: {
      base: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      hover: 'hover:scale-105',
      border: 'border-0'
    },
    outline: {
      base: 'bg-transparent text-blue-600 border-2 border-blue-600',
      hover: 'hover:bg-blue-600 hover:text-white hover:scale-105',
      border: 'border-2'
    },
    glass: {
      base: 'bg-white/20 backdrop-blur-md text-white border border-white/30',
      hover: 'hover:bg-white/30 hover:scale-105',
      border: 'border'
    }
  };

  // Sélection de l'icône
  const IconComponent = {
    arrow: ArrowLeft,
    chevron: ChevronLeft,
    home: Home
  }[icon];

  const config = variantConfig[variant];
  const sizeConf = sizeConfig[size];

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      className={clsx(
        "flex items-center rounded-full font-medium transition-all duration-300",
        sizeConf.padding,
        sizeConf.text,
        sizeConf.gap,
        config.base,
        config.hover,
        config.border,
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        "shadow-md hover:shadow-lg",
        className
      )}
      aria-label="Retour"
    >
      <IconComponent className={clsx(
        sizeConf.icon,
        "transition-transform duration-300 group-hover:-translate-x-1"
      )} />
      
      {showLabel && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="font-medium"
        >
          {label}
        </motion.span>
      )}

      {/* Tooltip sur le hover pour les versions minimales */}
      {!showLabel && (
        <span className="sr-only">{label}</span>
      )}
    </motion.button>
  );
});

BackButton.displayName = "BackButton";

export default BackButton;