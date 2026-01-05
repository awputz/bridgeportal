import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface IntakeLink {
  id: string;
  agent_id: string;
  link_code: string;
  name: string;
  division: string | null;
  is_active: boolean;
  expires_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface IntakeSubmission {
  id: string;
  link_id: string | null;
  agent_id: string;
  division: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_company: string | null;
  criteria: Record<string, unknown>;
  notes: string | null;
  status: string;
  contacted_at: string | null;
  converted_contact_id: string | null;
  converted_deal_id: string | null;
  is_general_inquiry: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

// Generate a unique link code
const generateLinkCode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Fetch list of agents for the universal intake form
export const useAgentsList = () => {
  return useQuery({
    queryKey: ["agents-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url")
        .eq("user_type", "agent")
        .order("full_name");
      
      if (error) throw error;
      return data as AgentProfile[];
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
};
// Fetch or auto-create the agent's single intake link
export const useMyIntakeLink = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ["my-intake-link", user?.id],
    queryFn: async () => {
      // First, try to fetch existing link
      const { data: existingLink, error: fetchError } = await supabase
        .from("client_intake_links")
        .select("*")
        .eq("agent_id", user!.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // If link exists, return it
      if (existingLink) {
        return existingLink as IntakeLink;
      }

      // Otherwise, create a new one
      const linkCode = generateLinkCode();
      const { data: newLink, error: createError } = await supabase
        .from("client_intake_links")
        .insert({
          agent_id: user!.id,
          link_code: linkCode,
          name: "Client Intake",
          division: null,
          is_active: true,
          expires_at: null,
        })
        .select()
        .single();

      if (createError) throw createError;
      
      return newLink as IntakeLink;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Fetch a single intake link by code (for public form)
export const useIntakeLinkByCode = (linkCode: string) => {
  return useQuery({
    queryKey: ["intake-link", linkCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_intake_links")
        .select("*")
        .eq("link_code", linkCode)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Link not found or expired");
      
      // Check expiration
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        throw new Error("This link has expired");
      }
      
      return data as IntakeLink;
    },
    enabled: !!linkCode,
    retry: false,
  });
};

// Fetch agent's intake submissions
export const useIntakeSubmissions = (filters?: { division?: string; status?: string }) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["intake-submissions", user?.id, filters],
    queryFn: async () => {
      let query = supabase
        .from("client_intake_submissions")
        .select("*")
        .eq("agent_id", user!.id)
        .order("created_at", { ascending: false });

      if (filters?.division) {
        query = query.eq("division", filters.division);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as IntakeSubmission[];
    },
    enabled: !!user,
  });
};

// Fetch intake stats
export const useIntakeStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["intake-stats", user?.id],
    queryFn: async () => {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from("client_intake_submissions")
        .select("id, status, created_at")
        .eq("agent_id", user!.id);

      if (error) throw error;

      const total = data.length;
      const thisWeek = data.filter(s => new Date(s.created_at) >= weekAgo).length;
      const newSubmissions = data.filter(s => s.status === 'new').length;

      return { total, thisWeek, newSubmissions };
    },
    enabled: !!user,
  });
};

// Create a submission (for public form) - supports both agent-specific and general inquiries
export const useCreateIntakeSubmission = () => {
  return useMutation({
    mutationFn: async (data: {
      link_id?: string;
      agent_id: string | null;
      division: string;
      client_name: string;
      client_email: string;
      client_phone?: string;
      client_company?: string;
      criteria: Record<string, unknown>;
      notes?: string;
      is_general_inquiry?: boolean;
    }) => {
      // For general inquiries without an agent, we need a placeholder agent_id
      // We'll use a system account or the first admin - this should be handled properly in production
      let agentId = data.agent_id;
      
      if (!agentId && data.is_general_inquiry) {
        // Fetch first admin user as placeholder for general inquiries
        const { data: admins } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "admin")
          .limit(1);
        
        if (admins && admins.length > 0) {
          agentId = admins[0].user_id;
        } else {
          throw new Error("No admin found to handle general inquiry");
        }
      }

      if (!agentId) {
        throw new Error("Agent ID is required");
      }

      const { data: submission, error } = await supabase
        .from("client_intake_submissions")
        .insert({
          link_id: data.link_id || null,
          agent_id: agentId,
          division: data.division,
          client_name: data.client_name,
          client_email: data.client_email,
          client_phone: data.client_phone || null,
          client_company: data.client_company || null,
          criteria: data.criteria as unknown as Record<string, never>,
          notes: data.notes || null,
          is_general_inquiry: data.is_general_inquiry || false,
        })
        .select()
        .single();

      if (error) throw error;
      return submission as IntakeSubmission;
    },
  });
};

// Update submission status
export const useUpdateSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, contacted_at }: { id: string; status?: string; contacted_at?: string }) => {
      const updateData: Record<string, unknown> = {};
      if (status) updateData.status = status;
      if (contacted_at) updateData.contacted_at = contacted_at;
      
      const { data, error } = await supabase
        .from("client_intake_submissions")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as IntakeSubmission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intake-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["intake-stats"] });
    },
  });
};

// Convert submission to CRM contact
export const useConvertToContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ submission, division }: { submission: IntakeSubmission; division: string }) => {
      // Create CRM contact
      const { data: contact, error: contactError } = await supabase
        .from("crm_contacts")
        .insert({
          agent_id: submission.agent_id,
          full_name: submission.client_name,
          email: submission.client_email,
          phone: submission.client_phone,
          company: submission.client_company,
          division,
          contact_type: "prospect",
          source: "intake_form",
          notes: `Criteria from intake form:\n${JSON.stringify(submission.criteria, null, 2)}`,
        })
        .select()
        .single();

      if (contactError) throw contactError;

      // Update submission with converted contact id
      const { error: updateError } = await supabase
        .from("client_intake_submissions")
        .update({ 
          converted_contact_id: contact.id,
          status: 'converted'
        })
        .eq("id", submission.id);

      if (updateError) throw updateError;

      return contact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intake-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["crm-contacts"] });
      toast.success("Contact created from submission!");
    },
    onError: (error) => {
      toast.error("Failed to convert: " + error.message);
    },
  });
};
