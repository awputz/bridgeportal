import { Link, useLocation } from "react-router-dom";
import { Home, Sparkles, Briefcase, Users, MoreHorizontal, ListTodo, FileText, Calculator, Wrench, FolderOpen, Send, User, Wand2, DollarSign, StickyNote, Building2, Heart, Target, Globe, Headphones, Bell } from "lucide-react";
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
  { path: "/portal/notes", icon: StickyNote, label: "Notes" },
];

const moreItems: { path: string; icon: typeof Home; label: string; group: string }[] = [
  // Company
  { path: "/portal/company/about", icon: Building2, label: "About Us", group: "Company" },
  { path: "/portal/company/mission", icon: Target, label: "Mission", group: "Company" },
  { path: "/portal/company/culture", icon: Heart, label: "Culture", group: "Company" },
  { path: "/portal/company/expansion", icon: Globe, label: "Expansion", group: "Company" },
  { path: "/portal/company/contact", icon: Headphones, label: "Contact", group: "Company" },
  { path: "/portal/directory", icon: Users, label: "Directory", group: "Company" },
  { path: "/portal/announcements", icon: Bell, label: "News", group: "Company" },
  // Tools
  { path: "/portal/ai", icon: Sparkles, label: "AI Assistant", group: "Tools" },
  { path: "/portal/templates", icon: FileText, label: "Templates", group: "Tools" },
  { path: "/portal/generators", icon: Wand2, label: "Generators", group: "Tools" },
  { path: "/portal/calculators", icon: Calculator, label: "Calculators", group: "Tools" },
  { path: "/portal/tools", icon: Wrench, label: "Tools", group: "Tools" },
  // Data
  { path: "/portal/resources", icon: FolderOpen, label: "Resources", group: "Data" },
  { path: "/portal/my-transactions", icon: DollarSign, label: "My Deals", group: "Data" },
  { path: "/portal/requests", icon: Send, label: "Requests", group: "Data" },
  // Account
  { path: "/portal/profile", icon: User, label: "Profile", group: "Account" },
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
          <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-2xl">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-lg font-light">More Pages</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 py-2 pb-6 overflow-y-auto">
              {["Company", "Tools", "Data", "Account"].map((group) => (
                <div key={group}>
                  <p className="text-xs font-medium text-muted-foreground mb-2 px-1">{group}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {moreItems.filter(i => i.group === group).map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMoreOpen(false)}
                          className={cn(
                            "flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-colors min-h-[80px]",
                            active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs font-light text-center leading-tight">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
