// components/map/MapControls.tsx
'use client';

import { ArrowLeft } from 'lucide-react';
import { memo } from 'react';

interface MapControlsProps {
    viewLevel: 'country' | 'region' | 'department' | 'commune';
    onBack: () => void;
    levelName: string;
}

export const MapControls = memo(({ viewLevel, onBack, levelName }: MapControlsProps) => {
    const levelColors = {
        country: 'bg-blue-600',
        region: 'bg-purple-600',
        department: 'bg-amber-600',
        commune: 'bg-green-600'
    };

    return (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            {viewLevel !== 'country' && (
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                    aria-label="Retour"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Retour</span>
                </button>
            )}

            <div className={`px-3 py-2 rounded-lg shadow-md text-white text-sm font-medium ${levelColors[viewLevel]}`}>
                {viewLevel === 'country' ? 'Côte d\'Ivoire' : levelName}
            </div>
        </div>
    );
});

MapControls.displayName = 'MapControls';