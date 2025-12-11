import { ServicePageLayout } from "@/components/ServicePageLayout";
import { MapPin, TrendingUp, Home, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactSheet } from "@/contexts/ContactSheetContext";

const Markets = () => {
  const { openContactSheet } = useContactSheet();
  const neighborhoods = [
    {
      borough: "Manhattan",
      areas: [
        { name: "Upper East Side", description: "Classic elegance with museum mile and Central Park access", avgRent: "$4,500" },
        { name: "Upper West Side", description: "Family-friendly with cultural institutions and riverside parks", avgRent: "$4,200" },
        { name: "Chelsea", description: "Art galleries, High Line access, and vibrant nightlife", avgRent: "$4,800" },
        { name: "Greenwich Village", description: "Historic charm with tree-lined streets and boutique shopping", avgRent: "$5,000" },
        { name: "Tribeca", description: "Converted lofts, celebrity neighbors, and top restaurants", avgRent: "$6,500" },
        { name: "SoHo", description: "Cast-iron architecture, high-end shopping, and gallery scene", avgRent: "$5,500" },
      ],
    },
    {
      borough: "Brooklyn",
      areas: [
        { name: "Williamsburg", description: "Trendy dining, music venues, and waterfront parks", avgRent: "$3,800" },
        { name: "DUMBO", description: "Tech hub with stunning Manhattan views and cobblestone streets", avgRent: "$4,500" },
        { name: "Park Slope", description: "Brownstone-lined streets, excellent schools, and Prospect Park", avgRent: "$3,500" },
        { name: "Brooklyn Heights", description: "Historic district with promenade views and easy commute", avgRent: "$4,000" },
        { name: "Cobble Hill", description: "Charming boutiques, cafes, and family-friendly atmosphere", avgRent: "$3,600" },
        { name: "Fort Greene", description: "Cultural diversity, BAM, and beautiful brownstones", avgRent: "$3,400" },
      ],
    },
    {
      borough: "Queens",
      areas: [
        { name: "Astoria", description: "Diverse dining, beer gardens, and Manhattan accessibility", avgRent: "$2,400" },
        { name: "Long Island City", description: "Waterfront living, art scene, and rapid development", avgRent: "$3,200" },
        { name: "Forest Hills", description: "Suburban feel with excellent transit and tennis stadium", avgRent: "$2,200" },
        { name: "Jackson Heights", description: "Cultural diversity, affordable options, and historic gardens", avgRent: "$1,900" },
      ],
    },
  ];

  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Residential / Markets</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          NYC Neighborhood Guide
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Explore New York City's diverse neighborhoods and find the perfect area 
          to call home.
        </p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="residential" heroContent={heroContent}>
      {/* Neighborhoods */}
      {neighborhoods.map((borough) => (
        <section key={borough.borough} className="py-16 odd:bg-background even:bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">{borough.borough}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {borough.areas.map((area) => (
                <div
                  key={area.name}
                  className="bg-background rounded-lg p-6 border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{area.name}</h3>
                      <p className="text-sm text-primary">Avg. Rent: {area.avgRent}/mo</p>
                    </div>
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">{area.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Market Trends */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Current Market Trends
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-secondary/20 rounded-lg p-8 border border-border">
              <TrendingUp className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-4">Rental Market</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Record-low vacancy rates across Manhattan
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Brooklyn continuing to see strong demand
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Queens emerging as value alternative
                </li>
              </ul>
            </div>
            <div className="bg-secondary/20 rounded-lg p-8 border border-border">
              <Home className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-4">Sales Market</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Condo prices stabilizing after recent growth
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Co-op market showing renewed interest
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Townhouse inventory remains tight
                </li>
              </ul>
            </div>
            <div className="bg-secondary/20 rounded-lg p-8 border border-border">
              <MapPin className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-4">Hot Neighborhoods</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Hudson Yards continuing to mature
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  South Bronx seeing investor interest
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Gowanus rezoning creating opportunities
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Need Help Choosing a Neighborhood?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Our agents have deep knowledge of every NYC neighborhood. Let us help you find 
            the perfect fit.
          </p>
          <Button size="lg" variant="secondary" onClick={openContactSheet}>
            Schedule Consultation <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Markets;
