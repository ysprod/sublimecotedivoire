'use client';
import { memo } from 'react';

export const LoginHeader = memo(function LoginHeader() {
    return (
        <div className="mb-6 text-center">
            <h1 className="mb-2 text-2xl font-bold text-blue-900 sm:text-3xl">
                Connexion
            </h1>

            <p className="mx-auto max-w-md text-xs text-gray-600 sm:text-sm">
                Accédez à votre espace personnel
            </p>
        </div>
    );
});

LoginHeader.displayName = 'LoginHeader';