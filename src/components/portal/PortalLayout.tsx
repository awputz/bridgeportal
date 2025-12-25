import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { PortalNavigation } from "./PortalNavigation";
import { MobileBottomNav } from "./MobileBottomNav";
import { AIAssistant } from "./AIAssistant";
import { FloatingSearch } from "./FloatingSearch";
import { CommandPalette, useCommandPalette } from "./CommandPalette";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Loader2 } from "lucide-react";
import { useStoreGoogleTokensOnLogin } from "@/hooks/useGoogleServices";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export const PortalLayout = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { open: commandOpen, setOpen: setCommandOpen } = useCommandPalette();
  
  // Store Google tokens when user signs in with Google OAuth
  useStoreGoogleTokensOnLogin();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && location.pathname.startsWith('/portal')) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, location.pathname, navigate]);

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
      <FloatingSearch onClick={() => setCommandOpen(true)} />
      <AIAssistant />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
};
