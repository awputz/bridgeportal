import { Users, DollarSign, LogOut, Settings, MapPin, Link2, Layers, Wrench, FileText, Home, Building2, Bell, Mail, FolderOpen, Shield, KeyRound, Activity, Newspaper, ClipboardList, Building, PieChart } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "@/hooks/use-toast";

const overviewItems = [
  { title: "Dashboard", url: "/admin", icon: Home, exact: true },
  { title: "Activity Logs", url: "/admin/activity-logs", icon: Activity },
];

const peopleItems = [
  { title: "Team", url: "/admin/team", icon: Users },
  { title: "Users & Roles", url: "/admin/users", icon: Shield },
  { title: "CRM Overview", url: "/admin/crm-overview", icon: PieChart },
  { title: "Agent Requests", url: "/admin/agent-requests", icon: ClipboardList },
  { title: "Commission Requests", url: "/admin/commission-requests", icon: DollarSign },
];

const dealsItems = [
  { title: "Listings", url: "/admin/listings", icon: Building2 },
  { title: "Deal Room", url: "/admin/deal-room", icon: KeyRound },
  { title: "Closed Deals", url: "/admin/transactions", icon: DollarSign },
];

const communicationsItems = [
  { title: "Inquiries", url: "/admin/inquiries", icon: Mail },
  { title: "Announcements", url: "/admin/announcements", icon: Bell },
  { title: "Newsletter", url: "/admin/newsletter", icon: Newspaper },
];

const propertiesItems = [
  { title: "Buildings", url: "/admin/buildings", icon: Building },
];

const cmsItems = [
  { title: "Settings", url: "/admin/settings", icon: Settings },
  { title: "CRM Config", url: "/admin/crm-config", icon: PieChart },
  { title: "Services", url: "/admin/services", icon: Layers },
  { title: "Markets", url: "/admin/markets", icon: MapPin },
  { title: "Listing Links", url: "/admin/listing-links", icon: Link2 },
  { title: "Tools", url: "/admin/tools", icon: Wrench },
  { title: "Templates", url: "/admin/templates", icon: FileText },
  { title: "Resources", url: "/admin/resources", icon: FolderOpen },
];

export function AdminSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  const renderMenuGroup = (items: typeof overviewItems, label: string) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = (item as any).exact 
              ? currentPath === item.url 
              : currentPath.startsWith(item.url);
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <NavLink 
                    to={item.url} 
                    end={(item as any).exact}
                    className="flex items-center gap-3"
                  >
                    <item.icon className="h-4 w-4" />
                    {open && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar className={open ? "w-64" : "w-16"} collapsible="icon">
      <SidebarContent>
        {renderMenuGroup(overviewItems, "Overview")}
        {renderMenuGroup(peopleItems, "People")}
        {renderMenuGroup(dealsItems, "Deals")}
        {renderMenuGroup(communicationsItems, "Communications")}
        {renderMenuGroup(propertiesItems, "Properties")}
        {renderMenuGroup(cmsItems, "CMS & Settings")}

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/portal" className="flex items-center gap-3">
                    <Building2 className="h-4 w-4" />
                    {open && <span>Agent Portal</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="flex items-center gap-3">
                  <LogOut className="h-4 w-4" />
                  {open && <span>Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
