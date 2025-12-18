export const COMPANY_INFO = {
  name: "Bridge Advisory Group",
  tagline: "Full Spectrum Real Estate Solutions For A Changing Market",
  address: {
    street: "600 Third Avenue",
    floors: "Floors 2 and 10",
    city: "New York",
    state: "NY",
    zip: "10016",
    full: "600 Third Avenue, Floors 2 and 10, New York NY 10016",
    short: "600 Third Avenue, New York NY 10016"
  },
  contact: {
    email: "office@bridgenyre.com",
    phone: "(212) 203-4881"
  },
  description: {
    full: "Bridge Advisory Group is a New York based brokerage and advisory platform that unifies residential, commercial leasing, investment sales, capital advisory, and marketing services under one integrated umbrella.",
    short: "NYC's premier full-service real estate advisory platform.",
    home: "Full-Service Real Estate Advisory"
  },
  compliance: {
    license: "Licensed Real Estate Broker • NY DOS License #10401379653",
    equalHousing: true
  }
};

export const DIVISIONS = {
  investmentSales: {
    name: "Investment Sales",
    path: "/services/investment-sales",
    tagline: "Transaction advisory for multifamily, mixed use, and commercial assets.",
    description: "Multifamily & Mixed-Use Investment Sales",
    icon: "TrendingUp"
  },
  commercialLeasing: {
    name: "Commercial Leasing",
    path: "/services/commercial-leasing",
    tagline: "Tenant and landlord representation for office, retail, and specialty assets.",
    description: "Office, Retail & Specialty Assets",
    icon: "Building2"
  },
  residential: {
    name: "Residential",
    path: "/services/residential",
    tagline: "Luxury leasing and sales for owners, renters, and buyers across New York.",
    description: "Find a Home • List Your Home",
    icon: "Home"
  },
  capitalAdvisory: {
    name: "Capital Advisory",
    path: "/services/capital-advisory",
    tagline: "Debt and equity solutions aligned with real world business plans.",
    description: "Debt & Equity Advisory",
    icon: "Landmark"
  },
  propertyManagement: {
    name: "Property Management",
    path: "/services/property-management",
    tagline: "Full-service portfolio management for landlords and investors.",
    description: "Portfolio & Asset Management",
    icon: "Settings"
  },
  marketing: {
    name: "Marketing",
    path: "/services/marketing",
    tagline: "Creative, digital, and strategy support for properties and brands.",
    description: "Creative, Digital & Strategy",
    icon: "Megaphone"
  },
  billboard: {
    name: "Billboard",
    path: "/services/billboard",
    tagline: "Direct LL access to NYC's best boards.",
    description: "Out-of-Home Advertising",
    icon: "Presentation"
  }
};

export const NAV_ITEMS = {
  services: {
    label: "Services",
    items: [
      { name: "Investment Sales", path: "/services/investment-sales" },
      { name: "Commercial Leasing", path: "/services/commercial-leasing" },
      { name: "Residential", path: "/services/residential" },
      { name: "Capital Advisory", path: "/services/capital-advisory" },
      { name: "Property Management", path: "/services/property-management" },
      { name: "Marketing", path: "/services/marketing" },
      { name: "Billboard", path: "/services/billboard" },
    ]
  }
};

export const LISTINGS_ITEMS = {
  label: "Listings",
  items: [
    { 
      name: "Investment Sales", 
      url: "/services/investment-sales/listings",
      external: false 
    },
    { 
      name: "Commercial Leasing", 
      url: "/services/commercial-leasing/listings",
      external: false 
    },
    { 
      name: "Residential", 
      url: "https://streeteasy.com/profile/957575-bridge-advisory-group?tab_profile=active_listings",
      external: true 
    }
  ]
};
