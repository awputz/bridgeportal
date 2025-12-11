import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "@/lib/constants";

export const ServicesSubNav = () => {
  const location = useLocation();

  return (
    <section className="py-4 border-b border-white/5 bg-white/[0.02] sticky top-24 md:top-28 z-40 backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {NAV_ITEMS.services.items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-light whitespace-nowrap rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
};
