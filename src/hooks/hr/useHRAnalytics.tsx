import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, subMonths, format, differenceInDays } from "date-fns";

export interface HRAnalyticsData {
  // Overview metrics
  totalAgents: number;
  agentsThisMonth: number;
  agentsInPipeline: number;
  
  // Pipeline breakdown
  pipelineByStatus: { status: string; count: number }[];
  pipelineByDivision: { division: string; count: number }[];
  
  // Interview metrics
  totalInterviews: number;
  interviewsThisMonth: number;
  passRate: number;
  avgScorecard: number;
  interviewsByType: { type: string; count: number }[];
  
  // Offer metrics
  totalOffers: number;
  offersThisMonth: number;
  acceptanceRate: number;
  avgTimeToSign: number;
  avgSigningBonus: number;
  offersByStatus: { status: string; count: number }[];
  
  // Campaign metrics
  activeCampaigns: number;
  totalEmailsSent: number;
  
  // Conversion funnel
  funnelData: { stage: string; count: number; rate: number }[];
  
  // Time series data
  hiresOverTime: { date: string; count: number }[];
  
  // Top sources
  topBrokerages: { name: string; count: number; hired: number }[];
}

const PIPELINE_STAGES = ['cold', 'contacted', 'warm', 'qualified', 'hot', 'offer-made', 'hired'];

export function useHRAnalytics() {
  return useQuery({
    queryKey: ['hr-analytics'],
    queryFn: async (): Promise<HRAnalyticsData> => {
      const now = new Date();
      const startOfThisMonth = startOfMonth(now);
      const sixMonthsAgo = subMonths(now, 6);

      // Fetch all data in parallel
      const [
        { data: agents },
        { data: interviews },
        { data: offers },
        { data: campaigns },
        { data: campaignAgents }
      ] = await Promise.all([
        supabase.from('hr_agents').select('*'),
        supabase.from('hr_interviews').select('*'),
        supabase.from('hr_offers').select('*'),
        supabase.from('hr_campaigns').select('*'),
        supabase.from('hr_campaign_agents').select('*')
      ]);

      const agentList = agents || [];
      const interviewList = interviews || [];
      const offerList = offers || [];
      const campaignList = campaigns || [];
      const campaignAgentList = campaignAgents || [];

      // Overview metrics
      const totalAgents = agentList.length;
      const agentsThisMonth = agentList.filter(a => 
        new Date(a.created_at) >= startOfThisMonth
      ).length;
      const agentsInPipeline = agentList.filter(a => 
        !['hired', 'lost', 'not-interested'].includes(a.recruitment_status)
      ).length;

      // Pipeline breakdown by status
      const statusCounts: Record<string, number> = {};
      agentList.forEach(a => {
        statusCounts[a.recruitment_status] = (statusCounts[a.recruitment_status] || 0) + 1;
      });
      const pipelineByStatus = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count
      }));

      // Pipeline breakdown by division
      const divisionCounts: Record<string, number> = {};
      agentList.forEach(a => {
        if (a.division) {
          divisionCounts[a.division] = (divisionCounts[a.division] || 0) + 1;
        }
      });
      const pipelineByDivision = Object.entries(divisionCounts).map(([division, count]) => ({
        division,
        count
      }));

      // Interview metrics
      const totalInterviews = interviewList.length;
      const interviewsThisMonth = interviewList.filter(i => 
        new Date(i.created_at) >= startOfThisMonth
      ).length;
      
      const decidedInterviews = interviewList.filter(i => i.decision);
      const passedInterviews = interviewList.filter(i => i.decision === 'pass');
      const passRate = decidedInterviews.length > 0 
        ? (passedInterviews.length / decidedInterviews.length) * 100 
        : 0;

      // Calculate average scorecard rating
      let totalRating = 0;
      let ratingCount = 0;
      interviewList.forEach(interview => {
        if (interview.scorecard && typeof interview.scorecard === 'object') {
          const scorecard = interview.scorecard as { categories?: { rating: number }[] };
          if (scorecard.categories && Array.isArray(scorecard.categories)) {
            scorecard.categories.forEach(cat => {
              if (cat.rating > 0) {
                totalRating += cat.rating;
                ratingCount++;
              }
            });
          }
        }
      });
      const avgScorecard = ratingCount > 0 ? totalRating / ratingCount : 0;

      // Interviews by type
      const typeCounts: Record<string, number> = {};
      interviewList.forEach(i => {
        typeCounts[i.interview_type] = (typeCounts[i.interview_type] || 0) + 1;
      });
      const interviewsByType = Object.entries(typeCounts).map(([type, count]) => ({
        type,
        count
      }));

      // Offer metrics
      const totalOffers = offerList.length;
      const offersThisMonth = offerList.filter(o => 
        new Date(o.created_at) >= startOfThisMonth
      ).length;

      const signedOffers = offerList.filter(o => o.signed_at);
      const declinedOffers = offerList.filter(o => o.declined_at);
      const respondedOffers = signedOffers.length + declinedOffers.length;
      const acceptanceRate = respondedOffers > 0 
        ? (signedOffers.length / respondedOffers) * 100 
        : 0;

      // Average time to sign
      let totalDaysToSign = 0;
      const offersWithSignTime = signedOffers.filter(o => o.sent_at && o.signed_at);
      offersWithSignTime.forEach(o => {
        totalDaysToSign += differenceInDays(new Date(o.signed_at!), new Date(o.sent_at!));
      });
      const avgTimeToSign = offersWithSignTime.length > 0 
        ? totalDaysToSign / offersWithSignTime.length 
        : 0;

      // Average signing bonus
      const offersWithBonus = signedOffers.filter(o => o.signing_bonus);
      const totalBonus = offersWithBonus.reduce((sum, o) => sum + (o.signing_bonus || 0), 0);
      const avgSigningBonus = offersWithBonus.length > 0 
        ? totalBonus / offersWithBonus.length 
        : 0;

      // Offers by status
      const offerStatusCounts = {
        draft: offerList.filter(o => !o.sent_at).length,
        sent: offerList.filter(o => o.sent_at && !o.signed_at && !o.declined_at).length,
        signed: signedOffers.length,
        declined: declinedOffers.length
      };
      const offersByStatus = Object.entries(offerStatusCounts).map(([status, count]) => ({
        status,
        count
      }));

      // Campaign metrics
      const activeCampaigns = campaignList.filter(c => c.status === 'active').length;
      const totalEmailsSent = campaignAgentList.filter(ca => ca.email_status === 'sent').length;

      // Conversion funnel
      const funnelData = PIPELINE_STAGES.map((stage, index) => {
        const stageIndex = PIPELINE_STAGES.indexOf(stage);
        const count = agentList.filter(a => 
          PIPELINE_STAGES.indexOf(a.recruitment_status) >= stageIndex
        ).length;
        const rate = index === 0 ? 100 : (totalAgents > 0 ? (count / totalAgents) * 100 : 0);
        return { stage, count, rate };
      });

      // Hires over time (last 6 months)
      const hiresOverTime: { date: string; count: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = startOfMonth(subMonths(now, i));
        const monthEnd = startOfMonth(subMonths(now, i - 1));
        const monthKey = format(monthStart, 'MMM yyyy');
        
        const hiredInMonth = agentList.filter(a => {
          if (a.recruitment_status !== 'hired') return false;
          const updatedAt = new Date(a.updated_at);
          return updatedAt >= monthStart && updatedAt < monthEnd;
        }).length;
        
        hiresOverTime.push({ date: monthKey, count: hiredInMonth });
      }

      // Top brokerages
      const brokerageCounts: Record<string, { count: number; hired: number }> = {};
      agentList.forEach(a => {
        if (a.current_brokerage) {
          if (!brokerageCounts[a.current_brokerage]) {
            brokerageCounts[a.current_brokerage] = { count: 0, hired: 0 };
          }
          brokerageCounts[a.current_brokerage].count++;
          if (a.recruitment_status === 'hired') {
            brokerageCounts[a.current_brokerage].hired++;
          }
        }
      });
      const topBrokerages = Object.entries(brokerageCounts)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        totalAgents,
        agentsThisMonth,
        agentsInPipeline,
        pipelineByStatus,
        pipelineByDivision,
        totalInterviews,
        interviewsThisMonth,
        passRate,
        avgScorecard,
        interviewsByType,
        totalOffers,
        offersThisMonth,
        acceptanceRate,
        avgTimeToSign,
        avgSigningBonus,
        offersByStatus,
        activeCampaigns,
        totalEmailsSent,
        funnelData,
        hiresOverTime,
        topBrokerages
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
