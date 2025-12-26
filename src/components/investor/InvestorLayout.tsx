import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, LayoutDashboard, Briefcase } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const InvestorLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/investor-login", { replace: true });
        return;
      }

      // Verify investor role
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

      // Get user profile
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-4">
              <Link to="/investor/dashboard" className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" 
                  alt="Bridge Advisory Group" 
                  className="h-8 w-auto"
                />
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">Investor Portal</span>
                  <span className="text-muted-foreground/50">|</span>
                  <img 
                    src="/lovable-uploads/hpg-logo-white.png" 
                    alt="HPG" 
                    className="h-5 w-auto"
                  />
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              <Link to="/investor/dashboard">
                <Button 
                  variant={location.pathname === "/investor/dashboard" ? "secondary" : "ghost"} 
                  size="sm" 
                  className="gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-sky-400" />
                <span className="text-muted-foreground">{userName}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-auto pb-safe">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Bridge Advisory Group © {new Date().getFullYear()}</span>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <span>Investor Portal</span>
            <img 
              src="/lovable-uploads/hpg-logo-white.png" 
              alt="HPG" 
              className="h-4 w-auto"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};
