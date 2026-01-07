import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Star, Users, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDealRoomInterests, useExpressInterest, useRemoveInterest } from "@/hooks/useDealRoom";
import { useCurrentAgent } from "@/hooks/useCurrentAgent";
import { toast } from "sonner";

interface DealRoomInterestedProps {
  dealId: string;
}

const INTEREST_TYPES = [
  { value: "co-broke", label: "Co-Broke Partner" },
  { value: "buyer-connection", label: "Buyer Connection" },
  { value: "watching", label: "Watching" },
  { value: "general", label: "General Interest" },
];

export function DealRoomInterested({ dealId }: DealRoomInterestedProps) {
  const [interestType, setInterestType] = useState("co-broke");
  const [message, setMessage] = useState("");
  
  const { data: agent } = useCurrentAgent();
  const { data: interests, isLoading } = useDealRoomInterests(dealId);
  const expressInterest = useExpressInterest();
  const removeInterest = useRemoveInterest();

  const currentUserId = agent?.id;
  const myInterest = interests?.find((i) => i.user_id === currentUserId);

  const handleExpressInterest = async () => {
    if (!currentUserId) {
      toast.error("You must be logged in to express interest");
      return;
    }

    try {
      await expressInterest.mutateAsync({
        dealId,
        interestType,
        message: message.trim() || undefined,
      });
      setMessage("");
      toast.success("Interest expressed!");
    } catch (error) {
      toast.error("Failed to express interest");
    }
  };

  const handleRemoveInterest = async () => {
    if (!myInterest) return;

    try {
      await removeInterest.mutateAsync({ dealId, interestId: myInterest.id });
      toast.success("Interest removed");
    } catch (error) {
      toast.error("Failed to remove interest");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-24 w-full rounded-lg" />
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Express Interest Form */}
      {!myInterest ? (
        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Express your interest</span>
          </div>

          <div className="space-y-3">
            <Select value={interestType} onValueChange={setInterestType}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Interest type" />
              </SelectTrigger>
              <SelectContent>
                {INTEREST_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Optional message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-9"
              maxLength={200}
            />

            <Button
              size="sm"
              className="w-full"
              onClick={handleExpressInterest}
              disabled={expressInterest.isPending}
            >
              {expressInterest.isPending ? "Submitting..." : "Express Interest"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-green-500 fill-green-500" />
              <span className="font-medium text-sm">You're interested</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-destructive hover:text-destructive"
              onClick={handleRemoveInterest}
              disabled={removeInterest.isPending}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Remove
            </Button>
          </div>
          {myInterest.message && (
            <p className="text-sm text-muted-foreground mt-2 italic">
              "{myInterest.message}"
            </p>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
        <Users className="h-3.5 w-3.5" />
        <span>{interests?.length || 0} people interested</span>
      </div>

      {/* Interests List */}
      <ScrollArea className="h-[280px]">
        {interests && interests.length > 0 ? (
          <div className="space-y-3 pr-4">
            {interests.map((interest) => {
              const userInitials = interest.user?.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "?";
              const isMe = interest.user_id === currentUserId;
              const typeLabel = INTEREST_TYPES.find((t) => t.value === interest.interest_type)?.label || interest.interest_type;

              return (
                <div
                  key={interest.id}
                  className={`flex gap-3 p-2 rounded-lg ${isMe ? "bg-primary/5" : ""}`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={interest.user?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">
                        {isMe ? "You" : interest.user?.full_name || "Someone"}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {typeLabel}
                      </Badge>
                    </div>

                    {interest.message && (
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        "{interest.message}"
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(interest.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No one has expressed interest yet</p>
            <p className="text-xs text-muted-foreground mt-1">Be the first!</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
