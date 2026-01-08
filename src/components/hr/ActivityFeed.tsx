import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { 
  MessageSquare, 
  Calendar, 
  FileText, 
  UserPlus, 
  Mail,
  ArrowRight 
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ActivityItem {
  id: string;
  type: "interaction" | "interview" | "offer" | "agent" | "campaign";
  title: string;
  description: string;
  timestamp: string;
  agentId?: string;
  agentName?: string;
}

const activityIcons = {
  interaction: <MessageSquare className="h-4 w-4 text-blue-400" />,
  interview: <Calendar className="h-4 w-4 text-purple-400" />,
  offer: <FileText className="h-4 w-4 text-emerald-400" />,
  agent: <UserPlus className="h-4 w-4 text-amber-400" />,
  campaign: <Mail className="h-4 w-4 text-rose-400" />,
};

export function ActivityFeed() {
  const navigate = useNavigate();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["hr-activity-feed"],
    queryFn: async () => {
      const results: ActivityItem[] = [];

      // Fetch recent interactions
      const { data: interactions } = await supabase
        .from("hr_interactions")
        .select(`
          id, interaction_type, notes, created_at,
          hr_agents (id, full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      interactions?.forEach((i) => {
        results.push({
          id: `interaction-${i.id}`,
          type: "interaction",
          title: `${i.interaction_type} logged`,
          description: i.notes || `Interaction with ${i.hr_agents?.full_name}`,
          timestamp: i.created_at,
          agentId: i.hr_agents?.id,
          agentName: i.hr_agents?.full_name,
        });
      });

      // Fetch recent interviews
      const { data: interviews } = await supabase
        .from("hr_interviews")
        .select(`
          id, interview_type, decision, interview_date,
          hr_agents (id, full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      interviews?.forEach((i) => {
        results.push({
          id: `interview-${i.id}`,
          type: "interview",
          title: `${i.interview_type} interview ${i.decision || "scheduled"}`,
          description: `With ${i.hr_agents?.full_name}`,
          timestamp: i.interview_date,
          agentId: i.hr_agents?.id,
          agentName: i.hr_agents?.full_name,
        });
      });

      // Fetch recent offers
      const { data: offers } = await supabase
        .from("hr_offers")
        .select(`
          id, status, created_at,
          hr_agents (id, full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      offers?.forEach((o) => {
        results.push({
          id: `offer-${o.id}`,
          type: "offer",
          title: `Offer ${o.status}`,
          description: `For ${o.hr_agents?.full_name}`,
          timestamp: o.created_at,
          agentId: o.hr_agents?.id,
          agentName: o.hr_agents?.full_name,
        });
      });

      // Sort by timestamp descending
      return results.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, 15);
    },
  });

  if (isLoading) {
    return (
      <div className="bg-sidebar border border-border/40 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sidebar border border-border/40 rounded-lg">
      <div className="p-4 border-b border-border/40">
        <h3 className="text-lg font-medium">Recent Activity</h3>
      </div>
      <ScrollArea className="h-[400px]">
        {activities.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    {activityIcons[activity.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  {activity.agentId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={() => navigate(`/hr/agents/${activity.agentId}`)}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
