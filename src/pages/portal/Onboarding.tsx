import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  MessageSquare, 
  Trophy, 
  Target, 
  HelpCircle, 
  PenTool,
  Sparkles,
  User,
  Mail,
  Calendar,
  FolderOpen,
  Building2,
  ArrowRight,
  Check,
  BookOpen,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const culturalValues = [
  { icon: Heart, title: "Lead with Optimism and Compassion", description: "Approach every interaction with positivity and empathy." },
  { icon: MessageSquare, title: "Cultivate Frequent Feedback", description: "Open communication helps us grow together." },
  { icon: Trophy, title: "Celebrate the Wins", description: "Acknowledge achievements, big and small." },
  { icon: Target, title: "Embrace Process Over Outcome", description: "Focus on doing things right, not just fast." },
  { icon: HelpCircle, title: "Start with Why", description: "Understand the purpose behind every action." },
  { icon: PenTool, title: "Cherish Writing", description: "Clear written communication is essential." },
];

const gettingStartedSteps = [
  { 
    title: "Complete Your Profile", 
    description: "Add a professional photo and your contact information",
    path: "/portal/profile",
    icon: User
  },
  { 
    title: "Connect Google Workspace", 
    description: "Sync your Bridge email, calendar, and drive for seamless integration",
    path: "/portal/profile",
    icon: Mail
  },
  { 
    title: "Explore the CRM", 
    description: "Add contacts, create deals, and manage your pipeline",
    path: "/portal/crm",
    icon: Building2
  },
  { 
    title: "Browse Templates", 
    description: "Find contracts, agreements, and marketing materials for your division",
    path: "/portal/templates",
    icon: FolderOpen
  },
  { 
    title: "Try the Calculators", 
    description: "Commission calculators, rent analysis, and more",
    path: "/portal/calculators",
    icon: Calendar
  },
  { 
    title: "Ask Bridge AI", 
    description: "Get help with emails, property descriptions, and deal summaries",
    path: "/portal/ai",
    icon: Sparkles
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isResetting, setIsResetting] = useState(false);

  const handleRestartOnboarding = async () => {
    setIsResetting(true);
    try {
      await supabase.from("profiles").update({ 
        onboarding_completed: false,
        onboarding_step: 0
      }).eq("id", user?.id);
      toast.success("Onboarding wizard will appear on your next dashboard visit");
      navigate("/portal");
    } catch (error) {
      toast.error("Failed to restart onboarding");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-light">Welcome to Bridge</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Everything you need to get started and succeed as a Bridge Advisory Group agent.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRestartOnboarding}
          disabled={isResetting}
          className="gap-2 mt-2"
        >
          <RotateCcw className="h-4 w-4" />
          Restart Onboarding Wizard
        </Button>
      </div>

      {/* Cultural Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Our Cultural Values
          </CardTitle>
          <CardDescription>
            The principles that guide everything we do at Bridge Advisory Group
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {culturalValues.map(({ icon: Icon, title, description }) => (
              <div 
                key={title} 
                className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            Getting Started
          </CardTitle>
          <CardDescription>
            Complete these steps to get the most out of your Bridge portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gettingStartedSteps.map(({ title, description, path, icon: Icon }, index) => (
              <button
                key={title}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10">
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Step {index + 1}</span>
                  </div>
                  <h3 className="font-medium text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Quick Links
          </CardTitle>
          <CardDescription>
            Jump to key areas of the portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Dashboard", path: "/portal" },
              { label: "CRM", path: "/portal/crm" },
              { label: "Templates", path: "/portal/templates" },
              { label: "Calculators", path: "/portal/calculators" },
              { label: "AI Assistant", path: "/portal/ai" },
              { label: "Resources", path: "/portal/resources" },
              { label: "Company Info", path: "/portal/company" },
              { label: "Profile", path: "/portal/profile" },
            ].map(({ label, path }) => (
              <Button 
                key={label} 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(path)}
                className="justify-start"
              >
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <div className="text-center p-6 rounded-xl bg-muted/30 border border-border">
        <h3 className="font-medium text-foreground mb-2">Need Help?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Questions about the portal or your onboarding? Reach out to your team lead or use the AI assistant.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate("/portal/ai")} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Ask Bridge AI
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/portal/company/contact")} className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
