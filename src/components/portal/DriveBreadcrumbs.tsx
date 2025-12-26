import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  id: string;
  name: string;
}

interface DriveBreadcrumbsProps {
  path: BreadcrumbItem[];
  onNavigate: (folderId: string | null) => void;
}

export function DriveBreadcrumbs({ path, onNavigate }: DriveBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1 text-sm overflow-x-auto pb-1">
      <button
        onClick={() => onNavigate(null)}
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-md transition-colors shrink-0",
          "hover:bg-muted text-gdrive-folder hover:text-gdrive-folder"
        )}
      >
        <Home className="h-4 w-4" />
        <span>My Drive</span>
      </button>

      {path.map((item, index) => (
        <div key={item.id} className="flex items-center shrink-0">
          <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
          <button
            onClick={() => onNavigate(item.id)}
            className={cn(
              "px-2 py-1 rounded-md transition-colors truncate max-w-[150px]",
              index === path.length - 1
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.name}
          </button>
        </div>
      ))}
    </nav>
  );
}
