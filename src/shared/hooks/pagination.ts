import { useState, useMemo } from 'react';

const usePagination = (items: any, itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate total pages safely
    const totalPages = useMemo(() => {
        return Math.ceil(items.length / itemsPerPage) || 1;
    }, [items.length, itemsPerPage]);

    // Get current page slice of items
    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return items.slice(start, end);
    }, [items, currentPage, itemsPerPage]);

    // Navigation functions
    const nextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToPage = (pageNumber: any) => {
        const pageIndex = Math.max(1, Math.min(pageNumber, totalPages));
        setCurrentPage(pageIndex);
    };

    return {
        currentPage,
        totalPages,
        currentItems,
        nextPage,
        prevPage,
        goToPage,
        hasPrev: currentPage > 1,
        hasNext: currentPage < totalPages,
    };
}

export { usePagination }