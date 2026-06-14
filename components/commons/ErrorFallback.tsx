'use client';
import { ERROR_MESSAGE } from "@/libs/constants";
import clsx from "clsx";
import React, { memo } from "react";

interface ErrorFallbackProps {
  error: Error;
  className?: string;
  customMessage?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = memo(({ error, className, customMessage }: ErrorFallbackProps) => {

  const errorMessage = error?.message || ERROR_MESSAGE;

  return (
    <div
      role="alert" aria-live="assertive" aria-atomic="true"
      className={clsx("p-6 bg-red-50 border-l-4 border-red-600 rounded-lg shadow-sm",
        "text-red-700", "hover:bg-red-100 transition-colors duration-200", className
      )}
    >
      <p className="font-semibold text-lg mb-2">
        {customMessage || ERROR_MESSAGE}
      </p>

      <pre className="mt-2 overflow-x-auto text-sm bg-red-100 p-3 rounded-md">
        {errorMessage}
      </pre>
    </div>
  );
});

ErrorFallback.displayName = "ErrorFallback";

export default ErrorFallback;