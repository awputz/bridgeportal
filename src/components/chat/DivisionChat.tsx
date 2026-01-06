import { useDivisionChat } from "@/hooks/useDivisionChat";
import { useDivision } from "@/contexts/DivisionContext";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle, Lock, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function DivisionChat() {
  const { division, setDivision, isAdmin, hasDivisionAssigned } = useDivision();
  const {
    channel,
    allChannels,
    isLoadingChannel,
    messages,
    isLoadingMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    isSending,
    toggleReaction,
    getReactionsForMessage,
    currentUserId,
  } = useDivisionChat();

  // No division assigned
  if (!hasDivisionAssigned && !isAdmin) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-4">
        <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-1">No Division Assigned</h3>
        <p className="text-sm text-muted-foreground max-w-[320px]">
          You need to be assigned to a division to access team chat. Please contact your administrator.
        </p>
      </div>
    );
  }

  // Loading state
  if (isLoadingChannel) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border/50">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    );
  }

  const formatDivisionName = (division: string) => {
    return division
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border/50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              {isAdmin ? (
                <Select value={division || ""} onValueChange={(val) => setDivision(val as any)}>
                  <SelectTrigger className="h-auto p-0 border-0 bg-transparent font-semibold text-lg hover:bg-transparent focus:ring-0">
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    {allChannels.map((ch) => (
                      <SelectItem key={ch.id} value={ch.division}>
                        {ch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <h2 className="font-semibold text-lg">
                  {channel?.name || formatDivisionName(division || "")}
                </h2>
              )}
              <p className="text-sm text-muted-foreground">
                {channel?.description || "Team collaboration space"}
              </p>
            </div>
          </div>
          
          {!isAdmin && (
            <Badge variant="secondary" className="gap-1">
              <Lock className="h-3 w-3" />
              {formatDivisionName(division || "")}
            </Badge>
          )}
        </div>
      </div>

      {/* Messages */}
      <ChatMessageList
        messages={messages}
        isLoading={isLoadingMessages}
        currentUserId={currentUserId}
        getReactionsForMessage={getReactionsForMessage}
        onEditMessage={editMessage}
        onDeleteMessage={deleteMessage}
        onReact={toggleReaction}
      />

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        disabled={isSending || !channel}
        placeholder={`Message ${channel?.name || "your team"}...`}
      />
    </div>
  );
}
