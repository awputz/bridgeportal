import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInvestorAgentPerformance, useDivisionBreakdown } from "@/hooks/useInvestorData";
import { TrendingUp, Users, DollarSign, BarChart3, ChevronDown, ChevronUp } from "lucide-react";

const Performance = () => {
  const [sortBy, setSortBy] = useState<"volume" | "deals" | "commission">("volume");
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  
  const { data: agentPerformance, isLoading: loadingAgents } = useInvestorAgentPerformance();
  const { data: divisionData, isLoading: loadingDivisions } = useDivisionBreakdown();

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const sortedAgents = agentPerformance?.slice().sort((a, b) => {
    if (sortBy === "volume") return b.volume - a.volume;
    if (sortBy === "deals") return b.deals - a.deals;
    return b.commission - a.commission;
  });

  if (loadingAgents || loadingDivisions) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Calculate totals
  const totalDeals = agentPerformance?.reduce((sum, a) => sum + a.deals, 0) || 0;
  const totalVolume = agentPerformance?.reduce((sum, a) => sum + a.volume, 0) || 0;
  const totalCommission = agentPerformance?.reduce((sum, a) => sum + a.commission, 0) || 0;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-light text-foreground">Agent Performance</h1>
        <p className="text-muted-foreground mt-1">View team performance metrics and rankings</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentPerformance?.length || 0}</div>
            <p className="text-xs text-muted-foreground">With closed deals</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalVolume)}</div>
            <p className="text-xs text-muted-foreground">{totalDeals} total deals</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCommission)}</div>
            <p className="text-xs text-muted-foreground">Avg: {formatCurrency(totalCommission / (agentPerformance?.length || 1))}</p>
          </CardContent>
        </Card>
      </div>

      {/* Division Breakdown */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-sky-400" />
            <CardTitle className="text-lg font-medium">Division Breakdown</CardTitle>
          </div>
          <CardDescription>Performance by business division</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {divisionData?.map((division) => (
              <div
                key={division.name}
                className="rounded-lg border border-border/50 p-4 hover:bg-muted/50 transition-colors"
              >
                <p className="text-sm font-medium text-foreground">{division.name}</p>
                <p className="text-xl font-bold text-sky-400 mt-1">{formatCurrency(division.volume)}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>{division.count} deals</span>
                  <span>•</span>
                  <span>{formatCurrency(division.commission)} comm.</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agent Leaderboard */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-medium">Agent Leaderboard</CardTitle>
              <CardDescription>Click to expand agent details</CardDescription>
            </div>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="volume">Sort by Volume</SelectItem>
                <SelectItem value="deals">Sort by Deals</SelectItem>
                <SelectItem value="commission">Sort by Commission</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedAgents?.map((agent, index) => (
              <div
                key={agent.name}
                className="rounded-lg border border-border/50 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedAgent(expandedAgent === agent.name ? null : agent.name)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-400/10 text-sky-400 text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{agent.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {agent.divisions.slice(0, 2).map((div) => (
                          <Badge key={div} variant="secondary" className="text-xs">
                            {div}
                          </Badge>
                        ))}
                        {agent.divisions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{agent.divisions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-medium text-foreground">{formatCurrency(agent.volume)}</p>
                      <p className="text-xs text-muted-foreground">Volume</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-medium text-foreground">{agent.deals}</p>
                      <p className="text-xs text-muted-foreground">Deals</p>
                    </div>
                    <div className="text-right hidden lg:block">
                      <p className="text-sm font-medium text-foreground">{formatCurrency(agent.commission)}</p>
                      <p className="text-xs text-muted-foreground">Commission</p>
                    </div>
                    {expandedAgent === agent.name ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
                {expandedAgent === agent.name && (
                  <div className="border-t border-border/50 bg-muted/30 p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Volume</p>
                        <p className="text-lg font-bold text-foreground">{formatCurrency(agent.volume)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Deals</p>
                        <p className="text-lg font-bold text-foreground">{agent.deals}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Commission</p>
                        <p className="text-lg font-bold text-foreground">{formatCurrency(agent.commission)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avg Deal Size</p>
                        <p className="text-lg font-bold text-foreground">{formatCurrency(agent.avgDealSize)}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Active Divisions</p>
                      <div className="flex flex-wrap gap-2">
                        {agent.divisions.map((div) => (
                          <Badge key={div} variant="secondary">{div}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Performance;
