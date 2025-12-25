import { Link, useLocation } from "react-router-dom";
import { Home, FileText, Sparkles, Wrench, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/portal", icon: Home, label: "Home" },
  { path: "/portal/templates", icon: FileText, label: "Templates" },
  { path: "/portal/ai", icon: Sparkles, label: "AI" },
  { path: "/portal/calculators", icon: Wrench, label: "Tools" },
  { path: "/portal/directory", icon: Users, label: "Directory" },
];

export const MobileBottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/portal") {
      return location.pathname === "/portal";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/80 backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-foreground")} />
              <span className="text-[10px] font-light">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
