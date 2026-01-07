/**
 * Sanitization utilities for database operations
 * Ensures empty strings are converted to null and strings are trimmed
 */

/**
 * Trim and convert empty strings to null for a single value
 */
export function trimOrNull(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

/**
 * Parse numeric string to number or null
 * Returns null for empty strings, NaN, undefined, or null
 */
export function parseNumericOrNull(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? null : num;
}

/**
 * Parse date string to ISO string or null
 * Returns null for empty or whitespace-only strings
 */
export function parseDateOrNull(value: string | null | undefined): string | null {
  if (!value || value.trim() === '') return null;
  return value;
}

/**
 * Sanitize contact data before database insert/update
 * Converts empty strings to null for all optional fields
 */
export function sanitizeContactData<T extends Record<string, unknown>>(data: T): T {
  return {
    ...data,
    email: trimOrNull(data.email as string),
    phone: trimOrNull(data.phone as string),
    company: trimOrNull(data.company as string),
    title: trimOrNull(data.title as string),
    source: trimOrNull(data.source as string),
    notes: trimOrNull(data.notes as string),
    address: trimOrNull(data.address as string),
    linkedin_url: trimOrNull(data.linkedin_url as string),
    secondary_email: trimOrNull(data.secondary_email as string),
    secondary_phone: trimOrNull(data.secondary_phone as string),
    assistant_name: trimOrNull(data.assistant_name as string),
    assistant_email: trimOrNull(data.assistant_email as string),
    assistant_phone: trimOrNull(data.assistant_phone as string),
    preferred_contact_method: trimOrNull(data.preferred_contact_method as string),
    company_website: trimOrNull(data.company_website as string),
    investor_profile: trimOrNull(data.investor_profile as string),
    street_address: trimOrNull(data.street_address as string),
    city: trimOrNull(data.city as string),
    state: trimOrNull(data.state as string),
    zip_code: trimOrNull(data.zip_code as string),
    country: trimOrNull(data.country as string),
    birthday: parseDateOrNull(data.birthday as string),
  };
}

/**
 * Sanitize deal data before database insert/update
 * Converts empty strings to null for all optional fields
 */
export function sanitizeDealData<T extends Record<string, unknown>>(data: T): T {
  return {
    ...data,
    // IDs - ensure null not empty string
    contact_id: trimOrNull(data.contact_id as string),
    stage_id: trimOrNull(data.stage_id as string),
    co_broker_id: trimOrNull(data.co_broker_id as string),
    primary_contact_id: trimOrNull(data.primary_contact_id as string),
    
    // String fields
    notes: trimOrNull(data.notes as string),
    neighborhood: trimOrNull(data.neighborhood as string),
    borough: trimOrNull(data.borough as string),
    zoning: trimOrNull(data.zoning as string),
    property_type: trimOrNull(data.property_type as string),
    building_class: trimOrNull(data.building_class as string),
    financing_type: trimOrNull(data.financing_type as string),
    lender_name: trimOrNull(data.lender_name as string),
    co_broker_name: trimOrNull(data.co_broker_name as string),
    property_condition: trimOrNull(data.property_condition as string),
    tenant_legal_name: trimOrNull(data.tenant_legal_name as string),
    lease_type: trimOrNull(data.lease_type as string),
    use_clause: trimOrNull(data.use_clause as string),
    space_type: trimOrNull(data.space_type as string),
    tenant_business_type: trimOrNull(data.tenant_business_type as string),
    move_in_urgency: trimOrNull(data.move_in_urgency as string),
    landlord_broker: trimOrNull(data.landlord_broker as string),
    referral_source: trimOrNull(data.referral_source as string),
    lost_reason: trimOrNull(data.lost_reason as string),
    deal_category: trimOrNull(data.deal_category as string),
    
    // Date fields
    expected_close: parseDateOrNull(data.expected_close as string),
    due_diligence_deadline: parseDateOrNull(data.due_diligence_deadline as string),
    ideal_close_date: parseDateOrNull(data.ideal_close_date as string),
    commencement_date: parseDateOrNull(data.commencement_date as string),
    expiration_date: parseDateOrNull(data.expiration_date as string),
    move_in_date: parseDateOrNull(data.move_in_date as string),
    due_date: parseDateOrNull(data.due_date as string),
    
    // Numeric fields - use nullish coalescing to preserve 0 values
    value: data.value ?? null,
    commission: data.commission ?? null,
    cap_rate: data.cap_rate ?? null,
    noi: data.noi ?? null,
    unit_count: data.unit_count ?? null,
    year_built: data.year_built ?? null,
    asking_price: data.asking_price ?? null,
    offer_price: data.offer_price ?? null,
    price_per_unit: data.price_per_unit ?? null,
    price_per_sf: data.price_per_sf ?? null,
    loan_amount: data.loan_amount ?? null,
    co_broker_split: data.co_broker_split ?? null,
    lot_size: data.lot_size ?? null,
    gross_sf: data.gross_sf ?? null,
    asking_rent_psf: data.asking_rent_psf ?? null,
    negotiated_rent_psf: data.negotiated_rent_psf ?? null,
    lease_term_months: data.lease_term_months ?? null,
    free_rent_months: data.free_rent_months ?? null,
    escalation_rate: data.escalation_rate ?? null,
    ti_allowance_psf: data.ti_allowance_psf ?? null,
    security_deposit_months: data.security_deposit_months ?? null,
    bedrooms: data.bedrooms ?? null,
    bathrooms: data.bathrooms ?? null,
    listing_price: data.listing_price ?? null,
    monthly_rent: data.monthly_rent ?? null,
    lease_length_months: data.lease_length_months ?? null,
    co_broke_percent: data.co_broke_percent ?? null,
  };
}

/**
 * Sanitize activity data before database insert/update
 * Converts empty strings to null for all optional fields
 */
export function sanitizeActivityData<T extends Record<string, unknown>>(data: T): T {
  return {
    ...data,
    // IDs - ensure null not empty string
    contact_id: trimOrNull(data.contact_id as string),
    deal_id: trimOrNull(data.deal_id as string),
    
    // String fields
    description: trimOrNull(data.description as string),
    recurring_pattern: trimOrNull(data.recurring_pattern as string),
    
    // Date fields
    due_date: parseDateOrNull(data.due_date as string),
    completed_at: parseDateOrNull(data.completed_at as string),
    reminder_at: parseDateOrNull(data.reminder_at as string),
  };
}
