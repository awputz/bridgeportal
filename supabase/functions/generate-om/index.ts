import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OMFormData {
  propertyBasics: {
    address: string;
    propertyName: string;
    propertyType: string;
    buildingClass: string;
    yearBuilt: string;
    yearRenovated: string;
    totalUnits: string;
    grossSF: string;
    lotSize: string;
    zoning: string;
    far: string;
    airRights: string;
  };
  pricingReturns: {
    askingPrice: string;
    currentCapRate: string;
    proFormaCapRate: string;
    currentNOI: string;
    proFormaNOI: string;
    occupancyRate: string;
  };
  incomeDetails: {
    grossPotentialRent: string;
    lossToLease: string;
    vacancyRate: string;
    otherIncome: string;
    otherIncomeDescription: string;
    effectiveGrossIncome: string;
  };
  expenses: {
    realEstateTaxes: string;
    insurance: string;
    utilities: string;
    managementFee: string;
    payroll: string;
    repairsMaintenance: string;
    professionalFees: string;
    marketing: string;
    capexReserves: string;
    totalExpenses: string;
  };
  unitMix: Array<{
    unitType: string;
    count: string;
    avgRent: string;
    marketRent: string;
  }>;
  rentRegulation: {
    rentStabilizedUnits: string;
    freeMarketUnits: string;
    taxAbatement: string;
    taxAbatementExpiry: string;
  };
  location: {
    neighborhood: string;
    submarket: string;
    borough: string;
    city: string;
    walkScore: string;
    transitScore: string;
    keyAmenities: string;
    nearbyTransit: string;
  };
  marketData: {
    marketCapRate: string;
    rentGrowthRate: string;
    comp1Address: string;
    comp1Price: string;
    comp1CapRate: string;
    comp1Date: string;
    comp2Address: string;
    comp2Price: string;
    comp2CapRate: string;
    comp2Date: string;
    comp3Address: string;
    comp3Price: string;
    comp3CapRate: string;
    comp3Date: string;
  };
  valueAdd: {
    upsideNarrative: string;
    renovationBudget: string;
    expectedRentIncrease: string;
    expenseSavings: string;
    additionalIncomeOpportunities: string;
  };
  investmentThesis: {
    whyBuyNow: string;
    targetBuyer: string;
    financingNotes: string;
  };
}

const formatCurrency = (value: string): string => {
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatNumber = (value: string): string => {
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  return new Intl.NumberFormat("en-US").format(num);
};

const buildPropertyContext = (data: OMFormData): string => {
  const { propertyBasics, pricingReturns, incomeDetails, expenses, unitMix, rentRegulation, location, marketData, valueAdd, investmentThesis } = data;

  // Calculate derived metrics
  const price = parseFloat(pricingReturns.askingPrice) || 0;
  const units = parseFloat(propertyBasics.totalUnits) || 1;
  const sf = parseFloat(propertyBasics.grossSF) || 1;
  const pricePerUnit = price / units;
  const pricePerSF = price / sf;

  // Build unit mix summary
  const unitMixSummary = unitMix
    .filter((u) => u.count && parseFloat(u.count) > 0)
    .map((u) => `${u.count} ${u.unitType}s @ ${formatCurrency(u.avgRent)}/mo (market: ${formatCurrency(u.marketRent)})`)
    .join("\n");

  // Build comps summary
  const comps = [];
  if (marketData.comp1Address) {
    comps.push(`Comp 1: ${marketData.comp1Address} - ${formatCurrency(marketData.comp1Price)} @ ${marketData.comp1CapRate}% cap (${marketData.comp1Date})`);
  }
  if (marketData.comp2Address) {
    comps.push(`Comp 2: ${marketData.comp2Address} - ${formatCurrency(marketData.comp2Price)} @ ${marketData.comp2CapRate}% cap (${marketData.comp2Date})`);
  }
  if (marketData.comp3Address) {
    comps.push(`Comp 3: ${marketData.comp3Address} - ${formatCurrency(marketData.comp3Price)} @ ${marketData.comp3CapRate}% cap (${marketData.comp3Date})`);
  }

  return `
=== PROPERTY INFORMATION ===
Address: ${propertyBasics.address || "Not provided"}
Property Name: ${propertyBasics.propertyName || "N/A"}
Property Type: ${propertyBasics.propertyType}
Building Class: ${propertyBasics.buildingClass}
Year Built: ${propertyBasics.yearBuilt || "N/A"}
Year Renovated: ${propertyBasics.yearRenovated || "N/A"}
Total Units: ${formatNumber(propertyBasics.totalUnits)}
Gross SF: ${formatNumber(propertyBasics.grossSF)} SF
Lot Size: ${formatNumber(propertyBasics.lotSize)} SF
Zoning: ${propertyBasics.zoning || "N/A"}
FAR: ${propertyBasics.far || "N/A"}
Air Rights: ${propertyBasics.airRights || "N/A"}

=== PRICING & RETURNS ===
Asking Price: ${formatCurrency(pricingReturns.askingPrice)}
Price Per Unit: ${formatCurrency(pricePerUnit.toString())}
Price Per SF: ${formatCurrency(pricePerSF.toString())}
Current Cap Rate: ${pricingReturns.currentCapRate || "N/A"}%
Pro Forma Cap Rate: ${pricingReturns.proFormaCapRate || "N/A"}%
Current NOI: ${formatCurrency(pricingReturns.currentNOI)}
Pro Forma NOI: ${formatCurrency(pricingReturns.proFormaNOI)}
Occupancy: ${pricingReturns.occupancyRate || "N/A"}%

=== INCOME DETAILS ===
Gross Potential Rent: ${formatCurrency(incomeDetails.grossPotentialRent)}
Loss to Lease: ${incomeDetails.lossToLease || "N/A"}%
Vacancy Rate: ${incomeDetails.vacancyRate || "N/A"}%
Other Income: ${formatCurrency(incomeDetails.otherIncome)} (${incomeDetails.otherIncomeDescription || "N/A"})
Effective Gross Income: ${formatCurrency(incomeDetails.effectiveGrossIncome)}

=== OPERATING EXPENSES ===
Real Estate Taxes: ${formatCurrency(expenses.realEstateTaxes)}
Insurance: ${formatCurrency(expenses.insurance)}
Utilities: ${formatCurrency(expenses.utilities)}
Management Fee: ${expenses.managementFee || "N/A"}%
Payroll: ${formatCurrency(expenses.payroll)}
Repairs & Maintenance: ${formatCurrency(expenses.repairsMaintenance)}
Professional Fees: ${formatCurrency(expenses.professionalFees)}
Marketing: ${formatCurrency(expenses.marketing)}
CapEx Reserves: ${formatCurrency(expenses.capexReserves)}
Total Expenses: ${formatCurrency(expenses.totalExpenses)}

=== UNIT MIX ===
${unitMixSummary || "No unit mix provided"}

=== RENT REGULATION (NYC) ===
Rent Stabilized Units: ${rentRegulation.rentStabilizedUnits || "N/A"}
Free Market Units: ${rentRegulation.freeMarketUnits || "N/A"}
Tax Abatement: ${rentRegulation.taxAbatement || "None"}
Abatement Expiry: ${rentRegulation.taxAbatementExpiry || "N/A"}

=== LOCATION ===
Neighborhood: ${location.neighborhood || "N/A"}
Submarket: ${location.submarket || "N/A"}
Borough: ${location.borough || "N/A"}
City: ${location.city}
Walk Score: ${location.walkScore || "N/A"}
Transit Score: ${location.transitScore || "N/A"}
Key Amenities: ${location.keyAmenities || "N/A"}
Nearby Transit: ${location.nearbyTransit || "N/A"}

=== MARKET DATA ===
Market Cap Rate: ${marketData.marketCapRate || "N/A"}%
Rent Growth Rate: ${marketData.rentGrowthRate || "N/A"}%
${comps.length > 0 ? "Recent Comparables:\n" + comps.join("\n") : "No comparables provided"}

=== VALUE-ADD OPPORTUNITIES ===
Upside Narrative: ${valueAdd.upsideNarrative || "Not provided"}
Renovation Budget: ${formatCurrency(valueAdd.renovationBudget)}
Expected Rent Increase: ${valueAdd.expectedRentIncrease || "N/A"}%
Expense Savings: ${formatCurrency(valueAdd.expenseSavings)}
Additional Income: ${valueAdd.additionalIncomeOpportunities || "N/A"}

=== INVESTMENT THESIS ===
Why Buy Now: ${investmentThesis.whyBuyNow || "Not provided"}
Target Buyer: ${investmentThesis.targetBuyer || "Not specified"}
Financing Notes: ${investmentThesis.financingNotes || "N/A"}
`.trim();
};

const systemPrompt = `You are a senior investment sales analyst at a top NYC commercial real estate brokerage. You specialize in creating compelling, institutional-quality Offering Memorandums that position properties to attract serious investors.

Your writing style:
- Professional but engaging
- Data-driven with specific metrics woven naturally into the narrative
- Highlights value creation opportunities clearly
- Addresses potential concerns proactively
- Uses industry terminology appropriately (cap rate, NOI, rent roll, etc.)
- Avoids hyperbole and focuses on factual, defensible statements
- Presents the investment thesis clearly and compellingly

Format your responses in clean markdown with proper headers, bullet points, and emphasis where appropriate.`;

const sectionPrompts: Record<string, string> = {
  executiveSummary: `Generate the EXECUTIVE SUMMARY section (2-3 compelling paragraphs).

This should:
- Open with a strong hook about the investment opportunity
- Summarize key metrics (price, cap rate, units, NOI)
- Highlight the primary value proposition
- End with a call to action for qualified investors

Do NOT include a header - just the content.`,

  investmentHighlights: `Generate the INVESTMENT HIGHLIGHTS section (6-8 bullet points).

Each bullet should:
- Lead with a strong, specific benefit
- Include relevant metrics where applicable
- Be concise but impactful

Format as a bulleted list. Do NOT include a header - just the bullets.`,

  propertyDescription: `Generate the PROPERTY DESCRIPTION section (2-3 paragraphs).

Cover:
- Physical characteristics (building type, size, units)
- Construction quality and condition
- Unit mix and layouts
- Recent improvements or upgrades
- Building amenities and systems

Be descriptive but factual. Do NOT include a header - just the content.`,

  locationOverview: `Generate the LOCATION OVERVIEW section (2-3 paragraphs).

Cover:
- Neighborhood character and appeal
- Transportation access
- Retail, dining, and entertainment nearby
- Demographics and tenant demand drivers
- Future development or infrastructure improvements in the area

Paint a picture of the location's desirability. Do NOT include a header - just the content.`,

  financialSummary: `Generate the FINANCIAL SUMMARY section (2-3 paragraphs plus key metrics).

Cover:
- Current income and expense performance
- Rent roll highlights
- NOI and cap rate analysis
- Comparison to market benchmarks
- Pro forma projections if applicable

Include specific numbers where provided. Do NOT include a header - just the content.`,

  marketAnalysis: `Generate the MARKET ANALYSIS section (2-3 paragraphs).

Cover:
- Current market conditions and cap rate trends
- Supply/demand dynamics in the submarket
- Rent growth trajectory
- Recent comparable sales and how this property compares
- Investment activity and buyer demand

Use market data provided to support the analysis. Do NOT include a header - just the content.`,

  valueCreation: `Generate the VALUE CREATION OPPORTUNITIES section (2-3 paragraphs or bullets).

Cover:
- Rent upside potential (below-market rents, loss to lease)
- Renovation opportunities and expected returns
- Expense reduction strategies
- Additional income opportunities
- Timeline and investment required

Be specific about the upside. Do NOT include a header - just the content.`,

  investmentThesis: `Generate the INVESTMENT THESIS section (2-3 paragraphs).

Cover:
- Why this is a compelling buy NOW
- Ideal buyer profile
- Financing considerations
- Risk factors and mitigants
- Summary of the opportunity

Close with conviction. Do NOT include a header - just the content.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData, section } = await req.json();

    if (!formData) {
      throw new Error("Form data is required");
    }

    const propertyContext = buildPropertyContext(formData);
    const sectionPrompt = section && sectionPrompts[section] ? sectionPrompts[section] : null;

    let userPrompt: string;

    if (sectionPrompt) {
      // Generate a single section
      userPrompt = `Based on this property information:

${propertyContext}

${sectionPrompt}`;
    } else {
      // Generate all sections
      userPrompt = `Based on this property information:

${propertyContext}

Generate a complete Offering Memorandum with the following sections. Use markdown formatting with ## headers for each section:

## Executive Summary
(2-3 compelling paragraphs opening with a strong hook)

## Investment Highlights
(6-8 bullet points with key benefits and metrics)

## Property Description
(2-3 paragraphs covering physical characteristics)

## Location Overview
(2-3 paragraphs on neighborhood and accessibility)

## Financial Summary
(2-3 paragraphs on income, expenses, and NOI)

## Market Analysis
(2-3 paragraphs on market conditions and comps)

## Value Creation Opportunities
(2-3 paragraphs on upside potential)

## Investment Thesis
(2-3 paragraphs on why to buy now)

Make sure each section is substantive and uses the specific data provided.`;
    }

    console.log(`[generate-om] Generating ${section || "full OM"} for: ${formData.propertyBasics?.address}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: section ? 1000 : 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[generate-om] API error: ${errorText}`);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    console.log(`[generate-om] Successfully generated content for: ${formData.propertyBasics?.address}`);

    return new Response(
      JSON.stringify({ 
        content,
        section: section || "full",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[generate-om] Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
