'use client';
import Loader from '@/app/admin/loading';
import { LoadingOverlay } from '@/components/admin/users/home/LoadingOverlay';
import { useUsersPageController } from '@/hooks/admin/consultants/useUsersPageController';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { memo } from 'react';
import RefreshBanner from './RefreshBanner';
import { SearchSection } from './SearchSection';
import { UsersGrid } from './UsersGrid';
import { UsersPageError } from './UsersPageStates';

export const UsersPageContent = memo(function UsersPageContent() {
  const {
    handlePageChange, handleSearch, handleClearSearch, handleResetFilters, handleRefresh,
    searchQuery, isRefreshing, loading, error, users, containerVariants,
    cardVariants, currentPage, totalPages, hasUsers, hasFilters,
  } = useUsersPageController();

  if (error) {
    return <UsersPageError error={error} handleRefresh={handleRefresh} isRefreshing={isRefreshing} />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full relative overflow-hidden  dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#070B1A]">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center gap-2 text-xl font-semibold text-green-600">
              LISTE DES CONSULTANTS  

              <motion.button
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                p-2 rounded-lg transition-all
                ${isRefreshing || loading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm'
                  }
              `}
                aria-label="Rafraîchir la liste"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing || loading ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-4">
        <div className="flex justify-center">
          <RefreshBanner loading={loading} isRefreshing={isRefreshing} hasUsers={hasUsers} />
        </div>

        <SearchSection
          searchQuery={searchQuery}
          loading={loading}
          handleSearch={handleSearch}
          handleClearSearch={handleClearSearch}
        />

        <div className="relative">
          <LoadingOverlay loading={loading} users={users} />

          <UsersGrid
            hasUsers={hasUsers}
            users={users}
            containerVariants={containerVariants}
            cardVariants={cardVariants}
            currentPage={currentPage}
            totalPages={totalPages}
            loading={loading}
            handlePageChange={handlePageChange}
            hasFilters={hasFilters}
            handleResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
});