import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { 
  ArrowLeft, 
  Mail, 
  Eye,
  UserPlus,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  Copy,
  X
} from "lucide-react";
import { 
  useHRCampaign, 
  useCampaignAgents,
  useUpdateHRCampaign,
  useUpdateCampaignStatus,
  useRemoveAgentFromCampaign,
  useDeleteHRCampaign,
  useCreateHRCampaign,
  campaignStatusColors,
  emailStatusColors,
  type CampaignStatus,
  type EmailStatus
} from "@/hooks/hr/useHRCampaigns";
import { divisionLabels, type Division } from "@/hooks/hr/useHRAgents";
import { CampaignStats } from "@/components/hr/CampaignStats";
import { AddAgentsToCampaignDialog } from "@/components/hr/AddAgentsToCampaignDialog";
import { EmailPreviewDialog } from "@/components/hr/EmailPreviewDialog";

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [addAgentsOpen, setAddAgentsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editSubject, setEditSubject] = useState<string | null>(null);
  const [editTemplate, setEditTemplate] = useState<string | null>(null);

  const { data: campaign, isLoading } = useHRCampaign(id);
  const { data: campaignAgents = [] } = useCampaignAgents(id);
  
  const updateCampaign = useUpdateHRCampaign();
  const updateStatus = useUpdateCampaignStatus();
  const removeAgent = useRemoveAgentFromCampaign();
  const deleteCampaign = useDeleteHRCampaign();
  const duplicateCampaign = useCreateHRCampaign();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground mb-4">Campaign not found</p>
        <Button variant="outline" onClick={() => navigate('/hr/outreach')}>
          Back to Campaigns
        </Button>
      </div>
    );
  }

  // Calculate stats
  const stats = {
    total: campaignAgents.length,
    sent: campaignAgents.filter(a => a.email_status !== 'pending').length,
    opened: campaignAgents.filter(a => ['opened', 'clicked', 'replied'].includes(a.email_status)).length,
    replied: campaignAgents.filter(a => a.email_status === 'replied').length,
  };

  const handleStatusChange = async (status: CampaignStatus) => {
    await updateStatus.mutateAsync({ id: campaign.id, status });
  };

  const handleSaveSubject = async () => {
    if (editSubject !== null) {
      await updateCampaign.mutateAsync({ id: campaign.id, email_subject: editSubject });
      setEditSubject(null);
    }
  };

  const handleSaveTemplate = async () => {
    if (editTemplate !== null) {
      await updateCampaign.mutateAsync({ id: campaign.id, email_template: editTemplate });
      setEditTemplate(null);
    }
  };

  const handleRemoveAgent = async (agentId: string) => {
    await removeAgent.mutateAsync({ campaignId: campaign.id, agentId });
  };

  const handleDelete = async () => {
    await deleteCampaign.mutateAsync(campaign.id);
    navigate('/hr/outreach');
  };

  const handleDuplicate = async () => {
    const newCampaign = await duplicateCampaign.mutateAsync({
      name: `${campaign.name} (Copy)`,
      division: campaign.division,
      email_subject: campaign.email_subject,
      email_template: campaign.email_template,
      status: 'draft',
    });
    navigate(`/hr/outreach/${newCampaign.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/hr/outreach')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-light tracking-tight">{campaign.name}</h1>
            <Badge 
              variant="outline" 
              className={`${campaignStatusColors[campaign.status as CampaignStatus]}`}
            >
              {campaign.status === 'active' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
              )}
              {campaign.status}
            </Badge>
            {campaign.division && (
              <Badge variant="outline" className="text-xs">
                {divisionLabels[campaign.division as Division] || campaign.division}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Email Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject Line */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
              Email Subject
            </label>
            {editSubject !== null ? (
              <div className="flex gap-2">
                <Input
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="bg-white/5 border-white/10 flex-1"
                  placeholder="Enter subject line..."
                />
                <Button size="sm" onClick={handleSaveSubject} className="bg-emerald-600 hover:bg-emerald-700">
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditSubject(null)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div 
                className="p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setEditSubject(campaign.email_subject || '')}
              >
                {campaign.email_subject || (
                  <span className="text-muted-foreground italic">Click to add subject...</span>
                )}
              </div>
            )}
          </div>

          {/* Email Template */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">
                Email Template
              </label>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setPreviewOpen(true)}
                disabled={!campaign.email_template}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>
            {editTemplate !== null ? (
              <div className="space-y-2">
                <Textarea
                  value={editTemplate}
                  onChange={(e) => setEditTemplate(e.target.value)}
                  className="bg-white/5 border-white/10 min-h-[250px]"
                  placeholder="Write your email template..."
                />
                <p className="text-xs text-muted-foreground">
                  Variables: {"{{first_name}}"}, {"{{full_name}}"}, {"{{brokerage}}"}, {"{{division}}"}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveTemplate} className="bg-emerald-600 hover:bg-emerald-700">
                    Save Template
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditTemplate(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                className="p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors min-h-[200px] whitespace-pre-wrap"
                onClick={() => setEditTemplate(campaign.email_template || '')}
              >
                {campaign.email_template || (
                  <span className="text-muted-foreground italic">Click to add email template...</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Stats & Recipients */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 text-emerald-400" />
              Campaign Stats
            </h3>
            <CampaignStats {...stats} />
          </div>

          {/* Recipients */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Recipients ({stats.total})</h3>
              <Button 
                size="sm" 
                variant="outline"
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                onClick={() => setAddAgentsOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            <ScrollArea className="h-[300px]">
              {campaignAgents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <p className="text-muted-foreground text-sm mb-2">No recipients yet</p>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setAddAgentsOpen(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add agents
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {campaignAgents.map((ca) => {
                    const agent = ca.agent as any;
                    if (!agent) return null;
                    
                    return (
                      <div 
                        key={ca.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-white/5 group"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={agent.photo_url || undefined} />
                          <AvatarFallback className="bg-white/10 text-xs">
                            {agent.full_name?.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{agent.full_name}</p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${emailStatusColors[ca.email_status as EmailStatus]}`}
                          >
                            {ca.email_status}
                          </Badge>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveAgent(ca.agent_id)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Actions */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-medium mb-3">Actions</h3>
            
            {/* Status Actions */}
            {campaign.status === 'draft' && (
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleStatusChange('active')}
                disabled={!campaign.email_subject || !campaign.email_template || stats.total === 0}
              >
                <Play className="h-4 w-4 mr-2" />
                Activate Campaign
              </Button>
            )}
            
            {campaign.status === 'active' && (
              <Button 
                variant="outline"
                className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                onClick={() => handleStatusChange('paused')}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause Campaign
              </Button>
            )}
            
            {campaign.status === 'paused' && (
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleStatusChange('active')}
              >
                <Play className="h-4 w-4 mr-2" />
                Resume Campaign
              </Button>
            )}
            
            {(campaign.status === 'active' || campaign.status === 'paused') && (
              <Button 
                variant="outline"
                className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                onClick={() => handleStatusChange('completed')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}

            <Button 
              variant="outline"
              className="w-full"
              onClick={handleDuplicate}
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate Campaign
            </Button>

            <Button 
              variant="outline"
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddAgentsToCampaignDialog
        open={addAgentsOpen}
        onOpenChange={setAddAgentsOpen}
        campaignId={campaign.id}
      />

      <EmailPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        subject={campaign.email_subject || ''}
        template={campaign.email_template || ''}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-sidebar border-border/40">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{campaign.name}" and all associated data. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
