'use client';
import { memo, SetStateAction, useCallback } from 'react';
import { FiUser, FiChevronDown } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { User } from '@/lib/libs/interface';

interface DropdownButtonProps {
    user: User;
    setIsOpen: (value: SetStateAction<boolean>) => void;
    isOpen: boolean;
}

const DropdownButton = memo(({ setIsOpen, isOpen, user }: DropdownButtonProps) => {
    const toggleDropdown = useCallback(() => { setIsOpen(prev => !prev); }, [setIsOpen]);

    return (
        <button
            className="flex items-center w-full gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
            aria-expanded={isOpen} onClick={toggleDropdown} aria-haspopup="true"
        >

            {user.photo ? (
                <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0">
                    <Image src={user.photo} alt={`Photo ${user.name}`} width={32} height={32}
                        className="object-cover" unoptimized />
                </div>
            ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                    <FiUser size={16} />
                </div>
            )}

            <span className="font-medium truncate max-w-[120px]">
                {user.name}
            </span>

            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}
                className="ml-auto"
            >
                <FiChevronDown size={18} />
            </motion.div>
        </button>
    );
});

DropdownButton.displayName = 'DropdownButton';

export default DropdownButton;