import { useMemo, useCallback, useState } from 'react';

export const usePagination = <T,>(data: T[], itemsPerPage: number, visiblePages: number) => {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData = useMemo(() => (
        data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
    ), [data, currentPage, itemsPerPage]);

    const visiblePageNumbers = useMemo(() => {
        const half = Math.floor(visiblePages / 2);
        let start = Math.max(0, currentPage - half);
        const end = Math.min(totalPages - 1, start + visiblePages - 1);

        if (end - start + 1 < visiblePages) {
            start = Math.max(0, end - visiblePages + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [currentPage, totalPages, visiblePages]);

    const handlePageChange = useCallback((page: number) => {
        window.scrollTo({ top: 100, behavior: 'smooth' });
        setCurrentPage(page);
    }, []);

    const goToFirstPage = useCallback(() => handlePageChange(0), [handlePageChange]);
    const goToLastPage = useCallback(() => handlePageChange(totalPages - 1), [handlePageChange, totalPages]);
    const goToNextPage = useCallback(() => handlePageChange(currentPage + 1), [currentPage, handlePageChange]);
    const goToPrevPage = useCallback(() => handlePageChange(currentPage - 1), [currentPage, handlePageChange]);

    return {
        currentPage, totalPages, paginatedData, visiblePageNumbers,
        handlePageChange, goToFirstPage, goToLastPage, goToNextPage, goToPrevPage
    };

};