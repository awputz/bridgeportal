import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { FileText, Building2, Calendar, TrendingUp } from "lucide-react";

export const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [inquiries, properties, tours] = await Promise.all([
        supabase.from("inquiries").select("id, status", { count: "exact" }),
        supabase.from("properties").select("id, status", { count: "exact" }),
        supabase.from("tour_requests").select("id, status", { count: "exact" }),
      ]);

      return {
        totalInquiries: inquiries.count || 0,
        newInquiries: inquiries.data?.filter(i => i.status === "new").length || 0,
        activeProperties: properties.data?.filter(p => p.status === "active").length || 0,
        totalProperties: properties.count || 0,
        pendingTours: tours.data?.filter(t => t.status === "pending").length || 0,
        totalTours: tours.count || 0,
      };
    },
  });

  const statCards = [
    {
      title: "Total Inquiries",
      value: stats?.totalInquiries || 0,
      subtitle: `${stats?.newInquiries || 0} new`,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Active Properties",
      value: stats?.activeProperties || 0,
      subtitle: `of ${stats?.totalProperties || 0} total`,
      icon: Building2,
      color: "text-green-600",
    },
    {
      title: "Tour Requests",
      value: stats?.totalTours || 0,
      subtitle: `${stats?.pendingTours || 0} pending`,
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Conversion Rate",
      value: "23%",
      subtitle: "up from last month",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Overview of your real estate business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.subtitle}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Activity feed coming soon...
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Quick action buttons coming soon...
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
