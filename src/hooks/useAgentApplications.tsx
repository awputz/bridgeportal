import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AgentApplication {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  mailing_address: string | null;
  date_of_birth: string | null;
  license_number: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  divisions: string[];
  bio: string | null;
  headshot_url: string | null;
  id_photo_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  cultural_values_acknowledged: boolean;
  contract_signed: boolean;
  w9_submitted: boolean;
}

export interface CreateApplicationData {
  email: string;
  full_name: string;
  phone: string;
  mailing_address?: string;
  date_of_birth?: string;
  license_number?: string;
  linkedin_url?: string;
  instagram_url?: string;
  divisions: string[];
  bio?: string;
  headshot_url?: string;
  id_photo_url?: string;
  cultural_values_acknowledged?: boolean;
}

export const useAgentApplications = () => {
  return useQuery({
    queryKey: ["agent-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AgentApplication[];
    },
  });
};

export const useAgentApplication = (id: string) => {
  return useQuery({
    queryKey: ["agent-application", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_applications")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as AgentApplication | null;
    },
    enabled: !!id,
  });
};

export const useCreateApplication = () => {
  return useMutation({
    mutationFn: async (application: CreateApplicationData) => {
      const { data, error } = await supabase
        .from("agent_applications")
        .insert(application)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
    },
    onError: (error: any) => {
      if (error.message?.includes("duplicate key")) {
        toast.error("An application with this email already exists");
      } else {
        toast.error(error.message || "Failed to submit application");
      }
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      admin_notes 
    }: { 
      id: string; 
      status: 'approved' | 'rejected'; 
      admin_notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("agent_applications")
        .update({
          status,
          admin_notes,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agent-applications"] });
      queryClient.invalidateQueries({ queryKey: ["agent-application", data.id] });
      toast.success(`Application ${data.status}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update application");
    },
  });
};

export const useUploadApplicationFile = () => {
  return useMutation({
    mutationFn: async ({ file, type }: { file: File; type: 'headshot' | 'id_photo' }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("agent-applications")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("agent-applications")
        .getPublicUrl(filePath);

      return publicUrl;
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload file");
    },
  });
};
