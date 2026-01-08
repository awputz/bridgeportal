import { Users, GitBranch, CalendarCheck, FileText, UserPlus } from "lucide-react";
import { useHRAnalytics } from "@/hooks/hr/useHRAnalytics";
import { MetricCard } from "@/components/hr/analytics/MetricCard";
import { RecruitmentFunnel } from "@/components/hr/analytics/RecruitmentFunnel";
import { PipelineBreakdown } from "@/components/hr/analytics/PipelineBreakdown";
import { DivisionChart } from "@/components/hr/analytics/DivisionChart";
import { HiresChart } from "@/components/hr/analytics/HiresChart";
import { OfferMetrics } from "@/components/hr/analytics/OfferMetrics";
import { CampaignStats } from "@/components/hr/analytics/CampaignStats";
import { SourceTable } from "@/components/hr/analytics/SourceTable";
import { Loader2 } from "lucide-react";

export default function Analytics() {
  const { data, isLoading } = useHRAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        Unable to load analytics data
      </div>
    );
  }

  const hiredCount = data.pipelineByStatus.find(s => s.status === 'hired')?.count || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extralight tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Recruitment performance insights and trends
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Agents"
          value={data.totalAgents}
          subtitle={`+${data.agentsThisMonth} this month`}
          icon={Users}
          color="emerald"
        />
        <MetricCard
          title="Pipeline Active"
          value={data.agentsInPipeline}
          subtitle={`${data.totalAgents > 0 ? ((data.agentsInPipeline / data.totalAgents) * 100).toFixed(0) : 0}% of total`}
          icon={GitBranch}
          color="blue"
        />
        <MetricCard
          title="Interviews"
          value={data.totalInterviews}
          subtitle={`${data.interviewsThisMonth} this month`}
          icon={CalendarCheck}
          color="purple"
        />
        <MetricCard
          title="Offers"
          value={data.totalOffers}
          subtitle={`${data.offersThisMonth} this month`}
          icon={FileText}
          color="amber"
        />
        <MetricCard
          title="Hires"
          value={hiredCount}
          subtitle={`${data.acceptanceRate.toFixed(0)}% accept rate`}
          icon={UserPlus}
          color="emerald"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <RecruitmentFunnel data={data.funnelData} />
          <HiresChart data={data.hiresOverTime} />
          <DivisionChart data={data.pipelineByDivision} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <PipelineBreakdown data={data.pipelineByStatus} />
          <OfferMetrics
            acceptanceRate={data.acceptanceRate}
            avgTimeToSign={data.avgTimeToSign}
            avgSigningBonus={data.avgSigningBonus}
            offersByStatus={data.offersByStatus}
          />
          <CampaignStats
            activeCampaigns={data.activeCampaigns}
            totalEmailsSent={data.totalEmailsSent}
          />
        </div>
      </div>

      {/* Full Width Section */}
      <SourceTable data={data.topBrokerages} />
    </div>
  );
}
