'use client';
import React from 'react';
import Link from 'next/link';

const RememberMe: React.FC = () => {

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label
          htmlFor="remember-me"
          className="ml-2 block text-sm text-gray-700"
        >
          Se souvenir de moi
        </label>
      </div>

      <div className="text-sm">
        <Link
          href="/forgot-password"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Mot de passe oublié ?
        </Link>
      </div>
    </div>
  );
};

export default React.memo(RememberMe);