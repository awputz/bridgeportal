import { TableHead } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc" | null;

interface SortableTableHeadProps {
  children: React.ReactNode;
  sortKey: string;
  currentSortKey: string | null;
  currentSortDirection: SortDirection;
  onSort: (key: string) => void;
  className?: string;
}

export function SortableTableHead({
  children,
  sortKey,
  currentSortKey,
  currentSortDirection,
  onSort,
  className,
}: SortableTableHeadProps) {
  const isActive = currentSortKey === sortKey;

  return (
    <TableHead className={cn("cursor-pointer select-none hover:bg-muted/50", className)}>
      <button
        className="flex items-center gap-1 w-full text-left font-medium"
        onClick={() => onSort(sortKey)}
      >
        {children}
        {isActive && currentSortDirection === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : isActive && currentSortDirection === "desc" ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        )}
      </button>
    </TableHead>
  );
}

export function useSorting<T>(
  data: T[] | undefined,
  defaultSortKey: string | null = null,
  defaultSortDirection: SortDirection = null
) {
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortKey(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!data || !sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortKey);
      const bValue = getNestedValue(b, sortKey);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  return { sortedData, sortKey, sortDirection, handleSort };
}

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

import { useState, useMemo } from "react";
