'use client';
import { memo, useState } from 'react';
import type { Etablissement } from '@/lib/libs/interface';
import { MdLocationCity, MdDirections } from 'react-icons/md';
import ContactInfo from './ContactInfo';
import LegalInfo from './LegalInfo';
import LocationInfo from './LocationInfo';
import OwnerInfo from './OwnerInfo';
import ToggleDetailsButton from './ToggleDetailsButton';
import EtablissementHeader from './EtablissementHeader';
import EtablissementBadges from './EtablissementBadges';

interface EtablissementCardProps {
  etablissement: Etablissement;
}

const EtabFiltreDisplay = memo(({ etablissement }: EtablissementCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-300">
      <div className="p-4 m-2">
        <EtablissementHeader etablissement={etablissement} />
        <EtablissementBadges etablissement={etablissement} />

        <div className="mt-5 grid grid-cols-1 md:grid-cols-1 gap-4">
          <LocationInfo
            adresse={etablissement.adresse} commune={etablissement.commune}
            departement={etablissement.departement} quartier={etablissement.quartier}
          />

          <ContactInfo telephone={etablissement.telephone} email={etablissement.email} />
        </div>

        {showDetails && (
          <div className="pt-6 animate-fadeIn space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 flex items-center mb-3">
                  <MdLocationCity className="mr-2 text-blue-500" /> Localisation
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Région:</span> {etablissement.region}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Département:</span> {etablissement.departement}
                </p>
              </div>
            </div>

            <LegalInfo licence={etablissement.licence} />
            <OwnerInfo owner={etablissement.owner} />

            <div className="flex justify-center mt-4">
              <a
                href={`https://www.google.com/maps?q=${etablissement.region} ${etablissement.departement} ${etablissement.adresse}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MdDirections className="mr-2" /> Voir sur la carte
              </a>
            </div>
          </div>
        )}

        <ToggleDetailsButton showDetails={showDetails} onClick={() => setShowDetails(!showDetails)} />
      </div>
    </div>
  );
});

EtabFiltreDisplay.displayName = "EtabFiltreDisplay";

export default EtabFiltreDisplay;