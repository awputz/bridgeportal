export const COMPANY_INFO = {
  name: "Bridge Advisory Group",
  tagline: "NYC's Premier Full-Service Real Estate Advisory",
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
    email: "info@bridgeadvisorygroup.com",
    phone: "(212) 555-0100"
  },
  description: {
    full: "Full-service real estate advisory delivering institutional-quality execution across commercial, residential, and investment sales throughout New York City.",
    short: "NYC's premier full-service real estate advisory platform.",
    home: "Full-Service Real Estate Advisory"
  },
  compliance: {
    license: "Licensed Real Estate Broker • NY DOS License #XXXXXXX",
    equalHousing: true
  }
};

export const DIVISIONS = {
  commercial: {
    name: "BRIDGE Commercial",
    tagline: "Institutional-grade execution for sophisticated investors",
    accent: "210 100% 45%", // Blue accent
    accentForeground: "0 0% 100%",
    vibe: "institutional",
    description: "Office, Retail, Industrial & Asset Sales"
  },
  investmentSales: {
    name: "BRIDGE Investment Sales", 
    tagline: "Maximizing value for middle market properties",
    accent: "210 100% 45%", // Same blue (merged section)
    accentForeground: "0 0% 100%",
    vibe: "institutional",
    description: "Multifamily & Mixed-Use Investment Sales"
  },
  residential: {
    name: "BRIDGE Residential",
    tagline: "White-glove service for discerning clients",
    accent: "35 85% 55%", // Warm gold accent
    accentForeground: "0 0% 11%",
    vibe: "lifestyle",
    description: "Find a Home • List Your Home"
  }
};

export const NAV_ITEMS = {
  commercialInvestment: {
    label: "Commercial & Investment",
    path: "/commercial",
    items: [
      { name: "Overview", path: "/commercial" },
      { name: "Office", path: "/commercial/office" },
      { name: "Retail", path: "/commercial/retail" },
      { name: "Industrial", path: "/commercial/industrial" },
      { name: "Investment Sales", path: "/commercial/investment-sales" },
      { name: "Track Record", path: "/commercial/track-record" },
    ]
  },
  residential: {
    label: "Residential",
    path: "/residential",
    items: [
      { name: "Overview", path: "/residential" },
      { name: "Find a Home", path: "/residential/listings" },
      { name: "List Your Home", path: "/residential/sell" },
      { name: "Track Record", path: "/residential/track-record" },
    ]
  }
};
