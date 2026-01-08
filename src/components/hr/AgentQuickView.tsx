import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HRAgent, HRInteraction, formatProduction, divisionColors, divisionLabels, statusColors, statusLabels, Division, RecruitmentStatus } from "@/hooks/hr/useHRAgents";
import { PoachabilityScore } from "./PoachabilityScore";
import { Phone, Mail, Linkedin, ExternalLink, MessageSquare, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatSafeRelativeTime } from "@/lib/dateUtils";

interface AgentQuickViewProps {
  agent: HRAgent | null;
  interactions: HRInteraction[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogInteraction: () => void;
}

const interactionIcons: Record<string, typeof Phone> = {
  call: Phone,
  email: Mail,
  linkedin: Linkedin,
  meeting: Calendar,
  text: MessageSquare,
  other: MessageSquare,
};

export function AgentQuickView({ agent, interactions, open, onOpenChange, onLogInteraction }: AgentQuickViewProps) {
  const navigate = useNavigate();

  if (!agent) return null;

  const initials = agent.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  const divisionColor = agent.division 
    ? divisionColors[agent.division as Division] 
    : 'bg-muted text-muted-foreground';

  const statusColor = agent.recruitment_status
    ? statusColors[agent.recruitment_status as RecruitmentStatus]
    : 'bg-muted text-muted-foreground';

  const recentInteractions = interactions.slice(0, 3);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="sr-only">Agent Details</SheetTitle>
        </SheetHeader>

        {/* Agent Header */}
        <div className="flex items-start gap-4 mt-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={agent.photo_url || undefined} alt={agent.full_name || ''} />
            <AvatarFallback className="text-lg bg-muted">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold truncate">{agent.full_name}</h2>
            <p className="text-muted-foreground text-sm truncate">
              {agent.current_brokerage || 'Unknown brokerage'}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {agent.division && (
                <Badge variant="outline" className={divisionColor}>
                  {divisionLabels[agent.division as Division]}
                </Badge>
              )}
              {agent.recruitment_status && (
                <Badge variant="outline" className={statusColor}>
                  {statusLabels[agent.recruitment_status as RecruitmentStatus]}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Production</p>
            <p className="font-medium">{formatProduction(agent.annual_production)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Experience</p>
            <p className="font-medium">{agent.years_experience ? `${agent.years_experience} years` : '-'}</p>
          </div>
          <div className="col-span-2 space-y-1">
            <p className="text-xs text-muted-foreground">Poachability Score</p>
            <PoachabilityScore score={agent.poachability_score} />
          </div>
        </div>

        <Separator className="my-4" />

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={onLogInteraction}>
              <Phone className="h-4 w-4 mr-2" />
              Log Call
            </Button>
            <Button variant="outline" size="sm" onClick={onLogInteraction}>
              <Mail className="h-4 w-4 mr-2" />
              Log Email
            </Button>
          </div>
          <Button 
            variant="secondary" 
            className="w-full" 
            size="sm"
            onClick={() => {
              onOpenChange(false);
              navigate(`/hr/agents/${agent.id}`);
            }}
          >
            <User className="h-4 w-4 mr-2" />
            View Full Profile
          </Button>
        </div>

        {/* Contact Info */}
        {(agent.email || agent.phone || agent.linkedin_url) && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Contact</p>
              <div className="space-y-2">
                {agent.email && (
                  <a 
                    href={`mailto:${agent.email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    {agent.email}
                  </a>
                )}
                {agent.phone && (
                  <a 
                    href={`tel:${agent.phone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    {agent.phone}
                  </a>
                )}
                {agent.linkedin_url && (
                  <a 
                    href={agent.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn Profile
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </>
        )}

        {/* Recent Interactions */}
        <Separator className="my-4" />
        <div className="space-y-3">
          <p className="text-sm font-medium">Recent Interactions</p>
          {recentInteractions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No interactions logged yet</p>
          ) : (
            <div className="space-y-2">
              {recentInteractions.map((interaction) => {
                const Icon = interactionIcons[interaction.interaction_type || 'other'] || MessageSquare;
                return (
                  <div 
                    key={interaction.id} 
                    className="flex items-start gap-3 p-2 rounded-lg bg-muted/50"
                  >
                    <div className="p-1.5 rounded-full bg-background">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium capitalize">
                          {interaction.interaction_type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatSafeRelativeTime(interaction.interaction_date)}
                        </span>
                      </div>
                      {interaction.notes && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {interaction.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
