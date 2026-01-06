import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";

export interface Expense {
  id: string;
  agent_id: string;
  expense_date: string;
  amount: number;
  category: string;
  subcategory: string | null;
  description: string;
  payment_method: string | null;
  deal_id: string | null;
  billable_to_client: boolean;
  is_tax_deductible: boolean;
  tax_notes: string | null;
  receipt_url: string | null;
  receipt_filename: string | null;
  receipt_uploaded_at: string | null;
  mileage_from: string | null;
  mileage_to: string | null;
  mileage_distance: number | null;
  mileage_rate: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseFormData {
  expense_date: string;
  amount: number;
  category: string;
  subcategory?: string;
  description: string;
  payment_method?: string;
  deal_id?: string;
  billable_to_client?: boolean;
  is_tax_deductible?: boolean;
  tax_notes?: string;
  receipt_url?: string;
  receipt_filename?: string;
  mileage_from?: string;
  mileage_to?: string;
  mileage_distance?: number;
  mileage_rate?: number;
  notes?: string;
}

export interface ExpenseFilters {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentMethod?: string;
  search?: string;
}

export interface ExpenseStats {
  totalExpenses: number;
  ytdExpenses: number;
  monthlyExpenses: number;
  categoryBreakdown: { category: string; amount: number; count: number }[];
  monthlyTrend: { month: string; amount: number }[];
  taxDeductibleTotal: number;
}

export const useExpenses = (filters?: ExpenseFilters) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["expenses", user?.id, filters],
    queryFn: async () => {
      if (!user?.id) return [];

      let query = supabase
        .from("agent_expenses")
        .select("*")
        .eq("agent_id", user.id)
        .order("expense_date", { ascending: false });

      if (filters?.category) {
        query = query.eq("category", filters.category);
      }
      if (filters?.dateFrom) {
        query = query.gte("expense_date", filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte("expense_date", filters.dateTo);
      }
      if (filters?.paymentMethod) {
        query = query.eq("payment_method", filters.paymentMethod);
      }
      if (filters?.search) {
        query = query.ilike("description", `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Expense[];
    },
    enabled: !!user?.id,
  });
};

export const useExpenseStats = () => {
  const { user } = useAuth();

  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("agent_expenses")
        .select("*")
        .eq("agent_id", user.id);

      if (error) throw error;
      return data as Expense[];
    },
    enabled: !!user?.id,
  });

  const stats = useMemo((): ExpenseStats => {
    if (!expenses || expenses.length === 0) {
      return {
        totalExpenses: 0,
        ytdExpenses: 0,
        monthlyExpenses: 0,
        categoryBreakdown: [],
        monthlyTrend: [],
        taxDeductibleTotal: 0,
      };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Total expenses
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // YTD expenses
    const ytdExpenses = expenses
      .filter((e) => new Date(e.expense_date).getFullYear() === currentYear)
      .reduce((sum, e) => sum + Number(e.amount), 0);

    // Current month expenses
    const monthlyExpenses = expenses
      .filter((e) => {
        const date = new Date(e.expense_date);
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
      })
      .reduce((sum, e) => sum + Number(e.amount), 0);

    // Tax deductible total (YTD)
    const taxDeductibleTotal = expenses
      .filter((e) => e.is_tax_deductible && new Date(e.expense_date).getFullYear() === currentYear)
      .reduce((sum, e) => sum + Number(e.amount), 0);

    // Category breakdown (YTD)
    const categoryMap = new Map<string, { amount: number; count: number }>();
    expenses
      .filter((e) => new Date(e.expense_date).getFullYear() === currentYear)
      .forEach((e) => {
        const existing = categoryMap.get(e.category) || { amount: 0, count: 0 };
        categoryMap.set(e.category, {
          amount: existing.amount + Number(e.amount),
          count: existing.count + 1,
        });
      });

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Monthly trend (last 12 months)
    const monthlyMap = new Map<string, number>();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap.set(key, 0);
    }

    expenses.forEach((e) => {
      const date = new Date(e.expense_date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyMap.has(key)) {
        monthlyMap.set(key, (monthlyMap.get(key) || 0) + Number(e.amount));
      }
    });

    const monthlyTrend = Array.from(monthlyMap.entries()).map(([month, amount]) => ({
      month,
      amount,
    }));

    return {
      totalExpenses,
      ytdExpenses,
      monthlyExpenses,
      categoryBreakdown,
      monthlyTrend,
      taxDeductibleTotal,
    };
  }, [expenses]);

  return { stats, isLoading };
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data: result, error } = await supabase
        .from("agent_expenses")
        .insert({
          ...data,
          agent_id: user.id,
          receipt_uploaded_at: data.receipt_url ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-stats"] });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ExpenseFormData> }) => {
      const { data: result, error } = await supabase
        .from("agent_expenses")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-stats"] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("agent_expenses").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-stats"] });
    },
  });
};
