import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MarketingAnalytics {
  id: string;
  agent_id: string;
  period: string;
  period_start: string;
  projects_created: number;
  emails_sent: number;
  emails_opened: number;
  emails_clicked: number;
  social_posts: number;
  flyers_generated: number;
  presentations_created: number;
  created_at: string;
  updated_at: string;
}

export interface MarketingPerformanceStats {
  totalProjects: number;
  emailsSent: number;
  openRate: number;
  socialPosts: number;
  flyersGenerated: number;
  presentationsCreated: number;
}

export const useMarketingPerformance = () => {
  return useQuery({
    queryKey: ["marketing-performance"],
    queryFn: async (): Promise<MarketingPerformanceStats> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get project counts by type
      const { data: projects, error: projectsError } = await supabase
        .from("marketing_projects")
        .select("type, status")
        .eq("agent_id", user.id)
        .is("deleted_at", null);

      if (projectsError) throw projectsError;

      // Get email campaign stats
      const { data: campaigns, error: campaignsError } = await supabase
        .from("email_campaigns")
        .select("total_recipients, total_opened, total_clicked")
        .eq("agent_id", user.id);

      if (campaignsError) throw campaignsError;

      // Calculate stats
      const totalProjects = projects?.length || 0;
      const socialPosts = projects?.filter(p => p.type === "social-post").length || 0;
      const flyersGenerated = projects?.filter(p => p.type === "flyer").length || 0;
      const presentationsCreated = projects?.filter(p => p.type === "presentation").length || 0;

      const emailsSent = campaigns?.reduce((sum, c) => sum + (c.total_recipients || 0), 0) || 0;
      const totalOpens = campaigns?.reduce((sum, c) => sum + (c.total_opened || 0), 0) || 0;
      const openRate = emailsSent > 0 ? Math.round((totalOpens / emailsSent) * 100) : 0;

      return {
        totalProjects,
        emailsSent,
        openRate,
        socialPosts,
        flyersGenerated,
        presentationsCreated,
      };
    },
  });
};

// Get analytics for a specific time period
export const useMarketingAnalyticsByPeriod = (period: "weekly" | "monthly" | "yearly" = "monthly") => {
  return useQuery({
    queryKey: ["marketing-analytics", period],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("marketing_analytics")
        .select("*")
        .eq("agent_id", user.id)
        .eq("period", period)
        .order("period_start", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as MarketingAnalytics | null;
    },
  });
};
