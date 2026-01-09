/**
 * Contract template utilities for parsing and validating templates
 */

/**
 * Parse a contract template and replace {{variable}} placeholders with values
 */
export function parseContractTemplate(
  template: string,
  variables: Record<string, string | number | null | undefined>
): string {
  // Handle simple variable replacement
  let result = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = variables[key];
    if (value === null || value === undefined || value === '') {
      return '';
    }
    return String(value);
  });

  // Handle conditional blocks: {{#if variable}}...{{/if}}
  result = result.replace(
    /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (match, key, content) => {
      const value = variables[key];
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        // Parse any variables inside the conditional block
        return parseContractTemplate(content, variables);
      }
      return '';
    }
  );

  return result;
}

/**
 * Extract all variable names from a template
 */
export function extractTemplateVariables(template: string): string[] {
  const simpleVars = template.match(/\{\{(\w+)\}\}/g) || [];
  const conditionalVars = template.match(/\{\{#if\s+(\w+)\}\}/g) || [];
  
  const allVars = [
    ...simpleVars.map(m => m.slice(2, -2)),
    ...conditionalVars.map(m => m.match(/\{\{#if\s+(\w+)\}\}/)?.[1] || ''),
  ].filter(Boolean);
  
  return [...new Set(allVars)];
}

/**
 * Validate that all required variables are provided
 */
export function validateTemplateVariables(
  template: string,
  variables: Record<string, unknown>,
  requiredFields: string[] = []
): { isValid: boolean; missing: string[] } {
  const templateVars = extractTemplateVariables(template);
  
  // If requiredFields is empty, use all template variables as required
  const required = requiredFields.length > 0 ? requiredFields : templateVars;
  
  const missing = required.filter(key => {
    const value = variables[key];
    return value === null || value === undefined || value === '';
  });
  
  return { isValid: missing.length === 0, missing };
}

/**
 * Format a date for contract display
 */
export function formatContractDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format currency for contract display
 */
export function formatContractCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generate a preview of contract content (first N characters)
 */
export function getContractPreview(contentHtml: string, maxLength: number = 200): string {
  // Strip HTML tags for preview
  const text = contentHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Contract status types
 */
export type ContractStatus = 'draft' | 'sent' | 'pending_signature' | 'signed' | 'voided';

/**
 * Get status display info
 */
export const contractStatusConfig: Record<ContractStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  sent: { label: 'Sent', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  pending_signature: { label: 'Pending Signature', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  signed: { label: 'Signed', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  voided: { label: 'Voided', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
};
