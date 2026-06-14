import { memo } from 'react';
import { FaHotel, FaBuilding, FaHome } from 'react-icons/fa';
import { MdMeetingRoom } from 'react-icons/md';

const TypeIcon = memo(({ type }: { type: string }) => {
  const baseClass = "text-3xl p-2 rounded-lg";

  switch (type) {
    case 'Hôtel': return <FaHotel className={`${baseClass} text-blue-100 bg-blue-500`} />;
    case 'Résidence': return <FaBuilding className={`${baseClass} text-green-100 bg-green-500`} />;
    case 'Maison d\'hôtes': return <FaHome className={`${baseClass} text-purple-100 bg-purple-500`} />;
    default: return <MdMeetingRoom className={`${baseClass} text-gray-100 bg-gray-500`} />;
  }
});

TypeIcon.displayName = "TypeIcon";

export default TypeIcon;