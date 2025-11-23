import { useTransactions } from "@/hooks/useTransactions";
import { useProperties } from "@/hooks/useProperties";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Transactions = () => {
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: properties = [] } = useProperties();

  const totalValue = transactions.reduce((sum, t) => sum + (t.total_lease_value || 0), 0);
  const totalDeals = transactions.length;

  const findMatchingProperty = (address: string) => {
    return properties.find(p => 
      p.address.toLowerCase().includes(address.toLowerCase()) || 
      address.toLowerCase().includes(p.address.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen pt-40 pb-20">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="mb-6">Past Transactions</h1>
          <p className="text-lg text-muted max-w-3xl leading-relaxed">
            A record of our successful residential and commercial transactions in New York City. 
            Our track record speaks to our expertise in the market.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Deals</p>
                <p className="text-3xl font-semibold">{totalDeals}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-3xl font-semibold">${(totalValue / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Deal Size</p>
                <p className="text-3xl font-semibold">${totalDeals > 0 ? Math.round(totalValue / totalDeals / 1000) : 0}K</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Transactions */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted">Loading transactions...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <Card className="overflow-hidden border border-border hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 font-semibold text-sm">Property Address</th>
                      <th className="text-left p-4 font-semibold text-sm">Borough</th>
                      <th className="text-left p-4 font-semibold text-sm">Neighborhood</th>
                      <th className="text-left p-4 font-semibold text-sm">Type</th>
                      <th className="text-left p-4 font-semibold text-sm">Agent</th>
                      <th className="text-right p-4 font-semibold text-sm">Monthly</th>
                      <th className="text-right p-4 font-semibold text-sm">Term</th>
                      <th className="text-right p-4 font-semibold text-sm">Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => {
                      const matchingProperty = findMatchingProperty(transaction.property_address);
                      return (
                        <tr key={transaction.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                          <td className="p-4">
                            {matchingProperty ? (
                              <Link 
                                to={`/listings/${matchingProperty.id}`}
                                className="font-medium hover:text-primary transition-colors underline"
                              >
                                {transaction.property_address}
                              </Link>
                            ) : (
                              <div className="font-medium">{transaction.property_address}</div>
                            )}
                          </td>
                          <td className="p-4 text-muted-foreground">{transaction.borough || '-'}</td>
                          <td className="p-4 text-muted-foreground">{transaction.neighborhood || '-'}</td>
                          <td className="p-4">
                            <Badge variant="secondary" className="text-xs">
                              {transaction.property_type || 'Residential'}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">{transaction.agent_name}</td>
                          <td className="p-4 text-right font-medium">
                            {transaction.monthly_rent ? `$${transaction.monthly_rent.toLocaleString()}` : '-'}
                          </td>
                          <td className="p-4 text-right text-muted-foreground">
                            {transaction.lease_term_months ? `${transaction.lease_term_months}mo` : '-'}
                          </td>
                          <td className="p-4 text-right font-semibold">
                            {transaction.total_lease_value ? `$${transaction.total_lease_value.toLocaleString()}` : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {transactions.map((transaction) => {
                const matchingProperty = findMatchingProperty(transaction.property_address);
                return (
                  <Card key={transaction.id} className="p-4 border border-border">
                    <div className="space-y-3">
                      <div>
                        {matchingProperty ? (
                          <Link 
                            to={`/listings/${matchingProperty.id}`}
                            className="font-semibold text-lg hover:text-primary transition-colors underline"
                          >
                            {transaction.property_address}
                          </Link>
                        ) : (
                          <h3 className="font-semibold text-lg">{transaction.property_address}</h3>
                        )}
                        {transaction.borough && (
                          <p className="text-sm text-muted-foreground">{transaction.borough}{transaction.neighborhood ? ` • ${transaction.neighborhood}` : ''}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {transaction.property_type || 'Residential'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {transaction.deal_type}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Agent</p>
                          <p className="font-medium">{transaction.agent_name}</p>
                        </div>
                        {transaction.monthly_rent && (
                          <div>
                            <p className="text-muted-foreground">Monthly</p>
                            <p className="font-medium">${transaction.monthly_rent.toLocaleString()}</p>
                          </div>
                        )}
                        {transaction.lease_term_months && (
                          <div>
                            <p className="text-muted-foreground">Term</p>
                            <p className="font-medium">{transaction.lease_term_months} months</p>
                          </div>
                        )}
                        {transaction.total_lease_value && (
                          <div>
                            <p className="text-muted-foreground">Total Value</p>
                            <p className="font-semibold">${transaction.total_lease_value.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Transactions;
