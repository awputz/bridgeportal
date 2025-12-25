import { useState, useMemo } from "react";

export function usePagination<T>(data: T[] | undefined, initialPageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedData = useMemo(() => {
    if (!data) return [];
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Reset to page 1 when data changes significantly
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return {
    paginatedData,
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    handlePageChange,
    handlePageSizeChange,
  };
}
