import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

export interface MarketingProject {
  id: string;
  agent_id: string;
  name: string;
  type: string;
  template_id: string | null;
  status: string;
  design_data: Json | null;
  thumbnail_url: string | null;
  output_url: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateProjectInput = {
  name: string;
  type: string;
  template_id?: string;
  design_data?: Json;
};

export type UpdateProjectInput = Partial<{
  name: string;
  type: string;
  template_id: string | null;
  status: string;
  design_data: Json | null;
  thumbnail_url: string | null;
  output_url: string | null;
}>;

export const useMarketingProjects = (status?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["marketing-projects", user?.id, status],
    queryFn: async () => {
      let query = supabase
        .from("marketing_projects")
        .select("*")
        .eq("agent_id", user!.id)
        .order("updated_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as MarketingProject[];
    },
    enabled: !!user?.id,
  });
};

export const useRecentProjects = (limit = 6) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["marketing-projects", "recent", user?.id, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_projects")
        .select("*")
        .eq("agent_id", user!.id)
        .order("updated_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as MarketingProject[];
    },
    enabled: !!user?.id,
  });
};

export const useProjectStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["marketing-projects", "stats", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_projects")
        .select("status")
        .eq("agent_id", user!.id);

      if (error) throw error;

      const stats = {
        total: data.length,
        draft: 0,
        completed: 0,
        published: 0,
      };

      data.forEach((project) => {
        if (project.status === "draft") stats.draft++;
        else if (project.status === "completed") stats.completed++;
        else if (project.status === "published") stats.published++;
      });

      return stats;
    },
    enabled: !!user?.id,
  });
};

export const useMarketingProject = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["marketing-project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_projects")
        .select("*")
        .eq("id", id)
        .eq("agent_id", user!.id)
        .single();

      if (error) throw error;
      return data as MarketingProject;
    },
    enabled: !!user?.id && !!id,
  });
};

export const useCreateMarketingProject = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const { data, error } = await supabase
        .from("marketing_projects")
        .insert({
          agent_id: user!.id,
          name: input.name,
          type: input.type,
          template_id: input.template_id || null,
          design_data: input.design_data || null,
          status: "draft",
        })
        .select()
        .single();

      if (error) throw error;
      return data as MarketingProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-projects"] });
      toast.success("Project created");
    },
    onError: (error) => {
      toast.error("Failed to create project");
      console.error("Create project error:", error);
    },
  });
};

export const useUpdateMarketingProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateProjectInput & { id: string }) => {
      const { data, error } = await supabase
        .from("marketing_projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as MarketingProject;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["marketing-projects"] });
      queryClient.invalidateQueries({ queryKey: ["marketing-project", data.id] });
      toast.success("Project updated");
    },
    onError: (error) => {
      toast.error("Failed to update project");
      console.error("Update project error:", error);
    },
  });
};

export const useDeleteMarketingProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("marketing_projects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-projects"] });
      toast.success("Project deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete project");
      console.error("Delete project error:", error);
    },
  });
};

export const useDuplicateProject = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (projectId: string) => {
      // First fetch the project to duplicate
      const { data: original, error: fetchError } = await supabase
        .from("marketing_projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (fetchError) throw fetchError;

      // Create duplicate with new name
      const { data, error } = await supabase
        .from("marketing_projects")
        .insert({
          agent_id: user!.id,
          name: `Copy of ${original.name}`,
          type: original.type,
          template_id: original.template_id,
          design_data: original.design_data,
          status: "draft",
        })
        .select()
        .single();

      if (error) throw error;
      return data as MarketingProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-projects"] });
      toast.success("Project duplicated");
    },
    onError: (error) => {
      toast.error("Failed to duplicate project");
      console.error("Duplicate project error:", error);
    },
  });
};

export const useAddImageToProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      imageUrl,
    }: {
      projectId: string;
      imageUrl: string;
    }) => {
      // First fetch current project to preserve existing design_data
      const { data: existing, error: fetchError } = await supabase
        .from("marketing_projects")
        .select("design_data")
        .eq("id", projectId)
        .single();

      if (fetchError) throw fetchError;

      // Merge new image into design_data
      const currentData = (existing?.design_data as Record<string, unknown>) || {};
      const updatedDesignData = {
        ...currentData,
        featured_image: imageUrl,
        staged_image: imageUrl,
      };

      const { data, error } = await supabase
        .from("marketing_projects")
        .update({
          design_data: updatedDesignData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .select()
        .single();

      if (error) throw error;
      return data as MarketingProject;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["marketing-projects"] });
      queryClient.invalidateQueries({ queryKey: ["marketing-project", data.id] });
      toast.success("Image added to project");
    },
    onError: (error) => {
      toast.error("Failed to add image to project");
      console.error("Add image to project error:", error);
    },
  });
};
