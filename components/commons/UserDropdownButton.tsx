'use client';
import { useState, useRef, memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import DropdownButton from './DropdownButton';
import DropdownMenu from './Dropdownmenu';
import { User } from '@/lib/libs/interface';

interface UserDropdownButtonProps {
  user: User;
}

const UserDropdownButton = memo(({ user }: UserDropdownButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="bg-white w-full max-w-lg rounded-lg p-2 shadow-sm  border border-gray-300">

      <div className="relative w-full" ref={dropdownRef}>

        <DropdownButton user={user} setIsOpen={setIsOpen} isOpen={isOpen} />

        <AnimatePresence>
          {isOpen && (<DropdownMenu setIsOpen={setIsOpen} />)}
        </AnimatePresence>
      </div>

    </div>
  );
});

UserDropdownButton.displayName = 'UserDropdownButton';

export default UserDropdownButton;