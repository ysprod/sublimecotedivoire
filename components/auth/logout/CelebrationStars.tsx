// app/logout/components/CelebrationStars.tsx
'use client';

import { Star } from "lucide-react";

const STARS_COUNT = 10;

export function CelebrationStars() {
  return (
    <div className="mt-5 sm:mt-6 flex items-center justify-center gap-1.5 sm:gap-2">
      {Array.from({ length: STARS_COUNT }, (_, i) => (
        <Star
          key={i}
          className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400"
        />
      ))}
    </div>
  );
}