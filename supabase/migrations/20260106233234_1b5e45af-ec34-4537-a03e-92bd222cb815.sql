-- Create RPC function to log client errors (avoids type regeneration issues)
CREATE OR REPLACE FUNCTION log_client_error(
  p_user_id UUID,
  p_section TEXT,
  p_error_message TEXT,
  p_stack_trace TEXT,
  p_component_stack TEXT,
  p_user_agent TEXT,
  p_url TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO client_errors (
    user_id,
    section,
    error_message,
    stack_trace,
    component_stack,
    user_agent,
    url
  ) VALUES (
    p_user_id,
    p_section,
    p_error_message,
    p_stack_trace,
    p_component_stack,
    p_user_agent,
    p_url
  );
END;
$$;

-- Grant execute to anyone (errors can be logged by anyone)
GRANT EXECUTE ON FUNCTION log_client_error TO anon;
GRANT EXECUTE ON FUNCTION log_client_error TO authenticated;