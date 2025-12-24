import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import NetEffectiveRentCalculator from "@/components/NetEffectiveRentCalculator";

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

const RenterResources = () => {
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
      {/* Section 1: Net Effective Rent Calculator */}
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

      {/* Section 2: Rental Application Requirements */}
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
              <Button asChild className="w-full rounded-full" size="sm">
                <a
                  href="https://secure.weimark.com/ifw/fc33000e21e90819048fbb95b0d70320/6037/new"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Start Application
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
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

      {/* Section 4: CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-6 text-center bg-surface border">
            <h2 className="text-lg font-semibold mb-2">
              Need Additional Information?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Questions about documentation or the process? We're here to help.
            </p>
            <Button asChild variant="outline" className="rounded-full" size="sm">
              <Link to="/contact">Contact our team</Link>
            </Button>
          </Card>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default RenterResources;