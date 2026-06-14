'use client';
import { memo } from "react";

const NavButtonConsulter = memo(({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        {...props}
    >

        {children}
    </button>
));

NavButtonConsulter.displayName = "NavButtonConsulter";

export default NavButtonConsulter;