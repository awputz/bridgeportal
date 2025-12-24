import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";

interface AgentContactCardProps {
  agentName: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  image_url: string | null;
  title: string | null;
}

// Helper to normalize names for matching
const normalizeName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z\s]/g, '') // Remove non-letters
    .replace(/\s+/g, ' ')     // Normalize spaces
    .trim();
};

// Get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Match agent name to team member
const findMatchingAgent = (agentName: string, teamMembers: TeamMember[]): TeamMember | null => {
  const normalizedSearch = normalizeName(agentName);
  const searchParts = normalizedSearch.split(' ').filter(Boolean);
  
  // Try exact match first
  const exactMatch = teamMembers.find(
    member => normalizeName(member.name) === normalizedSearch
  );
  if (exactMatch) return exactMatch;
  
  // Try first + last name match
  if (searchParts.length >= 2) {
    const firstName = searchParts[0];
    const lastName = searchParts[searchParts.length - 1];
    
    const partialMatch = teamMembers.find(member => {
      const memberParts = normalizeName(member.name).split(' ').filter(Boolean);
      if (memberParts.length < 2) return false;
      
      const memberFirst = memberParts[0];
      const memberLast = memberParts[memberParts.length - 1];
      
      return memberFirst === firstName && memberLast === lastName;
    });
    if (partialMatch) return partialMatch;
  }
  
  // Try first name match as fallback (for common nicknames)
  if (searchParts.length >= 1) {
    const firstName = searchParts[0];
    const firstNameMatch = teamMembers.find(member => {
      const memberFirst = normalizeName(member.name).split(' ')[0];
      return memberFirst === firstName;
    });
    if (firstNameMatch) return firstNameMatch;
  }
  
  return null;
};

export function AgentContactCard({ agentName }: AgentContactCardProps) {
  // Fetch all team members
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team-members-for-agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members_public')
        .select('id, name, email, phone, image_url, title');
      
      if (error) throw error;
      return (data || []) as TeamMember[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Handle multiple agents (comma-separated)
  const agentNames = agentName.split(',').map(n => n.trim()).filter(Boolean);
  
  // Match each agent name to team members
  const matchedAgents = agentNames.map(name => ({
    name,
    member: findMatchingAgent(name, teamMembers)
  }));

  return (
    <div className="space-y-3">
      {matchedAgents.map((agent, index) => (
        <div 
          key={index}
          className="flex items-center gap-3 bg-muted/30 rounded-lg p-3"
        >
          {/* Avatar */}
          <Avatar className="h-12 w-12 border border-accent/20 flex-shrink-0">
            <AvatarImage 
              src={agent.member?.image_url || undefined} 
              alt={agent.name} 
            />
            <AvatarFallback className="text-sm font-light bg-accent/10 text-accent">
              {getInitials(agent.name)}
            </AvatarFallback>
          </Avatar>
          
          {/* Info */}
          <div className="flex-1 min-w-0 space-y-0.5">
            <p className="font-medium text-sm truncate leading-tight">{agent.name}</p>
            {agent.member?.title && (
              <p className="text-xs text-muted-foreground truncate leading-tight">
                {agent.member.title}
              </p>
            )}
          </div>
          
          {/* Contact Buttons */}
          {agent.member && (agent.member.phone || agent.member.email) && (
            <div className="flex gap-2 flex-shrink-0">
              {agent.member.phone && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  asChild 
                  className="h-9 w-9 rounded-full border-accent/30 hover:bg-accent/10 hover:border-accent"
                >
                  <a href={`tel:${agent.member.phone}`} aria-label="Call agent">
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {agent.member.email && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  asChild 
                  className="h-9 w-9 rounded-full border-accent/30 hover:bg-accent/10 hover:border-accent"
                >
                  <a href={`mailto:${agent.member.email}`} aria-label="Email agent">
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
