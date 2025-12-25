import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PortalNavigation } from "./PortalNavigation";
import { MobileBottomNav } from "./MobileBottomNav";
import { AIAssistant } from "./AIAssistant";
import { CommandPalette, useCommandPalette } from "./CommandPalette";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Loader2 } from "lucide-react";

export const PortalLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { open: commandOpen, setOpen: setCommandOpen } = useCommandPalette();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        setIsLoading(false);
        
        if (!session && location.pathname.startsWith('/portal')) {
          navigate('/login', { replace: true });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
      
      if (!session && location.pathname.startsWith('/portal')) {
        navigate('/login', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
          <p className="text-sm text-muted-foreground font-light">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <PortalNavigation />
      <main className="pt-16 md:pt-20">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <MobileBottomNav />
      <AIAssistant />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
};
