import { useState, useMemo } from 'react';

export const usePagination = (items, itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the sliced data automatically
    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return items.slice(indexOfFirstItem, indexOfLastItem);
    }, [items, currentPage, itemsPerPage]);

    // Reset to page 1 if the items list changes (e.g., after a search or delete)
    useMemo(() => {
        setCurrentPage(1);
    }, [items.length]);

    // Props to pass directly to the <Pagination /> component
    const paginationProps = {
        currentPage,
        totalItems: items.length,
        itemsPerPage,
        onPageChange: setCurrentPage
    };

    return { currentItems, paginationProps };
};
