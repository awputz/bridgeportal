import { useState } from "react";
import { Trophy, TrendingUp, Users, CheckCircle, Medal, Crown, Award } from "lucide-react";
import { useAgentLeaderboard, LeaderboardEntry } from "@/hooks/useAgentLeaderboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type MetricType = 'volume' | 'deals' | 'contacts' | 'activities';
type PeriodType = 'all-time' | 'ytd' | 'monthly';

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-400" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-300" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return <span className="text-muted-foreground font-medium w-5 text-center">{rank}</span>;
  }
};

const getRankBg = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border-yellow-500/30';
    case 2:
      return 'bg-gradient-to-r from-gray-400/20 to-gray-400/5 border-gray-400/30';
    case 3:
      return 'bg-gradient-to-r from-amber-600/20 to-amber-600/5 border-amber-600/30';
    default:
      return 'bg-card/50';
  }
};

const sortByMetric = (data: LeaderboardEntry[], metric: MetricType): LeaderboardEntry[] => {
  return [...data].sort((a, b) => {
    switch (metric) {
      case 'volume':
        return b.total_volume - a.total_volume;
      case 'deals':
        return b.deals_closed - a.deals_closed;
      case 'contacts':
        return b.contacts_added - a.contacts_added;
      case 'activities':
        return b.activities_completed - a.activities_completed;
      default:
        return 0;
    }
  });
};

const LeaderboardTable = ({ 
  data, 
  metric, 
  isLoading 
}: { 
  data: LeaderboardEntry[]; 
  metric: MetricType; 
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const sortedData = sortByMetric(data, metric);
  const topThree = sortedData.slice(0, 3);
  const rest = sortedData.slice(3, 10);

  const getMetricValue = (entry: LeaderboardEntry) => {
    switch (metric) {
      case 'volume':
        return formatCurrency(entry.total_volume);
      case 'deals':
        return entry.deals_closed;
      case 'contacts':
        return entry.contacts_added;
      case 'activities':
        return entry.activities_completed;
    }
  };

  const getMetricLabel = () => {
    switch (metric) {
      case 'volume':
        return 'Total Volume';
      case 'deals':
        return 'Deals Closed';
      case 'contacts':
        return 'Contacts Added';
      case 'activities':
        return 'Activities';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4">
        {topThree.map((entry, index) => (
          <div
            key={entry.agent_id}
            className={`glass-card p-4 text-center border ${getRankBg(index + 1)} ${
              index === 0 ? 'order-2 scale-105' : index === 1 ? 'order-1' : 'order-3'
            }`}
          >
            <div className="flex justify-center mb-3">
              {getRankIcon(index + 1)}
            </div>
            <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-border">
              <AvatarImage src={entry.agent_image || undefined} alt={entry.agent_name} />
              <AvatarFallback className="bg-muted text-muted-foreground">
                {getInitials(entry.agent_name)}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-foreground text-sm truncate">{entry.agent_name}</h3>
            <p className="text-2xl font-bold text-foreground mt-2">{getMetricValue(entry)}</p>
            <p className="text-xs text-muted-foreground">{getMetricLabel()}</p>
          </div>
        ))}
      </div>

      {/* Remaining Rankings */}
      {rest.length > 0 && (
        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="w-16 text-muted-foreground">Rank</TableHead>
                <TableHead className="text-muted-foreground">Agent</TableHead>
                <TableHead className="text-right text-muted-foreground">{getMetricLabel()}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rest.map((entry, index) => (
                <TableRow key={entry.agent_id} className="border-border/30">
                  <TableCell className="font-medium">
                    <div className="flex items-center justify-center">
                      {getRankIcon(index + 4)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={entry.agent_image || undefined} alt={entry.agent_name} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          {getInitials(entry.agent_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground">{entry.agent_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {getMetricValue(entry)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {sortedData.length === 0 && (
        <div className="text-center py-16 glass-card">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-500/10 flex items-center justify-center mx-auto mb-6">
            <Trophy className="h-8 w-8 text-yellow-400/60" />
          </div>
          <h3 className="text-xl font-light text-foreground mb-2">
            No rankings available yet
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            The leaderboard populates as agents close deals and track their activities. 
            Start adding deals to the CRM to see your name here!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/portal/crm" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Open CRM
            </a>
            <a href="/portal/crm/deals/new" className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-border hover:bg-card transition-colors text-foreground">
              Create First Deal
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const Leaderboard = () => {
  const [period, setPeriod] = useState<PeriodType>('ytd');
  const [metric, setMetric] = useState<MetricType>('volume');
  const { data: leaderboardData, isLoading } = useAgentLeaderboard(period);

  const metricTabs = [
    { value: 'volume', label: 'Deal Volume', icon: TrendingUp },
    { value: 'deals', label: 'Deals Closed', icon: Trophy },
    { value: 'contacts', label: 'Contacts Added', icon: Users },
    { value: 'activities', label: 'Activities', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500/30 to-amber-500/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-yellow-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extralight text-foreground">
              Agent Leaderboard
            </h1>
          </div>
          <p className="text-muted-foreground font-light ml-13">
            Top performers across the brokerage
          </p>
        </div>

        {/* Period Selector */}
        <div className="mb-6">
          <Tabs value={period} onValueChange={(v) => setPeriod(v as PeriodType)}>
            <TabsList className="bg-card/50 border border-border">
              <TabsTrigger value="monthly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                This Month
              </TabsTrigger>
              <TabsTrigger value="ytd" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Year to Date
              </TabsTrigger>
              <TabsTrigger value="all-time" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All Time
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Metric Tabs */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {metricTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = metric === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setMetric(tab.value as MetricType)}
                  className={`glass-card p-4 flex flex-col items-center gap-2 transition-all duration-300 ${
                    isActive 
                      ? 'border-primary bg-primary/10' 
                      : 'hover:border-border/80'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-light ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Leaderboard Table */}
        <LeaderboardTable 
          data={leaderboardData || []} 
          metric={metric} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default Leaderboard;
