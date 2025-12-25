import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingSearchProps {
  onClick: () => void;
}

export const FloatingSearch = ({ onClick }: FloatingSearchProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-24 right-6 z-40",
        "hidden md:flex items-center gap-2",
        "px-4 py-2.5 rounded-full",
        "bg-background/80 backdrop-blur-xl",
        "border border-border/50",
        "shadow-lg shadow-black/5",
        "text-muted-foreground text-sm",
        "hover:bg-accent hover:text-foreground hover:border-border",
        "hover:shadow-xl hover:shadow-primary/5",
        "transition-all duration-200 ease-out",
        "group cursor-pointer"
      )}
    >
      <Search className="h-4 w-4 group-hover:text-primary transition-colors" />
      <span className="font-medium">Search</span>
      <kbd className={cn(
        "ml-1 px-1.5 py-0.5 rounded text-xs",
        "bg-muted/80 text-muted-foreground",
        "border border-border/50",
        "group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20",
        "transition-colors"
      )}>
        ⌘K
      </kbd>
    </button>
  );
};
