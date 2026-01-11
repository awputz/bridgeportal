-- Performance optimization indexes for eSign system
-- These indexes improve query performance for common access patterns

-- Document indexes
CREATE INDEX IF NOT EXISTS idx_esign_documents_created_by ON esign_documents(created_by);
CREATE INDEX IF NOT EXISTS idx_esign_documents_deal_id ON esign_documents(deal_id);
CREATE INDEX IF NOT EXISTS idx_esign_documents_status ON esign_documents(status);
CREATE INDEX IF NOT EXISTS idx_esign_documents_created_at ON esign_documents(created_at DESC);

-- Recipient indexes
CREATE INDEX IF NOT EXISTS idx_esign_recipients_document_id ON esign_recipients(document_id);
CREATE INDEX IF NOT EXISTS idx_esign_recipients_email ON esign_recipients(email);
CREATE INDEX IF NOT EXISTS idx_esign_recipients_access_token ON esign_recipients(access_token);
CREATE INDEX IF NOT EXISTS idx_esign_recipients_status ON esign_recipients(status);

-- Field indexes
CREATE INDEX IF NOT EXISTS idx_esign_fields_document_id ON esign_fields(document_id);
CREATE INDEX IF NOT EXISTS idx_esign_fields_recipient_id ON esign_fields(recipient_id);

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_esign_audit_document_id ON esign_audit_log(document_id);
CREATE INDEX IF NOT EXISTS idx_esign_audit_created_at ON esign_audit_log(created_at DESC);

-- Signatures index
CREATE INDEX IF NOT EXISTS idx_esign_signatures_user_email ON esign_signatures(user_email);

-- Filled templates indexes
CREATE INDEX IF NOT EXISTS idx_filled_templates_user_id ON filled_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_filled_templates_template_id ON filled_templates(template_id);
CREATE INDEX IF NOT EXISTS idx_filled_templates_deal_id ON filled_templates(deal_id);
CREATE INDEX IF NOT EXISTS idx_filled_templates_status ON filled_templates(status);