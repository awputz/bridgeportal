import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
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
  const isInternal = url.startsWith('/');
  
  const cardContent = (
    <>
      <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors">
        <Icon className="h-5 w-5 md:h-5 md:w-5 text-foreground/70 group-hover:text-foreground transition-colors" />
      </div>
      <h3 className="text-sm font-light text-foreground mb-1">
        {name}
      </h3>
      {description && (
        <p className="text-xs text-muted-foreground font-light line-clamp-2 mb-0">
          {description}
        </p>
      )}
    </>
  );

  const cardClasses = cn(
    "group glass-card p-4 flex flex-col items-center justify-center text-center",
    "min-h-[120px] md:min-h-[130px]",
    "hover:border-white/20 transition-all duration-300",
    className
  );

  if (isInternal) {
    return (
      <Link to={url} className={cardClasses}>
        {cardContent}
      </Link>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClasses}
    >
      {cardContent}
    </a>
  );
};
