import { fetchData, getRandomCount } from '@/lib/libs/functions';
import { ConnexionHistory } from "@/lib/libs/interface";
import { useCallback, useEffect, useState } from "react";

export function useUsersData() {
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

  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedHistories, setPaginatedHistories] = useState<ConnexionHistory[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const total = Math.ceil(histories.length / 10);
    setTotalPages(total);
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    setPaginatedHistories(histories.slice(startIndex, endIndex));
  }, [histories, currentPage]);

  const handlePrevious = () => { if (currentPage > 1) { setCurrentPage(currentPage - 1); } };
  const handleNext = () => { if (currentPage < totalPages) { setCurrentPage(currentPage + 1); } };

  const goToPage = (page: number) => { if (page >= 1 && page <= totalPages) { setCurrentPage(page); } };

  return {
    goToPage, handlePrevious, handleNext, error,
    histories, isLoading, paginatedHistories, currentPage, totalPages,
  };
}