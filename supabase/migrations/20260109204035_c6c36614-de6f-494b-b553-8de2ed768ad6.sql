-- Create AI generation history table
CREATE TABLE public.ai_generation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL,
  project_id UUID REFERENCES public.marketing_projects(id) ON DELETE SET NULL,
  generator_type TEXT NOT NULL,
  prompt_used TEXT NOT NULL,
  form_data JSONB,
  generated_content TEXT NOT NULL,
  model_used TEXT DEFAULT 'gemini-2.5-flash',
  tokens_used INTEGER,
  generation_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_ai_generation_history_agent ON public.ai_generation_history(agent_id);
CREATE INDEX idx_ai_generation_history_created ON public.ai_generation_history(created_at DESC);
CREATE INDEX idx_ai_generation_history_type ON public.ai_generation_history(generator_type);

-- Enable RLS
ALTER TABLE public.ai_generation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own generation history
CREATE POLICY "Users can view own generation history"
  ON public.ai_generation_history
  FOR SELECT
  USING (auth.uid() = agent_id);

-- RLS Policy: Users can insert their own generation records
CREATE POLICY "Users can insert own generation history"
  ON public.ai_generation_history
  FOR INSERT
  WITH CHECK (auth.uid() = agent_id);

-- RLS Policy: Users can delete their own generation records
CREATE POLICY "Users can delete own generation history"
  ON public.ai_generation_history
  FOR DELETE
  USING (auth.uid() = agent_id);