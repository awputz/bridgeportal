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

// IMPORTANT: Only use actual agent-entered commission values
// NO estimates - if commission is not entered, it's 0
const getActualCommission = (transaction: AgentTransaction): number => {
  // Only return the actual commission value if it exists
  if (transaction.commission !== null && transaction.commission !== undefined) {
    return transaction.commission;
  }
  return 0;
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
    
    // Only include transactions that have actual commission values entered
    const transactionsWithCommission = transactions.filter(
      tx => tx.commission !== null && tx.commission !== undefined && tx.commission > 0
    );
    
    // Calculate by division - only for transactions with actual commissions
    const divisionMap = new Map<string, { earnings: number; dealCount: number }>();
    // Calculate by year - only for transactions with actual commissions
    const yearMap = new Map<number, { earnings: number; dealCount: number }>();
    
    let totalEarnings = 0;
    let ytdEarnings = 0;
    let ytdDeals = 0;

    transactionsWithCommission.forEach(tx => {
      const commission = getActualCommission(tx);
      const division = tx.division || 'Other';
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
      totalDeals: transactions.length, // Total deals count includes all transactions
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
