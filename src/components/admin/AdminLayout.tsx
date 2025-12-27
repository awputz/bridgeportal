import { Navigate, Outlet, Link } from "react-router-dom";
import { useIsAdminOrAgent } from "@/hooks/useUserRole";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNotificationCenter } from "./AdminNotificationCenter";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export const AdminLayout = () => {
  const { isAdminOrAgent, isLoading } = useIsAdminOrAgent();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdminOrAgent) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 bg-background sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-2" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">B</span>
                </div>
                <span className="text-lg font-semibold hidden sm:block">BRIDGE Admin</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AdminNotificationCenter />
              <Link to="/portal">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Agent Portal</span>
                </Button>
              </Link>
            </div>
          </header>
          
          <main className="flex-1 p-4 md:p-6 bg-muted/30 overflow-auto">
            <Outlet />
          </main>
          
          {/* Subtle BOSS watermark */}
          <div className="hidden md:flex fixed bottom-4 right-4 items-center gap-1.5 opacity-20 hover:opacity-40 transition-opacity z-10 pointer-events-none">
            <span className="text-[9px] text-muted-foreground font-light">Powered by</span>
            <img 
              src="/assets/boss-logo-white.png" 
              alt="Brokerage Operating System" 
              className="h-3 w-auto"
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
