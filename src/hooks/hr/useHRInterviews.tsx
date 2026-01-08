import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type HRInterview = Database['public']['Tables']['hr_interviews']['Row'];
export type HRInterviewInsert = Database['public']['Tables']['hr_interviews']['Insert'];
export type HRInterviewUpdate = Database['public']['Tables']['hr_interviews']['Update'];

export type InterviewType = 'in-person' | 'video' | 'phone';
export type InterviewDecision = 'pass' | 'fail' | 'pending' | null;

export interface ScorecardCategory {
  id: string;
  name: string;
  rating: number;
  notes: string;
}

export interface Scorecard {
  categories: ScorecardCategory[];
  overallRating: number;
  strengths: string;
  weaknesses: string;
  recommendation: string;
}

export const defaultCategories: ScorecardCategory[] = [
  { id: 'communication', name: 'Communication Skills', rating: 0, notes: '' },
  { id: 'industry', name: 'Industry Knowledge', rating: 0, notes: '' },
  { id: 'sales', name: 'Sales Experience', rating: 0, notes: '' },
  { id: 'culture', name: 'Cultural Fit', rating: 0, notes: '' },
  { id: 'motivation', name: 'Motivation Level', rating: 0, notes: '' },
  { id: 'professionalism', name: 'Professionalism', rating: 0, notes: '' },
];

export const createDefaultScorecard = (): Scorecard => ({
  categories: defaultCategories.map(c => ({ ...c })),
  overallRating: 0,
  strengths: '',
  weaknesses: '',
  recommendation: '',
});

export const interviewTypeColors: Record<InterviewType, string> = {
  'in-person': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'video': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'phone': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export const decisionColors: Record<string, string> = {
  'pass': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'fail': 'bg-red-500/10 text-red-400 border-red-500/20',
  'pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export interface HRInterviewWithAgent extends HRInterview {
  hr_agents: {
    id: string;
    full_name: string;
    current_brokerage: string | null;
    division: string;
    photo_url: string | null;
    recruitment_status: string;
    poachability_score: number | null;
    annual_production: number | null;
    years_experience: number | null;
  } | null;
}

interface InterviewFilters {
  tab?: 'upcoming' | 'completed' | 'all';
  interviewer?: string;
  decision?: InterviewDecision;
  division?: string;
}

export function useHRInterviews(filters?: InterviewFilters) {
  return useQuery({
    queryKey: ['hr-interviews', filters],
    queryFn: async () => {
      let query = supabase
        .from('hr_interviews')
        .select(`
          *,
          hr_agents (
            id,
            full_name,
            current_brokerage,
            division,
            photo_url,
            recruitment_status,
            poachability_score,
            annual_production,
            years_experience
          )
        `)
        .order('interview_date', { ascending: true });

      const now = new Date().toISOString();

      if (filters?.tab === 'upcoming') {
        query = query.gte('interview_date', now);
      } else if (filters?.tab === 'completed') {
        query = query.lt('interview_date', now);
      }

      if (filters?.interviewer) {
        query = query.ilike('interviewer_name', `%${filters.interviewer}%`);
      }

      if (filters?.decision) {
        query = query.eq('decision', filters.decision);
      }

      if (filters?.division) {
        query = query.eq('hr_agents.division', filters.division);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as HRInterviewWithAgent[];
    },
  });
}

export function useHRInterview(id: string | undefined) {
  return useQuery({
    queryKey: ['hr-interview', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('hr_interviews')
        .select(`
          *,
          hr_agents (
            id,
            full_name,
            current_brokerage,
            division,
            photo_url,
            recruitment_status,
            poachability_score,
            annual_production,
            years_experience,
            email,
            phone
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as HRInterviewWithAgent;
    },
    enabled: !!id,
  });
}

export function useAgentInterviews(agentId: string | undefined) {
  return useQuery({
    queryKey: ['hr-agent-interviews', agentId],
    queryFn: async () => {
      if (!agentId) return [];

      const { data, error } = await supabase
        .from('hr_interviews')
        .select('*')
        .eq('agent_id', agentId)
        .order('interview_date', { ascending: false });

      if (error) throw error;
      return data as HRInterview[];
    },
    enabled: !!agentId,
  });
}

export function useCreateHRInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interview: HRInterviewInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('hr_interviews')
        .insert({ ...interview, created_by: user?.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-interviews'] });
      toast.success('Interview scheduled successfully');
    },
    onError: (error) => {
      toast.error('Failed to schedule interview');
      console.error(error);
    },
  });
}

export function useUpdateHRInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: HRInterviewUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('hr_interviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hr-interviews'] });
      queryClient.invalidateQueries({ queryKey: ['hr-interview', data.id] });
      queryClient.invalidateQueries({ queryKey: ['hr-agent-interviews'] });
      toast.success('Interview updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update interview');
      console.error(error);
    },
  });
}

export function useDeleteHRInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hr_interviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-interviews'] });
      toast.success('Interview deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete interview');
      console.error(error);
    },
  });
}

export function calculateOverallRating(categories: ScorecardCategory[]): number {
  const rated = categories.filter(c => c.rating > 0);
  if (rated.length === 0) return 0;
  const sum = rated.reduce((acc, c) => acc + c.rating, 0);
  return Math.round((sum / rated.length) * 100) / 100;
}
