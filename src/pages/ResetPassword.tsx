import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Lock, Loader2, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid session from the reset link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({
          title: "Invalid or expired link",
          description: "Please request a new password reset link.",
          variant: "destructive",
        });
        navigate("/login", { replace: true });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Password updated",
        description: "Your password has been reset successfully",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/portal", { replace: true });
      }, 2000);
    } catch (error: any) {
      console.error("Reset error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-light text-foreground mb-2">Password Reset Successful</h1>
          <p className="text-muted-foreground">Redirecting to portal...</p>
        </div>
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
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-foreground/70" />
            </div>
            <h1 className="text-2xl font-extralight text-foreground mb-1">
              Reset Password
            </h1>
            <p className="text-sm text-muted-foreground font-light">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-light text-muted-foreground">
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoFocus
                className="h-12 bg-white/5 border-white/10 focus:border-white/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-light text-muted-foreground">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="h-12 bg-white/5 border-white/10 focus:border-white/20"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 font-light text-base mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Set New Password"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground/50 mt-8 font-light">
          Bridge Advisory Group © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
