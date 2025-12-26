import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInvestorTransactions } from "@/hooks/useInvestorData";
import { Search, Download, Receipt, ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

const DIVISIONS = ["all", "Investment Sales", "Commercial Leasing", "Residential", "Capital Advisory"];
const YEARS = ["all", "2025", "2024", "2023", "2022", "2021"];

const Transactions = () => {
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [sortField, setSortField] = useState<"closing_date" | "sale_price">("closing_date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { data: transactions, isLoading } = useInvestorTransactions({
    division: divisionFilter,
    year: yearFilter !== "all" ? parseInt(yearFilter) : undefined,
    search: search.length > 2 ? search : undefined,
  });

  const formatCurrency = (value: number | null) => {
    if (!value) return "—";
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sortedTransactions = transactions?.slice().sort((a, b) => {
    const multiplier = sortDir === "asc" ? 1 : -1;
    if (sortField === "closing_date") {
      const dateA = a.closing_date ? new Date(a.closing_date).getTime() : 0;
      const dateB = b.closing_date ? new Date(b.closing_date).getTime() : 0;
      return (dateA - dateB) * multiplier;
    }
    return ((a.sale_price || 0) - (b.sale_price || 0)) * multiplier;
  });

  const exportToCSV = () => {
    if (!transactions) return;
    
    const headers = ["Property Address", "Borough", "Division", "Deal Type", "Agent", "Sale Price", "Commission", "Closing Date"];
    const rows = transactions.map(t => [
      t.property_address,
      t.borough || "",
      t.division || "",
      t.deal_type || "",
      t.agent_name || "",
      t.sale_price?.toString() || "",
      t.commission?.toString() || "",
      t.closing_date || "",
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const totalVolume = transactions?.reduce((sum, t) => sum + (t.sale_price || 0), 0) || 0;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-light text-foreground">Transaction History</h1>
          <p className="text-muted-foreground mt-1">
            {transactions?.length || 0} transactions • {formatCurrency(totalVolume)} total volume
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={divisionFilter} onValueChange={setDivisionFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Division" />
              </SelectTrigger>
              <SelectContent>
                {DIVISIONS.map((div) => (
                  <SelectItem key={div} value={div}>
                    {div === "all" ? "All Divisions" : div}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year === "all" ? "All Years" : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-sky-400" />
            <CardTitle className="text-lg font-medium">Transactions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Property</TableHead>
                  <TableHead className="hidden md:table-cell">Division</TableHead>
                  <TableHead className="hidden lg:table-cell">Agent</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("sale_price")}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      Price
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <button
                      onClick={() => handleSort("closing_date")}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions?.map((tx) => (
                  <>
                    <TableRow
                      key={tx.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setExpandedRow(expandedRow === tx.id ? null : tx.id)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{tx.property_address}</p>
                          <p className="text-xs text-muted-foreground">{tx.borough || "—"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {tx.division ? (
                          <Badge variant="secondary" className="text-xs">
                            {tx.division}
                          </Badge>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {tx.agent_name || "—"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(tx.sale_price)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {tx.closing_date ? format(new Date(tx.closing_date), "MMM d, yyyy") : "—"}
                      </TableCell>
                      <TableCell>
                        {expandedRow === tx.id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                    </TableRow>
                    {expandedRow === tx.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={6} className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Deal Type</p>
                              <p className="font-medium">{tx.deal_type || "—"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Borough</p>
                              <p className="font-medium">{tx.borough || "—"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Commission</p>
                              <p className="font-medium">{formatCurrency(tx.commission)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Agent</p>
                              <p className="font-medium">{tx.agent_name || "—"}</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
                {sortedTransactions?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
