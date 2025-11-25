import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio?: string;
  email: string;
  phone?: string;
  image_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  category: 'leadership' | 'sales_team';
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTeamMembers = (category?: string, includeInactive: boolean = false) => {
  return useQuery({
    queryKey: ['team-members', category, includeInactive],
    queryFn: async () => {
      let query = supabase
        .from('team_members')
        .select('*')
        .order('display_order');
      
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as TeamMember[];
    }
  });
};

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('team_members')
        .insert(member)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: "Success",
        description: "Team member added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add team member",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TeamMember> & { id: string }) => {
      const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: "Success",
        description: "Team member updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update team member",
        variant: "destructive",
      });
    }
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: "Success",
        description: "Team member deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete team member",
        variant: "destructive",
      });
    }
  });
};

export const useUploadTeamPhoto = () => {
  return useMutation({
    mutationFn: async ({ file, memberId }: { file: File; memberId: string }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${memberId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('team-photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('team-photos')
        .getPublicUrl(filePath);

      return publicUrl;
    },
    onError: (error: any) => {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      });
    }
  });
};
