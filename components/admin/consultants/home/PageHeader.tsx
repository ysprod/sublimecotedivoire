'use client';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { memo } from 'react';

interface PageHeaderProps {
  isRefreshing: boolean;
  loading: boolean;
  onRefresh: () => void;
}

const PageHeader = memo<PageHeaderProps>(({ isRefreshing, loading, onRefresh }) => {
 
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center justify-center gap-2 text-xl font-semibold text-green-600">
              LISTE DES CONSULTANTS
            
            <motion.button
              onClick={onRefresh}
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
  );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;