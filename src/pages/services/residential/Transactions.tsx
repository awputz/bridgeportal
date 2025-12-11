import { ServicePageLayout } from "@/components/ServicePageLayout";
import { useResidentialTransactions } from "@/hooks/useResidentialTransactions";
import { Building2, MapPin, DollarSign, User, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Transactions = () => {
  const { data: transactions, isLoading } = useResidentialTransactions();

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Residential / Transactions</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Closed Leases
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Our track record of successful residential and commercial lease transactions across New York City.
        </p>
      </div>
    </section>
  );

  const formatRent = (rent: number | null) => {
    if (!rent) return "Contact for pricing";
    return `$${rent.toLocaleString()}/mo`;
  };

  const formatLeaseValue = (value: number | null) => {
    if (!value) return null;
    return `$${value.toLocaleString()}`;
  };

  // Calculate stats
  const totalLeaseValue = transactions?.reduce((sum, t) => sum + (t.total_lease_value || 0), 0) || 0;
  const avgMonthlyRent = transactions?.length 
    ? Math.round(transactions.reduce((sum, t) => sum + (t.monthly_rent || 0), 0) / transactions.length)
    : 0;

  return (
    <ServicePageLayout serviceKey="residential" heroContent={heroContent}>
      {/* Stats */}
      <section className="py-12 bg-secondary/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">{transactions?.length || 0}</p>
              <p className="text-muted-foreground text-sm">Closed Leases</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">${(totalLeaseValue / 1000000).toFixed(1)}M+</p>
              <p className="text-muted-foreground text-sm">Total Lease Value</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">${avgMonthlyRent.toLocaleString()}</p>
              <p className="text-muted-foreground text-sm">Avg. Monthly Rent</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">100%</p>
              <p className="text-muted-foreground text-sm">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transactions Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Completed Deals
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Recent leasing transactions completed by our team.
          </p>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-secondary/20 rounded-lg p-6 border border-border">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <Skeleton className="h-5 w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transactions?.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-secondary/20 rounded-lg p-6 border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <Building2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {transaction.property_address}
                      </h3>
                      {transaction.neighborhood && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {transaction.neighborhood}
                          {transaction.borough && `, ${transaction.borough}`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Rent</span>
                      <span className="text-primary font-semibold">{formatRent(transaction.monthly_rent)}</span>
                    </div>
                    {transaction.lease_term_months && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Lease Term</span>
                        <span className="text-foreground">{transaction.lease_term_months} months</span>
                      </div>
                    )}
                    {transaction.total_lease_value && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Value</span>
                        <span className="text-foreground font-medium">{formatLeaseValue(transaction.total_lease_value)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      {transaction.agent_name}
                    </div>
                    {transaction.deal_type && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {transaction.deal_type}
                      </span>
                    )}
                  </div>

                  {transaction.property_type && (
                    <div className="mt-3">
                      <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded">
                        {transaction.property_type}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isLoading && (!transactions || transactions.length === 0) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transactions found.</p>
            </div>
          )}
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Transactions;
