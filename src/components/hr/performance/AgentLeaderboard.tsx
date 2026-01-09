import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, RefreshCw, ExternalLink } from "lucide-react";
import { formatFullCurrency } from "@/lib/formatters";
import { useProductionLeaderboard, useRefreshProductionSummary } from "@/hooks/hr/useAgentProduction";

const divisions = [
  { value: "all", label: "All Divisions" },
  { value: "residential", label: "Residential" },
  { value: "commercial-leasing", label: "Commercial Leasing" },
  { value: "investment-sales", label: "Investment Sales" },
];

interface AgentLeaderboardProps {
  compact?: boolean;
  limit?: number;
}

export function AgentLeaderboard({ compact = false, limit }: AgentLeaderboardProps) {
  const [division, setDivision] = useState("all");
  
  const { data: leaderboard, isLoading } = useProductionLeaderboard({
    division: division === "all" ? undefined : division,
    status: "active",
    limit: limit,
  });
  
  const refreshMutation = useRefreshProductionSummary();

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="w-5 text-center text-muted-foreground">{index + 1}</span>;
    }
  };

  const getDivisionBadge = (div: string) => {
    const colors: Record<string, string> = {
      residential: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      "commercial-leasing": "bg-purple-500/10 text-purple-400 border-purple-500/20",
      "investment-sales": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };
    return colors[div] || "bg-muted text-muted-foreground";
  };

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-light flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Top Performers
            </CardTitle>
            <Link to="/hr/performance">
              <Button variant="ghost" size="sm">
                View All
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />
              ))}
            </div>
          ) : !leaderboard?.length ? (
            <p className="text-sm text-muted-foreground">No production data yet</p>
          ) : (
            <div className="space-y-3">
              {leaderboard.slice(0, 3).map((agent, index) => (
                <Link
                  key={agent.active_agent_id}
                  to={`/hr/active-agents/${agent.active_agent_id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getRankIcon(index)}
                    <div>
                      <p className="font-medium text-sm">{agent.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {agent.total_deals} deals
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-emerald-400">
                    {formatFullCurrency(agent.total_volume)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-light">Agent Leaderboard</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={division} onValueChange={setDivision}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refreshMutation.mutate()}
              disabled={refreshMutation.isPending}
            >
              <RefreshCw className={`h-4 w-4 ${refreshMutation.isPending ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        ) : !leaderboard?.length ? (
          <p className="text-muted-foreground text-center py-8">
            No production data available
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Rank</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Division</TableHead>
                <TableHead className="text-right">Deals</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">Commission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((agent, index) => (
                <TableRow key={agent.active_agent_id}>
                  <TableCell>
                    <div className="flex justify-center">{getRankIcon(index)}</div>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/hr/active-agents/${agent.active_agent_id}`}
                      className="font-medium hover:text-emerald-400 transition-colors"
                    >
                      {agent.full_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getDivisionBadge(agent.division)}>
                      {agent.division.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{agent.total_deals}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatFullCurrency(agent.total_volume)}
                  </TableCell>
                  <TableCell className="text-right text-emerald-400">
                    {formatFullCurrency(agent.total_commission)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
