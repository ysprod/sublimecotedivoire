'use client';
import { memo } from 'react';
import { FaIdCard } from 'react-icons/fa';

interface LegalInfoProps {
  licence: string;
}

const LegalInfo = memo(({ licence }: LegalInfoProps) => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h4 className="font-medium text-blue-800 flex items-center mb-2">
      <FaIdCard className="mr-2" /> Information légale
    </h4>
    <p className="text-sm text-blue-700">
      <span className="font-medium">Licence:</span> {licence}
    </p>
  </div>
));

LegalInfo.displayName = 'LegalInfo';

export default LegalInfo;