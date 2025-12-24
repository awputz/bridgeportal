import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Download, Lock, Building2, MapPin, TrendingUp, Layers, Calendar, MessageSquare, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { InvestmentListing } from "@/hooks/useInvestmentListings";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import { useIsMobile } from "@/hooks/use-mobile";
import { TeamMemberDialog } from "@/components/TeamMemberDialog";
import { Link } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

interface InvestmentListingDialogProps {
  listing: InvestmentListing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SelectedAgent {
  id: string;
  name: string;
  title: string;
  image: string;
  email?: string;
  phone?: string;
  bio?: string;
  instagram?: string;
  linkedin?: string;
  category?: string;
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

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Shared content component used by both Dialog and Drawer
const InvestmentListingContent = ({
  listing,
  onClose,
  onAgentClick,
}: {
  listing: InvestmentListing;
  onClose: () => void;
  onAgentClick: (agent: SelectedAgent) => void;
}) => {
  const { openContactSheet } = useContactSheet();

  const handleInquire = () => {
    onClose();
    openContactSheet();
  };

  return (
    <>
      {/* Property Image */}
      <div className="aspect-[16/9] relative overflow-hidden">
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
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
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50 border border-border/30">
            <p className="text-xs text-muted-foreground mb-1">Asking Price</p>
            <p className="text-base font-bold text-foreground">{formatPrice(listing.asking_price)}</p>
          </div>
          {listing.cap_rate && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border/30">
              <p className="text-xs text-muted-foreground mb-1">Cap Rate</p>
              <p className="text-base font-bold text-primary flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {formatCapRate(listing.cap_rate)}
              </p>
            </div>
          )}
          {listing.units && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border/30">
              <p className="text-xs text-muted-foreground mb-1">Units</p>
              <p className="text-base font-bold text-foreground flex items-center gap-1">
                <Layers className="w-4 h-4 text-primary/70" />
                {listing.units}
              </p>
            </div>
          )}
          {listing.gross_sf && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border/30">
              <p className="text-xs text-muted-foreground mb-1">Gross SF</p>
              <p className="text-base font-bold text-foreground flex items-center gap-1">
                <Building2 className="w-4 h-4 text-primary/70" />
                {listing.gross_sf.toLocaleString()}
              </p>
            </div>
          )}
          {listing.year_built && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border/30">
              <p className="text-xs text-muted-foreground mb-1">Year Built</p>
              <p className="text-base font-bold text-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4 text-primary/70" />
                {listing.year_built}
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        {listing.description && (
          <div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {listing.description}
            </p>
          </div>
        )}

        {/* Listing Agents */}
        {listing.agents && listing.agents.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Listing Agents</p>
            <div className="space-y-2">
              {listing.agents.map((agent) => (
                <div 
                  key={agent.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/30 cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => onAgentClick({
                    id: agent.id,
                    name: agent.name,
                    title: agent.title,
                    image: agent.image_url || '',
                    email: agent.email || undefined,
                    phone: agent.phone || undefined,
                    bio: agent.bio || undefined,
                    instagram: agent.instagram_url || undefined,
                    linkedin: agent.linkedin_url || undefined,
                    category: agent.category || undefined,
                  })}
                >
                  <Avatar className="h-10 w-10 border border-border/30">
                    <AvatarImage src={agent.image_url || undefined} alt={agent.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(agent.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-left leading-none">
                      {agent.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate leading-tight">{agent.title}</p>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {agent.email && (
                      <Button size="icon" variant="outline" className="h-10 w-10 rounded-lg border-white/60" asChild>
                        <a href={`mailto:${agent.email}`} title={`Email ${agent.name}`}>
                          <Mail className="w-5 h-5" />
                        </a>
                      </Button>
                    )}
                    {agent.phone && (
                      <Button size="icon" variant="outline" className="h-10 w-10 rounded-lg border-white/60" asChild>
                        <a href={`tel:${agent.phone}`} title={`Call ${agent.name}`}>
                          <Phone className="w-5 h-5" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          {listing.om_url ? (
            <Button size="lg" className="w-full" asChild>
              <a href={listing.om_url} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                Download OM
              </a>
            </Button>
          ) : (
            <Button size="lg" className="w-full" disabled>
              <Download className="w-4 h-4 mr-2" />
              OM Coming Soon
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            className="w-full"
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
            className="w-full"
            onClick={handleInquire}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Inquire
          </Button>
        </div>
      </div>
    </>
  );
};

export const InvestmentListingDialog = ({
  listing,
  open,
  onOpenChange,
}: InvestmentListingDialogProps) => {
  const isMobile = useIsMobile();
  const [selectedAgent, setSelectedAgent] = useState<SelectedAgent | null>(null);
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);

  if (!listing) return null;

  const handleClose = () => onOpenChange(false);

  const handleAgentClick = (agent: SelectedAgent) => {
    setSelectedAgent(agent);
    setAgentDialogOpen(true);
  };

  // Mobile: Use Drawer that slides from bottom
  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader className="relative border-b border-border/30 pb-4">
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <DrawerTitle className="text-left pr-12">{listing.property_address}</DrawerTitle>
              <DrawerDescription className="text-left">
                {listing.asset_class} Investment Opportunity
              </DrawerDescription>
            </DrawerHeader>
            <div className="overflow-y-auto pb-8">
              <InvestmentListingContent 
                listing={listing} 
                onClose={handleClose} 
                onAgentClick={handleAgentClick}
              />
            </div>
          </DrawerContent>
        </Drawer>
        
        <TeamMemberDialog
          member={selectedAgent}
          open={agentDialogOpen}
          onOpenChange={setAgentDialogOpen}
        />
      </>
    );
  }

  // Desktop: Use Dialog
  return (
    <>
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

            <div className="rounded-t-xl overflow-hidden">
              <InvestmentListingContent 
                listing={listing} 
                onClose={handleClose}
                onAgentClick={handleAgentClick}
              />
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
      
      <TeamMemberDialog
        member={selectedAgent}
        open={agentDialogOpen}
        onOpenChange={setAgentDialogOpen}
      />
    </>
  );
};