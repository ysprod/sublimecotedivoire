"use client";
import { memo } from 'react';
import Link from 'next/link';

const LoginFooter = memo(() => {

  return (
    <div className="bg-gray-50 px-8 py-6 text-center">
      <p className="text-sm text-gray-600">
        Vous n&apos;avez pas de compte ?{' '}
        <Link
          href="/register"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
});

LoginFooter.displayName = 'LoginFooter';

export default LoginFooter;