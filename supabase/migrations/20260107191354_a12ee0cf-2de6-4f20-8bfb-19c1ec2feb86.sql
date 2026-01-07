-- Add performance indexes for notes (safe, non-destructive)
CREATE INDEX IF NOT EXISTS idx_agent_notes_agent_id 
ON public.agent_notes(agent_id, created_at DESC) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_note_folders_agent_id 
ON public.note_folders(agent_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_note_participants_note_contact 
ON public.note_participants(note_id, contact_id);