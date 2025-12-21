import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Download, Lock, Building2, MapPin, TrendingUp, Layers, Calendar, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { InvestmentListing } from "@/hooks/useInvestmentListings";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";

interface InvestmentListingDialogProps {
  listing: InvestmentListing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatPrice = (price: number | null) => {
  if (!price) return "Price Upon Request";
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  }
  return `$${price.toLocaleString()}`;
};

const formatCapRate = (rate: number | null) => {
  if (!rate) return null;
  return `${rate.toFixed(2)}%`;
};

export const InvestmentListingDialog = ({
  listing,
  open,
  onOpenChange,
}: InvestmentListingDialogProps) => {
  const { openContactSheet } = useContactSheet();

  if (!listing) return null;

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
          <div className="aspect-[16/9] relative overflow-hidden rounded-t-xl">
            <img
              src={listing.image_url || PLACEHOLDER_IMAGES.building.brownstone}
              alt={listing.property_address}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground border-0">
              {listing.asset_class}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {listing.property_address}
              </h2>
              {(listing.neighborhood || listing.borough) && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {[listing.neighborhood, listing.borough].filter(Boolean).join(", ")}
                </p>
              )}
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out delay-75">
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10">
                <p className="text-xs text-muted-foreground mb-1">Asking Price</p>
                <p className="text-lg font-bold text-foreground">{formatPrice(listing.asking_price)}</p>
              </div>
              {listing.cap_rate && (
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10">
                  <p className="text-xs text-muted-foreground mb-1">Cap Rate</p>
                  <p className="text-lg font-bold text-primary flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {formatCapRate(listing.cap_rate)}
                  </p>
                </div>
              )}
              {listing.units && (
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10">
                  <p className="text-xs text-muted-foreground mb-1">Units</p>
                  <p className="text-lg font-bold text-foreground flex items-center gap-1">
                    <Layers className="w-4 h-4 text-primary/70" />
                    {listing.units}
                  </p>
                </div>
              )}
              {listing.gross_sf && (
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10">
                  <p className="text-xs text-muted-foreground mb-1">Gross SF</p>
                  <p className="text-lg font-bold text-foreground flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-primary/70" />
                    {listing.gross_sf.toLocaleString()}
                  </p>
                </div>
              )}
              {listing.year_built && (
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10">
                  <p className="text-xs text-muted-foreground mb-1">Year Built</p>
                  <p className="text-lg font-bold text-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-primary/70" />
                    {listing.year_built}
                  </p>
                </div>
              )}
            </div>

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
              {listing.om_url ? (
                <Button size="lg" className="flex-1" asChild>
                  <a href={listing.om_url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download OM
                  </a>
                </Button>
              ) : (
                <Button size="lg" className="flex-1" disabled>
                  <Download className="w-4 h-4 mr-2" />
                  OM Coming Soon
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="flex-1 border-white/20 hover:bg-white/5"
                asChild
              >
                <Link to={`/services/investment-sales/deal-room/${listing.id}`}>
                  <Lock className="w-4 h-4 mr-2" />
                  Access Deal Room
                </Link>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="flex-1"
                onClick={handleInquire}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Inquire
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
