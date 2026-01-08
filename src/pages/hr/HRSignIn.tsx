import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function HRSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Check if user has admin role (admins have HR access)
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin")
            .maybeSingle();

          if (roleData) {
            navigate("/hr/dashboard", { replace: true });
            return;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("No user returned from authentication");
      }

      // Check if user has admin role (admins have HR access)
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authData.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError) {
        throw roleError;
      }

      if (!roleData) {
        await supabase.auth.signOut();
        toast.error("Access denied. HR admin privileges required.");
        return;
      }

      toast.success("Welcome to Bridge Careers!");
      navigate("/hr/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.message?.includes("Invalid login credentials")) {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.message || "An error occurred during sign in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
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

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-light">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hr@bridgenyre.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/5 border-white/10 focus:border-emerald-400/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-light">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/5 border-white/10 focus:border-emerald-400/30"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center">
              <Link 
                to="/reset-password" 
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </form>
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
