import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Instagram, Linkedin, X, Mail, Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContactSheet } from "@/contexts/ContactSheetContext";
import { useIsMobile } from "@/hooks/use-mobile";
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
}

interface TeamMemberDialogProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Format phone number for WhatsApp (remove non-digits, ensure country code)
const formatPhoneForWhatsApp = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  // If starts with 1, assume US number, otherwise add 1
  return digits.startsWith('1') ? digits : `1${digits}`;
};

export const TeamMemberDialog = ({
  member,
  open,
  onOpenChange
}: TeamMemberDialogProps) => {
  const { openContactSheet } = useContactSheet();
  const isMobile = useIsMobile();
  
  if (!member) return null;

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
    icon: typeof Mail;
    label: string;
    url: string;
  }[];

  const ContentComponent = () => (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight">{member.name}</h2>
        <p className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground">{member.title}</p>
      </div>

      {/* Bio */}
      {member.bio && (
        <p className="text-sm md:text-base leading-relaxed text-muted-foreground/90 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out delay-75">
          {member.bio}
        </p>
      )}

      {/* Contact Actions */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-2 md:pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out delay-100">
        {contactActions.map(action => {
          const Icon = action.icon;
          const isExternal = action.url.startsWith('http');
          return (
            <a
              key={action.label}
              href={action.url}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-2 rounded-lg border border-border/30 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95"
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-light">{action.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );

  // Use Drawer on mobile for better touch UX
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-6 pb-8 pt-4 max-h-[85vh]">
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
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 transition-all duration-300 ease-out" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
            "w-full max-w-2xl p-8 md:p-12 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-100",
            "data-[state=open]:slide-in-from-bottom-2",
            "transition-all duration-300 ease-out"
          )}
        >
          <DialogPrimitive.Close className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-all duration-300 ease-out hover:opacity-100 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <ContentComponent />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
