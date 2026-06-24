'use client';
import { memo, useCallback, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiClock, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface DropdownMenuProps {
    setIsOpen: (value: SetStateAction<boolean>) => void;
}

const DropdownMenu = memo(({ setIsOpen }: DropdownMenuProps) => {
    const router = useRouter();
    const { logout } = useAuth();

    const navigateTo = useCallback((path: string) => {
        setIsOpen(false);
        router.push(path);
    }, [setIsOpen, router]
    );

    const handleLogout = useCallback(() => {
        logout();
        router.push('/');
    }, [logout, router]);

    const dropdownmenuItems = [
        { label: 'Profil', icon: <FiUser size={16} />, onClick: () => navigateTo('/profil'), className: 'text-gray-700 hover:bg-gray-50', },
        { label: 'Déconnexion', icon: <FiLogOut size={16} />, onClick: handleLogout, className: 'text-red-600 hover:bg-red-50', },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}
            className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
        >
            {dropdownmenuItems.map(({ label, icon, onClick, className }) => (
                <button key={label} onClick={onClick}
                    className={`flex items-center gap-3 w-full px-4 py-2 text-left transition-colors ${className}`}
                >
                    {icon}<span>{label}</span>
                </button>
            ))}
        </motion.div>
    );
});

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;