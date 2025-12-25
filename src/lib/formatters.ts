/**
 * Centralized Pricing Formatters
 * 
 * This file contains standardized formatting functions for deal pricing
 * across all divisions. Rules:
 * 
 * - Residential: Always show full monthly rent (no abbreviations)
 * - Commercial: Show price/SF, total SF, and total monthly rent
 * - Investment Sales: Always show full purchase price (no $12.5M - use $12,500,000)
 */

// Division display names - never abbreviate
export const DIVISION_DISPLAY_NAMES = {
  "investment-sales": "Investment Sales",
  "commercial-leasing": "Commercial Leasing",
  "residential": "Residential",
} as const;

export type DivisionKey = keyof typeof DIVISION_DISPLAY_NAMES;

/**
 * Format a number as full currency (no abbreviations like K, M, B)
 * Always shows the complete number: $12,500,000 not $12.5M
 */
export const formatFullCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return "—";
  return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

/**
 * Format residential rent - always shows full monthly amount
 * Example: "$4,500/month"
 */
export const formatResidentialRent = (monthlyRent: number | null | undefined): string => {
  if (monthlyRent === null || monthlyRent === undefined) return "—";
  return `$${monthlyRent.toLocaleString('en-US', { maximumFractionDigits: 0 })}/month`;
};

/**
 * Commercial pricing structure - shows all three required values
 */
export interface CommercialPricing {
  pricePerSF: string;      // e.g., "$45.00/SF"
  totalSF: string;         // e.g., "2,500 SF"
  totalMonthly: string;    // e.g., "$9,375/month"
  totalAnnual: string;     // e.g., "$112,500/year"
}

/**
 * Format commercial pricing - returns all three values
 * @param rentPerSF - Annual rent per square foot
 * @param squareFeet - Total square footage
 */
export const formatCommercialPricing = (
  rentPerSF: number | null | undefined,
  squareFeet: number | null | undefined
): CommercialPricing => {
  const hasRent = rentPerSF !== null && rentPerSF !== undefined;
  const hasSF = squareFeet !== null && squareFeet !== undefined;
  
  const totalAnnual = hasRent && hasSF ? rentPerSF * squareFeet : 0;
  const totalMonthly = totalAnnual / 12;

  return {
    pricePerSF: hasRent ? `$${rentPerSF.toFixed(2)}/SF` : "—",
    totalSF: hasSF ? `${squareFeet.toLocaleString('en-US')} SF` : "—",
    totalMonthly: totalMonthly > 0 ? `$${Math.round(totalMonthly).toLocaleString('en-US')}/month` : "—",
    totalAnnual: totalAnnual > 0 ? `$${Math.round(totalAnnual).toLocaleString('en-US')}/year` : "—",
  };
};

/**
 * Format Investment Sales price - always shows full purchase price
 * Never abbreviates: $12,500,000 not $12.5M
 */
export const formatInvestmentSalesPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) return "—";
  return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

/**
 * Format square footage with comma separators
 */
export const formatSquareFeet = (sf: number | null | undefined): string => {
  if (sf === null || sf === undefined) return "—";
  return `${sf.toLocaleString('en-US')} SF`;
};

/**
 * Format units count
 */
export const formatUnits = (units: number | null | undefined): string => {
  if (units === null || units === undefined) return "—";
  return `${units.toLocaleString('en-US')} Units`;
};

/**
 * Format cap rate as percentage
 */
export const formatCapRate = (capRate: number | null | undefined): string => {
  if (capRate === null || capRate === undefined) return "—";
  return `${capRate.toFixed(2)}%`;
};

/**
 * Format price per unit for Investment Sales
 */
export const formatPricePerUnit = (pricePerUnit: number | null | undefined): string => {
  if (pricePerUnit === null || pricePerUnit === undefined) return "—";
  return `$${pricePerUnit.toLocaleString('en-US', { maximumFractionDigits: 0 })}/unit`;
};

/**
 * Format price per square foot (for Investment Sales)
 */
export const formatPricePerSF = (pricePerSF: number | null | undefined): string => {
  if (pricePerSF === null || pricePerSF === undefined) return "—";
  return `$${pricePerSF.toLocaleString('en-US', { maximumFractionDigits: 0 })}/SF`;
};

/**
 * Format deal value based on division type
 * This is the main function to use when displaying deal values
 */
export const formatDealValue = (
  division: string,
  value: number | null | undefined,
  additionalData?: {
    squareFeet?: number | null;
    rentPerSF?: number | null;
    monthlyRent?: number | null;
  }
): string => {
  switch (division) {
    case "investment-sales":
      return formatInvestmentSalesPrice(value);
    
    case "commercial-leasing":
      // For commercial, if we have rent per SF and square feet, show total monthly
      if (additionalData?.rentPerSF && additionalData?.squareFeet) {
        const pricing = formatCommercialPricing(additionalData.rentPerSF, additionalData.squareFeet);
        return pricing.totalMonthly;
      }
      // Otherwise show the value as-is
      return formatFullCurrency(value);
    
    case "residential":
      // For residential, show monthly rent
      if (additionalData?.monthlyRent) {
        return formatResidentialRent(additionalData.monthlyRent);
      }
      return formatResidentialRent(value);
    
    default:
      return formatFullCurrency(value);
  }
};

/**
 * Get division display name (never abbreviated)
 */
export const getDivisionDisplayName = (divisionKey: string): string => {
  return DIVISION_DISPLAY_NAMES[divisionKey as DivisionKey] || divisionKey;
};
