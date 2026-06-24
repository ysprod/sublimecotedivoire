'use client';
import { memo } from 'react';
import { Loader2 } from 'lucide-react';

interface LoginButtonProps {
    isSubmitting: boolean;
    isDisabled: boolean;
}

export const LoginButton = memo(function LoginButton({
    isSubmitting,
    isDisabled,
}: LoginButtonProps) {
    const isButtonDisabled = isDisabled || isSubmitting;

    return (
        <button
            type="submit"
            disabled={isButtonDisabled}
            className={`
        flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 py-3
        text-sm font-semibold shadow-md transition-colors
        ${isButtonDisabled
                    ? 'cursor-not-allowed border-blue-100 bg-gray-200 text-gray-400'
                    : 'bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900 hover:from-blue-200 hover:to-blue-400'
                }
      `}
            aria-busy={isSubmitting}
        >
            {isSubmitting ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Connexion...</span>
                </>
            ) : (
                'Se connecter'
            )}
        </button>
    );
});

LoginButton.displayName = 'LoginButton';