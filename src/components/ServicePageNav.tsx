import { Link, useLocation } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { SERVICE_SUB_PAGES, ServiceKey } from "@/lib/serviceSubPages";
import { cn } from "@/lib/utils";
import { SwipeHint } from "@/components/SwipeHint";

interface ServicePageNavProps {
  serviceKey: ServiceKey;
}

export const ServicePageNav = ({ serviceKey }: ServicePageNavProps) => {
  const location = useLocation();
  const service = SERVICE_SUB_PAGES[serviceKey];

  if (!service) return null;

  return (
    <nav className="bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8">
        <div className="relative">
          {/* Scroll fade indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[hsl(30,8%,10%)] to-transparent z-10 pointer-events-none sm:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-[hsl(30,8%,10%)] to-transparent z-10 pointer-events-none sm:hidden" />
          <div className="flex items-center overflow-x-auto scrollbar-hide py-1 px-4 sm:px-0">
            {service.pages.map((page) => {
              const isActive = location.pathname === page.path;
              const isExternal = 'external' in page && page.external;
              
              if (isExternal) {
                return (
                  <a
                    key={page.path}
                    href={page.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "px-3 sm:px-4 py-3 sm:py-3.5 md:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors relative min-h-[44px] md:min-h-[44px] flex items-center gap-1.5 touch-manipulation",
                      "text-muted-foreground hover:text-foreground active:text-foreground"
                    )}
                  >
                    {page.name}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                );
              }
              
              return (
                <Link
                  key={page.path}
                  to={page.path}
                  className={cn(
                    "px-3 sm:px-4 py-3 sm:py-3.5 md:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors relative min-h-[44px] md:min-h-[44px] flex items-center touch-manipulation",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground active:text-foreground"
                  )}
                >
                  {page.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 sm:left-4 sm:right-4 h-0.5 bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
          <SwipeHint 
            text="Swipe for more options" 
            storageKey={`service-nav-${serviceKey}`}
            className="sm:hidden"
          />
        </div>
      </div>
    </nav>
  );
};
