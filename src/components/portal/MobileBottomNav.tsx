import { Link, useLocation } from "react-router-dom";
import { Home, Sparkles, Briefcase, Users, MoreHorizontal, ListTodo, FileText, Calculator, Wrench, FolderOpen, Send, User, BarChart3, Wand2, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { path: "/portal", icon: Home, label: "Home" },
  { path: "/portal/crm", icon: Briefcase, label: "CRM" },
  { path: "/portal/tasks", icon: ListTodo, label: "Tasks" },
  { path: "/portal/directory", icon: Users, label: "Team" },
];

const moreItems = [
  { path: "/portal/ai", icon: Sparkles, label: "AI Assistant" },
  { path: "/portal/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/portal/templates", icon: FileText, label: "Templates" },
  { path: "/portal/generators", icon: Wand2, label: "Generators" },
  { path: "/portal/calculators", icon: Calculator, label: "Calculators" },
  { path: "/portal/tools", icon: Wrench, label: "Tools" },
  { path: "/portal/resources", icon: FolderOpen, label: "Resources" },
  { path: "/portal/requests", icon: Send, label: "Requests" },
  { path: "/portal/my-transactions", icon: DollarSign, label: "My Transactions" },
  { path: "/portal/profile", icon: User, label: "Profile" },
];

export const MobileBottomNav = () => {
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/portal") {
      return location.pathname === "/portal";
    }
    return location.pathname.startsWith(path);
  };

  const isMoreActive = moreItems.some(item => isActive(item.path));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors min-h-[44px]",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-foreground")} />
              <span className="text-[10px] font-light">{item.label}</span>
            </Link>
          );
        })}
        
        {/* More Menu */}
        <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors min-h-[44px]",
                isMoreActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <MoreHorizontal className={cn("h-5 w-5", isMoreActive && "text-foreground")} />
              <span className="text-[10px] font-light">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[70vh] rounded-t-2xl">
            <SheetHeader className="pb-2">
              <SheetTitle className="text-lg font-light">More Pages</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-4 gap-3 py-4">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMoreOpen(false)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-colors min-h-[72px]",
                      active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[11px] font-light text-center leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
