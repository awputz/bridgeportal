import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GitBranch, Calendar, FileText } from "lucide-react";

const stats = [
  {
    title: "Total Candidates",
    value: "0",
    description: "In database",
    icon: Users,
    color: "text-emerald-400",
  },
  {
    title: "In Pipeline",
    value: "0",
    description: "Active prospects",
    icon: GitBranch,
    color: "text-blue-400",
  },
  {
    title: "Interviews This Week",
    value: "0",
    description: "Scheduled",
    icon: Calendar,
    color: "text-purple-400",
  },
  {
    title: "Open Offers",
    value: "0",
    description: "Pending response",
    icon: FileText,
    color: "text-amber-400",
  },
];

export default function HRDashboard() {
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
                <div className="text-2xl font-light">{stat.value}</div>
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
          <CardHeader>
            <CardTitle className="text-lg font-light">Pipeline Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <p className="text-sm">Coming soon in Phase 3</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-light">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <p className="text-sm">Coming soon in Phase 2</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-light">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-center">
              <Users className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <span className="text-sm font-light">Add Agent</span>
            </button>
            <button className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors text-center">
              <GitBranch className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <span className="text-sm font-light">View Pipeline</span>
            </button>
            <button className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors text-center">
              <Calendar className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <span className="text-sm font-light">Schedule Interview</span>
            </button>
            <button className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors text-center">
              <FileText className="h-6 w-6 text-amber-400 mx-auto mb-2" />
              <span className="text-sm font-light">Create Offer</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
