'use client';
import CacheLink from '@/components/commons/CacheLink';
import { useLoginForm } from '@/hooks/auth/login/useLoginForm';
import Image from 'next/image';
import { memo } from 'react';
import { LoginInputField } from './LoginInputField';
import { LoginButton } from './LoginButton';
import { LoginErrorAlert } from './LoginErrorAlert';
import { LoginFooter } from './LoginFooter';
import { LoginHeader } from './LoginHeader';

const LOGO_CONFIG = {
  src: '/logo.png',
  alt: 'DATAKWABA',
  width: 80,
  height: 80,
} as const;

const LoginForm = memo(function LoginForm() {
  const {
    handleSubmit,
    error,
    isSubmitDisabled,
    isLoading,
    isPending,
    isHydrated,
    usernameProps,
    passwordProps,
  } = useLoginForm();

  const isSubmitting = isHydrated && (isLoading || isPending);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4 text-gray-900">
      <div className="w-full max-w-2xl">
        <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-[0_8px_32px_-18px_rgba(46,90,166,0.10)] sm:p-8">
          <CacheLink href="/" className="mb-6 block">
            <div className="flex justify-center">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={LOGO_CONFIG.src}
                  alt={LOGO_CONFIG.alt}
                  fill
                  sizes="(max-width: 768px) 80px, 80px"
                  className="object-contain p-3"
                  priority
                />
              </div>
            </div>
          </CacheLink>

          <LoginHeader />

          {error && <LoginErrorAlert message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <LoginInputField {...usernameProps} />
            <LoginInputField {...passwordProps} />
            <LoginButton
              isSubmitting={isSubmitting}
              isDisabled={isSubmitDisabled}
            />
          </form>

          <LoginFooter />
        </div>

        <p className="mb-16 mt-6 text-center text-xs text-gray-400">
          © 2026 DATAKWABA - Tous droits réservés.
        </p>
      </div>
    </div>
  );
});

export default LoginForm;