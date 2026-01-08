import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2 } from "lucide-react";

interface SourceTableProps {
  data: { name: string; count: number; hired: number }[];
}

export function SourceTable({ data }: SourceTableProps) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-lg font-light flex items-center gap-2">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          Top Source Brokerages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            No brokerage data yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-muted-foreground font-light">Brokerage</TableHead>
                <TableHead className="text-muted-foreground font-light text-right">Agents</TableHead>
                <TableHead className="text-muted-foreground font-light text-right">Hired</TableHead>
                <TableHead className="text-muted-foreground font-light text-right">Conv. Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => {
                const conversionRate = row.count > 0 
                  ? ((row.hired / row.count) * 100).toFixed(1) 
                  : '0.0';
                
                return (
                  <TableRow key={index} className="border-white/10">
                    <TableCell className="font-light">{row.name}</TableCell>
                    <TableCell className="text-right">{row.count}</TableCell>
                    <TableCell className="text-right text-emerald-400">{row.hired}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{conversionRate}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
