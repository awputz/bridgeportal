import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Lock, Loader2, Mail, ArrowLeft, LogOut, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { User } from "@supabase/supabase-js";
const GoogleIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>;
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [existingUser, setExistingUser] = useState<User | null>(null);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setExistingUser(session.user);
      } else {
        setExistingUser(null);
      }
      setIsCheckingSession(false);
    });
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (session?.user) {
        setExistingUser(session.user);
      }
      setIsCheckingSession(false);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);
  const handleContinueToPortal = () => {
    navigate("/portal", {
      replace: true
    });
  };
  const handleSwitchAccount = async () => {
    await supabase.auth.signOut();
    setExistingUser(null);
  };
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Request all Google service scopes during login
      const scopes = ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/contacts.readonly'].join(' ');
      const {
        error
      } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          },
          scopes
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google Sign-In Failed",
        description: error.message || "Could not sign in with Google. Please try again.",
        variant: "destructive"
      });
      setIsGoogleLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter your email and password",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const {
        error
      } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });
      if (error) {
        throw error;
      }
      toast({
        title: "Welcome back",
        description: "Successfully signed in"
      });
      navigate("/portal", {
        replace: true
      });
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
        variant: "destructive"
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
        variant: "destructive"
      });
      return;
    }
    setIsResetLoading(true);
    try {
      const {
        error
      } = await supabase.auth.resetPasswordForEmail(resetEmail.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link."
      });
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive"
      });
    } finally {
      setIsResetLoading(false);
    }
  };
  if (isCheckingSession) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
      </div>;
  }

  // If user is already logged in, show options
  if (existingUser) {
    return <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-black/50 pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-md">
          <div className="flex justify-center mb-10">
            <img src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" alt="Bridge Advisory Group" className="h-20 w-auto" />
          </div>

          <div className="glass-panel-strong p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="mx-auto w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-foreground/70" />
              </div>
              <h1 className="text-2xl font-extralight text-foreground mb-1">
                Welcome Back
              </h1>
              <p className="text-sm text-muted-foreground font-light">
                You're signed in as
              </p>
              <p className="text-foreground font-medium mt-1">
                {existingUser.email}
              </p>
            </div>

            <div className="space-y-3">
              <Button onClick={handleContinueToPortal} className="w-full h-12 font-light text-base">
                <ArrowRight className="h-4 w-4 mr-2" />
                Continue to Portal
              </Button>
              
              <Button variant="outline" onClick={handleSwitchAccount} className="w-full h-12 font-light text-base">
                <LogOut className="h-4 w-4 mr-2" />
                Switch Account
              </Button>
            </div>
          </div>

          <div className="text-center mt-8 space-y-2">
            <p className="text-xs text-muted-foreground/50 font-light">
              Bridge Advisory Group © {new Date().getFullYear()}
            </p>
            <div className="flex items-center justify-center gap-2 opacity-40">
              <span className="text-[10px] text-muted-foreground/50 font-light">Powered by</span>
              <img 
                src="/assets/boss-logo-white.png" 
                alt="Brokerage Operating System" 
                className="h-4 w-auto"
              />
            </div>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-black/50 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-10">
          <img src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" alt="Bridge Advisory Group" className="h-20 w-auto" />
        </div>

        <div className="glass-panel-strong p-8 md:p-10">
          {showForgotPassword ? <>
              <button onClick={() => setShowForgotPassword(false)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
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
                    <Input id="resetEmail" type="email" placeholder="your.name@bridgenyre.com" value={resetEmail} onChange={e => setResetEmail(e.target.value)} disabled={isResetLoading} autoFocus className="pl-10 h-12 bg-white/5 border-white/10 focus:border-white/20" />
                  </div>
                </div>
                
                <Button type="submit" className="w-full h-12 font-light text-base" disabled={isResetLoading}>
                  {isResetLoading ? <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </> : "Send Reset Link"}
                </Button>
              </form>
            </> : <>
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

              {/* Google Sign-In Button */}
              <Button type="button" variant="outline" onClick={handleGoogleSignIn} disabled={isGoogleLoading || isLoading} className="w-full h-12 font-normal text-base bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 transition-all">
                {isGoogleLoading ? <>
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                    Signing in...
                  </> : <>
                    <GoogleIcon />
                    <span className="ml-3">Sign in with Google</span>
                  </>}
              </Button>

              {/* Stay signed in note */}
              <p className="text-center text-xs text-muted-foreground/70 mt-3 font-light">
                You'll stay signed in on this device
              </p>

              {/* Collapsible Email Login */}
              <Collapsible open={showEmailLogin} onOpenChange={setShowEmailLogin} className="mt-6">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-light py-2">
                    {showEmailLogin ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Hide email login
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Sign in with email instead
                      </>
                    )}
                  </button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                  <div className="pt-4 space-y-5">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-light text-muted-foreground">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="email" type="email" placeholder="your.name@bridgenyre.com" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} className="pl-10 h-12 bg-white/5 border-white/10 focus:border-white/20" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-light text-muted-foreground">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} className="pl-10 h-12 bg-white/5 border-white/10 focus:border-white/20" />
                        </div>
                      </div>

                      <div className="text-right">
                        <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light">
                          Forgot password?
                        </button>
                      </div>
                      
                      <Button type="submit" className="w-full h-12 font-light text-base" disabled={isLoading}>
                        {isLoading ? <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Signing in...
                          </> : "Sign In"}
                      </Button>
                    </form>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Apply Link */}
              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-sm text-muted-foreground mb-2">New to Bridge?</p>
                <Button variant="outline" className="w-full" onClick={() => navigate("/apply")}>
                  Get Started  
                </Button>
              </div>

              {/* Investor Portal Link */}
              <div className="mt-6 text-center">
                <button onClick={() => navigate("/investor-login")} className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                  Investor access →
                </button>
              </div>
            </>}
        </div>

        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-muted-foreground/50 font-light">
            Bridge Advisory Group © {new Date().getFullYear()}
          </p>
          <div className="flex items-center justify-center gap-2 opacity-40">
            <span className="text-[10px] text-muted-foreground/50 font-light">Powered by</span>
            <img 
              src="/assets/boss-logo-white.png" 
              alt="Brokerage Operating System" 
              className="h-4 w-auto"
            />
          </div>
        </div>
      </div>
    </div>;
};
export default Login;