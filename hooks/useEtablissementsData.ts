import { useState, useEffect, useCallback } from "react";
import { Etablissement } from "@/lib/libs/interface";
import { fetchData } from "@/lib/libs/functions";
import { ERROR_MESSAGE } from "@/lib/libs/constants";

interface UseEtablissementsDataResult {
  etablissements: Etablissement[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useEtablissementsData(nbetablissements: number): UseEtablissementsDataResult {
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataetablissemnts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchData<Etablissement[]>(`/api/etablissements?nbetablissements=${nbetablissements}`);

      setEtablissements(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : ERROR_MESSAGE);
      setEtablissements([]);
    } finally {
      setIsLoading(false);
    }
  }, [nbetablissements]);

  useEffect(() => { fetchDataetablissemnts(); }, [fetchDataetablissemnts]);

  return { etablissements, isLoading, error, refresh: fetchDataetablissemnts, };

}