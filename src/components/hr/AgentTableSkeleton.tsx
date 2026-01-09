import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AgentTableSkeletonProps {
  rows?: number;
}

export function AgentTableSkeleton({ rows = 10 }: AgentTableSkeletonProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Brokerage</TableHead>
            <TableHead>Division</TableHead>
            <TableHead>Production</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Contact</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-8 w-8 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
