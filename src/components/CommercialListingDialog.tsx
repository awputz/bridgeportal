import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Download, Building2, Store, MapPin, Ruler, Calendar, Clock, DollarSign, ArrowUp, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { CommercialListing } from "@/hooks/useCommercialListings";

interface CommercialListingDialogProps {
  listing: CommercialListing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommercialListingDialog = ({
  listing,
  open,
  onOpenChange,
}: CommercialListingDialogProps) => {
  const { openContactSheet } = useContactSheet();

  if (!listing) return null;

  const isOffice = listing.listing_type === "office";

  const handleInquire = () => {
    onOpenChange(false);
    openContactSheet();
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 transition-all duration-300 ease-out" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
            "w-full max-w-3xl max-h-[90vh] overflow-y-auto",
            "bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-100",
            "data-[state=open]:slide-in-from-bottom-2",
            "transition-all duration-300 ease-out"
          )}
        >
          <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full p-2 bg-background/80 backdrop-blur-sm opacity-70 ring-offset-background transition-all duration-300 ease-out hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          {/* Property Image */}
          <div className="aspect-[16/9] relative overflow-hidden rounded-t-xl bg-muted">
            {listing.image_url ? (
              <img
                src={listing.image_url}
                alt={listing.property_address}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                {isOffice ? (
                  <Building2 className="h-16 w-16 text-primary/30" />
                ) : (
                  <Store className="h-16 w-16 text-primary/30" />
                )}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <Badge
              className={cn(
                "absolute top-4 left-4",
                isOffice ? "bg-primary" : "bg-accent text-accent-foreground"
              )}
            >
              {isOffice ? "Office" : "Retail"}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {listing.property_address}
              </h2>
              {listing.building_name && (
                <p className="text-base text-foreground/80">{listing.building_name}</p>
              )}
              {(listing.neighborhood || listing.borough) && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {[listing.neighborhood, listing.borough].filter(Boolean).join(", ")}
                </p>
              )}
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out delay-75">
              {listing.rent_per_sf && (
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10">
                  <p className="text-xs text-muted-foreground mb-1">Asking Rent</p>
                  <p className="text-lg font-bold text-foreground flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-primary/70" />
                    ${listing.rent_per_sf}/PSF
                  </p>
                </div>
              )}
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10">
                <p className="text-xs text-muted-foreground mb-1">Square Footage</p>
                <p className="text-lg font-bold text-foreground flex items-center gap-1">
                  <Ruler className="w-4 h-4 text-primary/70" />
                  {listing.square_footage.toLocaleString()} SF
                </p>
              </div>
              {listing.lease_term && (
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10">
                  <p className="text-xs text-muted-foreground mb-1">Lease Term</p>
                  <p className="text-lg font-bold text-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-primary/70" />
                    {listing.lease_term}
                  </p>
                </div>
              )}
              {listing.possession && (
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10">
                  <p className="text-xs text-muted-foreground mb-1">Possession</p>
                  <p className="text-lg font-bold text-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4 text-primary/70" />
                    {listing.possession}
                  </p>
                </div>
              )}
              {listing.ceiling_height_ft && (
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10">
                  <p className="text-xs text-muted-foreground mb-1">Ceiling Height</p>
                  <p className="text-lg font-bold text-foreground flex items-center gap-1">
                    <ArrowUp className="w-4 h-4 text-primary/70" />
                    {listing.ceiling_height_ft} ft
                  </p>
                </div>
              )}
            </div>

            {/* Features */}
            {listing.features && listing.features.length > 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out delay-100">
                <p className="text-xs text-muted-foreground mb-2">Features</p>
                <div className="flex flex-wrap gap-2">
                  {listing.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out delay-100">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out delay-150">
              {listing.flyer_url ? (
                <Button size="lg" variant="outline" className="flex-1 border-white/20 hover:bg-white/5" asChild>
                  <a href={listing.flyer_url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download Flyer
                  </a>
                </Button>
              ) : (
                <Button size="lg" variant="outline" className="flex-1 border-white/20" disabled>
                  <Download className="w-4 h-4 mr-2" />
                  Flyer Coming Soon
                </Button>
              )}
              <Button
                size="lg"
                className="flex-1"
                onClick={handleInquire}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Inquire About This Space
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
