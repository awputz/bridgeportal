import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Lock, Loader2 } from "lucide-react";

const ADMIN_EMAIL = "office@bridgenyre.com";

const Login = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/portal", { replace: true });
        }
        setIsCheckingSession(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/portal", { replace: true });
      }
      setIsCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast({
        title: "Error",
        description: "Please enter the password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          // Try to create account if it doesn't exist
          const { error: signUpError } = await supabase.auth.signUp({
            email: ADMIN_EMAIL,
            password: password,
            options: {
              emailRedirectTo: `${window.location.origin}/portal`,
            }
          });

          if (signUpError) {
            throw signUpError;
          }

          // Try to sign in again
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: ADMIN_EMAIL,
            password: password,
          });

          if (signInError) throw signInError;
        } else {
          throw error;
        }
      }

      toast({
        title: "Welcome",
        description: "Access granted",
      });

      navigate("/portal", { replace: true });
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Access Denied",
        description: "Invalid password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-black/50 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img 
            src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" 
            alt="Bridge Advisory Group" 
            className="h-20 w-auto"
          />
        </div>

        {/* Login Card */}
        <div className="glass-panel-strong p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-foreground/70" />
            </div>
            <h1 className="text-2xl font-extralight text-foreground mb-1">
              Agent Portal
            </h1>
            <p className="text-sm text-muted-foreground font-light">
              Enter password to access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoFocus
              className="text-center text-lg tracking-wider h-12 bg-white/5 border-white/10 focus:border-white/20"
            />
            
            <Button
              type="submit"
              className="w-full h-12 font-light text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Access Portal"
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/50 mt-8 font-light">
          Bridge Advisory Group © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Login;
