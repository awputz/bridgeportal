import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Instagram, Linkedin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useContactSheet } from "@/contexts/ContactSheetContext";

interface TeamMember {
  name: string;
  title: string;
  bio?: string;
  image: string;
  instagram?: string;
  linkedin?: string;
}

interface TeamMemberDialogProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TeamMemberDialog = ({ member, open, onOpenChange }: TeamMemberDialogProps) => {
  const { openContactSheet } = useContactSheet();

  if (!member) return null;

  const handleContact = () => {
    onOpenChange(false);
    openContactSheet();
  };

  const socialActions = [
    { icon: Instagram, label: "Instagram", url: member.instagram },
    { icon: Linkedin, label: "LinkedIn", url: member.linkedin },
  ].filter(action => action.url);

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
          </div>

          {/* Bio */}
          {member.bio && (
            <p className="text-base leading-relaxed text-muted-foreground/90 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out delay-75">
              {member.bio}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out delay-100">
            <Button onClick={handleContact} className="font-light">
              Contact {member.name.split(' ')[0]}
            </Button>
            
            {socialActions.map((action) => {
              const Icon = action.icon;
              return (
                <a
                  key={action.label}
                  href={action.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/30 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-light">{action.label}</span>
                </a>
              );
            })}
          </div>
        </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
