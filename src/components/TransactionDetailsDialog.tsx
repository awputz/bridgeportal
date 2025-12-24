import * as DialogPrimitive from "@radix-ui/react-dialog";
import { 
  X, Building2, MapPin, DollarSign, Calendar, Ruler, 
  TrendingUp, Layers, Briefcase, Home, Landmark, MessageSquare,
  User, FileText, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { Transaction } from "@/hooks/useTransactions";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import { useIsMobile } from "@/hooks/use-mobile";
import { AgentContactCard } from "@/components/AgentContactCard";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";

interface TransactionDetailsDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Format functions
const formatCurrency = (value: number | null) => {
  if (!value) return null;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
};

const formatExactCurrency = (value: number | null) => {
  if (!value) return null;
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", { 
    month: "short", 
    year: "numeric" 
  });
};

const formatFullDate = (dateStr: string | null) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", { 
    month: "long", 
    day: "numeric",
    year: "numeric" 
  });
};

const formatRole = (role: string | null): string | null => {
  if (!role) return null;
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const getPlaceholderImage = (assetType: string | null) => {
  const type = assetType?.toLowerCase() || "";
  if (type.includes("retail")) return PLACEHOLDER_IMAGES.retail.storefront;
  if (type.includes("office")) return PLACEHOLDER_IMAGES.building.exterior;
  if (type.includes("multifamily") || type.includes("residential")) return PLACEHOLDER_IMAGES.building.residential;
  return PLACEHOLDER_IMAGES.building.glass;
};

const getDivisionIcon = (division: string | null) => {
  switch (division) {
    case "Residential": return Home;
    case "Commercial": return Briefcase;
    case "Investment Sales": return TrendingUp;
    case "Capital Advisory": return Landmark;
    default: return Building2;
  }
};

const getDivisionColor = (division: string | null) => {
  switch (division) {
    case "Residential": return "bg-emerald-500/90";
    case "Commercial": return "bg-blue-500/90";
    case "Investment Sales": return "bg-amber-500/90";
    case "Capital Advisory": return "bg-purple-500/90";
    default: return "bg-primary/90";
  }
};

// Shared content component
const TransactionContent = ({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) => {
  const { openContactSheet } = useContactSheet();
  const DivisionIcon = getDivisionIcon(transaction.division);

  const handleContact = () => {
    onClose();
    openContactSheet();
  };

  // Determine primary value to display based on division
  const getPrimaryValue = () => {
    if (transaction.division === 'Residential' || transaction.division === 'Commercial') {
      if (transaction.monthly_rent) {
        return {
          label: "Monthly Rent",
          value: `${formatExactCurrency(transaction.monthly_rent)}/mo`,
          icon: DollarSign
        };
      }
    }
    if (transaction.sale_price) {
      return {
        label: transaction.division === 'Capital Advisory' ? "Loan Amount" : "Sale Price",
        value: formatExactCurrency(transaction.sale_price),
        icon: DollarSign
      };
    }
    if (transaction.total_lease_value) {
      return {
        label: "Total Lease Value",
        value: formatCurrency(transaction.total_lease_value),
        icon: DollarSign
      };
    }
    return null;
  };

  const primaryValue = getPrimaryValue();

  // Build metrics array
  const metrics: { label: string; value: string; icon: typeof Building2 }[] = [];
  
  if (primaryValue) {
    metrics.push(primaryValue);
  }

  if (transaction.gross_square_feet) {
    metrics.push({
      label: "Size",
      value: `${transaction.gross_square_feet.toLocaleString()} SF`,
      icon: Ruler
    });
  }

  if (transaction.units) {
    metrics.push({
      label: "Units",
      value: transaction.units.toString(),
      icon: Layers
    });
  }

  if (transaction.closing_date) {
    metrics.push({
      label: "Closed",
      value: formatDate(transaction.closing_date) || "",
      icon: Calendar
    });
  }

  if (transaction.price_per_sf) {
    metrics.push({
      label: "Price/SF",
      value: `$${transaction.price_per_sf.toLocaleString()}`,
      icon: TrendingUp
    });
  }

  if (transaction.price_per_unit) {
    metrics.push({
      label: "Price/Unit",
      value: formatCurrency(transaction.price_per_unit) || "",
      icon: Home
    });
  }

  if (transaction.lease_term_months) {
    metrics.push({
      label: "Lease Term",
      value: `${transaction.lease_term_months} months`,
      icon: Clock
    });
  }

  if (transaction.role) {
    metrics.push({
      label: "Role",
      value: formatRole(transaction.role) || transaction.role,
      icon: User
    });
  }

  return (
    <div className="flex flex-col">
      {/* Hero Image with Overlay */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden">
        <img
          src={transaction.image_url || getPlaceholderImage(transaction.asset_type)}
          alt={transaction.property_address}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* Division Badge */}
        <Badge className={cn(
          "absolute top-4 left-4 text-white border-0 shadow-lg",
          getDivisionColor(transaction.division)
        )}>
          <DivisionIcon className="w-3 h-3 mr-1.5" />
          {transaction.division || transaction.deal_type}
        </Badge>

        {/* Asset Type Badge */}
        {transaction.asset_type && (
          <Badge 
            variant="secondary" 
            className="absolute top-4 left-auto right-14 bg-background/80 backdrop-blur-sm border-0"
          >
            {transaction.asset_type}
          </Badge>
        )}

        {/* Address on image (mobile only) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:hidden">
          <h2 className="text-lg font-semibold text-white drop-shadow-lg line-clamp-2">
            {transaction.property_address}
          </h2>
          {(transaction.neighborhood || transaction.borough) && (
            <p className="text-sm text-white/80 flex items-center gap-1 mt-1 drop-shadow-md">
              <MapPin className="w-3 h-3" />
              {[transaction.neighborhood, transaction.borough].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-5">
        {/* Header (desktop only - mobile shows on image) */}
        <div className="hidden sm:block space-y-1">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
            {transaction.property_address}
          </h2>
          {(transaction.neighborhood || transaction.borough) && (
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {[transaction.neighborhood, transaction.borough].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        {/* Deal Type Badge (if different from division) */}
        {transaction.deal_type && transaction.division !== transaction.deal_type && (
          <div className="sm:hidden">
            <Badge variant="outline" className="text-xs">
              {transaction.deal_type}
            </Badge>
          </div>
        )}

        {/* Key Metrics Grid */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {metrics.slice(0, 6).map((metric, index) => {
              const Icon = metric.icon;
              const isPrimary = index === 0;
              return (
                <div 
                  key={metric.label}
                  className={cn(
                    "p-3 sm:p-4 rounded-xl border transition-colors",
                    isPrimary 
                      ? "bg-primary/5 border-primary/20 col-span-2 sm:col-span-1" 
                      : "bg-muted/30 border-border/30"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={cn(
                      "w-3.5 h-3.5",
                      isPrimary ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                  </div>
                  <p className={cn(
                    "font-semibold truncate",
                    isPrimary ? "text-lg sm:text-xl text-primary" : "text-base text-foreground"
                  )}>
                    {metric.value}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Additional Metrics (if more than 6) */}
        {metrics.length > 6 && (
          <div className="grid grid-cols-2 gap-2">
            {metrics.slice(6).map((metric) => {
              const Icon = metric.icon;
              return (
                <div 
                  key={metric.label}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/20"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                  </div>
                  <span className="text-sm font-medium">{metric.value}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Notes */}
        {transaction.notes && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="w-3.5 h-3.5" />
              <span>Deal Highlights</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground bg-muted/20 p-3 rounded-lg">
              {transaction.notes}
            </p>
          </div>
        )}

        {/* Agent Contact */}
        {transaction.agent_name && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              <span>Represented By</span>
            </div>
            <AgentContactCard agentName={transaction.agent_name} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Button
            size="lg"
            className="w-full"
            onClick={handleContact}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact About Similar Deals
          </Button>
        </div>
      </div>
    </div>
  );
};

export const TransactionDetailsDialog = ({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsDialogProps) => {
  const isMobile = useIsMobile();

  if (!transaction) return null;

  const handleClose = () => onOpenChange(false);

  // Mobile: Use Drawer that slides from bottom
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh] outline-none">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-50 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors shadow-lg"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="overflow-y-auto overscroll-contain">
            <TransactionContent transaction={transaction} onClose={handleClose} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Use Dialog
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
            "w-full max-w-2xl max-h-[90vh] overflow-hidden",
            "bg-background border border-border/50 shadow-2xl rounded-2xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "duration-200"
          )}
        >
          {/* Close button */}
          <DialogPrimitive.Close className="absolute right-4 top-4 z-50 rounded-full p-2 bg-background/80 backdrop-blur-sm opacity-70 hover:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-ring shadow-lg">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <div className="overflow-y-auto max-h-[90vh]">
            <TransactionContent transaction={transaction} onClose={handleClose} />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
