"use client";
import { memo } from 'react';

interface Props {
  error: string;
}

const LoginError = memo(({ error }: Props) => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-300">
          <div className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

LoginError.displayName = 'LoginError';

export default LoginError;