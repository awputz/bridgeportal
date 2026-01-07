import { useState } from "react";
import { 
  Target, 
  RefreshCw, 
  Mail, 
  Phone, 
  X, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Building2 
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  useDealMatches,
  useGenerateDealMatches,
  useDismissMatch,
  useRestoreMatch,
  useMarkMatchContacted,
} from "@/hooks/useDealMatching";

interface DealMatchesProps {
  dealId: string;
}

function getScoreColor(score: number): string {
  if (score >= 90) return "bg-green-500/20 text-green-400 border-green-500/30";
  if (score >= 70) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-muted text-muted-foreground border-border";
}

function getScoreEmoji(score: number): string {
  if (score >= 90) return "🟢";
  if (score >= 70) return "🟡";
  return "⚪";
}

export function DealMatches({ dealId }: DealMatchesProps) {
  const [showDismissed, setShowDismissed] = useState(false);
  const { data: matches, isLoading } = useDealMatches(dealId, showDismissed);
  const generateMatches = useGenerateDealMatches();
  const dismissMatch = useDismissMatch();
  const restoreMatch = useRestoreMatch();
  const markContacted = useMarkMatchContacted();

  const activeMatches = matches?.filter((m) => !m.is_dismissed) || [];
  const dismissedMatches = matches?.filter((m) => m.is_dismissed) || [];

  const handleRefresh = () => {
    generateMatches.mutate(dealId);
  };

  const handleDismiss = (matchId: string) => {
    dismissMatch.mutate({ matchId, dealId });
  };

  const handleRestore = (matchId: string) => {
    restoreMatch.mutate({ matchId, dealId });
  };

  const handleMarkContacted = (matchId: string) => {
    markContacted.mutate({ matchId, dealId });
  };

  const handleEmailContact = (email: string | null | undefined) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  const handleCallContact = (phone: string | null | undefined) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 py-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-lg border space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">AI Matches</span>
          {activeMatches.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeMatches.length}
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={generateMatches.isPending}
          className="gap-1.5"
        >
          {generateMatches.isPending ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {generateMatches.isPending ? "Analyzing..." : "Refresh AI"}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-6 py-4 space-y-3">
          {activeMatches.length === 0 && !generateMatches.isPending && (
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">
                No matches found yet
              </p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                Click "Refresh AI" to find matching contacts
              </p>
            </div>
          )}

          {activeMatches.map((match) => (
            <div
              key={match.id}
              className={cn(
                "p-4 rounded-lg border transition-colors",
                match.is_contacted 
                  ? "bg-muted/30 border-border/50" 
                  : "bg-card hover:bg-muted/30"
              )}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarFallback className="text-xs">
                      {match.contact?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {match.contact?.full_name || "Unknown Contact"}
                    </p>
                    {match.contact?.company && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                        <Building2 className="h-3 w-3 flex-shrink-0" />
                        {match.contact.company}
                      </p>
                    )}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn("flex-shrink-0 text-xs", getScoreColor(match.match_score))}
                >
                  {getScoreEmoji(match.match_score)} {match.match_score}%
                </Badge>
              </div>

              {/* AI Summary */}
              {match.ai_summary && (
                <p className="text-sm text-muted-foreground italic mb-3 leading-relaxed">
                  "{match.ai_summary}"
                </p>
              )}

              {/* Match Reasons */}
              {match.match_reasons && match.match_reasons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {match.match_reasons.slice(0, 3).map((reason, i) => (
                    <Badge key={i} variant="secondary" className="text-xs font-normal">
                      ✓ {reason}
                    </Badge>
                  ))}
                  {match.match_reasons.length > 3 && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      +{match.match_reasons.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                {match.is_contacted ? (
                  <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/30">
                    <Check className="h-3 w-3 mr-1" />
                    Contacted
                  </Badge>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => handleMarkContacted(match.id)}
                    >
                      <Check className="h-3 w-3" />
                      Mark Contacted
                    </Button>
                    {match.contact?.email && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleEmailContact(match.contact?.email)}
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {match.contact?.phone && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleCallContact(match.contact?.phone)}
                      >
                        <Phone className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 ml-auto text-muted-foreground hover:text-destructive"
                  onClick={() => handleDismiss(match.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}

          {/* Dismissed matches section */}
          {dismissedMatches.length > 0 && (
            <div className="pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-muted-foreground"
                onClick={() => setShowDismissed(!showDismissed)}
              >
                <span>Dismissed matches ({dismissedMatches.length})</span>
                {showDismissed ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {showDismissed && (
                <div className="mt-2 space-y-2">
                  {dismissedMatches.map((match) => (
                    <div
                      key={match.id}
                      className="p-3 rounded-lg border border-dashed border-border/50 bg-muted/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {match.contact?.full_name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {match.match_score}%
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleRestore(match.id)}
                        >
                          Restore
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
