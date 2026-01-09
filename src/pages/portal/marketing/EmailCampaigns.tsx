import { useState } from "react";
import { useEmailCampaigns, useUpdateEmailCampaign } from "@/hooks/marketing/useEmailCampaigns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Plus,
  MoreVertical,
  Calendar,
  Users,
  BarChart3,
  Send,
  Clock,
  FileText,
  UserPlus,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { CreateCampaignDialog } from "@/components/marketing/CreateCampaignDialog";
import { AddRecipientsDialog } from "@/components/marketing/AddRecipientsDialog";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const statusConfig = {
  draft: { label: "Draft", variant: "secondary" as const, icon: FileText },
  scheduled: { label: "Scheduled", variant: "outline" as const, icon: Clock },
  sending: { label: "Sending", variant: "default" as const, icon: Send },
  sent: { label: "Sent", variant: "default" as const, icon: Mail },
  failed: { label: "Failed", variant: "destructive" as const, icon: Mail },
};

export default function EmailCampaigns() {
  const [activeTab, setActiveTab] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [recipientsOpen, setRecipientsOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);
  const [sendingCampaignId, setSendingCampaignId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const { data: campaigns, isLoading, refetch } = useEmailCampaigns(
    activeTab === "all" ? undefined : activeTab
  );
  const updateCampaign = useUpdateEmailCampaign();

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  };

  const handleAddRecipients = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setRecipientsOpen(true);
  };

  const handleSendCampaign = (campaignId: string) => {
    setSendingCampaignId(campaignId);
    setConfirmSendOpen(true);
  };

  const confirmSend = async () => {
    if (!sendingCampaignId) return;
    
    setIsSending(true);
    try {
      const response = await supabase.functions.invoke("send-campaign-email", {
        body: { campaignId: sendingCampaignId },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast.success("Campaign sending initiated!");
      refetch();
    } catch (error) {
      console.error("Send campaign error:", error);
      toast.error("Failed to send campaign");
    } finally {
      setIsSending(false);
      setConfirmSendOpen(false);
      setSendingCampaignId(null);
    }
  };

  const selectedCampaign = campaigns?.find(c => c.id === sendingCampaignId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage email marketing campaigns
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="h-5 bg-muted rounded w-1/3" />
                        <div className="h-4 bg-muted rounded w-1/4" />
                      </div>
                      <div className="h-6 bg-muted rounded w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !campaigns?.length ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Mail className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No campaigns yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first email campaign to reach your contacts
                </p>
                <Button onClick={() => setCreateOpen(true)} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Campaign
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => {
                const status = getStatusConfig(campaign.status);
                const StatusIcon = status.icon;
                
                return (
                  <Card
                    key={campaign.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold truncate">{campaign.name}</h3>
                            <Badge variant={status.variant} className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </Badge>
                          </div>
                          
                          {campaign.subject && (
                            <p className="text-sm text-muted-foreground mb-2 truncate">
                              Subject: {campaign.subject}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {campaign.total_recipients || 0} recipients
                            </span>
                            
                            {campaign.scheduled_at && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {format(new Date(campaign.scheduled_at), "MMM d, yyyy h:mm a")}
                              </span>
                            )}
                            
                            {campaign.sent_at && (
                              <span className="flex items-center gap-1">
                                <Send className="h-3.5 w-3.5" />
                                Sent {format(new Date(campaign.sent_at), "MMM d, yyyy")}
                              </span>
                            )}
                            
                            {campaign.status === "sent" && campaign.total_recipients > 0 && (
                              <span className="flex items-center gap-1">
                                <BarChart3 className="h-3.5 w-3.5" />
                                {Math.round((campaign.total_opened / campaign.total_recipients) * 100)}% opened
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {campaign.status === "draft" && (
                              <>
                                <DropdownMenuItem onClick={() => handleAddRecipients(campaign.id)}>
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Add Recipients
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleSendCampaign(campaign.id)}
                                  disabled={campaign.total_recipients === 0}
                                >
                                  <Send className="mr-2 h-4 w-4" />
                                  Send Campaign
                                </DropdownMenuItem>
                              </>
                            )}
                            {campaign.status === "sent" && (
                              <DropdownMenuItem>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                View Analytics
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Campaign Dialog */}
      <CreateCampaignDialog open={createOpen} onOpenChange={setCreateOpen} />
      
      {/* Add Recipients Dialog */}
      <AddRecipientsDialog 
        open={recipientsOpen} 
        onOpenChange={setRecipientsOpen}
        campaignId={selectedCampaignId}
        onSuccess={() => refetch()}
      />

      {/* Confirm Send Dialog */}
      <AlertDialog open={confirmSendOpen} onOpenChange={setConfirmSendOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send "{selectedCampaign?.name}" to {selectedCampaign?.total_recipients || 0} recipients? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSend} disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Now
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
