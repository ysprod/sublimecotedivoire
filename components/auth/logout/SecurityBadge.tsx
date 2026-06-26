// app/logout/components/SecurityBadge.tsx
'use client';

import { Shield } from "lucide-react";

export function SecurityBadge() {
  return (
    <div className="mt-6 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 text-gray-600 text-xs font-medium">
        <Shield className="w-3.5 h-3.5" />
        <span>Vos données sont protégées</span>
      </div>
    </div>
  );
}