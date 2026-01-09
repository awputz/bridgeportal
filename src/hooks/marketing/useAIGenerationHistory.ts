import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AIGenerationRecord {
  id: string;
  agent_id: string;
  project_id: string | null;
  generator_type: string;
  prompt_used: string;
  form_data: Record<string, unknown> | null;
  generated_content: string;
  model_used: string;
  tokens_used: number | null;
  generation_time_ms: number | null;
  created_at: string;
}

export interface CreateGenerationInput {
  project_id?: string;
  generator_type: string;
  prompt_used: string;
  form_data?: Record<string, unknown>;
  generated_content: string;
  model_used?: string;
  tokens_used?: number;
  generation_time_ms?: number;
}

// Fetch generation history with optional filters
export const useAIGenerationHistory = (options?: {
  limit?: number;
  type?: string;
}) => {
  const { user } = useAuth();
  const { limit = 50, type } = options || {};

  return useQuery({
    queryKey: ["ai-generation-history", user?.id, limit, type],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
        .from("ai_generation_history")
        .select("*")
        .eq("agent_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (type) {
        query = query.eq("generator_type", type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AIGenerationRecord[];
    },
    enabled: !!user?.id,
  });
};

// Log a new generation
export const useLogGeneration = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateGenerationInput) => {
      const insertData = {
        agent_id: user!.id,
        generator_type: input.generator_type,
        prompt_used: input.prompt_used,
        generated_content: input.generated_content,
        project_id: input.project_id,
        form_data: input.form_data,
        model_used: input.model_used,
        tokens_used: input.tokens_used,
        generation_time_ms: input.generation_time_ms,
      };
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("ai_generation_history")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data as AIGenerationRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-generation-history"] });
    },
  });
};

// Delete a generation record
export const useDeleteGeneration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("ai_generation_history")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-generation-history"] });
    },
  });
};
