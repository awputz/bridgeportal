import { Link, useLocation } from "react-router-dom";
import { SERVICE_SUB_PAGES, ServiceKey } from "@/lib/serviceSubPages";
import { cn } from "@/lib/utils";

interface ServicePageNavProps {
  serviceKey: ServiceKey;
}

export const ServicePageNav = ({ serviceKey }: ServicePageNavProps) => {
  const location = useLocation();
  const service = SERVICE_SUB_PAGES[serviceKey];

  if (!service) return null;

  return (
    <nav className="bg-secondary/50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center overflow-x-auto scrollbar-hide py-1">
          {service.pages.map((page) => {
            const isActive = location.pathname === page.path;
            return (
              <Link
                key={page.path}
                to={page.path}
                className={cn(
                  "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {page.name}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
