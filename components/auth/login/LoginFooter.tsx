'use client';
import { memo } from 'react';
import { Lock } from 'lucide-react';
import CacheLink from '@/components/commons/CacheLink';

export const LoginFooter = memo(function LoginFooter() {

    return (
        <div className="mt-6 space-y-4">
            <div className="text-center">
                <p className="text-sm text-gray-700">
                    Pas encore de compte ?{' '}
                    <CacheLink
                        href="/auth/register"
                        className="font-semibold text-blue-700 transition-colors hover:underline"
                    >
                        Inscription
                    </CacheLink>
                </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-blue-400">
                <Lock className="h-3 w-3" aria-hidden="true" />
                <span>Connexion sécurisée et cryptée.</span>
            </div>
        </div>
    );
});

LoginFooter.displayName = 'LoginFooter';