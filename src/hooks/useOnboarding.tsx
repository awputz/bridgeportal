import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface OnboardingStatus {
  onboarding_completed: boolean | null;
  onboarding_step: number | null;
}

export const useOnboardingStatus = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["onboarding-status", user?.id],
    queryFn: async (): Promise<OnboardingStatus | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_completed, onboarding_step")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching onboarding status:", error);
        return null;
      }

      return data as OnboardingStatus | null;
    },
    enabled: !!user?.id,
  });
};

export const useCompleteOnboarding = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("No user");

      const { error } = await supabase
        .from("profiles")
        .update({
          onboarding_completed: true,
          onboarding_step: 4,
        })
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
    },
  });
};

export const useUpdateOnboardingStep = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (step: number) => {
      if (!user?.id) throw new Error("No user");

      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_step: step })
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
    },
  });
};