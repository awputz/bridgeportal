-- Create HR audit log table
CREATE TABLE hr_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for efficient querying
CREATE INDEX idx_hr_audit_log_created_at ON hr_audit_log(created_at DESC);
CREATE INDEX idx_hr_audit_log_table_record ON hr_audit_log(table_name, record_id);
CREATE INDEX idx_hr_audit_log_user ON hr_audit_log(user_id);

-- Enable RLS (admin only)
ALTER TABLE hr_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "HR admins can view audit logs"
  ON hr_audit_log FOR SELECT
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "System can insert audit logs"
  ON hr_audit_log FOR INSERT
  WITH CHECK (true);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.log_hr_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO hr_audit_log (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), 'create', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO hr_audit_log (user_id, action, table_name, record_id, old_data, new_data)
    VALUES (auth.uid(), 'update', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO hr_audit_log (user_id, action, table_name, record_id, old_data)
    VALUES (auth.uid(), 'delete', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Apply triggers to HR tables
CREATE TRIGGER audit_hr_agents
  AFTER INSERT OR UPDATE OR DELETE ON hr_agents
  FOR EACH ROW EXECUTE FUNCTION public.log_hr_changes();

CREATE TRIGGER audit_hr_offers
  AFTER INSERT OR UPDATE OR DELETE ON hr_offers
  FOR EACH ROW EXECUTE FUNCTION public.log_hr_changes();

CREATE TRIGGER audit_hr_interviews
  AFTER INSERT OR UPDATE OR DELETE ON hr_interviews
  FOR EACH ROW EXECUTE FUNCTION public.log_hr_changes();

CREATE TRIGGER audit_hr_interactions
  AFTER INSERT OR UPDATE OR DELETE ON hr_interactions
  FOR EACH ROW EXECUTE FUNCTION public.log_hr_changes();