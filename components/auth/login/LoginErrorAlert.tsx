'use client';
import { memo } from 'react';
import { AlertCircle } from 'lucide-react';

interface LoginErrorAlertProps {
    message: string;
}

export const LoginErrorAlert = memo(function LoginErrorAlert({
    message,
}: LoginErrorAlertProps) {
    return (
        <div
            className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-700/60 dark:bg-red-950/20"
            role="alert"
        >
            <AlertCircle
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400"
                aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-red-700 dark:text-red-300">
                {message}
            </p>
        </div>
    );
});

LoginErrorAlert.displayName = 'LoginErrorAlert';