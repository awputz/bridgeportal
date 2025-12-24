import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Instagram, Linkedin, X, Mail, Phone, MessageCircle, Building2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";

interface TeamMember {
  name: string;
  title: string;
  bio?: string;
  image: string;
  instagram?: string;
  linkedin?: string;
  email?: string;
  phone?: string;
  category?: string;
}

interface TeamMemberDialogProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

// Get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const TeamMemberDialog = ({
  member,
  open,
  onOpenChange
}: TeamMemberDialogProps) => {
  const isMobile = useIsMobile();
  
  // Fetch transactions for this team member
  const { data: transactions = [] } = useQuery({
    queryKey: ['member-transactions', member?.name],
    queryFn: async () => {
      if (!member?.name) return [];
      
      // Get first and last name for matching
      const nameParts = member.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .or(`agent_name.ilike.%${firstName}%${lastName}%,agent_name.ilike.%${lastName}%`)
        .order('closing_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: open && !!member?.name,
  });

  if (!member) return null;

  // Calculate stats
  const totalDeals = transactions.length;
  const totalVolume = transactions.reduce((sum, t) => {
    return sum + (t.sale_price || t.total_lease_value || 0);
  }, 0);

  // Build contact actions array
  const contactActions = [
    member.email && {
      icon: Mail,
      label: "Email",
      url: `mailto:${member.email}`
    },
    member.phone && {
      icon: Phone,
      label: "Call",
      url: `tel:${member.phone}`
    },
    member.phone && {
      icon: MessageCircle,
      label: "WhatsApp",
      url: `https://wa.me/${formatPhoneForWhatsApp(member.phone)}`
    },
  ].filter(Boolean) as {
    icon: typeof Mail;
    label: string;
    url: string;
  }[];

  const socialLinks = [
    member.linkedin && {
      icon: Linkedin,
      label: "LinkedIn",
      url: member.linkedin
    },
    member.instagram && {
      icon: Instagram,
      label: "Instagram",
      url: member.instagram
    }
  ].filter(Boolean) as {
    icon: typeof Linkedin;
    label: string;
    url: string;
  }[];

  const ContentComponent = () => (
    <div className="space-y-6">
      {/* Header with Photo */}
      <div className="flex items-start gap-5 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out">
        <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-2 ring-accent/30 ring-offset-2 ring-offset-background flex-shrink-0">
          <AvatarImage src={member.image} alt={member.name} className="object-cover" />
          <AvatarFallback className="text-lg md:text-xl font-light bg-accent/10">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0 pt-1">
          <h2 className="text-xl md:text-2xl font-light tracking-tight truncate">{member.name}</h2>
          <p className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mt-1">{member.title}</p>
          {member.category && (
            <Badge variant="secondary" className="mt-2 text-xs font-normal">
              {member.category}
            </Badge>
          )}
        </div>
      </div>

      {/* Bio */}
      {member.bio && (
        <p className="text-sm leading-relaxed text-muted-foreground/90 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out delay-75">
          {member.bio}
        </p>
      )}

      {/* Contact Actions */}
      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out delay-100">
        <div className="flex flex-wrap items-center gap-2">
          {contactActions.map(action => {
            const Icon = action.icon;
            return (
              <a
                key={action.label}
                href={action.url}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/40 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95"
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-light">{action.label}</span>
              </a>
            );
          })}
        </div>
        
        {socialLinks.length > 0 && (
          <div className="flex items-center gap-2">
            {socialLinks.map(link => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded-full border border-border/40 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 touch-manipulation active:scale-95"
                  aria-label={link.label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out delay-150">
          <Separator className="mb-5" />
          
          {/* Stats Summary */}
          <div className="flex items-center gap-6 mb-4">
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
          <ScrollArea className="h-[200px] md:h-[240px] pr-4">
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="group p-3 rounded-lg border border-border/30 hover:border-border/60 hover:bg-accent/5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{transaction.property_address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs font-normal px-2 py-0">
                          {transaction.deal_type}
                        </Badge>
                        {transaction.neighborhood && (
                          <span className="text-xs text-muted-foreground truncate">
                            {transaction.neighborhood}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium text-accent">
                        {formatCurrency(transaction.sale_price || transaction.total_lease_value)}
                      </p>
                      {transaction.closing_date && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(transaction.closing_date).getFullYear()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );

  // Use Drawer on mobile for better touch UX
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-6 pb-8 pt-4 max-h-[90vh]">
          <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DrawerClose>
          <ContentComponent />
        </DrawerContent>
      </Drawer>
    );
  }

  // Use Dialog on desktop
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 transition-all duration-300 ease-out" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
            "w-full max-w-lg p-8 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-100",
            "data-[state=open]:slide-in-from-bottom-2",
            "transition-all duration-300 ease-out"
          )}
        >
          <DialogPrimitive.Close className="absolute right-5 top-5 rounded-sm opacity-70 ring-offset-background transition-all duration-300 ease-out hover:opacity-100 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <ContentComponent />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
