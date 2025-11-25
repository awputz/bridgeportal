import { useState } from "react";
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
    <div className="min-h-screen pt-28 md:pt-36 lg:pt-44 px-4 md:px-6 lg:px-8 pb-20 md:pb-28 lg:pb-36">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-20 md:mb-24 lg:mb-28 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 md:mb-10 lg:mb-12 tracking-tight">Proven Track Record</h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-loose font-light">
            Representative transactions demonstrating our ability to maximize value for middle-market NYC property owners
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12 mb-16 md:mb-20 lg:mb-24">
          <div className="p-6 md:p-8 border-b-2 border-white/10">
            <DollarSign className="mb-4 text-accent" size={36} />
            <div className="text-4xl md:text-5xl font-light mb-2">${(totalVolume / 1000000).toFixed(1)}M</div>
            <p className="text-xs md:text-sm text-muted-foreground font-light uppercase tracking-wider">Total Volume</p>
          </div>
          <div className="p-6 md:p-8 border-b-2 border-white/10">
            <Building2 className="mb-4 text-accent" size={36} />
            <div className="text-4xl md:text-5xl font-light mb-2">{buildingsSold}</div>
            <p className="text-xs md:text-sm text-muted-foreground font-light uppercase tracking-wider">Buildings Sold</p>
          </div>
          <div className="p-6 md:p-8 border-b-2 border-white/10">
            <Building2 className="mb-4 text-accent" size={36} />
            <div className="text-4xl md:text-5xl font-light mb-2">{totalUnits.toLocaleString()}</div>
            <p className="text-xs md:text-sm text-muted-foreground font-light uppercase tracking-wider">Units Sold</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 md:mb-14">
          <Select value={assetType} onValueChange={setAssetType}>
            <SelectTrigger className="w-full sm:w-56 font-light">
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
            <SelectTrigger className="w-full sm:w-56 font-light">
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
            <p className="text-sm text-muted-foreground font-light">Loading transactions</p>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="space-y-2">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 md:p-6 rounded-lg transition-all duration-400 hover:bg-white/3 border-l-2 border-transparent hover:border-accent/30 hover:transform hover:-translate-y-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div>
                    <h3 className="text-base md:text-lg font-light mb-1">{transaction.property_address}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground font-light">{transaction.borough}, {transaction.neighborhood}</p>
                  </div>
                  
                  <div className="space-y-1 text-xs md:text-sm font-light">
                    {transaction.asset_type && (
                      <p><span className="text-muted-foreground">Type:</span> <span>{transaction.asset_type}</span></p>
                    )}
                    {transaction.units && (
                      <p><span className="text-muted-foreground">Units:</span> <span>{transaction.units}</span></p>
                    )}
                    {transaction.gross_square_feet && (
                      <p><span className="text-muted-foreground">SF:</span> <span>{transaction.gross_square_feet.toLocaleString()}</span></p>
                    )}
                  </div>
                  
                  <div className="md:text-right space-y-1">
                    {transaction.sale_price && (
                      <p className="text-xl md:text-2xl font-light">${transaction.sale_price.toLocaleString()}</p>
                    )}
                    {transaction.price_per_unit && (
                      <p className="text-xs text-muted-foreground font-light">
                        ${transaction.price_per_unit.toLocaleString()}/unit
                      </p>
                    )}
                    {transaction.closing_date && (
                      <div className="flex items-center gap-2 justify-start md:justify-end text-xs text-muted-foreground font-light">
                        <Calendar size={12} />
                        <span>{new Date(transaction.closing_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Building2 size={56} className="mx-auto mb-6 text-muted-foreground opacity-30" />
            <h3 className="text-lg md:text-xl font-light mb-2">No transactions match your criteria</h3>
            <p className="text-sm text-muted-foreground font-light">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackRecord;
