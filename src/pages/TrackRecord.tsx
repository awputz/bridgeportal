import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactions } from "@/hooks/useTransactions";
import { Building2, DollarSign, Calendar } from "lucide-react";

const TrackRecord = () => {
  const [assetType, setAssetType] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  
  const { data: transactions = [], isLoading } = useTransactions();

  const filteredTransactions = transactions.filter((t) => {
    if (assetType !== "all" && t.asset_type !== assetType) return false;
    if (year !== "all" && t.year?.toString() !== year) return false;
    return true;
  });

  const totalVolume = filteredTransactions.reduce((sum, t) => sum + (t.sale_price || 0), 0);
  const totalUnits = filteredTransactions.reduce((sum, t) => sum + (t.units || 0), 0);
  const buildingsSold = filteredTransactions.length;

  const years = Array.from(new Set(transactions.map(t => t.year).filter(Boolean))).sort((a, b) => b! - a!);

  return (
    <div className="min-h-screen pt-32 px-6 lg:px-8 pb-20">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Proven Track Record</h1>
          <p className="text-2xl text-muted-foreground leading-relaxed">
            Representative transactions demonstrating our ability to maximize value for middle-market NYC property owners
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 border border-border hover:shadow-lg transition-shadow bg-card/50">
            <DollarSign className="mb-4 text-accent" size={40} />
            <div className="text-5xl font-bold mb-2">${(totalVolume / 1000000).toFixed(1)}M</div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Volume</p>
          </Card>
          <Card className="p-8 border border-border hover:shadow-lg transition-shadow bg-card/50">
            <Building2 className="mb-4 text-accent" size={40} />
            <div className="text-5xl font-bold mb-2">{buildingsSold}</div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Buildings Sold</p>
          </Card>
          <Card className="p-8 border border-border hover:shadow-lg transition-shadow bg-card/50">
            <Building2 className="mb-4 text-accent" size={40} />
            <div className="text-5xl font-bold mb-2">{totalUnits.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Units Sold</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <Select value={assetType} onValueChange={setAssetType}>
            <SelectTrigger className="w-full sm:w-56">
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
            <SelectTrigger className="w-full sm:w-56">
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
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading transactions</p>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-6 border border-border hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{transaction.property_address}</h3>
                    <p className="text-sm text-muted-foreground">{transaction.borough}, {transaction.neighborhood}</p>
                  </div>
                  
                  <div className="space-y-1 text-sm font-variant-numeric-tabular">
                    {transaction.asset_type && (
                      <p><span className="text-muted-foreground">Type:</span> <span className="font-medium">{transaction.asset_type}</span></p>
                    )}
                    {transaction.units && (
                      <p><span className="text-muted-foreground">Units:</span> <span className="font-medium">{transaction.units}</span></p>
                    )}
                    {transaction.gross_square_feet && (
                      <p><span className="text-muted-foreground">SF:</span> <span className="font-medium">{transaction.gross_square_feet.toLocaleString()}</span></p>
                    )}
                  </div>
                  
                  <div className="md:text-right space-y-1">
                    {transaction.sale_price && (
                      <p className="text-2xl font-bold font-variant-numeric-tabular">${transaction.sale_price.toLocaleString()}</p>
                    )}
                    {transaction.price_per_unit && (
                      <p className="text-xs text-muted-foreground font-variant-numeric-tabular">
                        ${transaction.price_per_unit.toLocaleString()}/unit
                      </p>
                    )}
                    {transaction.closing_date && (
                      <div className="flex items-center gap-2 justify-end text-xs text-muted-foreground">
                        <Calendar size={12} />
                        <span>{new Date(transaction.closing_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Building2 size={56} className="mx-auto mb-6 text-muted-foreground opacity-30" />
            <h3 className="text-xl font-semibold mb-2">No transactions match your criteria</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackRecord;