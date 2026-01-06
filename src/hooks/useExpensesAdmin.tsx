import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ExpenseWithAgent {
  id: string;
  agent_id: string;
  agent_name: string;
  agent_email: string;
  expense_date: string;
  amount: number;
  category: string;
  subcategory: string | null;
  description: string;
  payment_method: string | null;
  is_tax_deductible: boolean | null;
  deal_id: string | null;
  billable_to_client: boolean | null;
  mileage_from: string | null;
  mileage_to: string | null;
  mileage_distance: number | null;
  mileage_rate: number | null;
  receipt_url: string | null;
  receipt_filename: string | null;
  notes: string | null;
  created_at: string | null;
}

export interface AgentExpenseSummary {
  agent_id: string;
  agent_name: string;
  agent_email: string;
  total_expenses: number;
  this_month_expenses: number;
  tax_deductible_total: number;
  expense_count: number;
  last_expense_date: string | null;
}

export function useAllAgentExpenses() {
  return useQuery({
    queryKey: ["admin", "all-agent-expenses"],
    queryFn: async (): Promise<ExpenseWithAgent[]> => {
      // Fetch all expenses
      const { data: expenses, error: expensesError } = await supabase
        .from("agent_expenses")
        .select("*")
        .order("expense_date", { ascending: false });

      if (expensesError) throw expensesError;

      if (!expenses || expenses.length === 0) return [];

      // Get unique agent IDs
      const agentIds = [...new Set(expenses.map(e => e.agent_id))];

      // Fetch profiles for agent info
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", agentIds);

      // Fetch team members as fallback
      const { data: teamMembers } = await supabase
        .from("team_members")
        .select("id, name, email");

      // Create lookup maps
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      const teamMemberByEmail = new Map(teamMembers?.map(t => [t.email, t]) || []);

      // Combine expenses with agent info
      return expenses.map(expense => {
        const profile = profileMap.get(expense.agent_id);
        const email = profile?.email || "";
        const teamMember = teamMemberByEmail.get(email);

        return {
          ...expense,
          agent_name: profile?.full_name || teamMember?.name || "Unknown Agent",
          agent_email: email || "No email",
        };
      });
    },
  });
}

export function useAgentExpenseSummary() {
  return useQuery({
    queryKey: ["admin", "agent-expense-summary"],
    queryFn: async (): Promise<AgentExpenseSummary[]> => {
      // Fetch all expenses
      const { data: expenses, error } = await supabase
        .from("agent_expenses")
        .select("*")
        .order("expense_date", { ascending: false });

      if (error) throw error;
      if (!expenses || expenses.length === 0) return [];

      // Get unique agent IDs
      const agentIds = [...new Set(expenses.map(e => e.agent_id))];

      // Fetch profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", agentIds);

      // Fetch team members as fallback
      const { data: teamMembers } = await supabase
        .from("team_members")
        .select("id, name, email");

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      const teamMemberByEmail = new Map(teamMembers?.map(t => [t.email, t]) || []);

      // Current month start
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Group expenses by agent
      const agentExpenses = new Map<string, typeof expenses>();
      expenses.forEach(expense => {
        const existing = agentExpenses.get(expense.agent_id) || [];
        existing.push(expense);
        agentExpenses.set(expense.agent_id, existing);
      });

      // Build summaries
      const summaries: AgentExpenseSummary[] = [];
      agentExpenses.forEach((agentExps, agentId) => {
        const profile = profileMap.get(agentId);
        const email = profile?.email || "";
        const teamMember = teamMemberByEmail.get(email);

        const totalExpenses = agentExps.reduce((sum, e) => sum + e.amount, 0);
        const thisMonthExpenses = agentExps
          .filter(e => new Date(e.expense_date) >= monthStart)
          .reduce((sum, e) => sum + e.amount, 0);
        const taxDeductibleTotal = agentExps
          .filter(e => e.is_tax_deductible)
          .reduce((sum, e) => sum + e.amount, 0);
        const lastExpenseDate = agentExps[0]?.expense_date || null;

        summaries.push({
          agent_id: agentId,
          agent_name: profile?.full_name || teamMember?.name || "Unknown Agent",
          agent_email: email || "No email",
          total_expenses: totalExpenses,
          this_month_expenses: thisMonthExpenses,
          tax_deductible_total: taxDeductibleTotal,
          expense_count: agentExps.length,
          last_expense_date: lastExpenseDate,
        });
      });

      // Sort by total expenses descending
      return summaries.sort((a, b) => b.total_expenses - a.total_expenses);
    },
  });
}

export function useAdminExpenseStats() {
  const { data: expenses } = useAllAgentExpenses();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const ytdExpenses = expenses?.filter(e => new Date(e.expense_date) >= yearStart) || [];
  const thisMonthExpenses = expenses?.filter(e => new Date(e.expense_date) >= monthStart) || [];

  const totalYTD = ytdExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalThisMonth = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const taxDeductibleYTD = ytdExpenses
    .filter(e => e.is_tax_deductible)
    .reduce((sum, e) => sum + e.amount, 0);
  const uniqueAgents = new Set(expenses?.map(e => e.agent_id) || []).size;

  return {
    totalYTD,
    totalThisMonth,
    taxDeductibleYTD,
    uniqueAgents,
  };
}
