import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Lock, Loader2, Mail, ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/portal", { replace: true });
        }
        setIsCheckingSession(false);
      }
    );

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
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Welcome back",
        description: "Successfully signed in",
      });

      navigate("/portal", { replace: true });
    } catch (error: any) {
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.message === "Invalid login credentials") {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please confirm your email address first.";
      } else if (error.message?.includes("Too many requests")) {
        errorMessage = "Too many login attempts. Please wait a moment.";
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsResetLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        resetEmail.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
      
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setIsResetLoading(false);
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
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-black/50 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-10">
          <img 
            src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" 
            alt="Bridge Advisory Group" 
            className="h-20 w-auto"
          />
        </div>

        <div className="glass-panel-strong p-8 md:p-10">
          {showForgotPassword ? (
            <>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </button>
              
              <div className="text-center mb-8">
                <div className="mx-auto w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-foreground/70" />
                </div>
                <h1 className="text-2xl font-extralight text-foreground mb-1">
                  Reset Password
                </h1>
                <p className="text-sm text-muted-foreground font-light">
                  Enter your email to receive a reset link
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail" className="text-sm font-light text-muted-foreground">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="your.name@bridgenyre.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      disabled={isResetLoading}
                      autoFocus
                      className="pl-10 h-12 bg-white/5 border-white/10 focus:border-white/20"
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full h-12 font-light text-base"
                  disabled={isResetLoading}
                >
                  {isResetLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="mx-auto w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-foreground/70" />
                </div>
                <h1 className="text-2xl font-extralight text-foreground mb-1">
                  Agent Portal
                </h1>
                <p className="text-sm text-muted-foreground font-light">
                  Sign in with your Bridge credentials
                </p>
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
                      placeholder="your.name@bridgenyre.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      autoFocus
                      className="pl-10 h-12 bg-white/5 border-white/10 focus:border-white/20"
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
                      className="pl-10 h-12 bg-white/5 border-white/10 focus:border-white/20"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light"
                  >
                    Forgot password?
                  </button>
                </div>
                
                <Button
                  type="submit"
                  className="w-full h-12 font-light text-base"
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
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground/50 mt-8 font-light">
          Bridge Advisory Group © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Login;
