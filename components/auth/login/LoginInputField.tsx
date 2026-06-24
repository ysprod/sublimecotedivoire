'use client';
import { Eye, EyeOff } from 'lucide-react';
import { memo } from 'react';

interface LoginInputFieldProps {
    label: string;
    name: string;
    type: string;
    value: string;
    error?: string;
    placeholder: string;
    icon: React.ElementType;
    showPasswordToggle?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LoginInputField = memo(function LoginInputField({
    label,
    name,
    type,
    value,
    error,
    placeholder,
    icon: Icon,
    showPasswordToggle,
    showPassword,
    onTogglePassword,
    onChange,
}: LoginInputFieldProps) {
    const hasError = Boolean(error);

    return (
        <div className="space-y-1.5">
            <label
                htmlFor={name}
                className="block text-xs font-semibold text-white dark:text-gray-300"
            >
                {label}
            </label>

            <div className="relative">
                <Icon
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-blue-300"
                    aria-hidden="true"
                />
                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`
            w-full rounded-xl border-2 bg-white py-2.5 text-sm
            pl-10 ${showPasswordToggle ? 'pr-10' : 'pr-4'}
            placeholder:text-gray-400 dark:placeholder:text-blue-300
            transition-colors
            ${hasError
                            ? 'border-red-300 focus:border-red-500 dark:border-red-700 dark:focus:border-red-500'
                            : 'border-gray-200 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-400'
                        }
            focus:outline-none focus:ring-2 focus:ring-blue-500/20
            dark:bg-gray-800 dark:focus:ring-blue-400/25
          `}
                    autoComplete={name === 'username' ? 'username' : 'current-password'}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${name}-error` : undefined}
                />

                {showPasswordToggle && onTogglePassword && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 transition-colors hover:text-gray-600 dark:text-blue-300 dark:hover:text-blue-200"
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                )}
            </div>

            {hasError && (
                <p
                    id={`${name}-error`}
                    className="mt-1 text-xs text-red-600 dark:text-red-400"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    );
});

LoginInputField.displayName = 'LoginInputField';