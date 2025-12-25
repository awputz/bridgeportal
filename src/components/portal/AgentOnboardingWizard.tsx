import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft,
  User,
  Mail,
  Calendar,
  FolderOpen,
  Sparkles,
  Building2,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentAgent } from "@/hooks/useCurrentAgent";
import { useGmailConnection, useConnectGmail } from "@/hooks/useGmail";
import { useGoogleCalendarConnection, useConnectGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { useDriveConnection, useConnectDrive } from "@/hooks/useGoogleDrive";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  isOptional?: boolean;
}

const steps: OnboardingStep[] = [
  { id: "welcome", title: "Welcome to Bridge", description: "Let's get you set up for success", icon: Sparkles },
  { id: "profile", title: "Complete Your Profile", description: "Add your photo and contact info", icon: User },
  { id: "google", title: "Connect Google Workspace", description: "Sync your email, calendar, and drive", icon: Mail, isOptional: true },
  { id: "explore", title: "Explore Your Tools", description: "Discover templates, calculators, and more", icon: Building2 },
];

interface AgentOnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const AgentOnboardingWizard = ({ onComplete, onSkip }: AgentOnboardingWizardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: agent } = useCurrentAgent();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const { data: gmailData } = useGmailConnection();
  const { data: calendarData } = useGoogleCalendarConnection();
  const { data: driveData } = useDriveConnection();
  const connectGmail = useConnectGmail();
  const connectCalendar = useConnectGoogleCalendar();
  const connectDrive = useConnectDrive();

  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) handleComplete();
    else setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const { error } = await supabase.from("profiles").update({ onboarding_completed: true, onboarding_step: steps.length }).eq("id", user?.id);
      if (error) throw error;
      toast.success("Welcome aboard! You're all set.");
      onComplete();
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Failed to complete onboarding");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkipOnboarding = async () => {
    try {
      await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", user?.id);
      onSkip();
    } catch { onSkip(); }
  };

  const agentName = agent?.fullName?.split(' ')[0] || 'Agent';
  const hasPhoto = !!agent?.photoUrl;
  const hasPhone = !!agent?.phone;

  const renderStepContent = () => {
    switch (step.id) {
      case "welcome":
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-light text-foreground mb-3">Welcome, {agentName}!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">You're now part of the Bridge Advisory Group team. Let's take a quick tour.</p>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-muted overflow-hidden flex items-center justify-center">
              {hasPhoto ? <img src={agent?.photoUrl} alt="" className="w-full h-full object-cover" /> : <User className="h-12 w-12 text-muted-foreground" />}
            </div>
            <div>
              <h2 className="text-2xl font-light text-foreground mb-2">Complete Your Profile</h2>
              <p className="text-muted-foreground">A complete profile helps clients and colleagues connect with you.</p>
            </div>
            <div className="space-y-3 max-w-sm mx-auto text-left">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", hasPhoto ? "bg-emerald-500/20 text-emerald-500" : "bg-muted-foreground/20 text-muted-foreground")}>
                  {hasPhoto ? <Check className="h-4 w-4" /> : <span className="text-xs">1</span>}
                </div>
                <span className={cn(hasPhoto && "line-through text-muted-foreground")}>Add a profile photo</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", hasPhone ? "bg-emerald-500/20 text-emerald-500" : "bg-muted-foreground/20 text-muted-foreground")}>
                  {hasPhone ? <Check className="h-4 w-4" /> : <span className="text-xs">2</span>}
                </div>
                <span className={cn(hasPhone && "line-through text-muted-foreground")}>Add your phone number</span>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/portal/profile')} className="gap-2">
              Go to Profile Settings <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        );
      case "google":
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center">
              <Mail className="h-12 w-12 text-blue-400" />
            </div>
            <h2 className="text-2xl font-light text-foreground mb-2">Connect Google Workspace</h2>
            <div className="space-y-3 max-w-sm mx-auto">
              {[
                { label: "Gmail", data: gmailData, connect: connectGmail, icon: Mail },
                { label: "Calendar", data: calendarData, connect: connectCalendar, icon: Calendar },
                { label: "Drive", data: driveData, connect: connectDrive, icon: FolderOpen },
              ].map(({ label, data, connect, icon: Icon }) => (
                <button key={label} onClick={() => !data?.isConnected && connect.mutate()} disabled={connect.isPending}
                  className={cn("w-full flex items-center gap-3 p-4 rounded-xl border transition-colors", data?.isConnected ? "bg-emerald-500/10 border-emerald-500/30" : "hover:bg-muted/50 border-border")}>
                  <Icon className={cn("h-5 w-5", data?.isConnected ? "text-emerald-500" : "text-muted-foreground")} />
                  <span className="flex-1 text-left">{label}</span>
                  {data?.isConnected ? <Check className="h-5 w-5 text-emerald-500" /> : connect.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="text-xs text-primary">Connect</span>}
                </button>
              ))}
            </div>
          </div>
        );
      case "explore":
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Building2 className="h-12 w-12 text-purple-400" />
            </div>
            <h2 className="text-2xl font-light text-foreground mb-2">You're All Set!</h2>
            <p className="text-muted-foreground">Explore CRM, Templates, Calculators, and submit Commission Requests.</p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {steps.map((s, i) => <div key={s.id} className={cn("w-2 h-2 rounded-full transition-colors", i === currentStep ? "bg-primary" : i < currentStep ? "bg-primary/50" : "bg-muted")} />)}
            </div>
            <button onClick={handleSkipOnboarding} className="text-xs text-muted-foreground hover:text-foreground">Skip for now</button>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
        <div className="p-6 min-h-[350px] flex flex-col justify-center">{renderStepContent()}</div>
        <div className="p-6 pt-4 border-t border-border flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0} className="gap-2"><ChevronLeft className="h-4 w-4" />Back</Button>
          <Button onClick={handleNext} disabled={isCompleting} className="gap-2">
            {isCompleting ? <><Loader2 className="h-4 w-4 animate-spin" />Finishing...</> : isLastStep ? <>Get Started<Sparkles className="h-4 w-4" /></> : <>{step.isOptional ? 'Skip' : 'Continue'}<ChevronRight className="h-4 w-4" /></>}
          </Button>
        </div>
      </div>
    </div>
  );
};