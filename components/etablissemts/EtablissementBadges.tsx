'use client';
import { memo } from 'react';
import { FaBed, FaMoneyBillWave } from 'react-icons/fa';
import type { Etablissement } from '@/libs/interface';

const EtablissementBadges = memo(({ etablissement }: { etablissement: Etablissement }) => (
    <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className="flex items-center px-3 py-1 bg-blue-50 text-blue-800 text-xs font-medium rounded-full">
            <FaBed className="mr-1" size={10} /> {etablissement.chambres} chambres
        </span>
        <span className={`flex items-center px-3 py-1 text-xs font-medium rounded-full ${etablissement.cotisation === 'À jour'
            ? 'bg-green-50 text-green-800'
            : 'bg-red-50 text-red-800'
            }`}>
            <FaMoneyBillWave className="mr-1" size={10} /> {etablissement.cotisation}
        </span>
    </div>
));

EtablissementBadges.displayName = 'EtablissementBadges';

export default EtablissementBadges;