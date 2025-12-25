import { Link } from "react-router-dom";
import { Users, DollarSign, FileText, Settings, Layers, MapPin, Link2, Wrench, ArrowRight, TrendingUp, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useTransactions } from "@/hooks/useTransactions";
import { Skeleton } from "@/components/ui/skeleton";

const AdminDashboard = () => {
  const { data: teamMembers, isLoading: teamLoading } = useTeamMembers();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();

  const activeTeamMembers = teamMembers?.filter(m => m.is_active)?.length || 0;
  const totalTransactions = transactions?.length || 0;
  const ytdTransactions = transactions?.filter(t => {
    const year = t.closing_date ? new Date(t.closing_date).getFullYear() : t.year;
    return year === new Date().getFullYear();
  })?.length || 0;

  const quickActions = [
    { name: "Team Management", path: "/admin/team", icon: Users, description: "Add/edit team members" },
    { name: "Closed Deals", path: "/admin/transactions", icon: DollarSign, description: "Manage transactions" },
    { name: "Settings", path: "/admin/settings", icon: Settings, description: "Site configuration" },
    { name: "Services", path: "/admin/services", icon: Layers, description: "Manage services" },
    { name: "Markets", path: "/admin/markets", icon: MapPin, description: "Configure markets" },
    { name: "Listing Links", path: "/admin/listing-links", icon: Link2, description: "Manage listing links" },
    { name: "Tools", path: "/admin/tools", icon: Wrench, description: "External tools config" },
    { name: "Templates", path: "/admin/templates", icon: FileText, description: "Agent templates" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your team, transactions, and site configuration</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Team Members</p>
                {teamLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-light text-foreground">{activeTeamMembers}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                {transactionsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-light text-foreground">{totalTransactions}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">YTD Transactions</p>
                {transactionsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-light text-foreground">{ytdTransactions}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-light text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.path} to={action.path}>
                <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{action.name}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Back to Portal */}
      <div className="pt-4">
        <Link to="/portal">
          <Button variant="outline" className="gap-2">
            <Building2 className="h-4 w-4" />
            Back to Agent Portal
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
