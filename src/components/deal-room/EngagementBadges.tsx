import { memo } from "react";
import { Flame, MessageCircle, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDealRoomComments, useDealRoomInterests } from "@/hooks/useDealRoom";

interface EngagementBadgesProps {
  dealId: string;
}

function EngagementBadgesComponent({ dealId }: EngagementBadgesProps) {
  const { data: comments, isLoading: commentsLoading } = useDealRoomComments(dealId);
  const { data: interests, isLoading: interestsLoading } = useDealRoomInterests(dealId);

  const commentCount = comments?.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0) || 0;
  const interestCount = interests?.length || 0;
  const isHot = commentCount >= 5 || interestCount >= 3;

  if (commentsLoading || interestsLoading) {
    return <Skeleton className="h-5 w-16" />;
  }

  if (commentCount === 0 && interestCount === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      {isHot && (
        <Badge variant="destructive" className="gap-1 text-[10px] px-1.5 py-0">
          <Flame className="h-3 w-3" />
          Hot
        </Badge>
      )}
      {commentCount > 0 && (
        <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0">
          <MessageCircle className="h-3 w-3" />
          {commentCount}
        </Badge>
      )}
      {interestCount > 0 && (
        <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0">
          <Star className="h-3 w-3" />
          {interestCount}
        </Badge>
      )}
    </div>
  );
}

export const EngagementBadges = memo(EngagementBadgesComponent);
EngagementBadges.displayName = "EngagementBadges";
