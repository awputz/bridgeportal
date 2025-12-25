import { Link } from "react-router-dom";
import { User, ArrowRight, TrendingUp, Briefcase } from "lucide-react";
import { useAgentTransactions } from "@/hooks/useAgentTransactions";
import { useAgentCommissions } from "@/hooks/useAgentCommissions";
import { Skeleton } from "@/components/ui/skeleton";

const formatCurrency = (value: number): string => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
};

export const ProfileCard = () => {
  const { data: transactions, isLoading } = useAgentTransactions();
  const commissions = useAgentCommissions(transactions || []);

  if (isLoading) {
    return (
      <div className="glass-card p-4">
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <Link 
      to="/portal/profile"
      className="glass-card p-4 flex items-center gap-4 hover:border-white/20 transition-all duration-300 group"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center flex-shrink-0">
        <User className="h-6 w-6 text-foreground" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-light text-foreground mb-1">My Profile</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Briefcase className="h-3 w-3" />
            <span>{commissions.totalDeals} deals</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>{formatCurrency(commissions.ytdEarnings)} YTD</span>
          </div>
        </div>
      </div>
      
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
    </Link>
  );
};
