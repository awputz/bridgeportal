export const SERVICE_SUB_PAGES = {
  "investment-sales": {
    title: "Investment Sales",
    basePath: "/services/investment-sales",
    pages: [
      { name: "Overview", path: "/services/investment-sales" },
      { name: "Valuations", path: "/services/investment-sales/valuations" },
      { name: "Track Record", path: "/transactions" },
      { name: "Tools", path: "/services/investment-sales/tools" },
    ],
  },
  "commercial-leasing": {
    title: "Commercial Leasing",
    basePath: "/services/commercial-leasing",
    pages: [
      { name: "Overview", path: "/services/commercial-leasing" },
      { name: "Tools", path: "/services/commercial-leasing/tools" },
    ],
  },
  residential: {
    title: "Residential",
    basePath: "/services/residential",
    pages: [
      { name: "Overview", path: "/services/residential" },
      { name: "For Landlords", path: "/services/residential/landlords" },
      { name: "For Buyers & Renters", path: "/services/residential/find-a-home" },
      { name: "For Sellers", path: "/services/residential/sellers" },
      { name: "Exclusive Portfolio", path: "/services/residential/buildings" },
      { name: "Renter Resources", path: "/services/residential/renter-resources" },
      { name: "Tools", path: "/services/residential/tools" },
    ],
  },
  "capital-advisory": {
    title: "Capital Advisory",
    basePath: "/services/capital-advisory",
    pages: [
      { name: "Overview", path: "/services/capital-advisory" },
      { name: "Tools", path: "/services/capital-advisory/tools" },
    ],
  },
  "property-management": {
    title: "Property Management",
    basePath: "/services/property-management",
    pages: [
      { name: "Overview", path: "/services/property-management" },
      { name: "Tools", path: "/services/property-management/tools" },
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
