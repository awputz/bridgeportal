import { useState } from "react";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ExternalLink, Copy, Check, Home, Building2, Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import NetEffectiveRentCalculator from "@/components/NetEffectiveRentCalculator";

const APPLICATION_LINK = "https://secure.weimark.com/ifw/fc33000e21e90819048fbb95b0d70320/6037/new";

const requiredDocuments = [
  { title: "Photo ID", description: "Government-issued identification" },
  { title: "Tax Returns or W-2s", description: "First two pages of 1040 only" },
  { title: "Recent Pay Stubs", description: "Latest pay period" },
  { title: "Bank Statements", description: "Summary page only" },
  { title: "Landlord Reference", description: "6-12 months payment history" },
  { title: "Employment Letter", description: "Stating current salary" },
];

const rentalChecklist = [
  "Government-issued ID",
  "Proof of income",
  "Bank statements",
  "Employer info",
  "Landlord references",
  "Credit report",
  "Application fee",
];

const purchaseChecklist = [
  "Pre-approval letter",
  "Proof of funds",
  "Financial statements",
  "Employment verification",
  "Tax returns (2 years)",
  "Personal references",
  "Board materials (co-ops)",
];

const leaseTerms = [
  "Lease term & renewal",
  "Rent & payment schedule",
  "Security deposit",
  "Utilities",
  "Pet policies",
  "Subletting rules",
  "Building amenities",
];

const exclusiveListings = [
  {
    division: "Residential",
    description: "Browse our exclusive residential listings on StreetEasy",
    url: "https://streeteasy.com/profile/957575-bridge-advisory-group?tab_profile=active_listings",
    icon: Home,
  },
  {
    division: "Commercial",
    description: "View available commercial spaces for lease",
    url: "https://bridgenyre.com/commercial-listings",
    icon: Building2,
  },
  {
    division: "Investment Sales",
    description: "Explore investment property opportunities",
    url: "https://bridgenyre.com/services/investment-sales/listings",
    icon: Landmark,
  },
];

const RenterResources = () => {
  const [copied, setCopied] = useState(false);

  const copyApplicationLink = async () => {
    try {
      await navigator.clipboard.writeText(APPLICATION_LINK);
      setCopied(true);
      toast.success("Application link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <ServicePageLayout
      serviceKey="residential"
      heroContent={
        <section className="relative pt-32 md:pt-40 pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                Residential / Renter Resources
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Resources & Legal
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Essential information and requirements for NYC real estate.
              </p>
            </div>
          </div>
        </section>
      }
    >
      {/* Section 1: Rental Application Requirements */}
      <section className="py-12 md:py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
            Rental Application Requirements
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Apply Online Card */}
            <Card className="p-5 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <h3 className="text-lg font-semibold mb-1">Apply Online</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete application takes 10-15 minutes
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={copyApplicationLink}
                  className="flex-1" 
                  size="sm"
                >
                  {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? "Copied!" : "Copy Application Link"}
                </Button>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <a
                    href={APPLICATION_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Application
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Card>

            {/* Financial Requirements Card */}
            <Card className="p-5">
              <h3 className="text-lg font-semibold mb-3">Financial Requirements</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span>
                    Combined income: <strong>40x monthly rent</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span>
                    Credit score: <strong>700+</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span>Verifiable employment</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Required Documentation Grid */}
          <Card className="p-5">
            <h3 className="text-lg font-semibold mb-4">Required Documentation</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {requiredDocuments.map((doc) => (
                <div key={doc.title} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">{doc.title}</span>
                    <span className="text-muted-foreground"> — {doc.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Section 2: Exclusive Listings */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-2">
            View Our Exclusive Listings
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Browse available properties across all our divisions
          </p>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-4">
            {exclusiveListings.map((listing) => (
              <Card key={listing.division} className="p-5 hover:bg-accent/5 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <listing.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold">{listing.division}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{listing.description}</p>
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-all"
                >
                  <a href={listing.url} target="_blank" rel="noopener noreferrer">
                    View Listings
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Client Resources - Compact 3-Column Grid */}
      <section className="py-12 md:py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
            Client Resources
          </h2>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Rental Checklist */}
              <Card className="p-4">
                <h3 className="text-base font-semibold mb-3">Rental Checklist</h3>
                <ul className="space-y-1.5">
                  {rentalChecklist.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Purchase Checklist */}
              <Card className="p-4">
                <h3 className="text-base font-semibold mb-3">Purchase Checklist</h3>
                <ul className="space-y-1.5">
                  {purchaseChecklist.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Understanding NYC Leases */}
              <Card className="p-4">
                <h3 className="text-base font-semibold mb-3">NYC Lease Terms</h3>
                <ul className="space-y-1.5">
                  {leaseTerms.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Net Effective Rent Calculator */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              Net Effective Rent Calculator
            </h2>
            <p className="text-muted-foreground">
              Calculate your true monthly rent after concessions and specials
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <NetEffectiveRentCalculator />
          </div>
        </div>
      </section>

      {/* Section 5: CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-6 text-center bg-surface border">
            <h2 className="text-lg font-semibold mb-2">
              Need Additional Information?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Questions about documentation or the process? We're here to help.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/contact">Contact our team</Link>
            </Button>
          </Card>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default RenterResources;
