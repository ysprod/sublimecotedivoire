'use client';
import { memo } from 'react';

export const MapLegend = memo(() => (
    <div className="absolute bottom-4 right-4 z-10 bg-white p-3 rounded-lg shadow-md text-xs">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-300 border border-blue-500" />
                <span>Régions</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-300 border border-yellow-600" />
                <span>Départements</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-300 border border-green-600" />
                <span>Communes</span>
            </div>
        </div>
    </div>
)); 