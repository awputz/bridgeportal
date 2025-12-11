import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Mail, Phone, Instagram, Linkedin, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  name: string;
  title: string;
  bio?: string;
  email: string;
  phone?: string;
  image: string;
  instagram?: string;
  linkedin?: string;
  license_number?: string;
}

interface TeamMemberDialogProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const generateVCard = (member: TeamMember) => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${member.name}
ORG:Bridge Advisory Group
TITLE:${member.title}
TEL:${member.phone || ''}
EMAIL:${member.email}
${member.linkedin ? `URL:${member.linkedin}\n` : ''}END:VCARD`;

  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${member.name.replace(/\s+/g, '-')}.vcf`;
  link.click();
  URL.revokeObjectURL(url);
};

const contactActions = [
  { icon: Mail, label: "Email", action: (member: TeamMember) => window.location.href = `mailto:${member.email}` },
  { icon: Phone, label: "Phone", action: (member: TeamMember) => member.phone && (window.location.href = `tel:${member.phone}`) },
  { icon: Instagram, label: "Instagram", action: (member: TeamMember) => member.instagram && window.open(member.instagram, '_blank') },
  { icon: Linkedin, label: "LinkedIn", action: (member: TeamMember) => member.linkedin && window.open(member.linkedin, '_blank') },
  { icon: Download, label: "Save", action: (member: TeamMember) => generateVCard(member) },
];

export const TeamMemberDialog = ({ member, open, onOpenChange }: TeamMemberDialogProps) => {
  if (!member) return null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 transition-all duration-300 ease-out" 
        />
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
          <DialogPrimitive.Close 
            className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-all duration-300 ease-out hover:opacity-100 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">{member.name}</h2>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">{member.title}</p>
            {member.license_number && (
              <p className="text-xs text-muted-foreground/70 font-light">
                #{member.license_number}
              </p>
            )}
          </div>

          {/* Bio */}
          {member.bio && (
            <p className="text-base leading-relaxed text-muted-foreground/90 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out delay-75">
              {member.bio}
            </p>
          )}

          {/* Contact Actions */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-6 pt-4">
            {contactActions.map((action, index) => {
              const Icon = action.icon;
              const isDisabled = 
                (action.label === "Phone" && !member.phone) ||
                (action.label === "Instagram" && !member.instagram) ||
                (action.label === "LinkedIn" && !member.linkedin);
              
              return (
                <button
                  key={action.label}
                  onClick={() => !isDisabled && action.action(member)}
                  disabled={isDisabled}
                  className={cn(
                    "flex flex-col items-center gap-3 group transition-all duration-300 ease-out",
                    "animate-in fade-in slide-in-from-bottom-4",
                    isDisabled && "opacity-30 cursor-not-allowed"
                  )}
                  style={{ 
                    animationDuration: "300ms",
                    animationDelay: `${(index + 2) * 40}ms` 
                  }}
                >
                  <div className={cn(
                    "w-20 h-20 rounded-full border-2 border-border/30 flex items-center justify-center",
                    "transition-all duration-300 ease-out",
                    !isDisabled && "group-hover:scale-110 group-hover:bg-accent/10 group-hover:border-accent/50",
                    !isDisabled && "group-active:scale-95"
                  )}>
                    <Icon className={cn(
                      "h-7 w-7 transition-all duration-300 ease-out",
                      !isDisabled && "group-hover:rotate-6"
                    )} />
                  </div>
                  <span className="text-xs uppercase tracking-wide font-light">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
