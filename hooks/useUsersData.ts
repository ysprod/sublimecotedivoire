import { getRandomCount } from '@/lib/libs/functions';
import { useState, useEffect, useCallback } from "react";
import { ConnexionHistory } from "@/lib/libs/interface";
import { fetchData } from "@/lib/libs/functions";

interface UseUsersDataResult {
  histories: ConnexionHistory[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useUsersData(): UseUsersDataResult {
  const [histories, setHistories] = useState<ConnexionHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDatausers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nbusers = getRandomCount(1000, 6000);
      const response = await fetchData<ConnexionHistory[]>(`/api/users?nbusers=${nbusers}`);

      setHistories(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setHistories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchDatausers(); }, [fetchDatausers]);

  return { histories, isLoading, error, refresh: fetchDatausers, };
}