import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, LogOut, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function HRSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [existingUser, setExistingUser] = useState<{ email: string; isAdmin: boolean } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Check if user has admin role
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin")
            .maybeSingle();

          if (roleData) {
            // User is already logged in and is admin - redirect to dashboard
            navigate("/hr/dashboard", { replace: true });
            return;
          } else {
            // User is logged in but not an admin
            setExistingUser({ email: session.user.email || "", isAdmin: false });
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Store intended destination for after auth
      sessionStorage.setItem("auth_redirect", "/hr/dashboard");
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Could not sign in with Google");
      setIsLoading(false);
    }
  };

  const handleSwitchAccount = async () => {
    await supabase.auth.signOut();
    setExistingUser(null);
    sessionStorage.removeItem("auth_redirect");
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  // User is logged in but not an admin
  if (existingUser && !existingUser.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-emerald-950/20">
        <header className="p-6">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to main login
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-4">
              <img 
                src="/lovable-uploads/bridge-careers-logo.png" 
                alt="Bridge Careers" 
                className="h-64 mx-auto"
              />
              <div>
                <h1 className="text-2xl font-extralight tracking-tight">
                  Access Denied
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  You're signed in as <span className="text-foreground">{existingUser.email}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  HR Portal access requires admin privileges.
                </p>
              </div>
            </div>

            <div className="space-y-3 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Button 
                variant="outline" 
                onClick={handleSwitchAccount}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Switch Account
              </Button>
              
              <Button 
                variant="ghost"
                onClick={() => navigate("/portal")}
                className="w-full"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Go to Agent Portal
              </Button>
            </div>
          </div>
        </main>

        <footer className="p-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BRIDGE. All rights reserved.
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-emerald-950/20">
      {/* Header */}
      <header className="p-6">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to main login
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and branding */}
          <div className="text-center space-y-4">
            <img 
              src="/lovable-uploads/bridge-careers-logo.png" 
              alt="Bridge Careers" 
              className="h-64 mx-auto"
            />
            <div>
              <h1 className="text-2xl font-extralight tracking-tight">
                HR Portal
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Talent Acquisition & Recruitment
              </p>
            </div>
          </div>

          {/* Sign in with Bridge account */}
          <div className="space-y-4 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-sm text-center text-muted-foreground">
              Sign in with your Bridge account
            </p>
            
            <Button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <GoogleIcon />
                  <span className="ml-3">Sign in with Google</span>
                </>
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground/70">
              Requires admin privileges
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} BRIDGE. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
