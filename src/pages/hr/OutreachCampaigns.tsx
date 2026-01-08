import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { 
  Plus, 
  Mail, 
  MoreHorizontal, 
  Eye, 
  Copy, 
  Trash2,
  Send,
  Users,
  BarChart3,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { 
  useHRCampaigns, 
  useDeleteHRCampaign,
  useCreateHRCampaign,
  campaignStatusColors,
  type CampaignStatus,
  type CampaignWithStats
} from "@/hooks/hr/useHRCampaigns";
import { CampaignFormDialog } from "@/components/hr/CampaignFormDialog";
import { divisionLabels, type Division } from "@/hooks/hr/useHRAgents";

export default function OutreachCampaigns() {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: campaigns = [], isLoading } = useHRCampaigns();
  const deleteCampaign = useDeleteHRCampaign();
  const createCampaign = useCreateHRCampaign();

  // Calculate overview metrics
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent_count, 0);
  const totalOpened = campaigns.reduce((sum, c) => sum + c.opened_count, 0);
  const totalReplied = campaigns.reduce((sum, c) => sum + c.replied_count, 0);
  const avgOpenRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
  const avgReplyRate = totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0;

  const handleDuplicate = async (campaign: CampaignWithStats) => {
    await createCampaign.mutateAsync({
      name: `${campaign.name} (Copy)`,
      division: campaign.division,
      email_subject: campaign.email_subject,
      email_template: campaign.email_template,
      status: 'draft',
    });
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCampaign.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight">Outreach Campaigns</h1>
          <p className="text-muted-foreground text-sm">
            Manage email campaigns to recruit top agents
          </p>
        </div>
        <Button 
          onClick={() => setFormOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Mail className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-light">{activeCampaigns}</p>
              <p className="text-xs text-muted-foreground">Active Campaigns</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Send className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-light">{totalSent}</p>
              <p className="text-xs text-muted-foreground">Emails Sent</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <BarChart3 className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-light">{avgOpenRate}%</p>
              <p className="text-xs text-muted-foreground">Open Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <MessageSquare className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-light">{avgReplyRate}%</p>
              <p className="text-xs text-muted-foreground">Reply Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            Loading campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Mail className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">No campaigns yet</p>
            <Button 
              onClick={() => setFormOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first campaign
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Division</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-center">Recipients</TableHead>
                <TableHead className="text-muted-foreground text-center">Sent</TableHead>
                <TableHead className="text-muted-foreground text-center">Opened</TableHead>
                <TableHead className="text-muted-foreground text-center">Replied</TableHead>
                <TableHead className="text-muted-foreground">Created</TableHead>
                <TableHead className="text-muted-foreground w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow 
                  key={campaign.id} 
                  className="border-white/10 hover:bg-white/5 cursor-pointer"
                  onClick={() => navigate(`/hr/outreach/${campaign.id}`)}
                >
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    {campaign.division ? (
                      <Badge variant="outline" className="text-xs">
                        {divisionLabels[campaign.division as Division] || campaign.division}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">All</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${campaignStatusColors[campaign.status as CampaignStatus]}`}
                    >
                      {campaign.status === 'active' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                      )}
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      {campaign.total_recipients}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{campaign.sent_count}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-amber-400">{campaign.opened_count}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-emerald-400">{campaign.replied_count}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(campaign.created_at!), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/hr/outreach/${campaign.id}`);
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(campaign);
                        }}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-400 focus:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(campaign.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <CampaignFormDialog 
        open={formOpen} 
        onOpenChange={setFormOpen} 
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-sidebar border-border/40">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the campaign and remove all associated agent records. This action cannot be undone.
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
