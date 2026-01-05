import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { PortalNavigation } from "./PortalNavigation";
import { MobileBottomNav } from "./MobileBottomNav";
import { AIAssistant } from "./AIAssistant";
import { CommandPalette, useCommandPalette } from "./CommandPalette";
import { QuickActivityLogger } from "./QuickActivityLogger";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PoweredByBoss } from "@/components/PoweredByBoss";
import { Loader2 } from "lucide-react";
import { useStoreGoogleTokensOnLogin } from "@/hooks/useGoogleServices";
import { useAutoSyncContacts } from "@/hooks/useAutoSyncContacts";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export const PortalLayout = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { open: commandOpen, setOpen: setCommandOpen } = useCommandPalette();
  
  // Store Google tokens when user signs in with Google OAuth
  useStoreGoogleTokensOnLogin();

  // Auto-sync contacts from Google when connected (runs globally on login)
  const { isSyncing, googleContactsCount } = useAutoSyncContacts();
  
  // Monitor online status and show toast notifications
  useOnlineStatus();

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
    <div className="min-h-[100dvh] h-[100dvh] bg-background flex flex-col overflow-hidden">
      <PortalNavigation onSearchClick={() => setCommandOpen(true)} />
      {/* Main content area - increased padding: pt-[72px] mobile (nav + buffer), pt-24 desktop, pb-16 for mobile bottom nav */}
      <main id="main-content" className="flex-1 flex flex-col pt-[72px] md:pt-24 pb-16 md:pb-0 min-h-0">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      
      {/* Desktop Footer with BOSS branding + Legal Links */}
      <footer className="hidden md:flex items-center justify-center py-3 border-t border-border/30 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link 
            to="/terms" 
            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light"
          >
            Terms of Service
          </Link>
          <span className="text-muted-foreground/30">|</span>
          <Link 
            to="/privacy" 
            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light"
          >
            Privacy Policy
          </Link>
          <span className="text-muted-foreground/30">|</span>
          <PoweredByBoss size="sm" />
        </div>
      </footer>
      
      <MobileBottomNav />
      <QuickActivityLogger />
      <AIAssistant />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
};
