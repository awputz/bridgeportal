export type TemplateCategory = 
  | 'commission-agreements'
  | 'lois'
  | 'exclusive-agreements'
  | 'referral-agreements'
  | 'leases'
  | 'co-broke'
  | 'nda'
  | 'email-templates'
  | 'general';

export interface TemplateCategoryInfo {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
}

export interface FormFieldValidation {
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'currency' | 'number' | 'email' | 'phone' | 'select' | 'checkbox';
  required: boolean;
  placeholder?: string;
  options?: string[]; // For select fields
  defaultValue?: string;
  helpText?: string;
  validation?: FormFieldValidation;
}

export interface FormSection {
  title: string;
  description?: string;
  fieldIds: string[];
}

export interface FormSchema {
  fields: FormField[];
  sections?: FormSection[];
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string | null;
  division: string;
  file_url: string;
  file_type: string | null;
  display_order: number | null;
  is_active: boolean | null;
  is_fillable: boolean;
  form_schema: FormSchema | null;
  fill_count: number;
  download_count: number;
  category: TemplateCategory | null;
  version: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface FilledTemplate {
  id: string;
  template_id: string;
  user_id: string;
  deal_id: string | null;
  form_data: Record<string, unknown>;
  generated_file_url: string | null;
  generated_file_name: string | null;
  status: 'draft' | 'completed' | 'sent_for_signature';
  created_at: string;
  updated_at: string;
}

export interface FilledTemplateWithTemplate extends FilledTemplate {
  template: {
    name: string;
    division: string;
    file_type: string | null;
  };
}
