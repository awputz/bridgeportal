import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, LogOut, Menu, X, Bell } from "lucide-react";
import { PoweredByBoss } from "@/components/PoweredByBoss";
import { toast } from "@/hooks/use-toast";
import { InvestorSidebar } from "./InvestorSidebar";
import { cn } from "@/lib/utils";
import { usePendingCounts } from "@/hooks/usePendingCounts";
import { useInvestorRealtime } from "@/hooks/useInvestorRealtime";
import {
  LayoutDashboard,
  BarChart3,
  Receipt,
  Users,
  DollarSign,
  FileText,
  Building2,
  FileQuestion,
  Wallet,
} from "lucide-react";

const mobileNavItems = [
  { name: "Dashboard", path: "/investor/dashboard", icon: LayoutDashboard },
  { name: "Performance", path: "/investor/performance", icon: BarChart3 },
  { name: "Transactions", path: "/investor/transactions", icon: Receipt },
  { name: "Team", path: "/investor/team", icon: Users },
  { name: "Commissions", path: "/investor/commissions", icon: DollarSign },
  { name: "Reports", path: "/investor/reports", icon: FileText },
  { name: "Listings", path: "/investor/listings", icon: Building2 },
  { name: "Agent Requests", path: "/investor/agent-requests", icon: FileQuestion },
  { name: "Commission Requests", path: "/investor/commission-requests", icon: Wallet },
];

export const InvestorLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Enable realtime subscriptions for auto-refresh
  useInvestorRealtime();
  
  // Get pending counts for notification badge
  const { data: pendingCounts } = usePendingCounts();
  const totalPending = (pendingCounts?.agentRequests || 0) + (pendingCounts?.commissionRequests || 0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/investor-login", { replace: true });
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "investor")
        .maybeSingle();

      if (!roleData) {
        toast({
          title: "Access Denied",
          description: "You don't have access to the investor portal.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        navigate("/login", { replace: true });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .maybeSingle();

      setUserName(profile?.full_name || session.user.email || "Investor");
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/investor-login", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/investor-login", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <InvestorSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur safe-area-top">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" alt="Bridge" className="h-7" />
              <span className="text-sm font-medium">Investor Portal</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Notification Badge */}
              <Link to="/investor/agent-requests" className="relative">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bell className="h-4 w-4" />
                  {totalPending > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] flex items-center justify-center"
                    >
                      {totalPending > 99 ? "99+" : totalPending}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="border-t border-border/50 p-2 bg-background">
              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                      isActive ? "bg-sky-400/10 text-sky-400" : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          )}
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex sticky top-0 z-40 h-16 items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur px-6">
          <div className="text-sm text-muted-foreground">Welcome, <span className="text-foreground font-medium">{userName}</span></div>
          <div className="flex items-center gap-3">
            {/* Notification Badge */}
            <Link to="/investor/agent-requests" className="relative">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Bell className="h-4 w-4" />
                {totalPending > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] flex items-center justify-center"
                  >
                    {totalPending > 99 ? "99+" : totalPending}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 py-4 px-6 pb-safe">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>Bridge Advisory Group © {new Date().getFullYear()}</span>
            <span>•</span>
            <PoweredByBoss size="sm" />
          </div>
        </footer>
      </div>
    </div>
  );
};
