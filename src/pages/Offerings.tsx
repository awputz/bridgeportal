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
    <div className="min-h-screen pt-32 px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Current Offerings</h1>
          <p className="text-xl text-muted-foreground">
            Active exclusive assignments represented by BRIDGE Investment Sales
          </p>
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
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>

          <Select value={borough} onValueChange={setBorough}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Borough" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Boroughs</SelectItem>
              <SelectItem value="Manhattan">Manhattan</SelectItem>
              <SelectItem value="Brooklyn">Brooklyn</SelectItem>
              <SelectItem value="Queens">Queens</SelectItem>
              <SelectItem value="Bronx">Bronx</SelectItem>
              <SelectItem value="Staten Island">Staten Island</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Offerings Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading offerings...</p>
          </div>
        ) : offerings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerings.map((offering) => (
              <Link key={offering.id} to={`/offerings/${offering.id}`}>
                <Card className="overflow-hidden hover-lift border border-border h-full">
                  {offering.images && offering.images[0] && (
                    <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
                      <img 
                        src={offering.images[0]} 
                        alt={offering.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{offering.title}</h3>
                    <div className="flex items-start gap-2 text-muted-foreground mb-4">
                      <MapPin size={16} className="mt-1 flex-shrink-0" />
                      <p className="text-sm">{offering.address}, {offering.city}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      {offering.asset_type && (
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-muted-foreground" />
                          <span className="text-muted-foreground">{offering.asset_type}</span>
                        </div>
                      )}
                      
                      {offering.price_on_request ? (
                        <p className="font-semibold text-foreground">Price on Request</p>
                      ) : (
                        <p className="font-semibold text-foreground">
                          ${offering.price.toLocaleString()}
                        </p>
                      )}
                      
                      {offering.units && (
                        <p className="text-muted-foreground">{offering.units} units</p>
                      )}
                      
                      {offering.gross_square_feet && (
                        <p className="text-muted-foreground">
                          {offering.gross_square_feet.toLocaleString()} SF
                        </p>
                      )}
                      
                      {offering.cap_rate && (
                        <p className="text-muted-foreground">{offering.cap_rate}% Cap Rate</p>
                      )}
                    </div>

                    {offering.brief_highlights && (
                      <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                        {offering.brief_highlights}
                      </p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Building2 size={64} className="mx-auto mb-6 text-muted-foreground opacity-50" />
            <h3 className="text-2xl font-semibold mb-2">No offerings match your criteria</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or check back soon for new listings</p>
            <Button asChild variant="outline">
              <Link to="/contact">Contact Us About Future Offerings</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Offerings;