// app/logout/components/BaseCard.tsx
'use client';

import { ReactNode } from "react";
import clsx from "clsx";

interface BaseCardProps {
  children: ReactNode;
  className?: string;
}

export function BaseCard({ children, className }: BaseCardProps) {
  return (
    <div className={clsx(
      "bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-10 text-center",
      className
    )}>
      {children}
    </div>
  );
}