import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, X, AlertCircle, CheckCircle2, Calendar, DollarSign, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Suggestion {
  id: string;
  type: "missing-data" | "overdue" | "follow-up" | "opportunity";
  title: string;
  message: string;
  action?: string;
  priority: "high" | "medium" | "low";
}

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const analyzePipeline = async () => {
      setIsLoading(true);
      const newSuggestions: Suggestion[] = [];

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Check for deals missing commission
        const { data: dealsWithoutCommission } = await supabase
          .from("crm_deals")
          .select("id, property_address")
          .is("commission", null)
          .eq("agent_id", user.id)
          .eq("is_active", true);

        if (dealsWithoutCommission && dealsWithoutCommission.length > 0) {
          newSuggestions.push({
            id: "missing-commission",
            type: "missing-data",
            title: "Missing Commission Data",
            message: `${dealsWithoutCommission.length} deal(s) are missing commission entry. Add your actual commission to track earnings accurately.`,
            action: "/portal/crm",
            priority: "high",
          });
        }

        // Check for deals missing value
        const { data: dealsWithoutValue } = await supabase
          .from("crm_deals")
          .select("id, property_address")
          .is("value", null)
          .eq("agent_id", user.id)
          .eq("is_active", true);

        if (dealsWithoutValue && dealsWithoutValue.length > 0) {
          newSuggestions.push({
            id: "missing-value",
            type: "missing-data",
            title: "Missing Deal Values",
            message: `${dealsWithoutValue.length} deal(s) are missing value. Update these to track your pipeline accurately.`,
            action: "/portal/crm",
            priority: "medium",
          });
        }

        // Check for overdue tasks
        const today = new Date().toISOString().split('T')[0];
        const { data: overdueTasks } = await supabase
          .from("crm_activities")
          .select("id, title")
          .lt("due_date", today)
          .eq("is_completed", false)
          .eq("agent_id", user.id);

        if (overdueTasks && overdueTasks.length > 0) {
          newSuggestions.push({
            id: "overdue-tasks",
            type: "overdue",
            title: "Overdue Tasks",
            message: `You have ${overdueTasks.length} overdue task(s). Complete or reschedule these to stay on track.`,
            action: "/portal/crm",
            priority: "high",
          });
        }

        // Check for deals with expected close date in next 7 days
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const { data: upcomingCloses } = await supabase
          .from("crm_deals")
          .select("id, property_address, expected_close")
          .gte("expected_close", today)
          .lte("expected_close", nextWeek.toISOString().split('T')[0])
          .eq("agent_id", user.id)
          .eq("is_active", true);

        if (upcomingCloses && upcomingCloses.length > 0) {
          newSuggestions.push({
            id: "upcoming-closes",
            type: "opportunity",
            title: "Deals Closing Soon",
            message: `${upcomingCloses.length} deal(s) are expected to close in the next 7 days. Make sure all documentation is ready.`,
            action: "/portal/crm",
            priority: "medium",
          });
        }

        // Check for contacts without recent activity
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { data: staleContacts, count: staleCount } = await supabase
          .from("crm_contacts")
          .select("id", { count: "exact", head: true })
          .eq("agent_id", user.id)
          .eq("is_active", true)
          .lt("updated_at", thirtyDaysAgo.toISOString());

        if (staleCount && staleCount > 5) {
          newSuggestions.push({
            id: "stale-contacts",
            type: "follow-up",
            title: "Contacts Need Attention",
            message: `${staleCount} contacts haven't been updated in 30+ days. Consider reaching out to maintain relationships.`,
            action: "/portal/crm",
            priority: "low",
          });
        }

        setSuggestions(newSuggestions);
      } catch (error) {
        console.error("Error analyzing pipeline:", error);
      } finally {
        setIsLoading(false);
      }
    };

    analyzePipeline();
    // Refresh every 5 minutes
    const interval = setInterval(analyzePipeline, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.action) {
      navigate(suggestion.action);
      setIsOpen(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-500/10";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10";
      default:
        return "text-blue-400 bg-blue-500/10";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "missing-data":
        return AlertCircle;
      case "overdue":
        return Calendar;
      case "follow-up":
        return CheckCircle2;
      case "opportunity":
        return DollarSign;
      default:
        return AlertCircle;
    }
  };

  const highPrioritySuggestions = suggestions.filter(s => s.priority === "high");

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className={cn(
            "fixed bottom-24 right-4 md:bottom-6 md:right-6 h-12 w-12 rounded-full shadow-lg z-40",
            "bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
            "transition-all hover:scale-105"
          )}
        >
          <Sparkles className="h-5 w-5 text-primary-foreground" />
          {highPrioritySuggestions.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
              {highPrioritySuggestions.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-background border-border">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Suggestions
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-muted-foreground">Analyzing your pipeline...</div>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">All Caught Up!</h3>
            <p className="text-sm text-muted-foreground">
              No action items right now. Keep up the great work!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((suggestion) => {
              const Icon = getTypeIcon(suggestion.type);
              return (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-lg", getPriorityColor(suggestion.priority))}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground text-sm">{suggestion.title}</span>
                        <Badge 
                          variant="secondary" 
                          className={cn("text-xs capitalize", getPriorityColor(suggestion.priority))}
                        >
                          {suggestion.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{suggestion.message}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                  </div>
                </button>
              );
            })}

            <div className="pt-4 border-t border-white/10">
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => {
                  navigate("/portal/ai");
                  setIsOpen(false);
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Open Bridge AI Chat
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
