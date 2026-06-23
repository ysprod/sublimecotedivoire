'use client';
import { memo } from 'react';

interface MapPopupProps {
  data: any;
  type: 'region' | 'department' | 'commune';
}

export const MapPopup = memo(({ data, type }: MapPopupProps) => {
  const titles = {
    region: 'Région',
    department: 'Département',
    commune: 'Commune'
  };

  return (
    <div className="p-3 max-w-xs">
      <h4 className="font-bold text-sm mb-1">{data.name}</h4>
      <p className="text-xs text-gray-600">
        {titles[type]} sélectionné(e)
      </p>
      {data.value !== undefined && (
        <p className="text-xs text-gray-500 mt-1">
          Valeur: {data.value}
        </p>
      )}
    </div>
  );
});

MapPopup.displayName = 'MapPopup';