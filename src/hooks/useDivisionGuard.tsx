import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Division = "investment-sales" | "commercial-leasing" | "residential" | "marketing";

export const useUserDivision = () => {
  return useQuery({
    queryKey: ["userDivision"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_roles")
        .select("assigned_division, role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user division:", error);
        return null;
      }

      return {
        division: data?.assigned_division as Division | null,
        role: data?.role as string | null,
        isAdmin: data?.role === "admin",
      };
    },
  });
};

export const useCanAccessDivision = (targetDivision: Division) => {
  const { data, isLoading } = useUserDivision();

  return {
    isLoading,
    canAccess: data?.isAdmin || data?.division === targetDivision || targetDivision === "marketing",
    userDivision: data?.division,
    isAdmin: data?.isAdmin,
  };
};
