import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, FileText, MessageCircle, Star, Activity, Edit2, Trash2, Save, X, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useDealRoomDeal, useUpdateDealRoomDeal, useRemoveFromDealRoom } from "@/hooks/useDealRoom";
import { useDealMatches } from "@/hooks/useDealMatching";
import { useCurrentAgent } from "@/hooks/useCurrentAgent";
import { DealRoomFiles } from "./DealRoomFiles";
import { DealRoomComments } from "./DealRoomComments";
import { DealRoomInterested } from "./DealRoomInterested";
import { DealRoomActivity } from "./DealRoomActivity";
import { DealMatches } from "./DealMatches";

interface DealDetailModalProps {
  dealId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DIVISION_LABELS: Record<string, string> = {
  "investment-sales": "Investment Sales",
  "commercial-leasing": "Commercial Leasing",
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

function formatSF(sf: number): string {
  return `${sf.toLocaleString()} SF`;
}

export function DealDetailModal({ dealId, open, onOpenChange }: DealDetailModalProps) {
  const { data: deal, isLoading } = useDealRoomDeal(dealId || "");
  const { data: agent } = useCurrentAgent();
  const { data: matches } = useDealMatches(dealId || "", false);
  const updateDeal = useUpdateDealRoomDeal();
  const removeDeal = useRemoveFromDealRoom();
  const matchCount = matches?.filter(m => !m.is_dismissed && m.match_score >= 70).length || 0;

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const isOwner = deal?.agent_id === agent?.id;

  const handleStartEditNotes = () => {
    setEditedNotes(deal?.deal_room_notes || "");
    setIsEditingNotes(true);
  };

  const handleSaveNotes = async () => {
    if (!deal) return;
    await updateDeal.mutateAsync({ dealId: deal.id, notes: editedNotes });
    setIsEditingNotes(false);
  };

  const handleRemove = async () => {
    if (!deal) return;
    await removeDeal.mutateAsync(deal.id);
    setShowRemoveDialog(false);
    onOpenChange(false);
  };

  if (!dealId) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4">
            <SheetTitle className="sr-only">Deal Details</SheetTitle>
          </SheetHeader>

          {isLoading || !deal ? (
            <div className="px-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Deal Header */}
              <div className="px-6 space-y-4">
                {/* Address + Owner Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-semibold leading-tight">
                      {deal.property_address}
                    </h2>
                    {deal.neighborhood && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {deal.neighborhood}
                        {deal.borough && `, ${deal.borough}`}
                      </p>
                    )}
                  </div>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive flex-shrink-0"
                      onClick={() => setShowRemoveDialog(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Agent Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={deal.agent?.avatar_url || undefined} />
                    <AvatarFallback className="text-sm">
                      {deal.agent?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{deal.agent?.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {DIVISION_LABELS[deal.division] || deal.division} •{" "}
                      {deal.last_deal_room_update
                        ? `Updated ${formatDistanceToNow(new Date(deal.last_deal_room_update), { addSuffix: true })}`
                        : `Shared ${formatDistanceToNow(new Date(deal.created_at), { addSuffix: true })}`}
                    </p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-4 gap-2">
                  {deal.value && (
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-sm font-semibold">{formatCurrency(deal.value)}</p>
                      <p className="text-xs text-muted-foreground">Value</p>
                    </div>
                  )}
                  {deal.gross_sf && (
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-sm font-semibold">{formatSF(deal.gross_sf)}</p>
                      <p className="text-xs text-muted-foreground">Size</p>
                    </div>
                  )}
                  {deal.property_type && (
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-sm font-semibold capitalize">
                        {deal.property_type.replace(/-/g, " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">Type</p>
                    </div>
                  )}
                  {deal.deal_type && (
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-sm font-semibold capitalize">
                        {deal.deal_type.replace(/-/g, " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">Deal</p>
                    </div>
                  )}
                </div>

                {/* Notes - Editable by owner */}
                {isEditingNotes ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Add notes about this deal..."
                      className="min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveNotes}
                        disabled={updateDeal.isPending}
                        className="gap-1"
                      >
                        <Save className="h-3.5 w-3.5" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditingNotes(false)}
                        className="gap-1"
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : deal.deal_room_notes || isOwner ? (
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50 group/notes relative">
                    {deal.deal_room_notes ? (
                      <p className="text-sm italic text-muted-foreground leading-relaxed">
                        "{deal.deal_room_notes}"
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground/60">
                        No notes added yet
                      </p>
                    )}
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover/notes:opacity-100 transition-opacity"
                        onClick={handleStartEditNotes}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ) : null}
              </div>

              <Separator className="my-4" />

              {/* Tabs */}
              <Tabs defaultValue="files" className="flex-1 flex flex-col min-h-0">
                <TabsList className="mx-6 w-auto justify-start">
                  <TabsTrigger value="files" className="gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    Files
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="gap-1.5">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Comments
                  </TabsTrigger>
                  <TabsTrigger value="interested" className="gap-1.5">
                    <Star className="h-3.5 w-3.5" />
                    Interested
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="gap-1.5">
                    <Activity className="h-3.5 w-3.5" />
                    Activity
                  </TabsTrigger>
                  <TabsTrigger value="matches" className="gap-1.5">
                    <Target className="h-3.5 w-3.5" />
                    Matches
                    {matchCount > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
                        {matchCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 min-h-0 mt-4">
                  <TabsContent value="files" className="h-full m-0">
                    <DealRoomFiles
                      dealId={deal.id}
                      isOwner={isOwner}
                      omFileUrl={deal.om_file_url}
                      omFileName={deal.om_file_name}
                    />
                  </TabsContent>

                  <TabsContent value="comments" className="h-full m-0">
                    <DealRoomComments dealId={deal.id} />
                  </TabsContent>

                  <TabsContent value="interested" className="h-full m-0 px-4">
                    <DealRoomInterested dealId={deal.id} />
                  </TabsContent>

                  <TabsContent value="activity" className="h-full m-0">
                    <DealRoomActivity dealId={deal.id} />
                  </TabsContent>

                  <TabsContent value="matches" className="h-full m-0">
                    <DealMatches dealId={deal.id} />
                  </TabsContent>
                </div>
              </Tabs>

              {/* Footer */}
              <div className="px-6 py-4 border-t mt-auto">
                <Button variant="outline" className="w-full gap-2" asChild>
                  <Link to={`/portal/crm/deals/${deal.id}`}>
                    <ExternalLink className="h-4 w-4" />
                    View Full Deal in CRM
                  </Link>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Remove confirmation dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Deal Room?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the deal from the team's Deal Room. The deal will remain in your CRM and you can share it again later.
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
    </>
  );
}
