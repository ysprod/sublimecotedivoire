// app/logout/components/LoadingState.tsx
'use client';

import { LogOut, Sparkles, Shield, Zap, Star } from "lucide-react";
import { BaseCard } from "./BaseCard";
import { StatusIcon } from "./StatusIcon";
import { IconPulse } from "./IconPulse";
import { ProgressBar } from "./ProgressBar";

interface LoadingStateProps {
  progress: number;
}

export function LoadingState({ progress }: LoadingStateProps) {
  return (
    <BaseCard>
      <StatusIcon gradient="from-blue-600 to-blue-400">
        <LogOut className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        <Sparkles className="absolute inset-0 w-16 h-16 text-blue-300 opacity-60" />
      </StatusIcon>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
        Déconnexion en cours
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-5 sm:mb-7">
        Sécurisation de votre session...
      </p>

      <ProgressBar progress={progress} />

      <div className="flex items-center justify-center gap-3 sm:gap-4 text-gray-400">
        <IconPulse Icon={Shield} color="text-blue-400" delay={0} />
        <IconPulse Icon={Zap} color="text-yellow-400" delay={0.15} />
        <IconPulse Icon={Star} color="text-blue-300" delay={0.3} />
      </div>
    </BaseCard>
  );
}