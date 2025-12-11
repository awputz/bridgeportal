import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TeamCategory = 'Leadership' | 'Investment Sales' | 'Residential' | 'Operations' | 'Marketing' | 'Advisory';

export interface BridgeAgent {
  id: string;
  name: string;
  slug: string;
  title: string;
  email: string;
  phone?: string;
  license_number?: string;
  image_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  category: TeamCategory;
  bio?: string;
  display_order: number;
  is_active: boolean;
  // Computed properties
  mailtoLink: string;
  telLink?: string;
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

const formatPhoneForTel = (phone: string | null | undefined): string | undefined => {
  if (!phone) return undefined;
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  return digits.length > 0 ? `+1${digits}` : undefined;
};

export const useBridgeAgents = () => {
  return useQuery({
    queryKey: ['bridge-agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;

      // Transform to BridgeAgent with computed properties
      const agents: BridgeAgent[] = (data || []).map((member) => ({
        id: member.id,
        name: member.name,
        slug: member.slug || member.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        title: member.title,
        email: member.email,
        phone: member.phone || undefined,
        license_number: member.license_number || undefined,
        image_url: member.image_url || undefined,
        instagram_url: member.instagram_url || undefined,
        linkedin_url: member.linkedin_url || undefined,
        category: member.category as TeamCategory,
        bio: member.bio || undefined,
        display_order: member.display_order || 0,
        is_active: member.is_active ?? true,
        // Computed properties
        mailtoLink: `mailto:${member.email}`,
        telLink: formatPhoneForTel(member.phone),
        profileUrl: `/team/${member.slug || member.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
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
