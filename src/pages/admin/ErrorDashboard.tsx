import { useState } from "react";
import { format } from "date-fns";
import { 
  AlertCircle, 
  Users, 
  TrendingUp, 
  Search, 
  ExternalLink,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useClientErrors, useErrorStats, ClientError } from "@/hooks/useClientErrors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";

const ErrorDashboard = () => {
  const [search, setSearch] = useState("");
  const [expandedError, setExpandedError] = useState<string | null>(null);
  
  const { data: errors, isLoading: errorsLoading, refetch } = useClientErrors({ limit: 100 });
  const { data: stats, isLoading: statsLoading } = useErrorStats();

  const filteredErrors = errors?.filter((e) =>
    e.error_message.toLowerCase().includes(search.toLowerCase()) ||
    e.section?.toLowerCase().includes(search.toLowerCase()) ||
    e.url?.toLowerCase().includes(search.toLowerCase())
  );

  const topSection = stats?.bySection
    ? Object.entries(stats.bySection).sort(([, a], [, b]) => b - a)[0]
    : null;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extralight text-foreground">
              Error Dashboard
            </h1>
            <p className="text-muted-foreground font-light mt-1">
              Monitor frontend errors across the portal
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Errors (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-semibold text-foreground">
                  {stats?.totalErrors || 0}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users Affected
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-semibold text-foreground">
                  {stats?.uniqueUsersAffected || 0}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Top Section
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : topSection ? (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-lg font-medium">
                    {topSection[0]}
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    ({topSection[1]} errors)
                  </span>
                </div>
              ) : (
                <p className="text-muted-foreground">No errors</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timeline Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-light">Error Timeline (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={stats?.byHour || []}>
                  <defs>
                    <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="hour" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--destructive))"
                    fill="url(#errorGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Error Table */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-light">Recent Errors</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search errors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {errorsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredErrors && filteredErrors.length > 0 ? (
                <div className="space-y-2">
                  {filteredErrors.map((error) => (
                    <ErrorRow
                      key={error.id}
                      error={error}
                      isExpanded={expandedError === error.id}
                      onToggle={() =>
                        setExpandedError(expandedError === error.id ? null : error.id)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No errors found</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface ErrorRowProps {
  error: ClientError;
  isExpanded: boolean;
  onToggle: () => void;
}

const ErrorRow = ({ error, isExpanded, onToggle }: ErrorRowProps) => {
  return (
    <div className="border border-border/30 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start justify-between gap-4 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs">
              {error.section || "unknown"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {format(new Date(error.created_at), "MMM d, h:mm a")}
            </span>
          </div>
          <p className="text-sm text-foreground truncate">{error.error_message}</p>
          {error.url && (
            <p className="text-xs text-muted-foreground truncate mt-1">{error.url}</p>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
          {error.stack_trace && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Stack Trace</p>
              <pre className="text-xs bg-muted/20 p-3 rounded-lg overflow-x-auto max-h-40">
                {error.stack_trace}
              </pre>
            </div>
          )}
          {error.component_stack && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Component Stack</p>
              <pre className="text-xs bg-muted/20 p-3 rounded-lg overflow-x-auto max-h-40">
                {error.component_stack}
              </pre>
            </div>
          )}
          <div className="flex gap-4 text-xs text-muted-foreground">
            {error.user_id && (
              <span>User: {error.user_id.slice(0, 8)}...</span>
            )}
            {error.user_agent && (
              <span className="truncate max-w-xs">UA: {error.user_agent}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorDashboard;
