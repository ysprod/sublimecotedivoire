'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { memo, useState } from 'react';

interface SearchBarProps {
  searchQuery: string;
  loading: boolean;
  onSearch: (value: string) => void;
  onClear: () => void;
  onSubmit?: () => void; // Nouvelle prop pour la recherche explicite
}

const SearchBar = memo<SearchBarProps>(({ 
  searchQuery, 
  loading, 
  onSearch, 
  onClear,
  onSubmit 
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Mettre à jour la recherche locale quand la prop change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    // Ne plus appeler onSearch ici - pas de recherche automatique
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    } else {
      // Fallback: déclencher la recherche avec la valeur locale
      onSearch(localQuery);
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    onClear();
    // Optionnel: lancer une recherche vide après clear
    if (onSubmit) {
      onSubmit();
    } else {
      onSearch('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="flex-1 relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Rechercher par nom, téléphone..."
          disabled={loading}
          className="w-full bg-white border border-gray-300 text-sm text-gray-900 pl-8 pr-8 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
          aria-label="Rechercher des utilisateurs"
        />
        
        <AnimatePresence>
          {localQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Bouton de recherche explicite */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`
          inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
          bg-gradient-to-r from-blue-600 to-indigo-600 text-white
          font-semibold text-sm shadow-sm
          hover:shadow-md hover:from-blue-700 hover:to-indigo-700
          transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300
          dark:focus-visible:ring-blue-700/40
          disabled:opacity-50 disabled:cursor-not-allowed
          min-w-[100px]
        `}
      >
        <Search className="h-4 w-4" />
        {loading ? 'Recherche...' : 'Rechercher'}
      </button>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;