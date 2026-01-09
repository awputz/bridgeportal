import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { HRSidebar } from "./HRSidebar";
import { NotificationCenter } from "./NotificationCenter";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  LogOut, 
  Loader2,
  LayoutDashboard,
  Users,
  GitBranch,
  Mail,
  FileText,
  BarChart3,
  Settings,
  ClipboardList,
  CalendarCheck,
  FileSignature,
  TrendingUp,
  FileDown,
  PieChart,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Section-based mobile navigation matching sidebar
const mobileNavSections = [
  {
    title: "Recruitment",
    items: [
      { name: "Dashboard", path: "/hr/dashboard", icon: LayoutDashboard },
      { name: "Applications", path: "/hr/applications", icon: ClipboardList },
      { name: "Agent Database", path: "/hr/agents", icon: Users },
      { name: "Pipeline", path: "/hr/pipeline", icon: GitBranch },
      { name: "Outreach", path: "/hr/outreach", icon: Mail },
      { name: "Interviews", path: "/hr/interviews", icon: CalendarCheck },
      { name: "Offers", path: "/hr/offers", icon: FileText },
      { name: "Contracts", path: "/hr/contracts", icon: FileSignature },
    ],
  },
  {
    title: "Team",
    items: [
      { name: "Active Agents", path: "/hr/active-agents", icon: UserCheck },
      { name: "Performance", path: "/hr/performance", icon: TrendingUp },
    ],
  },
  {
    title: "Analytics",
    items: [
      { name: "Reports", path: "/hr/reports", icon: FileDown },
      { name: "Executive Summary", path: "/hr/executive-summary", icon: PieChart },
      { name: "Analytics", path: "/hr/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Settings", path: "/hr/settings", icon: Settings },
    ],
  },
];

export function HRLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/hr/signin", { replace: true });
          return;
        }

        // Check for admin role (admins have HR access)
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (!roleData) {
          await supabase.auth.signOut();
          navigate("/hr/signin", { replace: true });
          return;
        }

        // Get user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();

        setUserName(profile?.full_name || user.email?.split("@")[0] || "HR Admin");
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/hr/signin", { replace: true });
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/hr/signin", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/hr/signin", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <HRSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/bridge-careers-logo.png" 
              alt="Bridge Careers" 
              className="h-8"
            />
            <span className="text-sm font-light">HR Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        {/* Mobile navigation drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[65px] z-30 bg-background/95 backdrop-blur-sm overflow-y-auto pb-20">
            <nav className="p-4 space-y-6">
              {mobileNavSections.map((section) => (
                <div key={section.title}>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider px-4 mb-2">
                    {section.title}
                  </p>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-light transition-colors",
                            isActive
                              ? "bg-emerald-400/10 text-emerald-400"
                              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-border/40">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-light text-destructive hover:bg-destructive/10 transition-colors w-full"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Desktop header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-border/40">
          <div>
            <h1 className="text-lg font-extralight">Welcome, {userName}</h1>
            <p className="text-xs text-muted-foreground">Bridge Careers HR Portal</p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="hidden lg:block px-8 py-4 border-t border-border/40">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} BRIDGE. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
