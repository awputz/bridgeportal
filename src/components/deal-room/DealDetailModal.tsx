import { useState, useEffect, memo } from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { 
  ExternalLink, 
  FileText, 
  MessageCircle, 
  Star, 
  Activity, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Target, 
  ImageIcon,
  Download,
  Share2,
  DollarSign,
  Ruler,
  Building2,
  Handshake,
  FileSignature
} from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { 
  useDealRoomDeal, 
  useUpdateDealRoomDeal, 
  useRemoveFromDealRoom,
  useDealRoomInterests,
  useExpressInterest,
  useRemoveInterest
} from "@/hooks/useDealRoom";
import { useDealMatches } from "@/hooks/useDealMatching";
import { useDealRoomPhotos } from "@/hooks/useDealRoomPhotos";
import { useCurrentAgent } from "@/hooks/useCurrentAgent";
import { DealRoomFiles } from "./DealRoomFiles";
import { DealRoomComments } from "./DealRoomComments";
import { DealRoomInterested } from "./DealRoomInterested";
import { DealRoomActivity } from "./DealRoomActivity";
import { DealMatches } from "./DealMatches";
import { DealRoomPhotoGallery } from "./DealRoomPhotoGallery";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import { cn } from "@/lib/utils";
import { SPACING, COMPONENT_CLASSES } from "@/lib/spacing";

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

// Metric card component - compact horizontal layout
const MetricCard = memo(function MetricCard({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: typeof DollarSign;
  label: string;
  value: string | undefined;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="min-w-0 flex-1 space-y-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide m-0 leading-none">{label}</p>
        <p className="text-sm font-semibold truncate m-0 leading-none mt-1.5">{value}</p>
      </div>
    </div>
  );
});

// Interest button component
function InterestButton({ dealId }: { dealId: string }) {
  const { data: interests } = useDealRoomInterests(dealId);
  const { data: agent } = useCurrentAgent();
  const expressInterest = useExpressInterest();
  const removeInterest = useRemoveInterest();
  
  const myInterest = interests?.find(i => i.user_id === agent?.id);
  const isInterested = !!myInterest;
  
  const handleToggle = async () => {
    if (isInterested && myInterest) {
      await removeInterest.mutateAsync({ interestId: myInterest.id, dealId });
    } else {
      await expressInterest.mutateAsync({ dealId, interestType: "general" });
    }
  };
  
  return (
    <Button
      variant={isInterested ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={expressInterest.isPending || removeInterest.isPending}
      className="gap-1.5"
    >
      <Star className={cn("h-4 w-4", isInterested && "fill-current")} />
      {isInterested ? "Interested" : "Express Interest"}
    </Button>
  );
}

export function DealDetailModal({ dealId, open, onOpenChange }: DealDetailModalProps) {
  const navigate = useNavigate();
  const { data: deal, isLoading } = useDealRoomDeal(dealId || "");
  const { data: agent } = useCurrentAgent();
  const { data: matches } = useDealMatches(dealId || "", false);
  const { data: photos } = useDealRoomPhotos(dealId || "");
  const updateDeal = useUpdateDealRoomDeal();
  const removeDeal = useRemoveFromDealRoom();
  const matchCount = matches?.filter(m => !m.is_dismissed && m.match_score >= 70).length || 0;
  const photoCount = photos?.length || 0;

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setIsEditingNotes(false);
      setEditedNotes("");
    }
  }, [open]);

  const isOwner = deal?.agent_id === agent?.id;
  const primaryPhoto = photos?.find(p => p.is_primary) || photos?.[0];
  const heroImage = primaryPhoto?.image_url || PLACEHOLDER_IMAGES.building.exterior;

  const handleStartEditNotes = () => {
    setEditedNotes(deal?.deal_room_notes || "");
    setIsEditingNotes(true);
  };

  const handleSaveNotes = async () => {
    if (!deal) return;
    await updateDeal.mutateAsync({ dealId: deal.id, notes: editedNotes });
    setIsEditingNotes(false);
    toast.success("Notes updated");
  };

  const handleRemove = async () => {
    if (!deal) return;
    await removeDeal.mutateAsync(deal.id);
    setShowRemoveDialog(false);
    onOpenChange(false);
    toast.success("Deal removed from Deal Room");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  if (!dealId) return null;

  return (
    <>
      <Dialog key={dealId} open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col bg-background">
          <DialogHeader className="sr-only">
            <DialogTitle>Deal Details</DialogTitle>
            <DialogDescription>
              Details for the deal at {deal?.property_address}
            </DialogDescription>
          </DialogHeader>

          {isLoading || !deal ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
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
            <div className="flex-1 overflow-y-auto">
              {/* Hero Photo Section - Full width with proper aspect */}
              <div className="relative w-full aspect-[16/9] max-h-72 bg-muted overflow-hidden">
                <img
                  src={heroImage}
                  alt={`Property at ${deal.property_address}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                {/* Address overlay on hero */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-xl md:text-2xl font-semibold text-white drop-shadow-lg leading-tight">
                    {deal.property_address}
                  </h2>
                  {deal.neighborhood && (
                    <p className="text-sm text-white/90 drop-shadow mt-1">
                      {deal.neighborhood}
                      {deal.borough && `, ${deal.borough}`}
                    </p>
                  )}
                </div>

                {/* Photo count badge */}
                {photoCount > 1 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute top-4 right-4 gap-1 bg-background/80 backdrop-blur-sm"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    {photoCount} photos
                  </Badge>
                )}

                {/* Owner delete button */}
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 left-4 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setShowRemoveDialog(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Photo Thumbnail Strip - below hero */}
              {photoCount > 1 && (
                <div className="flex gap-2 p-3 px-4 border-b border-border/30 overflow-x-auto">
                  {photos?.slice(0, 8).map((photo) => (
                    <button
                      key={photo.id}
                      className={cn(
                        "w-12 h-12 rounded-md overflow-hidden border-2 shrink-0 transition-opacity",
                        photo.is_primary ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                      )}
                    >
                      <img src={photo.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {photoCount > 8 && (
                    <div className="w-12 h-12 rounded-md bg-muted/50 flex items-center justify-center shrink-0">
                      <span className="text-xs text-muted-foreground">+{photoCount - 8}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Content Section */}
              <div className="p-4 md:p-6 space-y-4">
                {/* Agent Info - Compact card */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={deal.agent?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">
                      {deal.agent?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm leading-none m-0">{deal.agent?.full_name}</p>
                    <p className="text-xs text-muted-foreground leading-none m-0 mt-1">
                      {DIVISION_LABELS[deal.division] || deal.division} •{" "}
                      {deal.last_deal_room_update
                        ? `Updated ${formatDistanceToNow(new Date(deal.last_deal_room_update), { addSuffix: true })}`
                        : `Shared ${formatDistanceToNow(new Date(deal.created_at), { addSuffix: true })}`}
                    </p>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm"
                    variant={deal.om_file_url ? "default" : "outline"}
                    onClick={() => deal.om_file_url && window.open(deal.om_file_url, "_blank")}
                    disabled={!deal.om_file_url}
                    className="gap-1.5"
                  >
                    <Download className="h-4 w-4 flex-shrink-0" />
                    {deal.om_file_url ? "Download OM" : "No OM"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      onOpenChange(false);
                      navigate(`/portal/esign?dealId=${deal.id}`);
                    }} 
                    className="gap-1.5"
                  >
                    <FileSignature className="h-4 w-4 flex-shrink-0" />
                    Request Signature
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
                    <Share2 className="h-4 w-4 flex-shrink-0" />
                    Share
                  </Button>
                  <InterestButton dealId={deal.id} />
                  <Button variant="outline" size="sm" asChild className="gap-1.5">
                    <Link to={`/portal/crm/deals/${deal.id}`}>
                      <ExternalLink className="h-4 w-4 flex-shrink-0" />
                      CRM
                    </Link>
                  </Button>
                </div>

                {/* Key Metrics - Compact Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCard 
                    icon={DollarSign} 
                    label="Value" 
                    value={deal.value ? formatCurrency(deal.value) : undefined} 
                  />
                  <MetricCard 
                    icon={Ruler} 
                    label="Size" 
                    value={deal.gross_sf ? formatSF(deal.gross_sf) : undefined} 
                  />
                  <MetricCard 
                    icon={Building2} 
                    label="Type" 
                    value={deal.property_type?.replace(/-/g, " ")} 
                  />
                  <MetricCard 
                    icon={Handshake} 
                    label="Deal" 
                    value={deal.deal_type?.replace(/-/g, " ")} 
                  />
                </div>

                {/* Notes - Editable by owner */}
                {isEditingNotes ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Add notes about this deal..."
                      className="min-h-[72px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveNotes}
                        disabled={updateDeal.isPending}
                        className="gap-1"
                      >
                        <Save className="h-3.5 w-3.5 flex-shrink-0" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditingNotes(false)}
                        className="gap-1"
                      >
                        <X className="h-3.5 w-3.5 flex-shrink-0" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : deal.deal_room_notes || isOwner ? (
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/30 group/notes relative">
                    {deal.deal_room_notes ? (
                      <p className="text-sm italic text-muted-foreground leading-relaxed pr-8 m-0">
                        "{deal.deal_room_notes}"
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground/60 m-0">
                        No notes added yet
                      </p>
                    )}
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover/notes:opacity-100 transition-opacity"
                        onClick={handleStartEditNotes}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ) : null}

                <Separator />

                {/* Tabs - Pill/Bubble styling */}
                <Tabs defaultValue="photos" className="w-full">
                  <TabsList className="w-full h-auto p-1 gap-1 bg-muted/30 rounded-xl flex flex-wrap justify-start border border-border/30">
                    <TabsTrigger value="photos" className="gap-1.5 text-xs rounded-lg px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <ImageIcon className="h-3.5 w-3.5 flex-shrink-0" />
                      Photos
                      {photoCount > 0 && (
                        <Badge variant="secondary" className="ml-0.5 text-[10px] px-1.5 py-0 h-4 min-w-[1.25rem]">
                          {photoCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="files" className="gap-1.5 text-xs rounded-lg px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                      Files
                    </TabsTrigger>
                    <TabsTrigger value="comments" className="gap-1.5 text-xs rounded-lg px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <MessageCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      Comments
                    </TabsTrigger>
                    <TabsTrigger value="interested" className="gap-1.5 text-xs rounded-lg px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Star className="h-3.5 w-3.5 flex-shrink-0" />
                      Interested
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="gap-1.5 text-xs rounded-lg px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Activity className="h-3.5 w-3.5 flex-shrink-0" />
                      Activity
                    </TabsTrigger>
                    <TabsTrigger value="matches" className="gap-1.5 text-xs rounded-lg px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Target className="h-3.5 w-3.5 flex-shrink-0" />
                      Matches
                      {matchCount > 0 && (
                        <Badge variant="secondary" className="ml-0.5 text-[10px] px-1.5 py-0 h-4 min-w-[1.25rem]">
                          {matchCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-4">
                    <TabsContent value="photos" className="m-0">
                      <DealRoomPhotoGallery dealId={deal.id} isOwner={isOwner} />
                    </TabsContent>

                    <TabsContent value="files" className="m-0">
                      <DealRoomFiles
                        dealId={deal.id}
                        isOwner={isOwner}
                        omFileUrl={deal.om_file_url}
                        omFileName={deal.om_file_name}
                      />
                    </TabsContent>

                    <TabsContent value="comments" className="m-0">
                      <DealRoomComments dealId={deal.id} />
                    </TabsContent>

                    <TabsContent value="interested" className="m-0 px-1">
                      <DealRoomInterested dealId={deal.id} />
                    </TabsContent>

                    <TabsContent value="activity" className="m-0">
                      <DealRoomActivity dealId={deal.id} />
                    </TabsContent>

                    <TabsContent value="matches" className="m-0">
                      <DealMatches dealId={deal.id} />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
