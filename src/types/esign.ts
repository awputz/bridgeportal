// eSign Document Statuses
export type ESignDocumentStatus = 'draft' | 'pending' | 'in_progress' | 'completed' | 'voided' | 'declined';
export type ESignRecipientStatus = 'pending' | 'sent' | 'viewed' | 'signed' | 'declined';
export type ESignRecipientRole = 'signer' | 'cc' | 'viewer';
export type ESignSignerType = 'agent' | 'buyer' | 'seller' | 'attorney' | 'broker' | 'other';
export type ESignFieldType = 'signature' | 'initials' | 'date' | 'text' | 'checkbox' | 'dropdown';
export type SignatureType = 'draw' | 'type' | 'upload';

// Document entity
export interface ESignDocument {
  id: string;
  created_by: string | null;
  deal_id: string | null;
  template_id: string | null;
  title: string;
  description: string | null;
  status: ESignDocumentStatus;
  original_file_url: string;
  original_file_name: string;
  original_file_type: string;
  signed_file_url: string | null;
  total_signers: number;
  signed_count: number;
  sent_at: string | null;
  completed_at: string | null;
  voided_at: string | null;
  void_reason: string | null;
  created_at: string;
  updated_at: string;
}

// Recipient entity
export interface ESignRecipient {
  id: string;
  document_id: string;
  name: string;
  email: string;
  role: ESignRecipientRole;
  signer_type: ESignSignerType | null;
  signing_order: number;
  status: ESignRecipientStatus;
  access_token: string;
  token_expires_at: string;
  sent_at: string | null;
  viewed_at: string | null;
  signed_at: string | null;
  declined_at: string | null;
  decline_reason: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

// Field entity (for signature placement)
export interface ESignField {
  id: string;
  document_id: string;
  recipient_id: string;
  field_type: ESignFieldType;
  label: string | null;
  placeholder: string | null;
  required: boolean;
  page_number: number;
  x_position: number;
  y_position: number;
  width: number;
  height: number;
  value: string | null;
  filled_at: string | null;
  options: string[] | null;
  created_at: string;
  updated_at: string;
}

// Audit log entity
export interface ESignAuditLog {
  id: string;
  document_id: string;
  recipient_id: string | null;
  action: string;
  action_details: Record<string, unknown> | null;
  actor_email: string | null;
  actor_name: string | null;
  ip_address: string | null;
  user_agent: string | null;
  geolocation: string | null;
  created_at: string;
}

// User's saved signature
export interface UserSignature {
  id: string;
  user_email: string;
  signature_type: SignatureType;
  signature_data: string;
  font_family: string | null;
  initials_type: SignatureType | null;
  initials_data: string | null;
  initials_font_family: string | null;
  created_at: string;
  updated_at: string;
}

// Input types for creating documents
export interface CreateESignRecipientInput {
  name: string;
  email: string;
  role: ESignRecipientRole;
  signer_type?: ESignSignerType | null;
  signing_order?: number;
  status?: ESignRecipientStatus;
}

export interface CreateESignDocumentInput {
  title: string;
  description?: string;
  file: File;
  dealId?: string;
  templateId?: string;
  recipients: CreateESignRecipientInput[];
}

// Extended document with relations
export interface ESignDocumentWithRelations extends ESignDocument {
  recipients?: ESignRecipient[];
  fields?: ESignField[];
  audit_log?: ESignAuditLog[];
  deal?: { property_address: string } | null;
}
