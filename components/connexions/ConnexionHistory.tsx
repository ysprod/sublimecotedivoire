'use client';
import { useUsersData } from '@/hooks/datakwaba/connexions/useUsersData';
import { memo } from 'react';
import { FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi';
import HistoriqueLoader from './HistoriqueLoader';
import HistoryCard from './HistoryCard';
import Bandeau from '../commons/Bandeau';

const ConnectionHistoryDashboard = memo(() => {
  const {
    goToPage, handlePrevious, handleNext,
    histories, isLoading, paginatedHistories, currentPage, totalPages,
  } = useUsersData();

  if (isLoading) { return (<HistoriqueLoader texte="Chargement des historiques de connexions..." />); }

  return (
    <div className="bg-white p-2 w-full space-y-6">
      <header className="flex flex-col justify-between items-center">
        <Bandeau />
        <h2 className="text-2xl font-bold text-gray-800">Historique des Connexions</h2>
        {histories.length > 0 && (
          <div className="text-sm text-gray-500 mt-2"> {histories.length} connexions au total </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 flex flex-col items-center justify-center">
        {paginatedHistories.map((history) => (<HistoryCard key={`${history.userId}`} history={history} />))}
      </div>
      
      {histories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FiClock className="mx-auto text-3xl text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">Aucun historique disponible</h3>
          <p className="text-gray-500 mt-1">Les historiques des connexions apparaîtront ici</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between mt-6 space-y-4">
          <div className="text-sm text-gray-500">
            Page {currentPage} sur {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FiChevronLeft size={20} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum} onClick={() => goToPage(pageNum)}
                  className={`w-10 h-10 rounded-md ${currentPage === pageNum ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={handleNext} disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FiChevronRight size={20} />
            </button>
          </div>
          <div className="text-sm text-gray-500"> {10} éléments par page </div>
        </div>
      )}
    </div>
  );
});

export default ConnectionHistoryDashboard;