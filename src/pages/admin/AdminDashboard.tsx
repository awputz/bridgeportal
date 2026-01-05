import { Link } from "react-router-dom";
import { 
  Users, DollarSign, FileText, Settings, Layers, MapPin, Link2, Wrench, 
  TrendingUp, Building2, Mail, MessageSquare, ClipboardList, Activity,
  AlertCircle, Clock, ArrowRight, Home
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useTransactions } from "@/hooks/useTransactions";
import { useInquiries } from "@/hooks/useInquiries";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { useAgentRequestsAdmin } from "@/hooks/useAgentRequestsAdmin";
import { useNewsletterAdmin } from "@/hooks/useNewsletterAdmin";
import { useInvestmentListingsAdmin, useCommercialListingsAdmin } from "@/hooks/useListingsAdmin";
import { useDealRoomRegistrations } from "@/hooks/useDealRoomAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

const AdminDashboard = () => {
  const { data: teamMembers, isLoading: teamLoading } = useTeamMembers();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();
  const { data: inquiries, isLoading: inquiriesLoading } = useInquiries();
  const { logs: activityLogs, isLoading: activityLoading } = useActivityLogs();
  const { requests: agentRequests, isLoading: requestsLoading } = useAgentRequestsAdmin();
  const { subscriptions: newsletter, isLoading: newsletterLoading } = useNewsletterAdmin();
  const { listings: investmentListings, isLoading: investmentLoading } = useInvestmentListingsAdmin();
  const { listings: commercialListings, isLoading: commercialLoading } = useCommercialListingsAdmin();
  const { registrations, isLoading: isLoadingRegistrations } = useDealRoomRegistrations();

  // Stats calculations
  const activeTeamMembers = teamMembers?.filter(m => m.is_active)?.length || 0;
  const totalTransactions = transactions?.length || 0;
  const ytdTransactions = transactions?.filter(t => {
    const year = t.closing_date ? new Date(t.closing_date).getFullYear() : t.year;
    return year === new Date().getFullYear();
  })?.length || 0;

  const activeInvestmentListings = investmentListings?.filter(l => l.is_active)?.length || 0;
  const activeCommercialListings = commercialListings?.filter(l => l.is_active)?.length || 0;
  const pendingInquiries = inquiries?.length || 0;
  const pendingRequests = agentRequests?.filter(r => r.status === "pending")?.length || 0;
  const activeSubscribers = newsletter?.filter(s => s.is_active)?.length || 0;
  const recentRegistrations = registrations?.length || 0;

  // Transactions by month for chart
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    return {
      month: format(date, "MMM"),
      start: startOfMonth(date),
      end: endOfMonth(date),
      count: 0
    };
  });

  transactions?.forEach(t => {
    if (t.closing_date) {
      const closingDate = new Date(t.closing_date);
      const monthData = last6Months.find(m => 
        isWithinInterval(closingDate, { start: m.start, end: m.end })
      );
      if (monthData) monthData.count++;
    }
  });

  const chartData = last6Months.map(m => ({ name: m.month, transactions: m.count }));

  // Team by division for pie chart
  const teamByDivision = teamMembers?.reduce((acc: Record<string, number>, member) => {
    const category = member.category || "Other";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {}) || {};

  const pieData = Object.entries(teamByDivision).map(([name, value]) => ({ name, value }));
  const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

  // Quick actions
  const quickActions = [
    { name: "Team", path: "/admin/team", icon: Users, description: "Manage agents" },
    { name: "Closed Deals", path: "/admin/transactions", icon: DollarSign, description: "Transactions" },
    { name: "Listings", path: "/admin/listings", icon: Building2, description: "Investment & Commercial" },
    { name: "Inquiries", path: "/admin/inquiries", icon: MessageSquare, description: "Customer inquiries" },
    { name: "Users & Roles", path: "/admin/users", icon: Users, description: "Manage access" },
    { name: "Deal Room", path: "/admin/deal-room", icon: FileText, description: "Registrations & docs" },
    { name: "Agent Requests", path: "/admin/agent-requests", icon: ClipboardList, description: "Process requests" },
    { name: "Settings", path: "/admin/settings", icon: Settings, description: "Configuration" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extralight text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Command center for operations management</p>
        </div>
        <Link to="/portal">
          <Button variant="outline" size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            Portal
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Team</p>
                {teamLoading ? <Skeleton className="h-6 w-10" /> : (
                  <p className="text-2xl font-light text-foreground">{activeTeamMembers}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">YTD Deals</p>
                {transactionsLoading ? <Skeleton className="h-6 w-10" /> : (
                  <p className="text-2xl font-light text-foreground">{ytdTransactions}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Listings</p>
                {investmentLoading || commercialLoading ? <Skeleton className="h-6 w-10" /> : (
                  <p className="text-2xl font-light text-foreground">{activeInvestmentListings + activeCommercialListings}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Inquiries</p>
                {inquiriesLoading ? <Skeleton className="h-6 w-10" /> : (
                  <p className="text-2xl font-light text-foreground">{pendingInquiries}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Subscribers</p>
                {newsletterLoading ? <Skeleton className="h-6 w-10" /> : (
                  <p className="text-2xl font-light text-foreground">{activeSubscribers}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Deal Room</p>
                {isLoadingRegistrations ? <Skeleton className="h-6 w-10" /> : (
                  <p className="text-2xl font-light text-foreground">{recentRegistrations}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions Chart */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Transactions (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Bar dataKey="transactions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Team Breakdown */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Team by Division
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teamLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {pieData.map((entry, index) => (
                <Badge key={entry.name} variant="secondary" className="text-xs" style={{ borderColor: COLORS[index % COLORS.length] }}>
                  {entry.name}: {entry.value}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Items & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Items */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Pending Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingRequests > 0 && (
              <Link to="/admin/agent-requests" className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-foreground">Agent Requests</span>
                </div>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-500">{pendingRequests}</Badge>
              </Link>
            )}
            {pendingInquiries > 0 && (
              <Link to="/admin/inquiries" className="flex items-center justify-between p-3 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-foreground">New Inquiries</span>
                </div>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-500">{pendingInquiries}</Badge>
              </Link>
            )}
            {pendingRequests === 0 && pendingInquiries === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No pending items</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <Link to="/admin/activity-logs">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : activityLogs && activityLogs.length > 0 ? (
              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {activityLogs.slice(0, 8).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground truncate">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.entity_type && <span className="capitalize">{log.entity_type}</span>}
                        {log.created_at && ` • ${format(new Date(log.created_at), "MMM d, h:mm a")}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.path} to={action.path}>
                <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{action.name}</p>
                        <p className="text-xs text-muted-foreground hidden md:block">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
