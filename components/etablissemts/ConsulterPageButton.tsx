'use client';
import { memo } from "react";

export interface ConsulterPageButtonProps {
    page: number;
    currentPage: number;
    onClick: () => void;
}

const ConsulterPageButton = memo(({ page, currentPage, onClick }: ConsulterPageButtonProps) => (
    <button
        onClick={onClick}
        className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${page === currentPage
            ? 'bg-primary text-white font-medium shadow-sm' : 'hover:bg-gray-100 text-gray-700'
            }`}
        aria-current={page === currentPage ? 'page' : undefined}
    >
        {page + 1}
    </button>
));

ConsulterPageButton.displayName = 'ConsulterPageButton';

export default ConsulterPageButton;