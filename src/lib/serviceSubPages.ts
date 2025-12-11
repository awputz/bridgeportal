export const SERVICE_SUB_PAGES = {
  "investment-sales": {
    title: "Investment Sales",
    basePath: "/services/investment-sales",
    pages: [
      { name: "Overview", path: "/services/investment-sales" },
      { name: "Dispositions", path: "/services/investment-sales/dispositions" },
      { name: "Acquisitions", path: "/services/investment-sales/acquisitions" },
      { name: "Valuations", path: "/services/investment-sales/valuations" },
      { name: "Track Record", path: "/services/investment-sales/track-record" },
      { name: "View Listings on CoStar", path: "https://www.costar.com", external: true },
    ],
  },
  residential: {
    title: "Residential",
    basePath: "/services/residential",
    pages: [
      { name: "Overview", path: "/services/residential" },
      { name: "Find a Home", path: "/services/residential/find-a-home" },
      { name: "View Listings on StreetEasy", path: "https://streeteasy.com/nyc/rentals/agent:bridge-investment-sales", external: true },
      { name: "Transactions", path: "/services/residential/transactions" },
      { name: "Landlord Services", path: "/services/residential/landlord-services" },
      { name: "Buildings", path: "/services/residential/buildings" },
    ],
  },
  "commercial-leasing": {
    title: "Commercial Leasing",
    basePath: "/services/commercial-leasing",
    pages: [
      { name: "Overview", path: "/services/commercial-leasing" },
      { name: "Tenant Rep", path: "/services/commercial-leasing/tenant-rep" },
      { name: "Landlord Rep", path: "/services/commercial-leasing/landlord-rep" },
      { name: "Retail", path: "/services/commercial-leasing/retail" },
      { name: "Office", path: "/services/commercial-leasing/office" },
      { name: "View Listings on CoStar", path: "https://www.costar.com", external: true },
    ],
  },
  "capital-advisory": {
    title: "Capital Advisory",
    basePath: "/services/capital-advisory",
    pages: [
      { name: "Overview", path: "/services/capital-advisory" },
      { name: "Debt Placement", path: "/services/capital-advisory/debt" },
      { name: "Equity", path: "/services/capital-advisory/equity" },
      { name: "Refinance", path: "/services/capital-advisory/refinance" },
      { name: "Construction", path: "/services/capital-advisory/construction" },
    ],
  },
  "property-management": {
    title: "Property Management",
    basePath: "/services/property-management",
    pages: [
      { name: "Overview", path: "/services/property-management" },
      { name: "Services", path: "/services/property-management/services" },
      { name: "Portfolio", path: "/services/property-management/portfolio" },
      { name: "Reporting", path: "/services/property-management/reporting" },
    ],
  },
  marketing: {
    title: "Marketing",
    basePath: "/services/marketing",
    pages: [
      { name: "Overview", path: "/services/marketing" },
      { name: "Creative", path: "/services/marketing/creative" },
      { name: "Digital", path: "/services/marketing/digital" },
      { name: "Strategy", path: "/services/marketing/strategy" },
    ],
  },
  billboard: {
    title: "Billboard",
    basePath: "/services/billboard",
    pages: [
      { name: "Overview", path: "/services/billboard" },
      { name: "Inventory", path: "/services/billboard/inventory" },
      { name: "Pricing", path: "/services/billboard/pricing" },
      { name: "Case Studies", path: "/services/billboard/case-studies" },
    ],
  },
};

export type ServiceKey = keyof typeof SERVICE_SUB_PAGES;
