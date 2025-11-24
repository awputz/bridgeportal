import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInvestmentOfferings } from "@/hooks/useInvestmentOfferings";
import { Building2, MapPin } from "lucide-react";

const Offerings = () => {
  const [assetType, setAssetType] = useState<string>("all");
  const [borough, setBorough] = useState<string>("all");
  
  const { data: offerings = [], isLoading } = useInvestmentOfferings({
    asset_type: assetType !== "all" ? assetType : undefined,
    city: borough !== "all" ? borough : undefined,
  });

  return (
    <div className="min-h-screen pt-32 px-6 lg:px-8 pb-20">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Current Offerings</h1>
          <p className="text-lg text-muted-foreground">
            Active exclusive assignments across New York City
          </p>
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
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>

          <Select value={borough} onValueChange={setBorough}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Borough" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Boroughs</SelectItem>
              <SelectItem value="Manhattan">Manhattan</SelectItem>
              <SelectItem value="Brooklyn">Brooklyn</SelectItem>
              <SelectItem value="Queens">Queens</SelectItem>
              <SelectItem value="Bronx">Bronx</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Offerings Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading offerings</p>
          </div>
        ) : offerings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerings.map((offering) => (
              <Link key={offering.id} to={`/offerings/${offering.id}`}>
                <Card className="overflow-hidden border border-border h-full group hover:shadow-md transition-shadow">
                  {offering.images && offering.images[0] && (
                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                      <img 
                        src={offering.images[0]} 
                        alt={offering.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{offering.title}</h3>
                      <div className="flex items-start gap-1 text-muted-foreground">
                        <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{offering.address}, {offering.city}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm border-t border-border pt-4">
                      {offering.asset_type && (
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-muted-foreground" />
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">{offering.asset_type}</span>
                        </div>
                      )}
                      
                      {offering.price_on_request ? (
                        <p className="font-bold text-base text-foreground">Price on Request</p>
                      ) : (
                        <p className="font-bold text-xl text-foreground font-variant-numeric-tabular">
                          ${offering.price.toLocaleString()}
                        </p>
                      )}
                      
                      <div className="flex gap-4 text-sm text-muted-foreground font-variant-numeric-tabular">
                        {offering.units && <span>{offering.units} units</span>}
                        {offering.gross_square_feet && <span>{offering.gross_square_feet.toLocaleString()} SF</span>}
                      </div>

                      {offering.cap_rate && (
                        <p className="text-sm text-muted-foreground">
                          Cap Rate: <span className="font-semibold text-foreground">{offering.cap_rate}%</span>
                        </p>
                      )}
                    </div>

                    <Button variant="default" size="sm" className="w-full">
                      Request Information
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Building2 size={56} className="mx-auto mb-6 text-muted-foreground opacity-30" />
            <h3 className="text-xl font-semibold mb-2">No offerings match your criteria</h3>
            <p className="text-sm text-muted-foreground mb-6">Adjust your filters or check back soon</p>
            <Button asChild variant="outline">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Offerings;