// app/logout/components/ErrorState.tsx
'use client';

import { Zap, Loader2 } from "lucide-react";
import { BaseCard } from "./BaseCard";
import { StatusIcon } from "./StatusIcon";

export function ErrorState() {
  return (
    <BaseCard>
      <StatusIcon gradient="from-orange-500 to-red-500">
        <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
      </StatusIcon>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
        Petite erreur...
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-5">
        Redirection en cours...
      </p>
      <Loader2 className="mx-auto h-5 w-5 animate-spin text-blue-600 sm:h-6 sm:w-6" />
    </BaseCard>
  );
}