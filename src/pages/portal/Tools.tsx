import { 
  Mail, 
  Users, 
  Calendar, 
  HardDrive, 
  MessageSquare, 
  Search,
  TrendingUp,
  Building2,
  Home,
  ExternalLink
} from "lucide-react";
import { useExternalTools } from "@/hooks/useExternalTools";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Icon mapping for dynamic icons from database
const iconMap: Record<string, typeof Mail> = {
  Mail,
  Users,
  Calendar,
  HardDrive,
  MessageSquare,
  Search,
  TrendingUp,
  Building2,
  Home,
};

const Tools = () => {
  const { data: tools, isLoading } = useExternalTools();

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
            Tools
          </h1>
          <p className="text-muted-foreground font-light">
            Quick access to all your essential tools
          </p>
        </div>

        {/* Tools Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[180px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools?.map((tool) => {
              const Icon = iconMap[tool.icon] || Mail;
              return (
                <a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group glass-card p-6 flex flex-col",
                    "hover:border-white/20 transition-all duration-300"
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <Icon className="h-6 w-6 text-foreground/70 group-hover:text-foreground transition-colors" />
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                  </div>
                  
                  <h3 className="text-lg font-light text-foreground mb-2">
                    {tool.name}
                  </h3>
                  
                  {tool.description && (
                    <p className="text-sm text-muted-foreground font-light flex-1">
                      {tool.description}
                    </p>
                  )}
                  
                  <p className="text-xs text-muted-foreground/50 font-light mt-4 truncate">
                    {tool.url.replace(/^https?:\/\//, '')}
                  </p>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tools;
