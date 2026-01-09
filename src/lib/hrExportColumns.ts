/**
 * HR Export Column Definitions
 * Centralized column configurations for all HR data exports
 */

import { CSVColumn } from './csvExport';
import { ExcelColumn } from './excelExport';

// ============= HR Agents =============
export const hrAgentColumns: CSVColumn<any>[] = [
  { key: 'full_name', header: 'Full Name' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone' },
  { key: 'division', header: 'Division', formatter: (v) => formatDivision(v) },
  { key: 'recruitment_status', header: 'Status', formatter: (v) => formatStatus(v) },
  { key: 'current_brokerage', header: 'Current Brokerage' },
  { key: 'current_production', header: 'Current Production', formatter: (v) => formatCurrency(v) },
  { key: 'linkedin_url', header: 'LinkedIn' },
  { key: 'source', header: 'Source' },
  { key: 'score', header: 'Score' },
  { key: 'created_at', header: 'Added Date', formatter: (v) => formatDate(v) },
  { key: 'last_contacted_at', header: 'Last Contacted', formatter: (v) => formatDate(v) },
];

// ============= HR Contracts =============
export const hrContractColumns: CSVColumn<any>[] = [
  { key: 'agent_name', header: 'Agent Name' },
  { key: 'agent_email', header: 'Agent Email' },
  { key: 'division', header: 'Division', formatter: (v) => formatDivision(v) },
  { key: 'contract_type', header: 'Contract Type' },
  { key: 'status', header: 'Status', formatter: (v) => formatContractStatus(v) },
  { key: 'commission_split', header: 'Commission Split' },
  { key: 'signing_bonus', header: 'Signing Bonus', formatter: (v) => formatCurrency(v) },
  { key: 'start_date', header: 'Start Date', formatter: (v) => formatDate(v) },
  { key: 'term_months', header: 'Term (Months)' },
  { key: 'created_at', header: 'Created', formatter: (v) => formatDate(v) },
  { key: 'signed_at', header: 'Signed Date', formatter: (v) => formatDate(v) },
];

// ============= Active Agents =============
export const activeAgentColumns: CSVColumn<any>[] = [
  { key: 'employee_id', header: 'Employee ID' },
  { key: 'full_name', header: 'Full Name' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone' },
  { key: 'division', header: 'Division', formatter: (v) => formatDivision(v) },
  { key: 'status', header: 'Status' },
  { key: 'hire_date', header: 'Hire Date', formatter: (v) => formatDate(v) },
  { key: 'start_date', header: 'Start Date', formatter: (v) => formatDate(v) },
  { key: 'commission_split', header: 'Commission Split' },
  { key: 'ytd_production', header: 'YTD Production', formatter: (v) => formatCurrency(v) },
  { key: 'deals_closed', header: 'Deals Closed' },
];

// ============= Production Summary =============
export const productionColumns: CSVColumn<any>[] = [
  { key: 'full_name', header: 'Agent Name' },
  { key: 'division', header: 'Division', formatter: (v) => formatDivision(v) },
  { key: 'hire_date', header: 'Hire Date', formatter: (v) => formatDate(v) },
  { key: 'status', header: 'Status' },
  { key: 'total_deals', header: 'Total Deals' },
  { key: 'total_volume', header: 'Total Volume', formatter: (v) => formatCurrency(v) },
  { key: 'total_commission', header: 'Total Commission', formatter: (v) => formatCurrency(v) },
  { key: 'deals_since_hire', header: 'Deals Since Hire' },
  { key: 'volume_since_hire', header: 'Volume Since Hire', formatter: (v) => formatCurrency(v) },
  { key: 'commission_since_hire', header: 'Commission Since Hire', formatter: (v) => formatCurrency(v) },
  { key: 'last_deal_date', header: 'Last Deal', formatter: (v) => formatDate(v) },
];

// ============= HR Offers =============
export const hrOfferColumns: CSVColumn<any>[] = [
  { key: 'hr_agents.full_name', header: 'Agent Name' },
  { key: 'hr_agents.email', header: 'Agent Email' },
  { key: 'division', header: 'Division', formatter: (v) => formatDivision(v) },
  { key: 'commission_split', header: 'Commission Split' },
  { key: 'signing_bonus', header: 'Signing Bonus', formatter: (v) => formatCurrency(v) },
  { key: 'base_salary', header: 'Base Salary', formatter: (v) => formatCurrency(v) },
  { key: 'start_date', header: 'Start Date', formatter: (v) => formatDate(v) },
  { key: 'valid_until', header: 'Valid Until', formatter: (v) => formatDate(v) },
  { key: 'created_at', header: 'Created', formatter: (v) => formatDate(v) },
  { key: 'sent_at', header: 'Sent', formatter: (v) => formatDate(v) },
  { key: 'signed_at', header: 'Signed', formatter: (v) => formatDate(v) },
];

// ============= Onboarding Status =============
export const onboardingColumns: CSVColumn<any>[] = [
  { key: 'full_name', header: 'Agent Name' },
  { key: 'email', header: 'Email' },
  { key: 'division', header: 'Division', formatter: (v) => formatDivision(v) },
  { key: 'hire_date', header: 'Hire Date', formatter: (v) => formatDate(v) },
  { key: 'contract_signed', header: 'Contract Signed', formatter: (v) => formatBoolean(v) },
  { key: 'license_verified', header: 'License Verified', formatter: (v) => formatBoolean(v) },
  { key: 'w9_submitted', header: 'W9 Submitted', formatter: (v) => formatBoolean(v) },
  { key: 'email_account_created', header: 'Email Created', formatter: (v) => formatBoolean(v) },
  { key: 'crm_access_granted', header: 'CRM Access', formatter: (v) => formatBoolean(v) },
  { key: 'training_completed', header: 'Training Complete', formatter: (v) => formatBoolean(v) },
];

// ============= Compliance =============
export const complianceColumns: CSVColumn<any>[] = [
  { key: 'active_agents.full_name', header: 'Agent Name' },
  { key: 'license_type', header: 'License Type' },
  { key: 'license_number', header: 'License Number' },
  { key: 'license_state', header: 'State' },
  { key: 'issue_date', header: 'Issue Date', formatter: (v) => formatDate(v) },
  { key: 'expiry_date', header: 'Expiry Date', formatter: (v) => formatDate(v) },
  { key: 'status', header: 'Status' },
  { key: 'renewal_reminder_sent', header: 'Reminder Sent', formatter: (v) => formatBoolean(v) },
];

// ============= Excel Column Variants =============
export const hrAgentExcelColumns: ExcelColumn<any>[] = hrAgentColumns.map(c => ({
  ...c,
  type: (c.key === 'current_production' ? 'number' : 'string') as 'number' | 'string'
}));

export const activeAgentExcelColumns: ExcelColumn<any>[] = activeAgentColumns.map(c => ({
  ...c,
  type: (['ytd_production', 'deals_closed'].includes(c.key as string) ? 'number' : 'string') as 'number' | 'string'
}));

export const productionExcelColumns: ExcelColumn<any>[] = productionColumns.map(c => ({
  ...c,
  type: (['total_deals', 'total_volume', 'total_commission', 'deals_since_hire', 'volume_since_hire', 'commission_since_hire'].includes(c.key as string) ? 'number' : 'string') as 'number' | 'string'
}));

// ============= Formatters =============
function formatDate(value: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-US');
}

function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function formatBoolean(value: boolean | null): string {
  if (value === null || value === undefined) return '';
  return value ? 'Yes' : 'No';
}

function formatDivision(value: string | null): string {
  if (!value) return '';
  const labels: Record<string, string> = {
    'investment-sales': 'Investment Sales',
    'commercial-leasing': 'Commercial Leasing',
    'residential': 'Residential',
    'capital-advisory': 'Capital Advisory',
  };
  return labels[value] || value;
}

function formatStatus(value: string | null): string {
  if (!value) return '';
  const labels: Record<string, string> = {
    cold: 'Cold',
    contacted: 'Contacted',
    warm: 'Warm',
    qualified: 'Qualified',
    hot: 'Hot',
    'offer-made': 'Offer Made',
    hired: 'Hired',
    lost: 'Lost',
  };
  return labels[value] || value;
}

function formatContractStatus(value: string | null): string {
  if (!value) return '';
  const labels: Record<string, string> = {
    draft: 'Draft',
    sent: 'Sent',
    signed: 'Signed',
    voided: 'Voided',
  };
  return labels[value] || value;
}
