'use client';
import { memo } from 'react';
import { FileText } from 'lucide-react';

interface ReportButtonProps {
  onClick: () => void;
  label?: string;
}

export const ReportButton = memo(function ReportButton({
  onClick, label = 'Rapport',
}: ReportButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition-colors hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={`Générer un ${label}`}
      type="button"
    >
      <FileText className="h-5 w-5" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
});

ReportButton.displayName = 'ReportButton';