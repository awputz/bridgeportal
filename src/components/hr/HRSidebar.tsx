import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  Mail,
  Calendar,
  FileText,
  BarChart3,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/hr/dashboard", icon: LayoutDashboard },
  { name: "Agent Database", path: "/hr/agents", icon: Users },
  { name: "Pipeline", path: "/hr/pipeline", icon: GitBranch },
  { name: "Outreach", path: "/hr/outreach", icon: Mail },
  { name: "Calendar", path: "/hr/calendar", icon: Calendar },
  { name: "Offers", path: "/hr/offers", icon: FileText },
  { name: "Analytics", path: "/hr/analytics", icon: BarChart3 },
];

export function HRSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border/40 bg-sidebar">
      {/* Logo and branding */}
      <div className="p-6 border-b border-border/40">
        <img 
          src="/lovable-uploads/bridge-careers-logo.png" 
          alt="Bridge Careers" 
          className="h-10 mb-3"
        />
        <div>
          <h2 className="text-lg font-light tracking-tight">HR Portal</h2>
          <p className="text-xs text-muted-foreground">Recruitment hub</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-light transition-colors",
                isActive
                  ? "bg-emerald-400/10 text-emerald-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer branding */}
      <div className="p-4 border-t border-border/40">
        <p className="text-xs text-muted-foreground text-center">
          Powered by BRIDGE
        </p>
      </div>
    </aside>
  );
}
