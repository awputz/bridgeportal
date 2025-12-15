export const SERVICE_SUB_PAGES = {
  "investment-sales": {
    title: "Investment Sales",
    basePath: "/services/investment-sales",
    pages: [
      { name: "Overview", path: "/services/investment-sales" },
      { name: "Valuations", path: "/services/investment-sales/valuations" },
      { name: "Track Record", path: "/services/investment-sales/track-record" },
    ],
  },
  "commercial-leasing": {
    title: "Commercial Leasing",
    basePath: "/services/commercial-leasing",
    pages: [
      { name: "Overview", path: "/services/commercial-leasing" },
      { name: "Tenant Rep", path: "/services/commercial-leasing/tenant-rep" },
      { name: "Landlord Rep", path: "/services/commercial-leasing/landlord-rep" },
    ],
  },
  residential: {
    title: "Residential",
    basePath: "/services/residential",
    pages: [
      { name: "Overview", path: "/services/residential" },
      { name: "For Landlords", path: "/services/residential/landlords" },
      { name: "For Buyers", path: "/services/residential/find-a-home" },
      { name: "For Renters", path: "/services/residential/find-a-home" },
    ],
  },
  "capital-advisory": {
    title: "Capital Advisory",
    basePath: "/services/capital-advisory",
    pages: [
      { name: "Overview", path: "/services/capital-advisory" },
      { name: "Debt Financing", path: "/services/capital-advisory/debt-financing" },
      { name: "Equity & JV", path: "/services/capital-advisory/equity-jv" },
    ],
  },
  "property-management": {
    title: "Property Management",
    basePath: "/services/property-management",
    pages: [
      { name: "Overview", path: "/services/property-management" },
      { name: "Our Portfolio", path: "/services/property-management/portfolio" },
      { name: "Services", path: "/services/property-management/services" },
    ],
  },
  marketing: {
    title: "Marketing",
    basePath: "/services/marketing",
    pages: [
      { name: "Overview", path: "/services/marketing" },
      { name: "Creative Studio", path: "/services/marketing/creative-studio" },
      { name: "Digital & Campaigns", path: "/services/marketing/digital-campaigns" },
    ],
  },
  billboard: {
    title: "Billboard",
    basePath: "/services/billboard",
    pages: [
      { name: "Overview", path: "/services/billboard" },
      { name: "Inventory Map", path: "/services/billboard/inventory" },
      { name: "Rates & Availability", path: "/services/billboard/rates" },
    ],
  },
};

export type ServiceKey = keyof typeof SERVICE_SUB_PAGES;
