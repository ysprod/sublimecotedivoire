'use client';
 import { CATEGORY_CONFIG } from '@/lib/constants';
import { Category, OfferingAlternative } from "@/lib/interfaces";
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle2, Circle, Package } from 'lucide-react';
import Image from "next/image";
import React, { memo } from "react";

interface OfferingCardProps {
  offering: OfferingAlternative;
  isSelected: boolean;
  availableQuantity: number;
  onSelect: () => void;
  index: number;
}

export const OfferingCard: React.FC<OfferingCardProps> = memo(({ offering, isSelected, availableQuantity, onSelect, index }) => {
  const isSufficient = availableQuantity >= offering.quantity;
  const config = CATEGORY_CONFIG[offering.category];

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={isSufficient ? onSelect : undefined}
      disabled={!isSufficient}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
        ${isSelected
          ? `border-[#4F83D1]  shadow-md`
          : isSufficient
            ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#9BC2FF] active:scale-[0.98]"
            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-50 cursor-not-allowed"
        }
      `}
    >
      <div className="flex-shrink-0">
        {isSelected ? (
          <CheckCircle2 className="h-5 w-5 text-[#2E5AA6] dark:text-[#9BC2FF]" />
        ) : (
          <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
        )}
      </div>

      <div className={`
        w-16 h-16 rounded-lg flex items-center justify-center text-xl flex-shrink-0 overflow-hidden
        ${isSelected
          ? `bg-gradient-to-br ${config.gradient} text-white shadow-sm`
          : "bg-gray-100 dark:bg-gray-700"
        }
      `}>
        {offering.illustrationUrl && (
          <Image
            src={offering.illustrationUrl}
            alt={offering.name + ' illustration'}
            width={60}
            height={60}
            className="object-cover w-14 h-14 rounded-xl"
            unoptimized={offering.illustrationUrl.startsWith('blob:') || offering.illustrationUrl.startsWith('data:')}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
          {offering.name || `${config.label} ${index + 1}`}
        </h4>

        <div className="text-[11px] text-gray-600 dark:text-gray-400">
          <div className="mb-0.5">Offrande(s) Requise(s) :  <strong>{offering.quantity}</strong></div>
          <div className={isSufficient ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
            <strong>{availableQuantity}</strong> disponible(s) dans votre panier d'offrandes
          </div>
        </div>
      </div>
    </motion.button>
  );
});

export function OfferingStepEmptyCategory() {

  return (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
        <Package className="w-8 h-8 text-gray-400" />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Aucune offrande dans cette catégorie
      </p>
    </div>
  );
}

const toastVariants = {
  hidden: {
    opacity: 0,
    x: 100,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 22
    }
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export const ErrorToast = ({ message, onClose }: ErrorToastProps) => (
  <motion.div
    variants={toastVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="fixed bottom-4 right-4 z-50 max-w-sm"
  >
    <div className="bg-red-500/95 dark:bg-red-600/95 backdrop-blur-sm text-white rounded-xl shadow-2xl px-4 py-3 flex items-start gap-3 border border-red-400/30">
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-white/80 hover:text-white transition-colors duration-150"
        aria-label="Fermer"
      >
        <span className="text-lg leading-none">×</span>
      </button>
    </div>
  </motion.div>
);

interface TabButtonProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
  count: number;
}

export const TabButton: React.FC<TabButtonProps> = memo(({ category, isActive, onClick }) => {
  const config = CATEGORY_CONFIG[category];

  return (
    <button
      onClick={onClick}
      className={`
        flex-1 relative py-3 px-4 rounded-xl font-semibold text-sm transition-all
        ${isActive
          ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
          : `${config.lightBg} ${config.darkBg} text-gray-700 dark:text-gray-300 hover:opacity-80`
        }
      `}
    >
      <span className="flex items-center justify-center gap-1.5">
        <span className="text-base">{config.icon}</span>
        <span>{config.label}</span>
      </span>
    </button>
  );
});

interface OfferingStepTabsProps {
  activeTab: Category;
  categoryCounts: Record<Category, number>;
  onTabChange: (cat: Category) => void;
}

export function OfferingStepTabs({ activeTab, categoryCounts, onTabChange }: OfferingStepTabsProps) {

  return (
    <div className="flex gap-2">
      {(['animal', 'vegetal', 'beverage'] as Category[]).map(cat => (
        <TabButton
          key={cat}
          category={cat}
          isActive={activeTab === cat}
          onClick={() => onTabChange(cat)}
          count={categoryCounts[cat]}
        />
      ))}
    </div>
  );
}

interface StatusBannerProps {
  hasSelection: boolean;
  isSufficient: boolean;
}

export const StatusBanner: React.FC<StatusBannerProps> = memo(({ hasSelection, isSufficient }) => {
  if (!hasSelection) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-2 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
      >
        <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-yellow-700 dark:text-yellow-300">
          Sélectionnez une alternative disponible pour continuer
        </p>
      </motion.div>
    );
  }

  if (!isSufficient) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
      >
        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-red-700 dark:text-red-300">
          Quantité insuffisante. Rendez-vous au marché pour acquérir cette offrande.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-start gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
    >
      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
      <p className="text-xs text-green-700 dark:text-green-300">
        Alternative sélectionnée et disponible. Prêt à continuer !
      </p>
    </motion.div>
  );
});

export default function CategoryConsulterPageWrapper() {
 

 
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
      <div className="w-full max-w-4xl mx-auto mb-4 sm:mb-6"        >
        
      </div> 
    </div>
  );
}