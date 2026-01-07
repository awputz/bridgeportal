import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Building2, DollarSign, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/ui/QueryErrorState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAgentTransactions } from "@/hooks/useAgentTransactions";
import { AgentTransactionFormDialog } from "@/components/portal/AgentTransactionFormDialog";
import { formatResidentialRent, formatFullCurrency, formatCommercialPricing } from "@/lib/formatters";

// Format deal value based on division
const formatDealValueByDivision = (tx: any): string => {
  const division = tx.division || 'Other';
  
  if (division === 'Residential') {
    if (tx.deal_type === 'Lease' && tx.monthly_rent) {
      return formatResidentialRent(tx.monthly_rent);
    }
    return formatFullCurrency(tx.sale_price || tx.monthly_rent);
  }
  
  if (division === 'Commercial') {
    if (tx.deal_type === 'Lease') {
      // For commercial leases, show price per SF if available
      if (tx.price_per_sf && tx.gross_square_feet) {
        const pricing = formatCommercialPricing(tx.price_per_sf, tx.gross_square_feet);
        return `${pricing.pricePerSF} | ${pricing.totalSF}`;
      }
      if (tx.monthly_rent) {
        return `${formatFullCurrency(tx.monthly_rent)}/month`;
      }
    }
    return formatFullCurrency(tx.sale_price || tx.total_lease_value);
  }
  
  if (division === 'Investment Sales' || division === 'Capital Advisory') {
    return formatFullCurrency(tx.sale_price);
  }
  
  // Default
  return formatFullCurrency(tx.sale_price || tx.total_lease_value || tx.monthly_rent);
};

const MyTransactions = () => {
  const { data: transactions, isLoading, error, refetch } = useAgentTransactions();
  const [searchTerm, setSearchTerm] = useState("");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  // Get unique years from transactions
  const years = transactions
    ? [...new Set(transactions.map(tx => tx.year).filter(Boolean))].sort((a, b) => (b || 0) - (a || 0))
    : [];

  // Filter transactions
  const filteredTransactions = transactions?.filter(tx => {
    const matchesSearch = tx.property_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.borough?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDivision = divisionFilter === "all" || tx.division === divisionFilter;
    const matchesYear = yearFilter === "all" || tx.year?.toString() === yearFilter;
    
    return matchesSearch && matchesDivision && matchesYear;
  }) || [];

  const handleEdit = (tx: any) => {
    setEditingTransaction(tx);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/portal/profile">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extralight text-foreground">
              My Transactions
            </h1>
            <p className="text-muted-foreground font-light">
              View and manage all your closed deals
            </p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        {/* Filters */}
        <Card className="glass-card border-white/10 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by address, neighborhood..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={divisionFilter} onValueChange={setDivisionFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Divisions</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Investment Sales">Investment Sales</SelectItem>
                  <SelectItem value="Capital Advisory">Capital Advisory</SelectItem>
                </SelectContent>
              </Select>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year?.toString() || ""}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="font-light flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              All Transactions ({filteredTransactions.length})
            </CardTitle>
            <CardDescription>
              Click edit to update commission or transaction details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <QueryErrorState
                error={error}
                onRetry={() => refetch()}
                title="Failed to load transactions"
              />
            ) : isLoading ? (
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="text-muted-foreground">Address</TableHead>
                      <TableHead className="text-muted-foreground">Division</TableHead>
                      <TableHead className="text-muted-foreground">Type</TableHead>
                      <TableHead className="text-muted-foreground">Deal Value</TableHead>
                      <TableHead className="text-muted-foreground">Date</TableHead>
                      <TableHead className="text-muted-foreground text-right">Commission</TableHead>
                      <TableHead className="text-muted-foreground w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => {
                      const hasCommission = tx.commission !== null && tx.commission !== undefined && tx.commission > 0;
                      
                      return (
                        <TableRow key={tx.id} className="border-border/30">
                          <TableCell className="font-medium text-foreground">
                            <div>
                              <p className="truncate max-w-[200px]">{tx.property_address}</p>
                              <p className="text-xs text-muted-foreground">
                                {[tx.neighborhood, tx.borough].filter(Boolean).join(", ") || "—"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-muted-foreground">
                              {tx.division || 'Other'}
                            </span>
                          </TableCell>
                          <TableCell className="text-foreground/80">
                            {tx.deal_type}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {formatDealValueByDivision(tx)}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {tx.closing_date 
                              ? new Date(tx.closing_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                              : tx.year || "—"
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            {hasCommission ? (
                              <span className="font-medium text-emerald-400">
                                {formatFullCurrency(tx.commission)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/50">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(tx)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No transactions found</p>
                <p className="text-sm text-muted-foreground/70 mb-4">
                  {searchTerm || divisionFilter !== "all" || yearFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Add your first transaction to get started"
                  }
                </p>
                <Button onClick={handleAdd} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Transaction
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        {filteredTransactions.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card className="glass-card border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Deals</p>
                    <p className="text-xl font-light text-foreground">
                      {filteredTransactions.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Commission</p>
                    <p className="text-xl font-light text-foreground">
                      {formatFullCurrency(
                        filteredTransactions.reduce((sum, tx) => sum + (tx.commission || 0), 0)
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">With Commission</p>
                  <p className="text-xl font-light text-foreground">
                    {filteredTransactions.filter(tx => tx.commission && tx.commission > 0).length}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Missing Commission</p>
                  <p className="text-xl font-light text-amber-400">
                    {filteredTransactions.filter(tx => !tx.commission || tx.commission === 0).length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <AgentTransactionFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        transaction={editingTransaction}
      />
    </div>
  );
};

export default MyTransactions;
