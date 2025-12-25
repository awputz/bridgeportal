import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "agent" | "investor" | "user" | null;

export const useUserRole = () => {
  return useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }

      return data?.role as UserRole;
    },
  });
};

export const useIsAdminOrAgent = () => {
  const { data: role, isLoading } = useUserRole();
  return {
    isAdminOrAgent: role === "admin" || role === "agent",
    isLoading,
    role,
  };
};
