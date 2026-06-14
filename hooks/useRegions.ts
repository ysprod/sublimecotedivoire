import { DataStatistique } from '@/libs/interface';
import { useState, useEffect } from 'react';

interface UseRegionsResult {
  regions: DataStatistique[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useRegions(): UseRegionsResult {
  const [regions, setRegions] = useState<DataStatistique[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/regions');
      if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
      const { data } = await response.json();
      setRegions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegions(); }, []);

  return { regions, loading, error, refresh: fetchRegions };

}