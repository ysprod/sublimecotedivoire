'use client';
import { motion } from 'framer-motion';
import { memo } from 'react';
import SearchBar from './SearchBar';

interface SearchSectionProps {
  searchQuery: string;
  loading: boolean;
  handleSearch: (query: string) => void;
  handleClearSearch: () => void;
}

export const SearchSection = memo(function SearchSection({
  searchQuery,
  loading,
  handleSearch,
  handleClearSearch,
}: SearchSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
      className="max-w-3xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <div className="flex-1">
          <SearchBar
            searchQuery={searchQuery}
            loading={loading}
            onSearch={handleSearch}
            onClear={handleClearSearch}
          />
        </div>
      </div>
    </motion.div>
  );
});