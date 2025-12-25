import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";

interface CommissionRequest {
  id: string;
  property_address: string;
  commission_amount: number;
  deal_type: string;
  closing_date: string;
  status: string;
  paid_at: string | null;
  created_at: string;
}

export interface CommissionStats {
  ytdEarnings: number;
  pendingPayments: number;
  underReview: number;
  totalRequests: number;
  paidRequests: CommissionRequest[];
  pendingRequests: CommissionRequest[];
  monthlyEarnings: { month: string; amount: number }[];
}

export const useMyCommissions = () => {
  const { user } = useAuth();

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ["my-commission-requests", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("commission_requests")
        .select("*")
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CommissionRequest[];
    },
    enabled: !!user?.id,
  });

  const stats = useMemo((): CommissionStats => {
    if (!requests) {
      return {
        ytdEarnings: 0,
        pendingPayments: 0,
        underReview: 0,
        totalRequests: 0,
        paidRequests: [],
        pendingRequests: [],
        monthlyEarnings: [],
      };
    }

    const currentYear = new Date().getFullYear();
    
    // Filter paid requests for this year
    const paidRequests = requests.filter(r => 
      r.status === "paid" && 
      r.paid_at && 
      new Date(r.paid_at).getFullYear() === currentYear
    );

    // YTD earnings
    const ytdEarnings = paidRequests.reduce((sum, r) => sum + r.commission_amount, 0);

    // Pending payments (approved but not paid)
    const pendingPaymentRequests = requests.filter(r => r.status === "approved");
    const pendingPayments = pendingPaymentRequests.reduce((sum, r) => sum + r.commission_amount, 0);

    // Under review
    const underReviewRequests = requests.filter(r => 
      r.status === "pending" || r.status === "under_review"
    );
    const underReview = underReviewRequests.reduce((sum, r) => sum + r.commission_amount, 0);

    // Monthly earnings for chart (last 12 months)
    const monthlyMap = new Map<string, number>();
    const now = new Date();
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap.set(key, 0);
    }

    // Aggregate paid commissions by month
    paidRequests.forEach(r => {
      if (r.paid_at) {
        const date = new Date(r.paid_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyMap.has(key)) {
          monthlyMap.set(key, (monthlyMap.get(key) || 0) + r.commission_amount);
        }
      }
    });

    const monthlyEarnings = Array.from(monthlyMap.entries()).map(([month, amount]) => ({
      month,
      amount,
    }));

    return {
      ytdEarnings,
      pendingPayments,
      underReview,
      totalRequests: requests.length,
      paidRequests,
      pendingRequests: [...pendingPaymentRequests, ...underReviewRequests],
      monthlyEarnings,
    };
  }, [requests]);

  return {
    stats,
    requests,
    isLoading,
    error,
  };
};
