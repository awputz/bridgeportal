import { Card } from "@/components/ui/card";
import { FileText, ExternalLink, Download } from "lucide-react";

const legalResources = [
  {
    title: "New York Standard Operating Procedures",
    description: "Required disclosure document for all New York real estate transactions",
    link: "https://dos.ny.gov/system/files/documents/2024/01/1736.pdf",
    type: "external"
  },
  {
    title: "Fair Housing Information",
    description: "Federal fair housing guidelines and requirements",
    link: "https://www.hud.gov/program_offices/fair_housing_equal_opp",
    type: "external"
  },
  {
    title: "New York State Division of Licensing Services",
    description: "Information about real estate licensing and regulations",
    link: "https://dos.ny.gov/licensing-services",
    type: "external"
  }
];

const clientResources = [
  {
    title: "Rental Application Checklist",
    description: "Complete list of documents needed for NYC rental applications",
    items: [
      "Government-issued ID",
      "Proof of income (recent pay stubs or tax returns)",
      "Bank statements (last 2-3 months)",
      "Employer contact information",
      "Previous landlord references",
      "Credit report",
      "Application fee (typically $20-100)"
    ]
  },
  {
    title: "Purchase Checklist",
    description: "Documents required for NYC property purchases",
    items: [
      "Pre-approval letter from lender",
      "Proof of funds for down payment",
      "Financial statements",
      "Employment verification",
      "Tax returns (last 2 years)",
      "Personal references",
      "Board application materials (for co-ops)"
    ]
  },
  {
    title: "Understanding NYC Leases",
    description: "Key terms and considerations in New York rental agreements",
    items: [
      "Lease term and renewal options",
      "Rent amount and payment schedule",
      "Security deposit requirements",
      "Utilities and who pays what",
      "Pet policies and fees",
      "Subletting rules",
      "Building amenities and access"
    ]
  }
];

const Resources = () => {
  return (
    <div className="min-h-screen pt-24 md:pt-32 lg:pt-40 pb-20">
      {/* Header */}
      <section className="px-6 lg:px-8 mb-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight">Resources & Legal</h1>
          <p className="text-xl text-muted-foreground">
            Important information, required disclosures, and helpful resources for clients navigating New York City real estate.
          </p>
        </div>
      </section>

      {/* Legal Resources */}
      <section className="px-6 lg:px-8 mb-20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl font-semibold mb-8">Required Legal Disclosures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legalResources.map((resource, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <FileText className="mb-4 text-accent" size={32} />
                <h3 className="font-semibold mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:underline flex items-center gap-2"
                >
                  View Document
                  <ExternalLink size={14} />
                </a>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Client Resources */}
      <section className="px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl font-semibold mb-8">Client Resources</h2>
          <div className="space-y-8">
            {clientResources.map((resource, index) => (
              <Card key={index} className="p-8">
                <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                <p className="text-muted-foreground mb-6">{resource.description}</p>
                <ul className="space-y-3">
                  {resource.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="px-6 lg:px-8 mt-20">
        <div className="container mx-auto max-w-3xl bg-surface p-8 rounded-lg border border-border text-center">
          <h3 className="text-xl font-semibold mb-4">Need Additional Information?</h3>
          <p className="text-muted-foreground mb-6">
            Our team is available to answer questions about documentation requirements, legal disclosures, or any aspect of the process.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-accent hover:underline"
          >
            Contact our team
            <ExternalLink size={16} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Resources;
