export const SERVICE_SUB_PAGES = {
  "investment-sales": {
    title: "Investment Sales",
    basePath: "/services/investment-sales",
    pages: [
      { name: "Overview", path: "/services/investment-sales" },
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
      { name: "Transactions", path: "/services/residential/transactions" },
      { name: "View Listings on StreetEasy", path: "https://streeteasy.com/nyc/rentals/agent:bridge-investment-sales", external: true },
    ],
  },
  "commercial-leasing": {
    title: "Commercial Leasing",
    basePath: "/services/commercial-leasing",
    pages: [
      { name: "Overview", path: "/services/commercial-leasing" },
      { name: "Tenant Rep", path: "/services/commercial-leasing/tenant-rep" },
      { name: "Landlord Rep", path: "/services/commercial-leasing/landlord-rep" },
      { name: "View Listings on CoStar", path: "https://www.costar.com", external: true },
    ],
  },
  "capital-advisory": {
    title: "Capital Advisory",
    basePath: "/services/capital-advisory",
    pages: [
      { name: "Overview", path: "/services/capital-advisory" },
    ],
  },
  "property-management": {
    title: "Property Management",
    basePath: "/services/property-management",
    pages: [
      { name: "Overview", path: "/services/property-management" },
    ],
  },
  marketing: {
    title: "Marketing",
    basePath: "/services/marketing",
    pages: [
      { name: "Overview", path: "/services/marketing" },
    ],
  },
  billboard: {
    title: "Billboard",
    basePath: "/services/billboard",
    pages: [
      { name: "Overview", path: "/services/billboard" },
    ],
  },
};

export type ServiceKey = keyof typeof SERVICE_SUB_PAGES;