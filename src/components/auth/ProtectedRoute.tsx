import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserRole, UserRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  fallbackPath?: string;
}

export const ProtectedRoute = ({
  children,
  allowedRoles = ["admin", "agent"],
  fallbackPath = "/portal",
}: ProtectedRouteProps) => {
  const { data: role, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

// Specific route guards
export const AdminRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={["admin"]} fallbackPath="/portal">
    {children}
  </ProtectedRoute>
);

export const AgentRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={["admin", "agent"]} fallbackPath="/portal">
    {children}
  </ProtectedRoute>
);
