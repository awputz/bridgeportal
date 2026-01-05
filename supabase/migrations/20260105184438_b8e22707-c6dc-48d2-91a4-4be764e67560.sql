-- Create note_folders table for organization
CREATE TABLE public.note_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL,
  name TEXT NOT NULL,
  parent_folder_id UUID REFERENCES public.note_folders(id) ON DELETE CASCADE,
  color TEXT DEFAULT 'gray',
  icon TEXT DEFAULT 'folder',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create note_participants junction table for multi-person linking
CREATE TABLE public.note_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES public.agent_notes(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(note_id, contact_id)
);

-- Update agent_notes table with new columns
ALTER TABLE public.agent_notes 
ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES public.note_folders(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS starred BOOLEAN DEFAULT false;

-- Enable RLS on new tables
ALTER TABLE public.note_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_participants ENABLE ROW LEVEL SECURITY;

-- RLS policies for note_folders
CREATE POLICY "Agents can manage their own folders"
ON public.note_folders FOR ALL
USING (agent_id = auth.uid());

-- RLS policies for note_participants
CREATE POLICY "Agents can manage participants for their notes"
ON public.note_participants FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.agent_notes 
    WHERE agent_notes.id = note_participants.note_id 
    AND agent_notes.agent_id = auth.uid()
  )
);

-- Create index for better query performance
CREATE INDEX idx_agent_notes_folder_id ON public.agent_notes(folder_id);
CREATE INDEX idx_agent_notes_starred ON public.agent_notes(starred);
CREATE INDEX idx_agent_notes_category ON public.agent_notes(category);
CREATE INDEX idx_agent_notes_priority ON public.agent_notes(priority);
CREATE INDEX idx_note_folders_agent_id ON public.note_folders(agent_id);
CREATE INDEX idx_note_participants_note_id ON public.note_participants(note_id);
CREATE INDEX idx_note_participants_contact_id ON public.note_participants(contact_id);

-- Migrate existing pinned notes to starred
UPDATE public.agent_notes SET starred = is_pinned WHERE is_pinned = true;