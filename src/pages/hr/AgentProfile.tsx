import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";
import { 
  ArrowLeft, Phone, Mail, Linkedin, Building2, Calendar, DollarSign, 
  Briefcase, MessageSquare, Pencil, PhoneCall, Video, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PoachabilityScore } from "@/components/hr/PoachabilityScore";
import { AgentFormDialog } from "@/components/hr/AgentFormDialog";
import { LogInteractionDialog } from "@/components/hr/LogInteractionDialog";
import { 
  useHRAgent, 
  useHRInteractions,
  useUpdateHRAgent,
  RecruitmentStatus,
  Division,
  InteractionType,
  formatProduction,
  statusColors,
  divisionColors,
  divisionLabels,
  statusLabels
} from "@/hooks/hr/useHRAgents";
import { cn } from "@/lib/utils";

const interactionIcons: Record<InteractionType, React.ReactNode> = {
  call: <PhoneCall className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  meeting: <Video className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  text: <Send className="h-4 w-4" />,
  other: <MessageSquare className="h-4 w-4" />,
};

const outcomeColors = {
  positive: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  neutral: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  negative: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function AgentProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: agent, isLoading } = useHRAgent(id);
  const { data: interactions = [] } = useHRInteractions(id);
  const updateAgent = useUpdateHRAgent();

  const [formOpen, setFormOpen] = useState(false);
  const [interactionOpen, setInteractionOpen] = useState(false);
  const [interactionType, setInteractionType] = useState<InteractionType>('call');
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const handleStatusChange = async (status: RecruitmentStatus) => {
    if (!agent) return;
    await updateAgent.mutateAsync({ id: agent.id, updates: { recruitment_status: status } });
  };

  const handleSaveNotes = async () => {
    if (!agent) return;
    setIsSavingNotes(true);
    await updateAgent.mutateAsync({ id: agent.id, updates: { notes } });
    setIsSavingNotes(false);
  };

  const openInteractionDialog = (type: InteractionType) => {
    setInteractionType(type);
    setInteractionOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Agent not found</p>
        <Button variant="link" onClick={() => navigate('/hr/agents')}>
          Back to Agent Database
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate('/hr/agents')} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Database
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={agent.photo_url || undefined} />
                  <AvatarFallback className="bg-emerald-500/10 text-emerald-400 text-2xl">
                    {agent.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-2xl font-light">{agent.full_name}</h1>
                      {agent.current_brokerage && (
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                          <Building2 className="h-4 w-4" />
                          {agent.current_brokerage}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {agent.division && (
                        <Badge variant="outline" className={cn("text-xs", divisionColors[agent.division as Division])}>
                          {divisionLabels[agent.division as Division]}
                        </Badge>
                      )}
                      <Select 
                        value={agent.recruitment_status} 
                        onValueChange={(v) => handleStatusChange(v as RecruitmentStatus)}
                      >
                        <SelectTrigger className={cn("w-[140px] h-8", statusColors[agent.recruitment_status as RecruitmentStatus])}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {agent.email && (
                      <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <Mail className="h-4 w-4" />
                        {agent.email}
                      </a>
                    )}
                    {agent.phone && (
                      <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <Phone className="h-4 w-4" />
                        {agent.phone}
                      </a>
                    )}
                    {agent.linkedin_url && (
                      <a href={agent.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                <p className="text-lg font-semibold">{formatProduction(agent.annual_production ? Number(agent.annual_production) : null)}</p>
                <p className="text-xs text-muted-foreground">Annual Production</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Briefcase className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                <p className="text-lg font-semibold">{agent.years_experience ?? '-'}</p>
                <p className="text-xs text-muted-foreground">Years Experience</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                <p className="text-lg font-semibold">
                  {agent.last_contacted_at 
                    ? formatDistanceToNow(new Date(agent.last_contacted_at), { addSuffix: true })
                    : 'Never'}
                </p>
                <p className="text-xs text-muted-foreground">Last Contact</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                <p className="text-lg font-semibold">{interactions.length}</p>
                <p className="text-xs text-muted-foreground">Interactions</p>
              </CardContent>
            </Card>
          </div>

          {/* Poachability Score */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Poachability Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PoachabilityScore score={agent.poachability_score} />
            </CardContent>
          </Card>

          {/* Next Action */}
          {agent.next_action && (
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-emerald-400 mb-1">Next Action</p>
                <p className="text-foreground">{agent.next_action}</p>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={notes || agent.notes || ''}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this agent..."
                rows={4}
              />
              {(notes !== '' && notes !== agent.notes) && (
                <Button 
                  size="sm" 
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSavingNotes ? 'Saving...' : 'Save Notes'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Source */}
          {agent.source && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Source</p>
                <p className="text-foreground">{agent.source}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => openInteractionDialog('call')}
              >
                <PhoneCall className="h-4 w-4" />
                Log Call
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => openInteractionDialog('email')}
              >
                <Mail className="h-4 w-4" />
                Log Email
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => openInteractionDialog('meeting')}
              >
                <Video className="h-4 w-4" />
                Log Meeting
              </Button>
              <Button 
                className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setFormOpen(true)}
              >
                <Pencil className="h-4 w-4" />
                Edit Agent
              </Button>
            </CardContent>
          </Card>

          {/* Interaction Timeline */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Interaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {interactions.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No interactions logged yet
                </p>
              ) : (
                <div className="space-y-4">
                  {interactions.map((interaction) => (
                    <div key={interaction.id} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {interactionIcons[interaction.interaction_type as InteractionType]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm capitalize">
                            {interaction.interaction_type}
                          </span>
                          {interaction.outcome && (
                            <Badge variant="outline" className={cn("text-xs", outcomeColors[interaction.outcome as keyof typeof outcomeColors])}>
                              {interaction.outcome}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(interaction.interaction_date), 'MMM d, yyyy')}
                        </p>
                        {interaction.notes && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {interaction.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button 
                variant="ghost" 
                className="w-full mt-4 text-emerald-400"
                onClick={() => setInteractionOpen(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Interaction
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <AgentFormDialog 
        open={formOpen} 
        onOpenChange={setFormOpen}
        agent={agent}
      />

      <LogInteractionDialog
        open={interactionOpen}
        onOpenChange={setInteractionOpen}
        agentId={agent.id}
        agentName={agent.full_name}
        defaultType={interactionType}
      />
    </div>
  );
}
