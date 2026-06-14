'use client';
import { memo } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

export interface LocationInfoProps {
  adresse: string;
  commune: string;
  departement: string;
  quartier?: string;
}

const LocationInfo = memo(({ adresse, commune, departement, quartier }: LocationInfoProps) => (
  <div className="flex items-start space-x-3">
    <FaMapMarkerAlt className="text-gray-400 mt-0.5 flex-shrink-0" />

    <div className="flex flex-col space-y-2">
      <p className="text-gray-800 text-sm font-medium">{adresse}</p>
      <p className="text-gray-600 text-sm">{departement}</p>
      <p className="text-gray-600 text-sm">{commune}</p>
      {quartier && (<p className="text-gray-500 text-xs mt-1">Quartier: {quartier}</p>)}
    </div>
    
  </div>
));

LocationInfo.displayName = 'LocationInfo';

export default LocationInfo;