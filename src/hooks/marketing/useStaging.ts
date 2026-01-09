import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Type definitions
export type StagingType = 'residential' | 'commercial' | 'architecture' | 'investment';
export type StagingRoomType = 'living-room' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'exterior' | 'lobby' | 'dining-room' | 'other';
export type StagingStyle = 'modern' | 'traditional' | 'minimalist' | 'luxury' | 'industrial' | 'coastal' | 'scandinavian' | 'contemporary';
export type StagingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface StagingProject {
  id: string;
  agent_id: string;
  name: string;
  staging_type: string;
  property_id: string | null;
  property_type: string | null;
  target_audience: string | null;
  status: string;
  total_images: number;
  completed_images: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface StagingImage {
  id: string;
  project_id: string;
  original_url: string;
  original_width: number | null;
  original_height: number | null;
  staged_url: string | null;
  staged_width: number | null;
  staged_height: number | null;
  room_type: string;
  style_preference: string;
  staging_prompt: string | null;
  model_used: string | null;
  status: string;
  error_message: string | null;
  processing_time_ms: number | null;
  created_at: string;
  updated_at: string;
}

export interface StagingTemplate {
  id: string;
  name: string;
  description: string | null;
  staging_type: string;
  room_type: string;
  style_preference: string;
  prompt_template: string;
  negative_prompt: string | null;
  thumbnail_url: string | null;
  example_before_url: string | null;
  example_after_url: string | null;
  is_premium: boolean;
  is_active: boolean;
  popularity_score: number;
  created_at: string;
}

export interface CreateStagingProjectInput {
  name: string;
  staging_type: StagingType;
  property_id?: string;
  property_type?: string;
  target_audience?: string;
}

export interface CreateStagingImageInput {
  project_id: string;
  original_url: string;
  original_width?: number;
  original_height?: number;
  room_type: StagingRoomType;
  style_preference: StagingStyle;
}

export interface StagingProjectStats {
  total: number;
  totalImages: number;
  completedImages: number;
  processing: number;
}

// ==================== QUERIES ====================

export const useStagingProjects = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["staging-projects", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staging_projects")
        .select("*")
        .eq("agent_id", user!.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as StagingProject[];
    },
    enabled: !!user?.id,
  });
};

export const useStagingProject = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["staging-project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staging_projects")
        .select("*")
        .eq("id", id)
        .eq("agent_id", user!.id)
        .maybeSingle();

      if (error) throw error;
      return data as StagingProject | null;
    },
    enabled: !!id && !!user?.id,
  });
};

export const useStagingProjectImages = (projectId: string) => {
  return useQuery({
    queryKey: ["staging-project-images", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staging_images")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as StagingImage[];
    },
    enabled: !!projectId,
  });
};

export const useStagingTemplates = (options?: { 
  staging_type?: StagingType; 
  room_type?: StagingRoomType;
}) => {
  return useQuery({
    queryKey: ["staging-templates", options?.staging_type, options?.room_type],
    queryFn: async () => {
      let query = supabase
        .from("staging_templates")
        .select("*")
        .eq("is_active", true)
        .order("popularity_score", { ascending: false });

      if (options?.staging_type) {
        query = query.eq("staging_type", options.staging_type);
      }
      if (options?.room_type) {
        query = query.eq("room_type", options.room_type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as StagingTemplate[];
    },
  });
};

export const useStagingProjectStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["staging-projects", "stats", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staging_projects")
        .select("status, total_images, completed_images")
        .eq("agent_id", user!.id);

      if (error) throw error;

      const stats: StagingProjectStats = {
        total: data.length,
        totalImages: data.reduce((acc, p) => acc + (p.total_images || 0), 0),
        completedImages: data.reduce((acc, p) => acc + (p.completed_images || 0), 0),
        processing: data.filter((p) => p.status === "processing").length,
      };

      return stats;
    },
    enabled: !!user?.id,
  });
};

// ==================== MUTATIONS ====================

export const useCreateStagingProject = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateStagingProjectInput) => {
      const { data, error } = await supabase
        .from("staging_projects")
        .insert({
          agent_id: user!.id,
          name: input.name,
          staging_type: input.staging_type,
          property_id: input.property_id || null,
          property_type: input.property_type || null,
          target_audience: input.target_audience || null,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data as StagingProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staging-projects"] });
      toast({
        title: "Project created",
        description: "Your staging project has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateStagingProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<StagingProject> & { id: string }) => {
      const { data, error } = await supabase
        .from("staging_projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as StagingProject;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["staging-projects"] });
      queryClient.invalidateQueries({ queryKey: ["staging-project", data.id] });
    },
    onError: (error) => {
      toast({
        title: "Error updating project",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteStagingProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("staging_projects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staging-projects"] });
      toast({
        title: "Project deleted",
        description: "Your staging project has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateStagingImage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateStagingImageInput) => {
      const { data, error } = await supabase
        .from("staging_images")
        .insert({
          project_id: input.project_id,
          original_url: input.original_url,
          original_width: input.original_width || null,
          original_height: input.original_height || null,
          room_type: input.room_type,
          style_preference: input.style_preference,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data as StagingImage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["staging-project-images", data.project_id] });
      queryClient.invalidateQueries({ queryKey: ["staging-projects"] });
    },
    onError: (error) => {
      toast({
        title: "Error adding image",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateStagingImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<StagingImage> & { id: string }) => {
      const { data, error } = await supabase
        .from("staging_images")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as StagingImage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["staging-project-images", data.project_id] });
      queryClient.invalidateQueries({ queryKey: ["staging-projects"] });
    },
  });
};

// Stage image mutation - calls edge function
export const useStageImage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ imageId, templateId }: { imageId: string; templateId?: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('stage-property-image', {
        body: { imageId, templateId }
      });

      if (response.error) throw response.error;
      if (!response.data?.success) throw new Error(response.data?.error || 'Staging failed');
      
      return response.data;
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Image staged successfully!' });
      queryClient.invalidateQueries({ queryKey: ['staging-project-images'] });
      queryClient.invalidateQueries({ queryKey: ['staging-projects'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });
};

// Batch stage multiple images mutation
export const useBatchStageImages = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      imageIds, 
      roomType, 
      stylePreference,
      templateId 
    }: { 
      imageIds: string[]; 
      roomType: string;
      stylePreference: string;
      templateId?: string;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Update all images with room type and style
      await supabase
        .from("staging_images")
        .update({ room_type: roomType, style_preference: stylePreference })
        .in("id", imageIds);

      // Stage each image (they will process in parallel on backend)
      const results = await Promise.allSettled(
        imageIds.map(imageId => 
          supabase.functions.invoke('stage-property-image', {
            body: { imageId, templateId }
          })
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return { successful, failed, total: imageIds.length };
    },
    onSuccess: (data) => {
      toast({ 
        title: 'Batch Staging Started', 
        description: `Processing ${data.total} images.${data.failed > 0 ? ` ${data.failed} failed to start.` : ''}` 
      });
      queryClient.invalidateQueries({ queryKey: ['staging-project-images'] });
      queryClient.invalidateQueries({ queryKey: ['staging-projects'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Batch Staging Error', description: error.message, variant: 'destructive' });
    }
  });
};

export const useDeleteStagingImage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase
        .from("staging_images")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id, projectId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["staging-project-images", data.projectId] });
      queryClient.invalidateQueries({ queryKey: ["staging-projects"] });
      toast({
        title: "Image removed",
        description: "The image has been removed from the project.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing image",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// ==================== STORAGE HELPERS ====================

export const uploadStagingImage = async (
  file: File,
  projectId: string,
  userId: string
): Promise<{ path: string; url: string }> => {
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = `${userId}/${projectId}/original/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("staging-images")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from("staging-images")
    .getPublicUrl(filePath);

  return { path: filePath, url: publicUrl };
};

export const deleteStagingImageFromStorage = async (filePath: string): Promise<void> => {
  const { error } = await supabase.storage
    .from("staging-images")
    .remove([filePath]);

  if (error) throw error;
};
