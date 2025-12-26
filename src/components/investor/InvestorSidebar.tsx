import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Receipt,
  Users,
  DollarSign,
  FileText,
  Building2,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/investor/dashboard", icon: LayoutDashboard },
  { name: "Performance", path: "/investor/performance", icon: BarChart3 },
  { name: "Transactions", path: "/investor/transactions", icon: Receipt },
  { name: "Team", path: "/investor/team", icon: Users },
  { name: "Commissions", path: "/investor/commissions", icon: DollarSign },
  { name: "Reports", path: "/investor/reports", icon: FileText },
];

export const InvestorSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border/50 bg-background/95">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6">
        <img
          src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png"
          alt="Bridge Advisory Group"
          className="h-8 w-auto"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Investor Portal</span>
          <span className="text-xs text-muted-foreground">Read-only access</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sky-400/10 text-sky-400"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* HPG Branding */}
      <div className="border-t border-border/50 p-4">
        <div className="flex items-center justify-center">
          <img
            src="/lovable-uploads/hpg-logo-white.png"
            alt="HPG"
            className="h-10 w-auto opacity-60"
          />
        </div>
      </div>
    </aside>
  );
};
