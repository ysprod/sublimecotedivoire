'use client';
import { memo } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface ToggleDetailsButtonProps {
  showDetails: boolean;
  onClick: () => void;
}

const ToggleDetailsButton: React.FC<ToggleDetailsButtonProps> = memo(({ showDetails, onClick, }) => (
  <div className="mt-6 text-center">
    <button
      onClick={onClick}
      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
    >

      {showDetails ? (
        <>
          <span>Voir moins...</span>
          <FaChevronUp className="ml-2" size={12} />
        </>
      ) : (
        <>
          <span>Voir plus...</span>
          <FaChevronDown className="ml-2" size={12} />
        </>
      )}
    </button>
  </div>
));

ToggleDetailsButton.displayName = "ToggleDetailsButton";

export default ToggleDetailsButton;