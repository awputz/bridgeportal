import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/useTransactions";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return `$${(value / 1000).toFixed(0)}K`;
};

const getPlaceholderImage = (assetType: string | null) => {
  const type = assetType?.toLowerCase() || "";
  if (type.includes("retail")) return PLACEHOLDER_IMAGES.retail.storefront;
  if (type.includes("office")) return PLACEHOLDER_IMAGES.building.exterior;
  if (type.includes("multifamily") || type.includes("residential")) return PLACEHOLDER_IMAGES.building.residential;
  return PLACEHOLDER_IMAGES.building.glass;
};

export const FeaturedDeals = () => {
  const { data: transactions, isLoading } = useTransactions();
  const { elementRef, isVisible } = useScrollReveal();

  // Get top 6 transactions by sale price
  const featuredDeals = transactions
    ?.filter((t) => t.sale_price && t.sale_price > 0)
    .slice(0, 6) || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (featuredDeals.length === 0) return null;

  return (
    <section ref={elementRef} className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
            Featured Transactions
          </h2>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            A selection of notable closings from our investment sales division
          </p>
        </div>

        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
          style={{ transitionDelay: "200ms" }}
        >
          {featuredDeals.map((deal, index) => (
            <div
              key={deal.id}
              className="group rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 overflow-hidden"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {/* Property Image */}
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src={deal.image_url || getPlaceholderImage(deal.asset_type)} 
                  alt={deal.property_address}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5">
                <div className="mb-3">
                  <h3 className="font-medium text-sm mb-1 truncate group-hover:text-accent transition-colors">
                    {deal.property_address}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {deal.neighborhood || deal.borough || "New York"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Sale Price</span>
                    <span className="font-medium text-accent text-sm">
                      {deal.sale_price ? formatCurrency(deal.sale_price) : "N/A"}
                    </span>
                  </div>
                  
                  {deal.gross_square_feet && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Size</span>
                      <span className="text-sm">
                        {deal.gross_square_feet.toLocaleString()} SF
                      </span>
                    </div>
                  )}

                  {deal.asset_type && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Type</span>
                      <span className="text-sm capitalize">{deal.asset_type}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs text-muted-foreground">
                    {deal.agent_name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={cn(
            "text-center transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
          style={{ transitionDelay: "400ms" }}
        >
          <Button asChild variant="link" className="font-light group">
            <Link to="/transactions">
              View Full Track Record
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};