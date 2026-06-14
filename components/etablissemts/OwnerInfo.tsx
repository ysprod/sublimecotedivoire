'use client';
import { Owner } from '@/libs/interface';
import { memo } from 'react';
import { FaUserTie, FaPhone, FaIdCard } from 'react-icons/fa';

interface OwnerInfoProps {
  owner: Owner;
}

const OwnerInfo = memo(({ owner }: OwnerInfoProps) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-medium text-gray-800 flex items-center mb-3">
      <FaUserTie className="mr-2 text-blue-500" /> Responsable
    </h4>
    <p className="text-sm text-gray-600">
      {owner.prenom} {owner.nom} ({owner.genre})
    </p>

    <div className="flex items-center mt-2">
      <FaPhone className="text-gray-400 mr-2" size={12} />
      <a
        href={`tel:${owner.telephone}`}
        className="text-blue-600 hover:underline text-sm"
      >
        {owner.telephone}
      </a>
    </div>

    {owner.matricule && (
      <p className="text-sm text-gray-600 mt-2 flex items-center">
        <FaIdCard className="mr-2 text-gray-400" size={12} />
        <span className="font-medium">Matricule:</span> {owner.matricule}
      </p>
    )}
  </div>
));

OwnerInfo.displayName = 'OwnerInfo';

export default OwnerInfo;