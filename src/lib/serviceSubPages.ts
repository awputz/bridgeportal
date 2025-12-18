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
      { name: "Buildings", path: "/services/residential/buildings" },
      { name: "For Landlords", path: "/services/residential/landlords" },
      { name: "For Sellers", path: "/services/residential/sellers" },
      { name: "For Buyers & Renters", path: "/services/residential/find-a-home" },
      { name: "Renter Resources", path: "/services/residential/renter-resources" },
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
