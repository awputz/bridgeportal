import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const ApplySuccess = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-black/50 pointer-events-none" />
      
      <div className="relative z-10 max-w-md w-full text-center">
        <img 
          src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" 
          alt="Bridge Advisory Group" 
          className="h-16 mx-auto mb-8"
        />

        <div className="glass-panel-strong p-8 md:p-10 rounded-2xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-emerald-500" />
          </div>

          <div>
            <h1 className="text-2xl font-light text-foreground mb-2">
              Application Submitted!
            </h1>
            <p className="text-muted-foreground">
              Thank you for your interest in joining Bridge Advisory Group.
            </p>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-foreground">Check Your Email</h3>
                <p className="text-xs text-muted-foreground">
                  You'll receive a confirmation email with next steps.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-foreground">Review Process</h3>
                <p className="text-xs text-muted-foreground">
                  Our team will review your application within 2-3 business days.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Already have an account?
            </p>
            <Button asChild className="w-full gap-2">
              <Link to="/login">
                Sign In to Portal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/50 mt-8">
          Bridge Advisory Group © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default ApplySuccess;
