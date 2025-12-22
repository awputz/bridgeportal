import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { SEOHelmet } from "@/components/SEOHelmet";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import { 
  Building2, DollarSign, Calendar, MapPin, ArrowRight, ExternalLink,
  Home, Briefcase, TrendingUp, Landmark, FileText, Ruler, User
} from "lucide-react";

const divisions = [
  { id: "all", label: "All Divisions", icon: Building2 },
  { id: "Residential", label: "Residential", icon: Home },
  { id: "Commercial", label: "Commercial", icon: Briefcase },
  { id: "Investment Sales", label: "Investment Sales", icon: TrendingUp },
  { id: "Capital Advisory", label: "Capital Advisory", icon: Landmark },
];

const formatCurrency = (value: number | null) => {
  if (!value) return null;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
};

const formatExactCurrency = (value: number | null) => {
  if (!value) return null;
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", { 
    month: "short", 
    year: "numeric" 
  });
};

const getPlaceholderImage = (assetType: string | null) => {
  const type = assetType?.toLowerCase() || "";
  if (type.includes("retail")) return PLACEHOLDER_IMAGES.retail.storefront;
  if (type.includes("office")) return PLACEHOLDER_IMAGES.building.exterior;
  if (type.includes("multifamily") || type.includes("residential")) return PLACEHOLDER_IMAGES.building.residential;
  return PLACEHOLDER_IMAGES.building.glass;
};

export default function Transactions() {
  const { openContactSheet } = useContactSheet();
  const heroReveal = useScrollReveal(0.1);
  const gridReveal = useScrollReveal(0.1);
  const ctaReveal = useScrollReveal(0.1);

  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const { data: transactions = [], isLoading } = useTransactions();

  const filteredTransactions = transactions.filter((t) => {
    if (selectedDivision === "all") return true;
    return t.division === selectedDivision;
  });

  // Stats
  const totalVolume = filteredTransactions.reduce((sum, t) => sum + (t.sale_price || t.total_lease_value || 0), 0);
  const totalDeals = filteredTransactions.length;

  return (
    <div className="min-h-screen">
      <SEOHelmet 
        title="Transactions | Bridge Advisory Group"
        description="View our track record of successful real estate transactions across residential, commercial, investment sales, and capital advisory divisions in NYC."
        path="/transactions"
      />

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 md:pt-28 lg:pt-36 pb-8 sm:pb-12 md:pb-16" ref={heroReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className={`transition-all duration-700 ${
            heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Traded Link */}
            <a 
              href="https://traded.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-accent hover:text-accent/80 transition-colors mb-4 sm:mb-6 group"
            >
              View transactions on Traded 
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
              <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </a>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-3 sm:mb-4">
              Transactions
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground font-light max-w-3xl mb-6 sm:mb-8">
              A record of completed deals demonstrating our expertise across New York's residential, commercial, and investment markets.
            </p>

            {/* Summary Stats */}
            <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
              <div>
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-accent">
                  {formatCurrency(totalVolume) || "$0"}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-light">Total Volume</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-accent">
                  {totalDeals}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-light">Deals Closed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-y border-white/5 bg-white/[0.01] sticky top-16 z-30 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="flex flex-wrap gap-2">
            {divisions.map((division) => {
              const Icon = division.icon;
              const isActive = selectedDivision === division.id;
              return (
                <button
                  key={division.id}
                  onClick={() => setSelectedDivision(division.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-light transition-all ${
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {division.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transactions Grid */}
      <section className="py-12 md:py-20" ref={gridReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          {isLoading ? (
            <div className="text-center py-16 sm:py-20">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-foreground mx-auto mb-4"></div>
              <p className="text-xs sm:text-sm text-muted-foreground font-light">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 transition-all duration-700 ${
              gridReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              {filteredTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  onClick={() => setSelectedTransaction(transaction)}
                  className="rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-accent/30 transition-all cursor-pointer group overflow-hidden"
                  style={{ transitionDelay: `${index * 30}ms` }}
                >
                  {/* Property Image */}
                  <div className="aspect-[16/9] overflow-hidden">
                    <img 
                      src={transaction.image_url || getPlaceholderImage(transaction.asset_type)} 
                      alt={transaction.property_address}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-3 sm:p-4 md:p-5">
                    {/* Address & Neighborhood */}
                    <h3 className="text-base font-light mb-1 group-hover:text-accent transition-colors line-clamp-1">
                      {transaction.property_address}
                    </h3>
                    {transaction.neighborhood && (
                      <p className="text-sm text-muted-foreground font-light mb-3 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {transaction.neighborhood}{transaction.borough && `, ${transaction.borough}`}
                      </p>
                    )}

                    {/* Division & Deal Type */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-block text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                        {transaction.division || transaction.deal_type}
                      </span>
                      {transaction.deal_type && transaction.division !== transaction.deal_type && (
                        <span className="inline-block text-xs bg-white/10 text-muted-foreground px-2 py-1 rounded">
                          {transaction.deal_type}
                        </span>
                      )}
                      {transaction.asset_type && (
                        <span className="inline-block text-xs bg-white/5 text-muted-foreground px-2 py-1 rounded">
                          {transaction.asset_type}
                        </span>
                      )}
                    </div>

                    {/* Key Metrics */}
                    <div className="space-y-1 text-sm">
                      {/* Show Monthly Rent for Residential and Commercial leases */}
                      {(transaction.division === 'Residential' || transaction.division === 'Commercial') && transaction.monthly_rent ? (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground font-light">Monthly Rent</span>
                          <span className="font-light">
                            {formatExactCurrency(transaction.monthly_rent)}/mo
                          </span>
                        </div>
                      ) : (transaction.sale_price || transaction.total_lease_value) && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground font-light">
                            {transaction.division === 'Capital Advisory' ? 'Loan Amount' : 'Sale Price'}
                          </span>
                          <span className="font-light">
                            {transaction.division === 'Investment Sales' 
                              ? formatExactCurrency(transaction.sale_price || transaction.total_lease_value)
                              : formatCurrency(transaction.sale_price || transaction.total_lease_value)}
                          </span>
                        </div>
                      )}
                      {transaction.gross_square_feet && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground font-light">Size</span>
                          <span className="font-light">{transaction.gross_square_feet.toLocaleString()} SF</span>
                        </div>
                      )}
                      {transaction.closing_date && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground font-light">Date</span>
                          <span className="font-light">{formatDate(transaction.closing_date)}</span>
                        </div>
                      )}
                    </div>

                    {/* View Details */}
                    <div className="mt-4 pt-3 border-t border-white/5">
                      <span className="text-xs text-accent font-light group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Building2 size={56} className="mx-auto mb-6 text-muted-foreground opacity-30" />
              <h3 className="text-lg font-light mb-2">No transactions in this division</h3>
              <p className="text-sm text-muted-foreground font-light">Try selecting a different filter</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 lg:py-28 bg-muted/30" ref={ctaReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <div className={`transition-all duration-700 ${
            ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">
              Ready to Work Together?
            </h2>
            <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
              Whether you're looking to buy, sell, lease, or finance, our team is ready to help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="font-light">
                <Link to="/contact">
                  <FileText className="mr-2 h-4 w-4" />
                  Submit a Deal
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="font-light"
                onClick={openContactSheet}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Modal */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-light">
              {selectedTransaction?.property_address}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4 pt-4">
              {/* Property Image in Modal */}
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src={selectedTransaction.image_url || getPlaceholderImage(selectedTransaction.asset_type)} 
                  alt={selectedTransaction.property_address}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Location */}
              {selectedTransaction.neighborhood && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground font-light">Neighborhood</p>
                    <p className="font-light">
                      {selectedTransaction.neighborhood}
                      {selectedTransaction.borough && `, ${selectedTransaction.borough}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Division & Type */}
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground font-light">Division</p>
                  <p className="font-light">
                    {selectedTransaction.division || selectedTransaction.deal_type}
                    {selectedTransaction.deal_type && selectedTransaction.division !== selectedTransaction.deal_type && ` • ${selectedTransaction.deal_type}`}
                    {selectedTransaction.asset_type && ` • ${selectedTransaction.asset_type}`}
                  </p>
                </div>
              </div>

              {/* Value - Show Monthly Rent for Residential and Commercial */}
              {(selectedTransaction.division === 'Residential' || selectedTransaction.division === 'Commercial') && selectedTransaction.monthly_rent ? (
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground font-light">Monthly Rent</p>
                    <p className="text-lg font-light">
                      {formatExactCurrency(selectedTransaction.monthly_rent)}/mo
                    </p>
                  </div>
                </div>
              ) : (selectedTransaction.sale_price || selectedTransaction.total_lease_value) && (
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground font-light">
                      {selectedTransaction.division === "Capital Advisory" 
                        ? "Loan Amount" 
                        : "Sale Price"}
                    </p>
                    <p className="text-lg font-light">
                      {selectedTransaction.division === 'Investment Sales'
                        ? formatExactCurrency(selectedTransaction.sale_price || selectedTransaction.total_lease_value)
                        : formatCurrency(selectedTransaction.sale_price || selectedTransaction.total_lease_value)}
                    </p>
                  </div>
                </div>
              )}

              {/* Size */}
              {selectedTransaction.gross_square_feet && (
                <div className="flex items-start gap-3">
                  <Ruler className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground font-light">Size</p>
                    <p className="font-light">{selectedTransaction.gross_square_feet.toLocaleString()} SF</p>
                  </div>
                </div>
              )}

              {/* Date */}
              {selectedTransaction.closing_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground font-light">Closing Date</p>
                    <p className="font-light">{formatDate(selectedTransaction.closing_date)}</p>
                  </div>
                </div>
              )}

              {/* Role */}
              {selectedTransaction.role && (
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground font-light">Role</p>
                    <p className="font-light capitalize">{selectedTransaction.role.replace(/_/g, " ")}</p>
                  </div>
                </div>
              )}

              {/* Agent */}
              {selectedTransaction.agent_name && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground font-light">Agent</p>
                    <p className="font-light">{selectedTransaction.agent_name}</p>
                  </div>
                </div>
              )}

              {/* Notes / Highlights */}
              {selectedTransaction.notes && (
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-muted-foreground font-light mb-2">Highlights</p>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed">
                    {selectedTransaction.notes}
                  </p>
                </div>
              )}

              {/* Price Metrics */}
              {(selectedTransaction.price_per_sf || selectedTransaction.price_per_unit) && (
                <div className="pt-4 border-t border-white/10 flex gap-6">
                  {selectedTransaction.price_per_sf && (
                    <div>
                      <p className="text-sm text-muted-foreground font-light">Price/SF</p>
                      <p className="font-light">${selectedTransaction.price_per_sf.toLocaleString()}</p>
                    </div>
                  )}
                  {selectedTransaction.price_per_unit && (
                    <div>
                      <p className="text-sm text-muted-foreground font-light">Price/Unit</p>
                      <p className="font-light">${selectedTransaction.price_per_unit.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}