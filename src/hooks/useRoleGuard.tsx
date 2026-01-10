import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole, UserRole } from "./useUserRole";
import { toast } from "@/hooks/use-toast";

interface UseRoleGuardOptions {
  allowedRoles: UserRole[];
  redirectTo?: string;
  showToast?: boolean;
}

export const useRoleGuard = ({
  allowedRoles,
  redirectTo = "/portal",
  showToast = true,
}: UseRoleGuardOptions) => {
  const { data: role, isLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && role !== null) {
      if (!allowedRoles.includes(role)) {
        if (showToast) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to view this page.",
            variant: "destructive",
          });
        }
        navigate(redirectTo);
      }
    }
  }, [role, isLoading, allowedRoles, navigate, redirectTo, showToast]);

  return {
    isLoading,
    hasAccess: role !== null && allowedRoles.includes(role),
    role,
  };
};

// Convenience hooks
export const useAdminGuard = (redirectTo?: string) =>
  useRoleGuard({ allowedRoles: ["admin"], redirectTo });

export const useAgentOrAdminGuard = (redirectTo?: string) =>
  useRoleGuard({ allowedRoles: ["admin", "agent"], redirectTo });
