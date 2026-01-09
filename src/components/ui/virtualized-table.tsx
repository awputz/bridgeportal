import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface VirtualizedTableColumn<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface VirtualizedTableProps<T> {
  data: T[];
  columns: VirtualizedTableColumn<T>[];
  getRowKey: (row: T) => string;
  estimateSize?: number;
  overscan?: number;
  maxHeight?: number;
  onRowClick?: (row: T) => void;
  rowClassName?: string | ((row: T) => string);
}

export function VirtualizedTable<T>({
  data,
  columns,
  getRowKey,
  estimateSize = 52,
  overscan = 5,
  maxHeight = 600,
  onRowClick,
  rowClassName,
}: VirtualizedTableProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ maxHeight }}
      >
        <Table>
          <TableHeader className="sticky top-0 bg-muted/95 backdrop-blur-sm z-10">
            <TableRow className="bg-muted/30">
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={column.headerClassName}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} colSpan={columns.length} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = data[virtualRow.index];
              const rowKey = getRowKey(row);
              const className =
                typeof rowClassName === "function"
                  ? rowClassName(row)
                  : rowClassName;

              return (
                <TableRow
                  key={rowKey}
                  data-index={virtualRow.index}
                  className={cn(
                    onRowClick && "cursor-pointer hover:bg-muted/50",
                    className
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  style={{
                    height: `${virtualRow.size}px`,
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} className={column.className}>
                      {column.cell(row, virtualRow.index)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} colSpan={columns.length} />
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
