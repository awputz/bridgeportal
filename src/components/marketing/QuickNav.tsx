import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Wand2,
  FolderKanban,
  Image,
  Palette,
  Upload,
  Mail,
  Calendar,
  History,
} from "lucide-react";

const navItems = [
  { name: "AI Generators", href: "/portal/marketing/generators", icon: Sparkles },
  { name: "AI Staging", href: "/portal/marketing/staging", icon: Wand2 },
  { name: "Projects", href: "/portal/marketing/projects", icon: FolderKanban },
  { name: "Media Library", href: "/portal/marketing/media", icon: Image },
  { name: "Brand Profile", href: "/portal/marketing/brand", icon: Palette },
  { name: "Assets", href: "/portal/marketing/assets", icon: Upload },
  { name: "Email", href: "/portal/marketing/campaigns", icon: Mail },
  { name: "Social", href: "/portal/marketing/social-schedule", icon: Calendar },
  { name: "History", href: "/portal/marketing/history", icon: History },
];

export const QuickNav = () => {
  const location = useLocation();

  return (
    <nav className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
              isActive
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};
