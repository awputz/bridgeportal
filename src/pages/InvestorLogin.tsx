import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Lock, Loader2, Mail, ArrowLeft, Briefcase } from "lucide-react";

const InvestorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Check if user has investor role
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "investor")
          .maybeSingle();

        if (roleData) {
          navigate("/investor/dashboard", { replace: true });
        }
      }
      setIsCheckingSession(false);
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter your email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (authError) throw authError;

      // Verify user has investor role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authData.user.id)
        .eq("role", "investor")
        .maybeSingle();

      if (roleError) throw roleError;

      if (!roleData) {
        // User doesn't have investor role - sign them out
        await supabase.auth.signOut();
        throw new Error("This portal is for authorized investors only. Please use the main login page.");
      }

      toast({
        title: "Welcome",
        description: "Successfully signed in to Investor Portal",
      });

      navigate("/investor/dashboard", { replace: true });
    } catch (error: any) {
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.message === "Invalid login credentials") {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
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
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-sky-950/20 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-10">
          <img 
            src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" 
            alt="Bridge Advisory Group" 
            className="h-20 w-auto"
          />
        </div>

        <div className="glass-panel-strong p-8 md:p-10 border-sky-400/20">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to main login
          </button>

          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-full bg-sky-400/10 flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6 text-sky-400" />
            </div>
            <h1 className="text-2xl font-extralight text-foreground mb-1">
              Investor Portal
            </h1>
            <div className="flex items-center justify-center gap-2 mt-3">
              <img 
                src="/lovable-uploads/hpg-logo-white.png" 
                alt="HPG" 
                className="h-6 w-auto"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-light text-muted-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                  className="pl-10 h-12 bg-white/5 border-white/10 focus:border-sky-400/30"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-light text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pl-10 h-12 bg-white/5 border-white/10 focus:border-sky-400/30"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 font-light text-base bg-sky-500 hover:bg-sky-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In to Investor Portal"
              )}
            </Button>
          </form>

          <button
            onClick={() => navigate("/reset-password")}
            className="block mx-auto text-sm text-sky-400/80 hover:text-sky-300 transition-colors mt-4"
          >
            Forgot your password?
          </button>

          <p className="text-center text-xs text-muted-foreground/60 mt-4 font-light">
            For authorized investors only
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground/50 mt-8 font-light">
          Bridge Advisory Group © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default InvestorLogin;
