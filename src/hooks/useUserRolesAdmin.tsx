import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type AppRole = "admin" | "agent" | "investor" | "user";
type Division = "investment-sales" | "commercial-leasing" | "residential";

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string | null;
  roles: Array<{ role: AppRole; assigned_division: Division | null }>;
}

export function useUserRolesAdmin() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users-roles"],
    queryFn: async () => {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name, created_at")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get all user roles including assigned_division
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role, assigned_division");

      if (rolesError) throw rolesError;

      // Combine profiles with their roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => ({
        ...profile,
        roles: (roles || [])
          .filter((r) => r.user_id === profile.id)
          .map((r) => ({ 
            role: r.role as AppRole, 
            assigned_division: r.assigned_division as Division | null 
          })),
      }));

      return usersWithRoles;
    },
  });

  const addRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-roles"] });
      toast({ title: "Role added successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to add role", description: error.message, variant: "destructive" });
    },
  });

  const removeRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-roles"] });
      toast({ title: "Role removed successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to remove role", description: error.message, variant: "destructive" });
    },
  });

  const updateDivision = useMutation({
    mutationFn: async ({ userId, division }: { userId: string; division: Division | null }) => {
      const { error } = await supabase
        .from("user_roles")
        .update({ assigned_division: division })
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-roles"] });
      queryClient.invalidateQueries({ queryKey: ["userAssignedDivision"] });
      toast({ title: "Division updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update division", description: error.message, variant: "destructive" });
    },
  });

  return {
    users,
    isLoading,
    addRole,
    removeRole,
    updateDivision,
  };
}
