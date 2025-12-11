import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { useTransactions } from "@/hooks/useTransactions";
import { Building2, TrendingUp, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const DivisionTrackRecord = () => {
  const { data: transactions, isLoading } = useTransactions();

  const salesTransactions = transactions?.filter(t => t.deal_type === "sale") || [];

  const stats = [
    { label: "Total Volume", value: "$5B+", icon: TrendingUp },
    { label: "Transactions Closed", value: "350+", icon: Building2 },
    { label: "Avg. Deal Size", value: "$14M", icon: TrendingUp },
    { label: "Markets Covered", value: "5", icon: MapPin },
  ];

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Investment Sales / Track Record</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Investment Sales Track Record
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          A proven history of successful investment sales transactions across New York City's 
          most competitive markets.
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="investment-sales" heroContent={heroContent}>
      {/* Stats */}
      <section className="py-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Recent Investment Sales
          </h2>
          <p className="text-muted-foreground mb-12">
            A selection of our recent investment sales transactions.
          </p>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-secondary/20 rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-secondary/50 rounded mb-4 w-3/4" />
                  <div className="h-4 bg-secondary/50 rounded mb-2 w-1/2" />
                  <div className="h-4 bg-secondary/50 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : salesTransactions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {salesTransactions.slice(0, 12).map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-secondary/20 rounded-lg p-6 border border-border hover:border-primary/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {transaction.property_address}
                  </h3>
                  <div className="space-y-1 text-sm">
                    {transaction.borough && (
                      <p className="text-muted-foreground">
                        <span className="text-foreground">Location:</span> {transaction.borough}
                        {transaction.neighborhood && `, ${transaction.neighborhood}`}
                      </p>
                    )}
                    {transaction.sale_price && (
                      <p className="text-muted-foreground">
                        <span className="text-foreground">Sale Price:</span>{" "}
                        ${transaction.sale_price.toLocaleString()}
                      </p>
                    )}
                    {transaction.units && (
                      <p className="text-muted-foreground">
                        <span className="text-foreground">Units:</span> {transaction.units}
                      </p>
                    )}
                    {transaction.asset_type && (
                      <p className="text-muted-foreground">
                        <span className="text-foreground">Type:</span> {transaction.asset_type}
                      </p>
                    )}
                    {transaction.closing_date && (
                      <p className="text-muted-foreground">
                        <span className="text-foreground">Closed:</span>{" "}
                        {new Date(transaction.closing_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              Transaction data coming soon.
            </p>
          )}

          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link to="/track-record">
                View Full Track Record <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* By The Numbers */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Investment Sales By The Numbers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-8 border border-border text-center">
              <p className="text-5xl font-bold text-primary mb-2">$5B+</p>
              <p className="text-lg font-medium text-foreground mb-2">Total Transaction Volume</p>
              <p className="text-muted-foreground text-sm">
                Across multifamily, mixed-use, and commercial properties
              </p>
            </div>
            <div className="bg-background rounded-lg p-8 border border-border text-center">
              <p className="text-5xl font-bold text-primary mb-2">350+</p>
              <p className="text-lg font-medium text-foreground mb-2">Closed Transactions</p>
              <p className="text-muted-foreground text-sm">
                Representing buyers and sellers throughout NYC
              </p>
            </div>
            <div className="bg-background rounded-lg p-8 border border-border text-center">
              <p className="text-5xl font-bold text-primary mb-2">98%</p>
              <p className="text-lg font-medium text-foreground mb-2">Closing Rate</p>
              <p className="text-muted-foreground text-sm">
                Industry-leading execution and deal certainty
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Ready to Add to Our Track Record?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Whether buying or selling, let's discuss how we can help with your next transaction.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/contact">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default DivisionTrackRecord;
