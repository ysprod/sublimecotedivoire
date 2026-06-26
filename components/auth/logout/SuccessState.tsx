// app/logout/components/SuccessState.tsx
'use client';

import { Check } from "lucide-react";
import { BaseCard } from "./BaseCard";
import { StatusIcon } from "./StatusIcon";
import { RippleEffect } from "./RippleEffect";
import { CelebrationStars } from "./CelebrationStars";
 

export function SuccessState() {
  return (
    <BaseCard>
      <StatusIcon gradient="from-green-500 to-emerald-500">
        <Check className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[3]" />
        <RippleEffect />
      </StatusIcon>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
        Déconnexion réussie !
      </h2>
      <p className="text-sm sm:text-base text-gray-500">
        À bientôt sur DATAKWABA
      </p>

      <CelebrationStars />
    </BaseCard>
  );
}