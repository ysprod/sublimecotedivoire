// app/logout/components/StatusIcon.tsx
'use client';

import { ReactNode } from "react";
import clsx from "clsx";

interface StatusIconProps {
  children: ReactNode;
  gradient: string;
  size?: 'sm' | 'md';
}

export function StatusIcon({ children, gradient, size = 'md' }: StatusIconProps) {
  const sizeClasses = {
    sm: 'w-14 h-14 sm:w-16 sm:h-16',
    md: 'w-16 h-16 sm:w-20 sm:h-20'
  };

  return (
    <div className={clsx(
      "mx-auto mb-5 sm:mb-6 relative",
      sizeClasses[size]
    )}>
      <div className={clsx(
        "absolute inset-0 bg-gradient-to-br rounded-full shadow-lg",
        gradient
      )} />
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}