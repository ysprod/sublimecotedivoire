// app/logout/components/IconPulse.tsx
'use client';

import clsx from "clsx";
import { ElementType } from "react";

interface IconPulseProps {
    Icon: ElementType;
    color: string;
    delay?: number;
}

export function IconPulse({ Icon, color }: IconPulseProps) {
    return (
        <div className={clsx(color, "transition-opacity")}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
    );
}