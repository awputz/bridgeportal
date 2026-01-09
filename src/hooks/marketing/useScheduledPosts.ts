import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ScheduledPost {
  id: string;
  agent_id: string;
  project_id: string | null;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter';
  content: string;
  hashtags: string[] | null;
  image_url: string | null;
  scheduled_at: string;
  status: 'scheduled' | 'posted' | 'failed' | 'cancelled';
  posted_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateScheduledPostInput = {
  project_id?: string;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter';
  content: string;
  hashtags?: string[];
  image_url?: string;
  scheduled_at: string;
};

export const useScheduledPosts = (status?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['scheduled-posts', user?.id, status],
    queryFn: async () => {
      if (!user?.id) return [];

      let query = supabase
        .from('scheduled_social_posts')
        .select('*')
        .eq('agent_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ScheduledPost[];
    },
    enabled: !!user?.id,
  });
};

export const useCreateScheduledPost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (post: CreateScheduledPostInput) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('scheduled_social_posts')
        .insert({
          agent_id: user.id,
          ...post,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] });
      toast.success("Post scheduled successfully");
    },
    onError: (error) => {
      toast.error("Failed to schedule post: " + error.message);
    },
  });
};

export const useUpdateScheduledPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ScheduledPost> & { id: string }) => {
      const { data, error } = await supabase
        .from('scheduled_social_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] });
      toast.success("Post updated");
    },
    onError: (error) => {
      toast.error("Failed to update post: " + error.message);
    },
  });
};

export const useCancelScheduledPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('scheduled_social_posts')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] });
      toast.success("Post cancelled");
    },
    onError: (error) => {
      toast.error("Failed to cancel post: " + error.message);
    },
  });
};
