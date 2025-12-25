import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  name: string;
  description?: string;
  icon: LucideIcon;
  url: string;
  className?: string;
}

export const QuickActionCard = ({ 
  name, 
  description, 
  icon: Icon, 
  url,
  className 
}: QuickActionCardProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group glass-card p-6 flex flex-col items-center justify-center text-center",
        "min-h-[140px] md:min-h-[160px]",
        "hover:border-white/20 transition-all duration-300",
        className
      )}
    >
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
        <Icon className="h-6 w-6 md:h-7 md:w-7 text-foreground/70 group-hover:text-foreground transition-colors" />
      </div>
      <h3 className="text-sm md:text-base font-light text-foreground mb-1">
        {name}
      </h3>
      {description && (
        <p className="text-xs text-muted-foreground font-light">
          {description}
        </p>
      )}
    </a>
  );
};
