import { Building2, TrendingUp, MapPin, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const boroughs = [
  {
    name: "Manhattan",
    neighborhoods: [
      "Upper West Side",
      "Upper East Side", 
      "Harlem",
      "Washington Heights",
      "Inwood",
      "East Village",
      "West Village",
      "Chelsea",
      "Murray Hill",
      "Midtown"
    ],
    description: "Primary focus with extensive transaction history across luxury and value-add multifamily properties",
    stats: {
      avgPricePerUnit: "$450K-$800K",
      avgCapRate: "3.5%-5.0%",
      volume: "$200M+"
    }
  },
  {
    name: "Brooklyn",
    neighborhoods: [
      "Williamsburg",
      "Park Slope",
      "Crown Heights",
      "Bed-Stuy",
      "Bushwick",
      "Fort Greene",
      "Brooklyn Heights",
      "Prospect Heights",
      "Sunset Park",
      "Bay Ridge"
    ],
    description: "Strong presence in emerging and established neighborhoods with value-add and stabilized assets",
    stats: {
      avgPricePerUnit: "$300K-$600K",
      avgCapRate: "4.0%-6.0%",
      volume: "$180M+"
    }
  },
  {
    name: "Queens",
    neighborhoods: [
      "Astoria",
      "Long Island City",
      "Flushing",
      "Forest Hills",
      "Sunnyside",
      "Jackson Heights",
      "Woodside",
      "Corona",
      "Elmhurst",
      "Ridgewood"
    ],
    description: "Expanding coverage in high-growth neighborhoods with institutional and private buyer interest",
    stats: {
      avgPricePerUnit: "$250K-$450K",
      avgCapRate: "4.5%-6.5%",
      volume: "$80M+"
    }
  },
  {
    name: "Bronx",
    neighborhoods: [
      "Fordham",
      "Grand Concourse",
      "Riverdale",
      "Mott Haven",
      "Hunts Point",
      "Morris Heights",
      "Kingsbridge",
      "Belmont"
    ],
    description: "Active in value-add and development opportunities with strong rental fundamentals",
    stats: {
      avgPricePerUnit: "$200K-$350K",
      avgCapRate: "5.5%-7.5%",
      volume: "$40M+"
    }
  }
];

const assetTypes = [
  {
    icon: Building2,
    title: "Multifamily",
    subtitle: "Walk-ups to Mid-Rise Elevator Buildings",
    description: "Our core focus. Extensive experience with rent-stabilized, market-rate, and mixed portfolios across all NYC submarkets.",
    highlights: [
      "5-50 unit buildings",
      "Value-add and stabilized",
      "Rent-stabilized expertise",
      "Market-rate luxury"
    ],
    typicalBuyers: "Private investors, family offices, local operators, institutional funds"
  },
  {
    icon: Building2,
    title: "Mixed-Use",
    subtitle: "Retail Ground Floor with Residential Above",
    description: "Specialized in retail-residential combinations, particularly corner buildings with strong retail presence and residential income.",
    highlights: [
      "Retail + residential income",
      "Corner locations preferred",
      "Neighborhood retail",
      "Restaurant/bar spaces"
    ],
    typicalBuyers: "Owner-operators, retail specialists, local developers"
  },
  {
    icon: TrendingUp,
    title: "Development Sites",
    subtitle: "Air Rights, Assemblages, Vacant Land",
    description: "Work with owners on air rights transfers, assemblage strategies, and surplus land monetization for ground-up development.",
    highlights: [
      "Air rights transfers",
      "Site assemblages",
      "Surplus land sales",
      "Zoning analysis"
    ],
    typicalBuyers: "Developers, builders, institutional land funds"
  },
  {
    icon: Building2,
    title: "Retail",
    subtitle: "Street Retail & Neighborhood Shopping",
    description: "Single-tenant and multi-tenant retail buildings, particularly in high-traffic neighborhood corridors.",
    highlights: [
      "Corner retail buildings",
      "Long-term leases",
      "Credit tenants",
      "Neighborhood strips"
    ],
    typicalBuyers: "REITs, private equity, family offices, retail operators"
  },
  {
    icon: Building2,
    title: "Office Conversions",
    subtitle: "Repositioning Opportunities",
    description: "Identify and execute on residential conversion opportunities, particularly older office buildings in emerging areas.",
    highlights: [
      "Class B/C office",
      "Conversion-ready zoning",
      "Adaptive reuse",
      "Tax incentive programs"
    ],
    typicalBuyers: "Developers, conversion specialists, opportunity funds"
  },
  {
    icon: TrendingUp,
    title: "Distressed Assets",
    subtitle: "Note Sales, Foreclosures, Receiverships",
    description: "Experience with complex situations including note sales, foreclosure properties, and receivership assignments.",
    highlights: [
      "Note sales",
      "REO properties",
      "Receivership sales",
      "Court-ordered sales"
    ],
    typicalBuyers: "Opportunity funds, distressed specialists, high-net-worth value-add buyers"
  }
];

const Markets = () => {
  return (
    <div className="min-h-screen pt-24 md:pt-32 lg:pt-40 pb-16 md:pb-20 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 md:mb-20 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight">Markets & Asset Types</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
            Comprehensive coverage across NYC boroughs with specialized expertise in middle-market investment properties
          </p>
        </div>

        {/* NYC Boroughs Coverage */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-light mb-12">NYC Coverage</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {boroughs.map((borough, index) => (
              <div 
                key={index}
                className="p-8 md:p-10 border-l-2 border-accent/30 rounded-lg bg-white/[0.02] transition-all duration-400 hover:bg-white/[0.04] hover:transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-6">
                  <MapPin className="text-accent flex-shrink-0" size={32} />
                  <div>
                    <h3 className="text-2xl md:text-3xl font-light mb-2">{borough.name}</h3>
                    <p className="text-sm md:text-base text-muted-foreground font-light">{borough.description}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-lg bg-white/[0.02]">
                  <div>
                    <div className="text-xs text-muted-foreground font-light mb-1">Avg Price/Unit</div>
                    <div className="text-sm font-light">{borough.stats.avgPricePerUnit}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-light mb-1">Cap Rate Range</div>
                    <div className="text-sm font-light">{borough.stats.avgCapRate}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-light mb-1">Career Volume</div>
                    <div className="text-sm font-light">{borough.stats.volume}</div>
                  </div>
                </div>

                {/* Neighborhoods */}
                <div>
                  <h4 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Key Neighborhoods</h4>
                  <div className="flex flex-wrap gap-2">
                    {borough.neighborhoods.map((neighborhood, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 font-light"
                      >
                        {neighborhood}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Asset Types */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-light mb-12">Asset Type Expertise</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {assetTypes.map((asset, index) => {
              const Icon = asset.icon;
              return (
                <div 
                  key={index}
                  className="p-8 md:p-10 border-l-2 border-accent/30 rounded-lg bg-white/[0.02] transition-all duration-400 hover:bg-white/[0.04]"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-accent" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-light mb-1">{asset.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground font-light">{asset.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm md:text-base text-muted-foreground font-light mb-6 leading-relaxed">
                    {asset.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-light uppercase tracking-wider text-muted-foreground mb-3">Key Focus Areas</h4>
                      <ul className="space-y-2">
                        {asset.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs md:text-sm font-light">
                            <CheckCircle2 size={14} className="mt-0.5 text-accent flex-shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-light uppercase tracking-wider text-muted-foreground mb-3">Typical Buyer Profile</h4>
                      <p className="text-xs md:text-sm font-light text-muted-foreground leading-relaxed">
                        {asset.typicalBuyers}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Market Intelligence CTA */}
        <section className="p-8 md:p-12 rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Ready to Discuss Your Asset?</h2>
          <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed mb-8 max-w-2xl mx-auto">
            Whether you're considering a sale, exploring market conditions, or seeking a valuation, our team provides data-driven guidance tailored to your asset and objectives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-light px-8 md:px-12">
              <Link to="/submit-deal">Submit Your Property</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-light px-8 md:px-12">
              <Link to="/transactions">View Recent Sales</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Markets;