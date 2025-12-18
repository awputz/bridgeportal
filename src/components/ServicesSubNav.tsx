import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "@/lib/constants";

export const ServicesSubNav = () => {
  const location = useLocation();

  return (
    <section className="py-2 sm:py-3 md:py-4 border-b border-white/5 bg-white/[0.02] sticky top-[calc(4rem+0.75rem)] sm:top-[calc(4.5rem+0.75rem)] md:top-[calc(5rem+1rem)] lg:top-[calc(4.5rem+1.5rem)] z-40 backdrop-blur-xl">
      <div className="container mx-auto px-0 sm:px-4 md:px-6">
        <div className="relative">
          {/* Scroll fade indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none sm:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none sm:hidden" />
          <nav className="flex items-center gap-1 sm:gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-0">
            {NAV_ITEMS.services.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-2 text-xs sm:text-sm font-light whitespace-nowrap rounded-full transition-all duration-300 min-h-[40px] sm:min-h-[44px] flex items-center touch-manipulation ${
                    isActive
                      ? "bg-white/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5 active:bg-white/10"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
};
