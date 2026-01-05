import { Link } from "react-router-dom";
import { FileText, Download, ExternalLink, FileCheck, Building2, Users, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ResourceItem {
  name: string;
  description: string;
  url?: string;
  external?: boolean;
}

interface ResourceCategory {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: ResourceItem[];
}

const resourceCategories: ResourceCategory[] = [
  {
    title: "Tax & Financial Forms",
    description: "Essential tax and financial documents",
    icon: <FileText className="h-5 w-5" />,
    items: [
      { name: "W-9 Form", description: "Request for Taxpayer Identification Number", url: "https://www.irs.gov/pub/irs-pdf/fw9.pdf", external: true },
      { name: "1099-NEC Instructions", description: "Nonemployee Compensation reporting guide", url: "https://www.irs.gov/pub/irs-pdf/i1099nec.pdf", external: true },
      { name: "Direct Deposit Form", description: "Set up direct deposit for commissions" },
      { name: "Expense Reimbursement Form", description: "Submit business expenses for reimbursement" },
    ]
  },
  {
    title: "Legal & Compliance",
    description: "Required legal documents and disclosures",
    icon: <FileCheck className="h-5 w-5" />,
    items: [
      { name: "Fair Housing Guidelines", description: "Federal fair housing requirements", url: "https://www.hud.gov/program_offices/fair_housing_equal_opp/fair_housing_act_overview", external: true },
      { name: "Agency Disclosure Form", description: "NYS disclosure requirements" },
      { name: "Equal Housing Logo", description: "Download official Equal Housing logo" },
      { name: "Anti-Discrimination Policy", description: "Company anti-discrimination guidelines" },
    ]
  },
  {
    title: "Real Estate Forms",
    description: "Standard real estate documents",
    icon: <Building2 className="h-5 w-5" />,
    items: [
      { name: "Exclusive Right to Sell", description: "Listing agreement template" },
      { name: "Exclusive Right to Lease", description: "Rental listing agreement" },
      { name: "Buyer Agency Agreement", description: "Buyer representation contract" },
      { name: "Commission Agreement", description: "Co-broke commission split form" },
    ]
  },
  {
    title: "HR & Operations",
    description: "Human resources and operational documents",
    icon: <Users className="h-5 w-5" />,
    items: [
      { name: "Employee Handbook", description: "Company policies and procedures" },
      { name: "Time Off Request", description: "Request vacation or personal days" },
      { name: "Contractor Agreement", description: "Independent contractor terms" },
      { name: "Compliance Training", description: "Required annual training materials" },
    ]
  },
  {
    title: "Branding & Marketing",
    description: "Brand guidelines and marketing assets",
    icon: <Palette className="h-5 w-5" />,
    items: [
      { name: "Brand Guidelines", description: "Logo usage and brand standards" },
      { name: "Email Signature Template", description: "Standard email signature format" },
      { name: "Social Media Guidelines", description: "Posting guidelines for agents" },
      { name: "Listing Photo Standards", description: "Property photography requirements" },
    ]
  },
];

const Resources = () => {
  const handleDownload = (item: ResourceItem) => {
    if (item.url) {
      window.open(item.url, '_blank');
    } else {
      toast.info(`${item.name} coming soon`, {
        description: "Contact office@bridgenyre.com for assistance",
      });
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {/* Back to Tools */}
        <Link 
          to="/portal/tools" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          ← Back to Tools
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
            Resources
          </h1>
          <p className="text-muted-foreground font-light">
            Legal, tax, HR, and branding documents for agents
          </p>
        </div>

        {/* Resource Categories */}
        <div className="grid gap-6">
          {resourceCategories.map((category) => (
            <Card key={category.title} className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="font-light flex items-center gap-2">
                  {category.icon}
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {category.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="min-w-0 flex-1 mr-3">
                        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(item)}
                        className="flex-shrink-0"
                      >
                        {item.external ? (
                          <ExternalLink className="h-4 w-4" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <Card className="glass-card border-white/10 mt-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                Can't find what you need? Contact us at{" "}
                <a href="mailto:office@bridgenyre.com" className="text-primary hover:underline">
                  office@bridgenyre.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resources;
