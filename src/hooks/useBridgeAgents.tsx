import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TeamCategory = 'Leadership' | 'Investment Sales' | 'Residential' | 'Operations' | 'Marketing' | 'Advisory';

export interface BridgeAgent {
  id: string;
  name: string;
  slug: string;
  title: string;
  image_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  category: TeamCategory;
  bio?: string;
  display_order: number;
  // Computed properties
  profileUrl: string;
}

export interface GroupedAgents {
  Leadership: BridgeAgent[];
  'Investment Sales': BridgeAgent[];
  Residential: BridgeAgent[];
  Operations: BridgeAgent[];
  Marketing: BridgeAgent[];
  Advisory: BridgeAgent[];
}

const CATEGORY_ORDER: TeamCategory[] = [
  'Leadership',
  'Investment Sales',
  'Residential',
  'Operations',
  'Marketing',
  'Advisory'
];

export const useBridgeAgents = () => {
  return useQuery({
    queryKey: ['bridge-agents-public'],
    queryFn: async () => {
      // Use the secure public view that doesn't expose email/phone
      const { data, error } = await supabase
        .from('team_members_public')
        .select('*')
        .order('display_order');

      if (error) throw error;

      // Transform to BridgeAgent with computed properties
      const agents: BridgeAgent[] = (data || []).map((member) => ({
        id: member.id || '',
        name: member.name || '',
        slug: member.slug || (member.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        title: member.title || '',
        image_url: member.image_url || undefined,
        instagram_url: member.instagram_url || undefined,
        linkedin_url: member.linkedin_url || undefined,
        category: (member.category as TeamCategory) || 'Advisory',
        bio: member.bio || undefined,
        display_order: member.display_order || 0,
        // Computed properties
        profileUrl: `/team/${member.slug || (member.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
      }));

      // Group by category
      const grouped: GroupedAgents = {
        Leadership: [],
        'Investment Sales': [],
        Residential: [],
        Operations: [],
        Marketing: [],
        Advisory: [],
      };

      agents.forEach((agent) => {
        if (grouped[agent.category]) {
          grouped[agent.category].push(agent);
        }
      });

      return {
        all: agents,
        grouped,
        categories: CATEGORY_ORDER,
      };
    },
  });
};

// Helper to get agents for a specific category
export const useBridgeAgentsByCategory = (category: TeamCategory) => {
  const { data, ...rest } = useBridgeAgents();
  
  return {
    ...rest,
    data: data?.grouped[category] || [],
  };
};
