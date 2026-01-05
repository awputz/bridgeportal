import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Sparkles, 
  Briefcase, 
  Users, 
  MoreHorizontal, 
  ListTodo, 
  FileText, 
  Calculator, 
  Wrench, 
  FolderOpen, 
  Send, 
  User, 
  Wand2, 
  DollarSign, 
  StickyNote, 
  Building2, 
  Heart, 
  Target, 
  Globe, 
  Headphones, 
  Bell, 
  Mail 
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navItems = [
  { path: "/portal", icon: Home, label: "Home", external: false },
  { path: "https://mail.google.com", icon: Mail, label: "Mail", external: true },
  { path: "/portal/crm", icon: Briefcase, label: "CRM", external: false },
  { path: "/portal/tasks", icon: ListTodo, label: "Tasks", external: false },
];

const moreItemsGrouped = [
  {
    category: "Google",
    items: [
      { path: "/portal/contacts", icon: Users, label: "Contacts" },
      { path: "/portal/drive", icon: FolderOpen, label: "Drive" },
    ],
  },
  {
    category: "Essentials",
    items: [
      { path: "/portal/notes", icon: StickyNote, label: "Notes" },
    ],
  },
  {
    category: "Tools",
    items: [
      { path: "/portal/ai", icon: Sparkles, label: "AI Assistant" },
      { path: "/portal/templates", icon: FileText, label: "Templates" },
      { path: "/portal/generators", icon: Wand2, label: "Generators" },
      { path: "/portal/calculators", icon: Calculator, label: "Calculators" },
      { path: "/portal/tools", icon: Wrench, label: "Tools" },
    ],
  },
  {
    category: "Company",
    items: [
      { path: "/portal/company/about", icon: Building2, label: "About Us" },
      { path: "/portal/company/mission", icon: Target, label: "Mission" },
      { path: "/portal/company/culture", icon: Heart, label: "Culture" },
      { path: "/portal/company/expansion", icon: Globe, label: "Expansion" },
      { path: "/portal/company/contact", icon: Headphones, label: "Contact" },
      { path: "/portal/directory", icon: Users, label: "Directory" },
      { path: "/portal/announcements", icon: Bell, label: "News" },
    ],
  },
  {
    category: "Data",
    items: [
      { path: "/portal/resources", icon: FolderOpen, label: "Resources" },
      { path: "/portal/my-transactions", icon: DollarSign, label: "My Deals" },
      { path: "/portal/my-commissions", icon: DollarSign, label: "Earnings" },
      { path: "/portal/requests", icon: Send, label: "Requests" },
    ],
  },
  {
    category: "Account",
    items: [
      { path: "/portal/profile", icon: User, label: "Profile" },
    ],
  },
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-nav rounded-t-2xl safe-bottom">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = !item.external && isActive(item.path);
          
          if (item.external) {
            return (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-300 min-w-[60px] active:scale-95 text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </a>
            );
          }
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-300 min-w-[60px] active:scale-95",
                active
                  ? "text-foreground bg-white/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform duration-300", active && "scale-110")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        <Sheet>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-300 min-w-[60px] text-muted-foreground hover:text-foreground hover:bg-white/5 active:scale-95">
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="glass-panel-strong rounded-t-3xl pb-safe max-h-[85vh] overflow-y-auto">
            <SheetHeader className="text-left pb-4">
              <SheetTitle className="text-foreground font-light text-lg">More Options</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 pb-8">
              {moreItemsGrouped.map((group) => (
                <div key={group.category}>
                  <h3 className="text-xs uppercase text-muted-foreground font-medium tracking-wider mb-3 px-1">
                    {group.category}
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      return (
                        <SheetClose asChild key={item.path}>
                          <Link
                            to={item.path}
                            className={cn(
                              "flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all duration-300 active:scale-95",
                              active ? "bg-white/10 text-foreground" : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", active ? "bg-primary/20" : "bg-white/5")}>
                              <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-foreground/60")} />
                            </div>
                            <span className="text-[10px] font-medium text-center">{item.label}</span>
                          </Link>
                        </SheetClose>
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
