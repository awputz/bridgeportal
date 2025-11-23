import { useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useProperties } from "@/hooks/useProperties";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { PullToRefreshIndicator } from "@/components/PullToRefreshIndicator";
import { ListingCardSkeletonGrid } from "@/components/skeletons/ListingCardSkeleton";
import { PropertyMap } from "@/components/PropertyMap";
import { Map, Grid3x3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Listings = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>("all");
  const [bedroomsFilter, setBedroomsFilter] = useState<number>(0);
  const [bathroomsFilter, setBathroomsFilter] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);

  const { data: properties = [], isLoading, refetch } = useProperties({
    listing_type: typeFilter !== "all" ? typeFilter : undefined,
    bedrooms: bedroomsFilter > 0 ? bedroomsFilter : undefined,
    min_price: priceRange[0],
    max_price: priceRange[1],
  });

  const handleRefresh = async () => {
    await refetch();
  };

  const { isPulling, pullDistance, isRefreshing } = usePullToRefresh(handleRefresh);

  const cities = Array.from(new Set(properties.map(p => p.city)));
  const propertyTypes = Array.from(new Set(properties.map(p => p.property_type).filter(Boolean)));

  const filteredListings = properties.filter(property => {
    const matchesCity = cityFilter === "all" || property.city === cityFilter;
    const matchesPropertyType = propertyTypeFilter === "all" || property.property_type === propertyTypeFilter;
    const matchesBathrooms = bathroomsFilter === 0 || (property.bathrooms && property.bathrooms >= bathroomsFilter);
    return matchesCity && matchesPropertyType && matchesBathrooms;
  }).map(p => ({
    id: p.id,
    address: p.address,
    neighborhood: p.city,
    price: p.listing_type === "rent" ? `$${p.price.toLocaleString()}` : `$${p.price.toLocaleString()}`,
    beds: p.bedrooms || 0,
    baths: p.bathrooms || 0,
    image: p.images?.[0] || "/placeholder.svg",
    type: (p.listing_type === "rent" ? "rental" : "sale") as "rental" | "sale"
  }));

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-20">
      <PullToRefreshIndicator
        isPulling={isPulling}
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-10 pt-4 md:pt-8">
          <h1 className="mb-4 text-3xl md:text-5xl">Available Listings</h1>
          <p className="text-sm md:text-lg text-muted max-w-2xl leading-relaxed">
            Browse our curated collection of NYC properties
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-lg border border-border p-1 bg-muted">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="gap-2"
            >
              <Grid3x3 size={16} />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("map")}
              className="gap-2"
            >
              <Map size={16} />
              <span className="hidden sm:inline">Map</span>
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-col gap-4 mb-6 md:mb-8 p-4 md:p-6 bg-background rounded-lg border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Listing Type */}
            <div>
              <label className="text-xs md:text-sm font-medium mb-2 block">Listing Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-10 md:h-11 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="rent">Rentals</SelectItem>
                  <SelectItem value="sale">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div>
              <label className="text-xs md:text-sm font-medium mb-2 block">City</label>
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="h-10 md:h-11 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Property Type */}
            <div>
              <label className="text-xs md:text-sm font-medium mb-2 block">Property Type</label>
              <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
                <SelectTrigger className="h-10 md:h-11 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {propertyTypes.map(type => (
                    <SelectItem key={type} value={type!}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="text-xs md:text-sm font-medium mb-2 block">
                Bedrooms: {bedroomsFilter === 0 ? "Any" : `${bedroomsFilter}+`}
              </label>
              <Select value={bedroomsFilter.toString()} onValueChange={(v) => setBedroomsFilter(Number(v))}>
                <SelectTrigger className="h-10 md:h-11 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="text-xs md:text-sm font-medium mb-2 block">
                Bathrooms: {bathroomsFilter === 0 ? "Any" : `${bathroomsFilter}+`}
              </label>
              <Select value={bathroomsFilter.toString()} onValueChange={(v) => setBathroomsFilter(Number(v))}>
                <SelectTrigger className="h-10 md:h-11 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-xs md:text-sm font-medium mb-3 block">
              Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
            </label>
            <Slider
              min={0}
              max={10000000}
              step={50000}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="w-full"
            />
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setTypeFilter("all");
              setCityFilter("all");
              setPropertyTypeFilter("all");
              setBedroomsFilter(0);
              setBathroomsFilter(0);
              setPriceRange([0, 10000000]);
            }}
            className="w-full md:w-auto text-sm"
          >
            Clear All Filters
          </Button>
        </div>

        {/* Results */}
        <div className="mb-6 md:mb-8">
          <p className="text-xs md:text-sm text-muted">
            {filteredListings.length} {filteredListings.length === 1 ? "property" : "properties"}
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <ListingCardSkeletonGrid count={9} />
        ) : viewMode === "map" ? (
          <PropertyMap 
            properties={properties.filter(p => {
              const matchesCity = cityFilter === "all" || p.city === cityFilter;
              const matchesPropertyType = propertyTypeFilter === "all" || p.property_type === propertyTypeFilter;
              const matchesBathrooms = bathroomsFilter === 0 || (p.bathrooms && p.bathrooms >= bathroomsFilter);
              return matchesCity && matchesPropertyType && matchesBathrooms;
            })}
            onPropertyClick={(property) => navigate(`/listings/${property.id}`)}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="text-center py-20">
                <p className="text-base md:text-lg text-muted">No listings match your filters</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setTypeFilter("all");
                    setCityFilter("all");
                    setPropertyTypeFilter("all");
                    setBedroomsFilter(0);
                    setBathroomsFilter(0);
                    setPriceRange([0, 10000000]);
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Listings;
