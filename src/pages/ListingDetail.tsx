import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bed, Bath, Maximize, MapPin, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useProperty } from "@/hooks/useProperties";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PropertyDetailSkeleton } from "@/components/skeletons/PropertyDetailSkeleton";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { PullToRefreshIndicator } from "@/components/PullToRefreshIndicator";

const ListingDetail = () => {
  const { id } = useParams();
  const { data: property, isLoading, refetch } = useProperty(id || "");

  const handleRefresh = async () => {
    await refetch();
  };

  const { isPulling, pullDistance, isRefreshing } = usePullToRefresh(handleRefresh);

  if (isLoading) {
    return (
      <>
        <PullToRefreshIndicator
          isPulling={isPulling}
          pullDistance={pullDistance}
          isRefreshing={isRefreshing}
        />
        <PropertyDetailSkeleton />
      </>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen pt-40 pb-20">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h1 className="mb-4">Listing Not Found</h1>
          <Button asChild>
            <Link to="/listings">Back to Listings</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (property.listing_type === "rent") {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen pt-28 md:pt-40 pb-20">
      <PullToRefreshIndicator
        isPulling={isPulling}
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-4 md:mb-6 text-sm">
          <Link to="/listings">
            <ArrowLeft className="mr-2" size={16} />
            Back
          </Link>
        </Button>

        {/* Hero Image */}
        <div className="aspect-video md:aspect-[21/9] overflow-hidden rounded-lg mb-6 md:mb-8">
          <img
            src={property.images?.[0] || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Main Content - Reordered for Mobile */}
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            {/* Header - Mobile First */}
            <div>
              <h1 className="text-2xl md:text-4xl mb-3 md:mb-4">{property.title}</h1>
              <p className="text-base md:text-xl text-muted-foreground flex items-start gap-2 mb-4">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>{property.address}, {property.city}</span>
              </p>
              
              {/* Price - Prominent on Mobile */}
              <div className="text-3xl md:text-4xl font-semibold mb-4">{formatPrice(property.price)}</div>

              {/* Key Facts */}
              <div className="flex flex-wrap gap-4 text-sm md:text-base text-muted-foreground">
                {property.bedrooms && (
                  <span className="flex items-center gap-2">
                    <Bed size={18} />
                    {property.bedrooms} Bed
                  </span>
                )}
                {property.bathrooms && (
                  <span className="flex items-center gap-2">
                    <Bath size={18} />
                    {property.bathrooms} Bath
                  </span>
                )}
                {property.square_feet && (
                  <span className="flex items-center gap-2">
                    <Maximize size={18} />
                    {property.square_feet.toLocaleString()} sq ft
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Description</h2>
                <div className="prose prose-gray max-w-none space-y-4 text-sm md:text-base text-muted-foreground">
                  <p>{property.description}</p>
                </div>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="text-accent mt-0.5 flex-shrink-0" size={18} />
                      <span className="text-sm md:text-base">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Information - Collapsible on Mobile */}
            <details className="lg:hidden group">
              <summary className="text-xl font-semibold mb-4 cursor-pointer">
                Property Details
              </summary>
              <Card className="p-4 mt-4">
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground mb-1">Type</dt>
                    <dd className="font-medium capitalize">{property.property_type || "N/A"}</dd>
                  </div>
                  {property.year_built && (
                    <div>
                      <dt className="text-muted-foreground mb-1">Built</dt>
                      <dd className="font-medium">{property.year_built}</dd>
                    </div>
                  )}
                  {property.zip_code && (
                    <div>
                      <dt className="text-muted-foreground mb-1">ZIP</dt>
                      <dd className="font-medium">{property.zip_code}</dd>
                    </div>
                  )}
                </dl>
              </Card>
            </details>

            {/* Property Information - Desktop */}
            <div className="hidden lg:block">
              <h2 className="text-2xl font-semibold mb-6">Property Information</h2>
              <Card className="p-6">
                <dl className="grid grid-cols-2 gap-6">
                  <div>
                    <dt className="text-sm text-muted-foreground mb-1">Property Type</dt>
                    <dd className="font-medium capitalize">{property.property_type || "N/A"}</dd>
                  </div>
                  {property.year_built && (
                    <div>
                      <dt className="text-sm text-muted-foreground mb-1">Year Built</dt>
                      <dd className="font-medium">{property.year_built}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm text-muted-foreground mb-1">Listing Type</dt>
                    <dd className="font-medium capitalize">{property.listing_type}</dd>
                  </div>
                  {property.zip_code && (
                    <div>
                      <dt className="text-sm text-muted-foreground mb-1">ZIP Code</dt>
                      <dd className="font-medium">{property.zip_code}</dd>
                    </div>
                  )}
                </dl>
              </Card>
            </div>
          </div>

          {/* Sidebar - Contact Form - Simplified */}
          <div className="lg:col-span-1">
            <Card className="p-4 md:p-6 lg:sticky lg:top-32">
              <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Inquire</h3>
              <form 
                className="space-y-3 md:space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  
                  try {
                    const { error } = await supabase.functions.invoke("submit-inquiry", {
                      body: {
                        name: formData.get('name'),
                        email: formData.get('email'),
                        phone: formData.get('phone'),
                        notes: `Property: ${property.title} at ${property.address}. ${formData.get('message')}`,
                        user_type: property.listing_type === 'rent' ? 'renter' : 'buyer'
                      }
                    });
                    
                    if (error) throw error;
                    
                    toast({
                      title: "Inquiry sent!",
                      description: "We'll contact you within 24 hours"
                    });
                    
                    e.currentTarget.reset();
                  } catch (error) {
                    console.error('Error:', error);
                    toast({
                      title: "Error",
                      description: "Please try again",
                      variant: "destructive"
                    });
                  }
                }}
              >
                <div>
                  <Label htmlFor="name" className="text-sm">Name</Label>
                  <Input id="name" name="name" placeholder="Your name" className="h-10 text-sm" required />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="your@email.com" className="h-10 text-sm" required />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm">Phone</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" className="h-10 text-sm" />
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm">Message</Label>
                  <Textarea 
                    id="message"
                    name="message"
                    placeholder="I'm interested..."
                    rows={3}
                    className="text-sm resize-none"
                    required
                  />
                </div>
                <Button type="submit" className="w-full text-sm">Send Inquiry</Button>
              </form>

              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border">
                <p className="text-xs md:text-sm text-muted-foreground mb-3">Lead Agent</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-full" />
                  <div>
                    <div className="font-medium text-sm md:text-base">Sarah Chen</div>
                    <div className="text-xs md:text-sm text-muted-foreground">Managing Director</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full text-sm" asChild>
                  <a href="tel:+1234567890">Call (123) 456-7890</a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
