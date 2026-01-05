// OM Generator TypeScript Interfaces

export interface OMPropertyBasics {
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
}

export interface OMPricingReturns {
  askingPrice: string;
  currentCapRate: string;
  proFormaCapRate: string;
  currentNOI: string;
  proFormaNOI: string;
  occupancyRate: string;
}

export interface OMIncomeDetails {
  grossPotentialRent: string;
  lossToLease: string;
  vacancyRate: string;
  otherIncome: string;
  otherIncomeDescription: string;
  effectiveGrossIncome: string;
}

export interface OMExpenses {
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
}

export interface OMUnitType {
  id: string;
  unitType: string;
  count: string;
  avgRent: string;
  marketRent: string;
}

export interface OMRentRegulation {
  rentStabilizedUnits: string;
  freeMarketUnits: string;
  taxAbatement: string;
  taxAbatementExpiry: string;
}

export interface OMLocation {
  neighborhood: string;
  submarket: string;
  borough: string;
  city: string;
  walkScore: string;
  transitScore: string;
  keyAmenities: string;
  nearbyTransit: string;
}

export interface OMMarketData {
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
}

export interface OMValueAdd {
  upsideNarrative: string;
  renovationBudget: string;
  expectedRentIncrease: string;
  expenseSavings: string;
  additionalIncomeOpportunities: string;
}

export interface OMInvestmentThesis {
  whyBuyNow: string;
  targetBuyer: string;
  financingNotes: string;
}

export interface OMFormData {
  propertyBasics: OMPropertyBasics;
  pricingReturns: OMPricingReturns;
  incomeDetails: OMIncomeDetails;
  expenses: OMExpenses;
  unitMix: OMUnitType[];
  rentRegulation: OMRentRegulation;
  location: OMLocation;
  marketData: OMMarketData;
  valueAdd: OMValueAdd;
  investmentThesis: OMInvestmentThesis;
}

export interface OMGeneratedSections {
  executiveSummary: string;
  investmentHighlights: string;
  propertyDescription: string;
  locationOverview: string;
  financialSummary: string;
  marketAnalysis: string;
  valueCreation: string;
  investmentThesis: string;
}

export const initialOMFormData: OMFormData = {
  propertyBasics: {
    address: "",
    propertyName: "",
    propertyType: "multifamily",
    buildingClass: "B",
    yearBuilt: "",
    yearRenovated: "",
    totalUnits: "",
    grossSF: "",
    lotSize: "",
    zoning: "",
    far: "",
    airRights: "",
  },
  pricingReturns: {
    askingPrice: "",
    currentCapRate: "",
    proFormaCapRate: "",
    currentNOI: "",
    proFormaNOI: "",
    occupancyRate: "",
  },
  incomeDetails: {
    grossPotentialRent: "",
    lossToLease: "",
    vacancyRate: "",
    otherIncome: "",
    otherIncomeDescription: "",
    effectiveGrossIncome: "",
  },
  expenses: {
    realEstateTaxes: "",
    insurance: "",
    utilities: "",
    managementFee: "",
    payroll: "",
    repairsMaintenance: "",
    professionalFees: "",
    marketing: "",
    capexReserves: "",
    totalExpenses: "",
  },
  unitMix: [
    { id: "1", unitType: "Studio", count: "", avgRent: "", marketRent: "" },
    { id: "2", unitType: "1BR", count: "", avgRent: "", marketRent: "" },
    { id: "3", unitType: "2BR", count: "", avgRent: "", marketRent: "" },
  ],
  rentRegulation: {
    rentStabilizedUnits: "",
    freeMarketUnits: "",
    taxAbatement: "none",
    taxAbatementExpiry: "",
  },
  location: {
    neighborhood: "",
    submarket: "",
    borough: "",
    city: "New York",
    walkScore: "",
    transitScore: "",
    keyAmenities: "",
    nearbyTransit: "",
  },
  marketData: {
    marketCapRate: "",
    rentGrowthRate: "",
    comp1Address: "",
    comp1Price: "",
    comp1CapRate: "",
    comp1Date: "",
    comp2Address: "",
    comp2Price: "",
    comp2CapRate: "",
    comp2Date: "",
    comp3Address: "",
    comp3Price: "",
    comp3CapRate: "",
    comp3Date: "",
  },
  valueAdd: {
    upsideNarrative: "",
    renovationBudget: "",
    expectedRentIncrease: "",
    expenseSavings: "",
    additionalIncomeOpportunities: "",
  },
  investmentThesis: {
    whyBuyNow: "",
    targetBuyer: "",
    financingNotes: "",
  },
};

// Helper to format currency
export const formatCurrency = (value: string | number): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

// Helper to calculate metrics
export const calculateMetrics = (formData: OMFormData) => {
  const price = parseFloat(formData.pricingReturns.askingPrice) || 0;
  const units = parseFloat(formData.propertyBasics.totalUnits) || 0;
  const sf = parseFloat(formData.propertyBasics.grossSF) || 0;
  const noi = parseFloat(formData.pricingReturns.currentNOI) || 0;

  return {
    pricePerUnit: units > 0 ? price / units : 0,
    pricePerSF: sf > 0 ? price / sf : 0,
    capRate: price > 0 ? (noi / price) * 100 : 0,
  };
};
