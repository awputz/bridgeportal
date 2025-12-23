import { ServicePageLayout } from "@/components/ServicePageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, FileText, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
const requiredDocuments = [{
  title: "Photo ID",
  description: "Government-issued identification"
}, {
  title: "Tax Returns or W-2s",
  description: "First two pages of 1040 only"
}, {
  title: "Recent Pay Stubs",
  description: "Latest pay period"
}, {
  title: "Bank Statements",
  description: "Summary page only"
}, {
  title: "Landlord Reference",
  description: "6-12 months payment history"
}, {
  title: "Employment Letter",
  description: "Stating current salary"
}];
const legalResources = [{
  title: "New York Standard Operating Procedures",
  description: "Required disclosure document for all New York real estate transactions",
  url: "https://dos.ny.gov/system/files/documents/2024/01/1736.pdf"
}, {
  title: "Fair Housing Information",
  description: "Federal fair housing guidelines and requirements",
  url: "https://www.hud.gov/program_offices/fair_housing_equal_opp"
}, {
  title: "New York State Division of Licensing Services",
  description: "Information about real estate licensing and regulations",
  url: "https://dos.ny.gov/licensing-services"
}];
const rentalChecklist = ["Government-issued ID", "Proof of income (recent pay stubs or tax returns)", "Bank statements (last 2-3 months)", "Employer contact information", "Previous landlord references", "Credit report", "Application fee (typically $20-100)"];
const purchaseChecklist = ["Pre-approval letter from lender", "Proof of funds for down payment", "Financial statements", "Employment verification", "Tax returns (last 2 years)", "Personal references", "Board application materials (for co-ops)"];
const leaseTerms = ["Lease term and renewal options", "Rent amount and payment schedule", "Security deposit requirements", "Utilities and who pays what", "Pet policies and fees", "Subletting rules", "Building amenities and access"];
const RenterResources = () => {
  return <ServicePageLayout serviceKey="residential" heroContent={<section className="relative pt-32 md:pt-40 pb-16 md:pb-20">
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
        </section>}>
      {/* Section 2: Rental Application Requirements */}
      <section className="py-16 md:py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            Rental Application Requirements
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Apply Online Card */}
            <Card className="p-6 md:p-8 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <h3 className="text-xl font-semibold mb-2">Apply Online</h3>
              <p className="text-muted-foreground mb-6">
                Complete application takes 10-15 minutes
              </p>
              <Button asChild className="w-full rounded-full">
                <a href="https://secure.weimark.com/ifw/fc33000e21e90819048fbb95b0d70320/6037/new" target="_blank" rel="noopener noreferrer">
                  Start Application
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </Card>

            {/* Financial Requirements Card */}
            <Card className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4">Financial Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <span>
                    Combined household income: <strong>40x monthly rent</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <span>
                    Credit score: <strong>700 or above</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <span>Verifiable employment and references</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Required Documentation Grid */}
          <Card className="p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6">Required Documentation</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {requiredDocuments.map(doc => <div key={doc.title} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">{doc.title}</span>
                    <span className="text-muted-foreground"> — {doc.description}</span>
                  </div>
                </div>)}
            </div>
          </Card>
        </div>
      </section>

      {/* Section 3: Required Legal Disclosures */}
      

      {/* Section 4: Client Resources */}
      <section className="py-16 md:py-20 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            Client Resources
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            {/* Rental Application Checklist */}
            <Card className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-2">
                Rental Application Checklist
              </h3>
              <p className="text-muted-foreground mb-4">
                Complete list of documents needed for NYC rental applications
              </p>
              <ul className="grid sm:grid-cols-2 gap-2">
                {rentalChecklist.map(item => <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>)}
              </ul>
            </Card>

            {/* Purchase Checklist */}
            <Card className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-2">Purchase Checklist</h3>
              <p className="text-muted-foreground mb-4">
                Documents required for NYC property purchases
              </p>
              <ul className="grid sm:grid-cols-2 gap-2">
                {purchaseChecklist.map(item => <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>)}
              </ul>
            </Card>

            {/* Understanding NYC Leases */}
            <Card className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-2">
                Understanding NYC Leases
              </h3>
              <p className="text-muted-foreground mb-4">
                Key terms and considerations in New York rental agreements
              </p>
              <ul className="grid sm:grid-cols-2 gap-2">
                {leaseTerms.map(item => <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>)}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 5: CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-8 text-center bg-surface border">
            <h2 className="text-xl font-semibold mb-2">
              Need Additional Information?
            </h2>
            <p className="text-muted-foreground mb-6">
              Questions about documentation or the process? We're here to help.
            </p>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/contact">Contact our team</Link>
            </Button>
          </Card>
        </div>
      </section>
    </ServicePageLayout>;
};
export default RenterResources;