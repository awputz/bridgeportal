import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
import { Instagram, Linkedin, X, Mail, Phone, MessageCircle, Building2, TrendingUp, Store, MapPin, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
export interface TeamMember {
  id?: string;
  name: string;
  title: string;
  bio?: string;
  image: string;
  instagram?: string;
  linkedin?: string;
  email?: string;
  phone?: string;
  category?: string;
  licenseNumber?: string;
}
interface TeamMemberDialogProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
interface InvestmentListing {
  id: string;
  property_address: string;
  neighborhood: string | null;
  borough: string | null;
  asking_price: number | null;
  asset_class: string;
  image_url: string | null;
  is_active: boolean;
}
interface CommercialListing {
  id: string;
  property_address: string;
  neighborhood: string | null;
  borough: string | null;
  listing_type: string;
  asking_rent: number | null;
  rent_per_sf: number | null;
  image_url: string | null;
  is_active: boolean;
}

// Format phone number for WhatsApp (remove non-digits, ensure country code)
const formatPhoneForWhatsApp = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('1') ? digits : `1${digits}`;
};

// Format currency
const formatCurrency = (value: number | null): string => {
  if (!value) return '$0';
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
};

// Format price for listings
const formatPrice = (price: number | null): string => {
  if (!price) return 'Price Upon Request';
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(2)}M`;
  }
  return `$${price.toLocaleString()}`;
};

// Format transaction value based on deal type
const formatTransactionValue = (transaction: {
  deal_type?: string;
  division?: string;
  monthly_rent?: number | null;
  price_per_sf?: number | null;
  sale_price?: number | null;
  total_lease_value?: number | null;
}): string => {
  const dealType = (transaction.deal_type || transaction.division || '').toLowerCase();

  // Residential: Show monthly rent
  if (dealType === 'residential') {
    if (transaction.monthly_rent) {
      return `$${transaction.monthly_rent.toLocaleString()}/mo`;
    }
    return formatCurrency(transaction.total_lease_value);
  }

  // Commercial/Lease: Show price per SF
  if (dealType === 'commercial' || dealType === 'lease') {
    if (transaction.price_per_sf) {
      return `$${transaction.price_per_sf.toLocaleString()}/SF`;
    }
    if (transaction.monthly_rent) {
      return `$${transaction.monthly_rent.toLocaleString()}/mo`;
    }
    return '—';
  }

  // Investment Sales/Sale: Show full sale price (no abbreviation)
  if (dealType === 'investment sales' || dealType === 'sale') {
    if (transaction.sale_price) {
      return `$${transaction.sale_price.toLocaleString()}`;
    }
    return '—';
  }

  // Default fallback
  return formatCurrency(transaction.sale_price || transaction.total_lease_value);
};

// Get initials from name
const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};
export const TeamMemberDialog = ({
  member,
  open,
  onOpenChange
}: TeamMemberDialogProps) => {
  const isMobile = useIsMobile();

  // Fetch agent's current investment listings
  const {
    data: investmentListings = []
  } = useQuery({
    queryKey: ['agent-investment-listings', member?.id],
    queryFn: async () => {
      if (!member?.id) return [];
      const {
        data,
        error
      } = await supabase.from('investment_listing_agents').select(`
          listing_id,
          investment_listings!inner (
            id,
            property_address,
            neighborhood,
            borough,
            asking_price,
            asset_class,
            image_url,
            is_active
          )
        `).eq('agent_id', member.id);
      if (error) {
        console.error('Error fetching investment listings:', error);
        return [];
      }

      // Filter for active listings and flatten
      return (data || []).map((item: any) => item.investment_listings as InvestmentListing).filter((listing: InvestmentListing) => listing?.is_active);
    },
    enabled: open && !!member?.id
  });

  // Fetch agent's current commercial listings
  const {
    data: commercialListings = []
  } = useQuery({
    queryKey: ['agent-commercial-listings', member?.id],
    queryFn: async () => {
      if (!member?.id) return [];
      const {
        data,
        error
      } = await supabase.from('commercial_listing_agents').select(`
          listing_id,
          commercial_listings!inner (
            id,
            property_address,
            neighborhood,
            borough,
            listing_type,
            asking_rent,
            rent_per_sf,
            image_url,
            is_active
          )
        `).eq('agent_id', member.id);
      if (error) {
        console.error('Error fetching commercial listings:', error);
        return [];
      }

      // Filter for active listings and flatten
      return (data || []).map((item: any) => item.commercial_listings as CommercialListing).filter((listing: CommercialListing) => listing?.is_active);
    },
    enabled: open && !!member?.id
  });

  // Fetch transactions for this team member
  const {
    data: transactions = []
  } = useQuery({
    queryKey: ['member-transactions', member?.name],
    queryFn: async () => {
      if (!member?.name) return [];

      // Get first and last name for matching
      const nameParts = member.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      const {
        data,
        error
      } = await supabase.from('transactions').select('*').or(`agent_name.ilike.%${firstName}%${lastName}%,agent_name.ilike.%${lastName}%`).order('closing_date', {
        ascending: false
      });
      if (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }
      return data || [];
    },
    enabled: open && !!member?.name
  });
  if (!member) return null;

  // Helper to get transaction volume for sorting
  const getTransactionVolume = (t: typeof transactions[0]) => {
    return t.sale_price || t.total_lease_value || 0;
  };

  // Sort transactions by volume (highest to lowest)
  const sortedTransactions = [...transactions].sort((a, b) => {
    return getTransactionVolume(b) - getTransactionVolume(a);
  });

  // Calculate stats
  const totalDeals = transactions.length;
  const totalVolume = transactions.reduce((sum, t) => {
    return sum + getTransactionVolume(t);
  }, 0);
  const totalExclusives = investmentListings.length + commercialListings.length;

  // Build contact actions array
  const contactActions = [member.email && {
    icon: Mail,
    label: "Email",
    url: `mailto:${member.email}`
  }, member.phone && {
    icon: Phone,
    label: "Call",
    url: `tel:${member.phone}`
  }, member.phone && {
    icon: MessageCircle,
    label: "WhatsApp",
    url: `https://wa.me/${formatPhoneForWhatsApp(member.phone)}`
  }].filter(Boolean) as {
    icon: typeof Mail;
    label: string;
    url: string;
  }[];
  const socialLinks = [member.linkedin && {
    icon: Linkedin,
    label: "LinkedIn",
    url: member.linkedin
  }, member.instagram && {
    icon: Instagram,
    label: "Instagram",
    url: member.instagram
  }].filter(Boolean) as {
    icon: typeof Linkedin;
    label: string;
    url: string;
  }[];
  const ContentComponent = ({
    onClose
  }: {
    onClose?: () => void;
  }) => <div className="space-y-5">
      {/* Header with Photo */}
      <div className="flex items-start gap-5 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out">
        <div className="relative flex-shrink-0">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 rounded-xl border-2 border-border/40 shadow-xl">
            <AvatarImage src={member.image} alt={member.name} className="object-cover rounded-xl" />
            <AvatarFallback className="text-xl md:text-2xl lg:text-3xl font-light bg-accent/10 rounded-xl">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>
          {/* Gradient overlay effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
        </div>
        
        <div className="flex-1 min-w-0 pt-1">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-light tracking-tight">{member.name}</h2>
          <p className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mt-1">{member.title}</p>
          
          
        </div>
      </div>

      {/* Bio */}
      {member.bio && <p className="text-sm leading-relaxed text-muted-foreground/90 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out delay-75">
          {member.bio}
        </p>}

      {/* Contact Actions */}
      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out delay-100">
        <div className="flex flex-wrap items-center gap-2">
          {contactActions.map(action => {
          const Icon = action.icon;
          return <a key={action.label} href={action.url} className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-border/40 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-light">{action.label}</span>
              </a>;
        })}
          
          {socialLinks.map(link => {
          const Icon = link.icon;
          return <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-11 w-11 rounded-md border border-border/40 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 touch-manipulation active:scale-95" aria-label={link.label}>
                <Icon className="h-4 w-4" />
              </a>;
        })}
        </div>
      </div>

      <Separator />

      {/* Tabs Section */}
      <Tabs defaultValue="exclusives" className="animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out delay-150">
        <TabsList className="grid w-full grid-cols-2 h-11">
          <TabsTrigger value="exclusives" className="text-sm gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Current</span> Exclusives
            {totalExclusives > 0 && <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                {totalExclusives}
              </Badge>}
          </TabsTrigger>
          <TabsTrigger value="transactions" className="text-sm gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Past</span> Transactions
            {totalDeals > 0 && <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                {totalDeals}
              </Badge>}
          </TabsTrigger>
        </TabsList>

        {/* Current Exclusives Tab */}
        <TabsContent value="exclusives" className="mt-4">
          {totalExclusives === 0 ? <div className="text-center py-10 text-muted-foreground">
              <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No active listings</p>
            </div> : <ScrollArea className="h-[280px] md:h-[320px] pr-4">
              <div className="grid gap-3">
                {/* Investment Sales Listings */}
                {investmentListings.map(listing => <Link key={listing.id} to="/services/investment-sales/listings" onClick={() => onClose?.()} className="group flex gap-4 p-3 rounded-lg border border-border/30 hover:border-accent/50 hover:bg-accent/5 transition-all duration-200">
                    <div className="w-20 h-16 md:w-24 md:h-18 rounded-md overflow-hidden bg-muted/20 flex-shrink-0">
                      {listing.image_url ? <img src={listing.image_url} alt={listing.property_address} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-muted-foreground/30" />
                        </div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                            {listing.property_address}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs font-normal px-2 py-0 bg-primary/5">
                              Investment Sales
                            </Badge>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm font-medium text-accent">
                          {formatPrice(listing.asking_price)}
                        </span>
                        {listing.neighborhood && <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {listing.neighborhood}
                          </span>}
                      </div>
                    </div>
                  </Link>)}

                {/* Commercial Listings */}
                {commercialListings.map(listing => <Link key={listing.id} to="/commercial-listings" onClick={() => onClose?.()} className="group flex gap-4 p-3 rounded-lg border border-border/30 hover:border-accent/50 hover:bg-accent/5 transition-all duration-200">
                    <div className="w-20 h-16 md:w-24 md:h-18 rounded-md overflow-hidden bg-muted/20 flex-shrink-0">
                      {listing.image_url ? <img src={listing.image_url} alt={listing.property_address} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center">
                          <Store className="h-6 w-6 text-muted-foreground/30" />
                        </div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                            {listing.property_address}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs font-normal px-2 py-0 bg-secondary/50">
                              {listing.listing_type === 'office' ? 'Office' : 'Retail'}
                            </Badge>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm font-medium text-accent">
                          {listing.rent_per_sf ? `$${listing.rent_per_sf}/SF` : formatCurrency(listing.asking_rent)}
                        </span>
                        {listing.neighborhood && <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {listing.neighborhood}
                          </span>}
                      </div>
                    </div>
                  </Link>)}
              </div>
            </ScrollArea>}
        </TabsContent>

        {/* Past Transactions Tab */}
        <TabsContent value="transactions" className="mt-4">
          {transactions.length === 0 ? <div className="text-center py-10 text-muted-foreground">
              <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No transaction history</p>
            </div> : <>
              {/* Stats Summary */}
              <div className="flex items-center gap-6 mb-4 pb-4 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">{totalDeals}</span>
                    <span className="text-muted-foreground ml-1">Deals</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">{formatCurrency(totalVolume)}</span>
                    <span className="text-muted-foreground ml-1">Volume</span>
                  </span>
                </div>
              </div>

              {/* Transaction List */}
              <ScrollArea className="h-[240px] md:h-[280px] pr-4">
                <div className="space-y-3">
                  {sortedTransactions.map(transaction => <div key={transaction.id} className="group p-3 rounded-lg border border-border/30 hover:border-border/60 hover:bg-accent/5 transition-all duration-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{transaction.property_address}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs font-normal px-2 py-0">
                              {transaction.deal_type}
                            </Badge>
                            {transaction.neighborhood && <span className="text-xs text-muted-foreground truncate">
                                {transaction.neighborhood}
                              </span>}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-medium text-accent">
                            {formatTransactionValue(transaction)}
                          </p>
                          {transaction.closing_date && <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(transaction.closing_date).getFullYear()}
                            </p>}
                        </div>
                      </div>
                    </div>)}
                </div>
              </ScrollArea>
            </>}
        </TabsContent>
      </Tabs>
    </div>;
  const handleClose = () => onOpenChange(false);

  // Use Drawer on mobile for better touch UX
  if (isMobile) {
    return <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-5 pb-8 pt-4 max-h-[92vh]">
          <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DrawerClose>
          <ContentComponent onClose={handleClose} />
        </DrawerContent>
      </Drawer>;
  }

  // Use Dialog on desktop
  return <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 transition-all duration-300 ease-out" />
        <DialogPrimitive.Content className={cn("fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]", "w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-xl", "data-[state=open]:animate-in data-[state=closed]:animate-out", "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-100", "data-[state=open]:slide-in-from-bottom-2", "transition-all duration-300 ease-out")}>
          <DialogPrimitive.Close className="absolute right-5 top-5 rounded-sm opacity-70 ring-offset-background transition-all duration-300 ease-out hover:opacity-100 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <ContentComponent onClose={handleClose} />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>;
};