// app/logout/components/ProgressBar.tsx
'use client';
interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="mb-5 sm:mb-7">
      <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="relative h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs sm:text-sm text-gray-400 mt-2 font-semibold">
        {progress}%
      </p>
    </div>
  );
}