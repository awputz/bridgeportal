import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GitBranch, Calendar, FileText, Loader2, ArrowRight, ClipboardList, TrendingUp } from "lucide-react";
import { useHRAnalytics } from "@/hooks/hr/useHRAnalytics";
import { useAgentApplications } from "@/hooks/useAgentApplications";
import { AgentLeaderboard } from "@/components/hr/performance/AgentLeaderboard";

export default function HRDashboard() {
  const { data, isLoading } = useHRAnalytics();
  const { data: applications, isLoading: applicationsLoading } = useAgentApplications();
  
  const pendingApplications = applications?.filter(a => a.status === "pending") || [];

  const stats = [
    {
      title: "Total Candidates",
      value: isLoading ? "—" : data?.totalAgents.toString() || "0",
      description: "In database",
      icon: Users,
      color: "text-emerald-400",
    },
    {
      title: "In Pipeline",
      value: isLoading ? "—" : data?.agentsInPipeline.toString() || "0",
      description: "Active prospects",
      icon: GitBranch,
      color: "text-blue-400",
    },
    {
      title: "Total Interviews",
      value: isLoading ? "—" : data?.totalInterviews.toString() || "0",
      description: `${data?.passRate.toFixed(0) || 0}% pass rate`,
      icon: Calendar,
      color: "text-purple-400",
    },
    {
      title: "Open Offers",
      value: isLoading ? "—" : data?.offersByStatus.find(s => s.status === 'sent')?.count.toString() || "0",
      description: "Pending response",
      icon: FileText,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extralight tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Recruitment overview and key metrics
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-light text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-light">Pipeline Overview</CardTitle>
            <Link 
              to="/hr/pipeline" 
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              View Pipeline <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.pipelineByStatus.slice(0, 5).map((status) => (
                <div key={status.status} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground capitalize">
                    {status.status.replace('-', ' ')}
                  </span>
                  <span className="text-sm font-light">{status.count}</span>
                </div>
              )) || (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <p className="text-sm">No pipeline data yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-light">Performance Insights</CardTitle>
            <Link 
              to="/hr/analytics" 
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              View Analytics <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Acceptance Rate</span>
                <span className="text-sm font-light">{data?.acceptanceRate.toFixed(1) || 0}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Time to Sign</span>
                <span className="text-sm font-light">{data?.avgTimeToSign.toFixed(1) || 0} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Campaigns</span>
                <span className="text-sm font-light">{data?.activeCampaigns || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Hires</span>
                <span className="text-sm font-light text-emerald-400">
                  {data?.pipelineByStatus.find(s => s.status === 'hired')?.count || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Applications Alert */}
      {pendingApplications.length > 0 && (
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-light flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-amber-400" />
              Pending Applications
            </CardTitle>
            <Link 
              to="/hr/applications" 
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {pendingApplications.length} application{pendingApplications.length !== 1 ? 's' : ''} awaiting review
            </p>
            <div className="space-y-2">
              {pendingApplications.slice(0, 3).map((app) => (
                <Link
                  key={app.id}
                  to={`/hr/applications/${app.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {app.headshot_url ? (
                      <img src={app.headshot_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-emerald-400 text-xs font-medium">{app.full_name.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{app.full_name}</p>
                      <p className="text-xs text-muted-foreground">{app.divisions.join(', ')}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Performers */}
      <AgentLeaderboard compact limit={3} />

      {/* Quick actions */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-light">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Link to="/hr/applications" className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors text-center relative">
              <ClipboardList className="h-6 w-6 text-amber-400 mx-auto mb-2" />
              <span className="text-sm font-light">Applications</span>
              {pendingApplications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-amber-500 text-xs rounded-full flex items-center justify-center text-black font-medium">
                  {pendingApplications.length}
                </span>
              )}
            </Link>
            <Link to="/hr/agents" className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-center">
              <Users className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <span className="text-sm font-light">View Agents</span>
            </Link>
            <Link to="/hr/pipeline" className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors text-center">
              <GitBranch className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <span className="text-sm font-light">View Pipeline</span>
            </Link>
            <Link to="/hr/interviews" className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors text-center">
              <Calendar className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <span className="text-sm font-light">View Interviews</span>
            </Link>
            <Link to="/hr/offers" className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors text-center">
              <FileText className="h-6 w-6 text-rose-400 mx-auto mb-2" />
              <span className="text-sm font-light">View Offers</span>
            </Link>
            <Link to="/hr/performance" className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors text-center">
              <TrendingUp className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
              <span className="text-sm font-light">Performance</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
