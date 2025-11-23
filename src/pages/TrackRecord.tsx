import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactions } from "@/hooks/useTransactions";
import { Building2, DollarSign, Calendar } from "lucide-react";

const TrackRecord = () => {
  const [assetType, setAssetType] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  
  const { data: transactions = [], isLoading } = useTransactions();

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (assetType !== "all" && t.asset_type !== assetType) return false;
    if (year !== "all" && t.year?.toString() !== year) return false;
    return true;
  });

  // Calculate totals
  const totalVolume = filteredTransactions.reduce((sum, t) => sum + (t.sale_price || 0), 0);
  const totalUnits = filteredTransactions.reduce((sum, t) => sum + (t.units || 0), 0);
  const buildingsSold = filteredTransactions.length;

  // Get unique years for filter
  const years = Array.from(new Set(transactions.map(t => t.year).filter(Boolean))).sort((a, b) => b! - a!);

  return (
    <div className="min-h-screen pt-32 px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Track Record</h1>
          <p className="text-xl text-muted-foreground">
            Recent and representative sales across the BRIDGE platform
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-8 border border-border">
            <DollarSign className="mb-4 text-accent" size={32} />
            <div className="text-4xl font-bold mb-2">${(totalVolume / 1000000).toFixed(1)}M</div>
            <p className="text-muted-foreground">Total Volume</p>
          </Card>
          <Card className="p-8 border border-border">
            <Building2 className="mb-4 text-accent" size={32} />
            <div className="text-4xl font-bold mb-2">{buildingsSold}</div>
            <p className="text-muted-foreground">Buildings Sold</p>
          </Card>
          <Card className="p-8 border border-border">
            <Building2 className="mb-4 text-accent" size={32} />
            <div className="text-4xl font-bold mb-2">{totalUnits.toLocaleString()}</div>
            <p className="text-muted-foreground">Units Sold</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl">
          <Select value={assetType} onValueChange={setAssetType}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Asset Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="multifamily">Multifamily</SelectItem>
              <SelectItem value="mixed-use">Mixed-Use</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="development">Development</SelectItem>
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={y!.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transactions List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-6 hover-lift border border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{transaction.property_address}</h3>
                    <p className="text-sm text-muted-foreground">{transaction.borough}</p>
                    {transaction.neighborhood && (
                      <p className="text-sm text-muted-foreground">{transaction.neighborhood}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {transaction.asset_type && (
                      <p className="text-sm"><span className="font-medium">Type:</span> {transaction.asset_type}</p>
                    )}
                    {transaction.units && (
                      <p className="text-sm"><span className="font-medium">Units:</span> {transaction.units}</p>
                    )}
                    {transaction.gross_square_feet && (
                      <p className="text-sm"><span className="font-medium">SF:</span> {transaction.gross_square_feet.toLocaleString()}</p>
                    )}
                    {transaction.role && (
                      <p className="text-sm"><span className="font-medium">Role:</span> {transaction.role.replace('_', ' ')}</p>
                    )}
                  </div>
                  
                  <div className="md:text-right space-y-2">
                    {transaction.sale_price && (
                      <p className="text-2xl font-bold">${transaction.sale_price.toLocaleString()}</p>
                    )}
                    {transaction.price_per_unit && (
                      <p className="text-sm text-muted-foreground">
                        ${transaction.price_per_unit.toLocaleString()}/unit
                      </p>
                    )}
                    {transaction.price_per_sf && (
                      <p className="text-sm text-muted-foreground">
                        ${transaction.price_per_sf.toLocaleString()}/SF
                      </p>
                    )}
                    {transaction.closing_date && (
                      <div className="flex items-center gap-2 justify-end text-sm text-muted-foreground">
                        <Calendar size={14} />
                        <span>{new Date(transaction.closing_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {transaction.notes && (
                  <p className="mt-4 text-sm text-muted-foreground border-t border-border pt-4">
                    {transaction.notes}
                  </p>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Building2 size={64} className="mx-auto mb-6 text-muted-foreground opacity-50" />
            <h3 className="text-2xl font-semibold mb-2">No transactions match your criteria</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackRecord;