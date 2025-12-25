import { useMemo } from "react";
import { AgentTransaction } from "./useAgentTransactions";

export interface CommissionSummary {
  totalEarnings: number;
  totalDeals: number;
  byDivision: {
    division: string;
    earnings: number;
    dealCount: number;
  }[];
  byYear: {
    year: number;
    earnings: number;
    dealCount: number;
  }[];
  ytdEarnings: number;
  ytdDeals: number;
}

// Commission rates by division (agent's take after house split)
const COMMISSION_RATES = {
  'Investment Sales': { rate: 0.015, houseSplit: 0.5 }, // 1.5% of sale, 50% to agent
  'Commercial Leasing': { rate: 0.04, houseSplit: 0.5 }, // 4% of lease value, 50% to agent
  'Residential': { rate: 0.025, houseSplit: 0.5 }, // 2.5% of sale or 1 month rent
  'Capital Advisory': { rate: 0.005, houseSplit: 0.5 }, // 0.5% of loan, 50% to agent
};

const calculateCommission = (transaction: AgentTransaction): number => {
  const division = transaction.division || 'Investment Sales';
  const config = COMMISSION_RATES[division as keyof typeof COMMISSION_RATES] || COMMISSION_RATES['Investment Sales'];
  
  let grossCommission = 0;
  
  if (transaction.sale_price) {
    // Sale transaction
    grossCommission = transaction.sale_price * config.rate;
  } else if (transaction.total_lease_value) {
    // Lease with total value
    grossCommission = transaction.total_lease_value * config.rate;
  } else if (transaction.monthly_rent) {
    // Rental - typically 1 month rent as commission
    grossCommission = transaction.monthly_rent;
  }
  
  // Agent's take after house split
  return grossCommission * config.houseSplit;
};

export const useAgentCommissions = (transactions: AgentTransaction[] | undefined): CommissionSummary => {
  return useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalEarnings: 0,
        totalDeals: 0,
        byDivision: [],
        byYear: [],
        ytdEarnings: 0,
        ytdDeals: 0,
      };
    }

    const currentYear = new Date().getFullYear();
    
    // Calculate by division
    const divisionMap = new Map<string, { earnings: number; dealCount: number }>();
    // Calculate by year
    const yearMap = new Map<number, { earnings: number; dealCount: number }>();
    
    let totalEarnings = 0;
    let ytdEarnings = 0;
    let ytdDeals = 0;

    transactions.forEach(tx => {
      const commission = calculateCommission(tx);
      const division = tx.division || 'Investment Sales';
      const year = tx.closing_date ? new Date(tx.closing_date).getFullYear() : currentYear;
      
      totalEarnings += commission;
      
      // YTD calculation
      if (year === currentYear) {
        ytdEarnings += commission;
        ytdDeals++;
      }
      
      // By division
      const divData = divisionMap.get(division) || { earnings: 0, dealCount: 0 };
      divData.earnings += commission;
      divData.dealCount++;
      divisionMap.set(division, divData);
      
      // By year
      const yearData = yearMap.get(year) || { earnings: 0, dealCount: 0 };
      yearData.earnings += commission;
      yearData.dealCount++;
      yearMap.set(year, yearData);
    });

    return {
      totalEarnings,
      totalDeals: transactions.length,
      byDivision: Array.from(divisionMap.entries())
        .map(([division, data]) => ({ division, ...data }))
        .sort((a, b) => b.earnings - a.earnings),
      byYear: Array.from(yearMap.entries())
        .map(([year, data]) => ({ year, ...data }))
        .sort((a, b) => b.year - a.year),
      ytdEarnings,
      ytdDeals,
    };
  }, [transactions]);
};
