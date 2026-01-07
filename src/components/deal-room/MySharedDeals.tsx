import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Building2, MessageCircle, Star, TrendingUp, Eye, Trash2, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyDealRoomDeals, useRemoveFromDealRoom, useDealRoomComments, useDealRoomInterests } from "@/hooks/useDealRoom";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface MySharedDealsProps {
  onDealClick: (dealId: string) => void;
  onShareClick: () => void;
}

const DIVISION_LABELS: Record<string, string> = {
  "investment-sales": "Investment",
  "commercial-leasing": "Commercial",
  residential: "Residential",
};

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
}

// Stats card component for deal engagement
function DealStatsCard({ dealId }: { dealId: string }) {
  const { data: comments } = useDealRoomComments(dealId);
  const { data: interests } = useDealRoomInterests(dealId);

  const commentCount = comments?.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0) || 0;
  const interestCount = interests?.length || 0;

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <MessageCircle className="h-3.5 w-3.5" />
        {commentCount}
      </span>
      <span className="flex items-center gap-1">
        <Star className="h-3.5 w-3.5" />
        {interestCount}
      </span>
    </div>
  );
}

export function MySharedDeals({ onDealClick, onShareClick }: MySharedDealsProps) {
  const { data: deals, isLoading } = useMyDealRoomDeals();
  const removeDeal = useRemoveFromDealRoom();
  const [dealToRemove, setDealToRemove] = useState<string | null>(null);

  const handleRemove = async () => {
    if (!dealToRemove) return;
    await removeDeal.mutateAsync(dealToRemove);
    setDealToRemove(null);
  };

  // Calculate aggregate stats
  const totalDeals = deals?.length || 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        {/* Cards skeleton */}
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!deals || deals.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No deals shared yet"
        description="Share your first off-market deal with the team to see engagement metrics here"
        actionLabel="Share a Deal"
        onAction={onShareClick}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{totalDeals}</p>
              <p className="text-sm text-muted-foreground">Deals Shared</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold">Active</p>
              <p className="text-sm text-muted-foreground">Deal Room Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Cards */}
      <div className="space-y-3">
        {deals.map((deal) => {
          const timeAgo = deal.last_deal_room_update
            ? formatDistanceToNow(new Date(deal.last_deal_room_update), { addSuffix: true })
            : formatDistanceToNow(new Date(deal.created_at), { addSuffix: true });

          return (
            <Card
              key={deal.id}
              className={cn(
                "group cursor-pointer transition-all duration-200",
                "hover:border-primary/30 hover:shadow-md"
              )}
              onClick={() => onDealClick(deal.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm truncate">
                        {deal.property_address}
                      </h3>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {DIVISION_LABELS[deal.division] || deal.division}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {deal.value && <span>{formatCurrency(deal.value)}</span>}
                      {deal.neighborhood && <span>{deal.neighborhood}</span>}
                      <span>Updated {timeAgo}</span>
                    </div>
                    {/* Engagement metrics */}
                    <DealStatsCard dealId={deal.id} />
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDealClick(deal.id);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDealToRemove(deal.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Remove confirmation dialog */}
      <AlertDialog open={!!dealToRemove} onOpenChange={() => setDealToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Deal Room?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the deal from the team's Deal Room. You can share it again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
