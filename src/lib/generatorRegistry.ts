import {
  FileText,
  Mail,
  Building2,
  FileCheck,
  PenTool,
  BarChart3,
  Target,
  TrendingUp,
  MessageSquare,
  Layers,
  DollarSign,
  Users,
  Briefcase,
  Home,
  Heart,
  Phone,
  Linkedin,
  Lightbulb,
  ClipboardCheck,
  Instagram,
  Presentation,
  Image,
  Factory,
  type LucideIcon,
} from "lucide-react";
import type { Division } from "@/contexts/DivisionContext";

export type GeneratorCategory = 
  | "presentations"
  | "documents" 
  | "flyers"
  | "social-media"
  | "emails"
  | "scripts";

export type GeneratorStatus = "live" | "under-construction" | "coming-soon";

export interface GeneratorDefinition {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  status: GeneratorStatus;
  category: GeneratorCategory;
  divisions: Division[] | "all";
  priority: number;
}

// ==========================================
// PRESENTATIONS (5 Active)
// ==========================================
const presentationGenerators: GeneratorDefinition[] = [
  {
    id: "investment-sales-om-deck",
    name: "Investment Sales OM Deck",
    description: "Full offering memorandum presentation for investment properties",
    icon: Presentation,
    status: "live",
    category: "presentations",
    divisions: ["investment-sales"],
    priority: 1,
  },
  {
    id: "office-leasing-deck",
    name: "Office Leasing Deck",
    description: "Professional office space presentation for tenants",
    icon: Presentation,
    status: "live",
    category: "presentations",
    divisions: ["commercial-leasing"],
    priority: 2,
  },
  {
    id: "retail-leasing-deck",
    name: "Retail Leasing Deck",
    description: "Retail space presentation for prospective tenants",
    icon: Presentation,
    status: "live",
    category: "presentations",
    divisions: ["commercial-leasing"],
    priority: 3,
  },
  {
    id: "residential-listing-deck",
    name: "Residential Listing Deck",
    description: "Home and condo listing presentation",
    icon: Presentation,
    status: "live",
    category: "presentations",
    divisions: ["residential"],
    priority: 4,
  },
  {
    id: "seller-pitch-deck",
    name: "Seller Pitch Deck",
    description: "Win-the-listing presentation for sellers",
    icon: Presentation,
    status: "live",
    category: "presentations",
    divisions: "all",
    priority: 5,
  },
];

// ==========================================
// DOCUMENTS (8 Active)
// ==========================================
const documentGenerators: GeneratorDefinition[] = [
  {
    id: "om-generator",
    name: "Investment Sales OM",
    description: "Full written offering memorandum document",
    icon: FileText,
    status: "live",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 1,
  },
  {
    id: "deal-summary",
    name: "One-Page Deal Summary",
    description: "Quick executive summary for transactions",
    icon: FileText,
    status: "live",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 2,
  },
  {
    id: "cma-generator",
    name: "CMA Report",
    description: "Comparative market analysis report",
    icon: BarChart3,
    status: "live",
    category: "documents",
    divisions: "all",
    priority: 3,
  },
  {
    id: "investment-analysis-report",
    name: "Investment Analysis Report",
    description: "Detailed financial breakdown and analysis",
    icon: TrendingUp,
    status: "live",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 4,
  },
  {
    id: "lease-summary",
    name: "Lease Summary",
    description: "Lease abstract and summary document",
    icon: FileCheck,
    status: "live",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 5,
  },
  {
    id: "due-diligence-checklist",
    name: "Due Diligence Checklist",
    description: "Property-specific due diligence checklist",
    icon: ClipboardCheck,
    status: "live",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 6,
  },
  {
    id: "meeting-prep",
    name: "Meeting Prep Brief",
    description: "Pre-meeting research summary and talking points",
    icon: Briefcase,
    status: "live",
    category: "documents",
    divisions: "all",
    priority: 7,
  },
  {
    id: "buyer-match-letter",
    name: "Buyer Match Letter",
    description: "Why this property fits your client",
    icon: Target,
    status: "live",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 8,
  },
];

// ==========================================
// FLYERS (6 Active)
// ==========================================
const flyerGenerators: GeneratorDefinition[] = [
  {
    id: "investment-sales-flyer",
    name: "Investment Sales Flyer",
    description: "Full-color investment property listing flyer",
    icon: Image,
    status: "live",
    category: "flyers",
    divisions: ["investment-sales"],
    priority: 1,
  },
  {
    id: "office-space-flyer",
    name: "Office Space Flyer",
    description: "Office for lease marketing flyer",
    icon: Image,
    status: "live",
    category: "flyers",
    divisions: ["commercial-leasing"],
    priority: 2,
  },
  {
    id: "retail-space-flyer",
    name: "Retail Space Flyer",
    description: "Retail for lease marketing flyer",
    icon: Image,
    status: "live",
    category: "flyers",
    divisions: ["commercial-leasing"],
    priority: 3,
  },
  {
    id: "residential-just-listed-flyer",
    name: "Just Listed Flyer",
    description: "New residential listing announcement flyer",
    icon: Image,
    status: "live",
    category: "flyers",
    divisions: ["residential"],
    priority: 4,
  },
  {
    id: "residential-open-house-flyer",
    name: "Open House Flyer",
    description: "Open house event marketing flyer",
    icon: Image,
    status: "live",
    category: "flyers",
    divisions: ["residential"],
    priority: 5,
  },
  {
    id: "industrial-warehouse-flyer",
    name: "Industrial/Warehouse Flyer",
    description: "Industrial space marketing flyer",
    icon: Factory,
    status: "live",
    category: "flyers",
    divisions: ["commercial-leasing"],
    priority: 6,
  },
];

// ==========================================
// SOCIAL MEDIA (4 Active)
// ==========================================
const socialMediaGenerators: GeneratorDefinition[] = [
  {
    id: "instagram-just-listed",
    name: "Instagram Just Listed Post",
    description: "New listing graphic caption for Instagram",
    icon: Instagram,
    status: "live",
    category: "social-media",
    divisions: "all",
    priority: 1,
  },
  {
    id: "instagram-just-sold",
    name: "Instagram Just Sold Post",
    description: "Deal closed announcement for Instagram",
    icon: Instagram,
    status: "live",
    category: "social-media",
    divisions: "all",
    priority: 2,
  },
  {
    id: "linkedin-deal-post",
    name: "LinkedIn Deal Post",
    description: "Professional closed deal post for LinkedIn",
    icon: Linkedin,
    status: "live",
    category: "social-media",
    divisions: "all",
    priority: 3,
  },
  {
    id: "instagram-open-house-story",
    name: "Instagram Open House Story",
    description: "Event countdown caption for Instagram Stories",
    icon: Instagram,
    status: "live",
    category: "social-media",
    divisions: ["residential"],
    priority: 4,
  },
];

// ==========================================
// EMAILS (4 Active)
// ==========================================
const emailGenerators: GeneratorDefinition[] = [
  {
    id: "email-generator",
    name: "Email Generator",
    description: "Draft professional emails for any situation",
    icon: Mail,
    status: "live",
    category: "emails",
    divisions: "all",
    priority: 1,
  },
  {
    id: "follow-up-email",
    name: "Follow-up Email",
    description: "Post-meeting or showing follow-up emails",
    icon: Mail,
    status: "live",
    category: "emails",
    divisions: "all",
    priority: 2,
  },
  {
    id: "market-update-email",
    name: "Market Update Email",
    description: "Monthly newsletter for your client base",
    icon: TrendingUp,
    status: "live",
    category: "emails",
    divisions: "all",
    priority: 3,
  },
  {
    id: "client-thank-you",
    name: "Client Thank You Email",
    description: "Post-closing gratitude emails",
    icon: Heart,
    status: "live",
    category: "emails",
    divisions: "all",
    priority: 4,
  },
];

// ==========================================
// SCRIPTS (3 Active)
// ==========================================
const scriptGenerators: GeneratorDefinition[] = [
  {
    id: "cold-call-script",
    name: "Cold Call Script",
    description: "Phone prospecting scripts tailored to your prospect",
    icon: Phone,
    status: "live",
    category: "scripts",
    divisions: "all",
    priority: 1,
  },
  {
    id: "objection-handler",
    name: "Objection Handler",
    description: "Common objections with professional responses",
    icon: MessageSquare,
    status: "live",
    category: "scripts",
    divisions: "all",
    priority: 2,
  },
  {
    id: "seller-pricing-script",
    name: "Seller Pricing Script",
    description: "Justify pricing to sellers with market data",
    icon: DollarSign,
    status: "live",
    category: "scripts",
    divisions: "all",
    priority: 3,
  },
];

// ==========================================
// UNDER CONSTRUCTION (Legacy generators)
// ==========================================
const underConstructionGenerators: GeneratorDefinition[] = [
  // Investment Sales legacy
  {
    id: "investment-thesis",
    name: "Investment Thesis",
    description: "Generate compelling investment rationale for buyers",
    icon: Lightbulb,
    status: "under-construction",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 100,
  },
  {
    id: "comp-narrative",
    name: "Comp Narrative",
    description: "Generate market analysis narratives from comparable sales",
    icon: PenTool,
    status: "under-construction",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 101,
  },
  {
    id: "noi-pro-forma",
    name: "NOI Pro Forma",
    description: "AI-assisted NOI projections and pro forma narratives",
    icon: BarChart3,
    status: "under-construction",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 102,
  },
  {
    id: "rent-roll-analyzer",
    name: "Rent Roll Analyzer",
    description: "Summarize and analyze rent rolls with AI insights",
    icon: FileText,
    status: "under-construction",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 103,
  },
  {
    id: "1031-exchange-brief",
    name: "1031 Exchange Brief",
    description: "Educational briefs for 1031 exchange clients",
    icon: FileText,
    status: "under-construction",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 104,
  },
  {
    id: "investment-comparison",
    name: "Investment Comparison",
    description: "Compare multiple investment properties side-by-side",
    icon: Layers,
    status: "under-construction",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 105,
  },
  {
    id: "cap-rate-justification",
    name: "Cap Rate Justification",
    description: "Explain and justify pricing to sellers",
    icon: DollarSign,
    status: "under-construction",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 106,
  },
  {
    id: "portfolio-analysis",
    name: "Portfolio Analysis",
    description: "Multi-property portfolio summaries and insights",
    icon: Layers,
    status: "under-construction",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 107,
  },
  {
    id: "disposition-strategy",
    name: "Disposition Strategy",
    description: "Exit strategy recommendations for owners",
    icon: TrendingUp,
    status: "under-construction",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 108,
  },
  // Commercial Leasing legacy
  {
    id: "loi-generator",
    name: "LOI Generator",
    description: "Draft Letter of Intent for lease negotiations",
    icon: FileText,
    status: "under-construction",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 110,
  },
  {
    id: "tenant-proposal",
    name: "Tenant Proposal",
    description: "RFP responses and tenant requirement packages",
    icon: FileText,
    status: "under-construction",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 111,
  },
  {
    id: "space-comparison",
    name: "Space Comparison",
    description: "Compare multiple spaces side-by-side for tenants",
    icon: Layers,
    status: "under-construction",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 112,
  },
  {
    id: "lease-abstract",
    name: "Lease Abstract",
    description: "Summarize existing leases into digestible abstracts",
    icon: FileCheck,
    status: "under-construction",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 113,
  },
  {
    id: "ti-scope",
    name: "TI Scope Generator",
    description: "Tenant improvement scope descriptions and budgets",
    icon: FileText,
    status: "under-construction",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 114,
  },
  {
    id: "landlord-pitch",
    name: "Landlord Pitch Letter",
    description: "Pitch letters to acquire exclusive listings",
    icon: Mail,
    status: "under-construction",
    category: "emails",
    divisions: ["commercial-leasing"],
    priority: 115,
  },
  {
    id: "tour-confirmation",
    name: "Tour Confirmation",
    description: "Professional tour scheduling and confirmation emails",
    icon: Mail,
    status: "under-construction",
    category: "emails",
    divisions: ["commercial-leasing"],
    priority: 116,
  },
  {
    id: "lease-renewal-proposal",
    name: "Lease Renewal Proposal",
    description: "Renewal negotiation documents and proposals",
    icon: FileText,
    status: "under-construction",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 117,
  },
  {
    id: "sublease-blurb",
    name: "Sublease Blurb",
    description: "Quick sublease marketing copy and descriptions",
    icon: Building2,
    status: "under-construction",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 118,
  },
  {
    id: "escalation-explainer",
    name: "Escalation Explainer",
    description: "Client education on rent escalations and increases",
    icon: TrendingUp,
    status: "under-construction",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 119,
  },
  {
    id: "cam-summary",
    name: "CAM Summary",
    description: "Explain CAM charges to tenants in plain language",
    icon: DollarSign,
    status: "under-construction",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 120,
  },
  {
    id: "space-programming",
    name: "Space Programming",
    description: "Help tenants define their space needs and requirements",
    icon: Layers,
    status: "under-construction",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 121,
  },
  // Residential legacy
  {
    id: "property-description",
    name: "Property Description",
    description: "Create compelling listing descriptions for properties",
    icon: Building2,
    status: "under-construction",
    category: "documents",
    divisions: ["residential"],
    priority: 130,
  },
  {
    id: "buyer-needs-analysis",
    name: "Buyer Needs Analysis",
    description: "Document and organize buyer requirements systematically",
    icon: ClipboardCheck,
    status: "under-construction",
    category: "documents",
    divisions: ["residential"],
    priority: 131,
  },
  {
    id: "neighborhood-guide",
    name: "Neighborhood Guide",
    description: "AI-written area guides with local insights",
    icon: Home,
    status: "under-construction",
    category: "documents",
    divisions: ["residential"],
    priority: 132,
  },
  {
    id: "open-house-follow-up",
    name: "Open House Follow-up",
    description: "Post-showing follow-up emails for attendees",
    icon: Users,
    status: "under-construction",
    category: "emails",
    divisions: ["residential"],
    priority: 133,
  },
  {
    id: "rental-application-summary",
    name: "Rental App Summary",
    description: "Summarize tenant applications for landlords",
    icon: FileText,
    status: "under-construction",
    category: "documents",
    divisions: ["residential"],
    priority: 134,
  },
  {
    id: "seller-net-sheet",
    name: "Seller Net Sheet Narrative",
    description: "Explain net proceeds to sellers in plain language",
    icon: DollarSign,
    status: "under-construction",
    category: "documents",
    divisions: ["residential"],
    priority: 135,
  },
  {
    id: "buyer-offer-letter",
    name: "Buyer Offer Letter",
    description: "Compelling cover letters to accompany offers",
    icon: Heart,
    status: "under-construction",
    category: "emails",
    divisions: ["residential"],
    priority: 136,
  },
  {
    id: "rental-listing",
    name: "Rental Listing",
    description: "Rental-specific listing copy for apartments",
    icon: Home,
    status: "under-construction",
    category: "documents",
    divisions: ["residential"],
    priority: 137,
  },
  {
    id: "tenant-welcome-letter",
    name: "Tenant Welcome Letter",
    description: "New tenant welcome package and move-in guide",
    icon: Home,
    status: "under-construction",
    category: "emails",
    divisions: ["residential"],
    priority: 138,
  },
  {
    id: "lease-violation-notice",
    name: "Lease Violation Notice",
    description: "Draft professional violation notices for landlords",
    icon: FileText,
    status: "under-construction",
    category: "documents",
    divisions: ["residential"],
    priority: 139,
  },
  {
    id: "showing-feedback-summary",
    name: "Showing Feedback Summary",
    description: "Compile and summarize showing feedback for sellers",
    icon: MessageSquare,
    status: "under-construction",
    category: "documents",
    divisions: ["residential"],
    priority: 140,
  },
  {
    id: "price-reduction-memo",
    name: "Price Reduction Memo",
    description: "Justify price adjustments to sellers with market data",
    icon: TrendingUp,
    status: "under-construction",
    category: "documents",
    divisions: ["residential"],
    priority: 141,
  },
  {
    id: "building-amenity-guide",
    name: "Building Amenity Guide",
    description: "Highlight building features and amenities",
    icon: Building2,
    status: "under-construction",
    category: "documents",
    divisions: ["residential"],
    priority: 142,
  },
  {
    id: "listing-teaser",
    name: "Listing Teaser Generator",
    description: "Create social media teasers for listings",
    icon: PenTool,
    status: "under-construction",
    category: "social-media",
    divisions: ["commercial-leasing", "residential"],
    priority: 143,
  },
  // Universal legacy
  {
    id: "social-media-post",
    name: "Social Media Post",
    description: "LinkedIn and Instagram captions for listings and wins",
    icon: Linkedin,
    status: "under-construction",
    category: "social-media",
    divisions: "all",
    priority: 150,
  },
  {
    id: "agent-bio",
    name: "Agent Bio Writer",
    description: "Professional bio for websites and marketing materials",
    icon: Users,
    status: "under-construction",
    category: "documents",
    divisions: "all",
    priority: 151,
  },
  // Analytics legacy
  {
    id: "pipeline-health",
    name: "Pipeline Health Report",
    description: "AI analysis of your deal pipeline with recommendations",
    icon: BarChart3,
    status: "under-construction",
    category: "documents",
    divisions: "all",
    priority: 160,
  },
  {
    id: "lead-scoring",
    name: "Lead Scoring Tool",
    description: "AI-analyzed lead prioritization based on activity",
    icon: Target,
    status: "under-construction",
    category: "documents",
    divisions: "all",
    priority: 161,
  },
  {
    id: "commission-forecast",
    name: "Commission Forecast",
    description: "Projected earnings based on your current pipeline",
    icon: DollarSign,
    status: "under-construction",
    category: "documents",
    divisions: "all",
    priority: 162,
  },
  {
    id: "weekly-activity-digest",
    name: "Weekly Activity Digest",
    description: "AI-summarized weekly activity report",
    icon: BarChart3,
    status: "under-construction",
    category: "documents",
    divisions: "all",
    priority: 163,
  },
  {
    id: "performance-insights",
    name: "Performance Insights",
    description: "AI coaching based on your metrics and activity",
    icon: TrendingUp,
    status: "under-construction",
    category: "documents",
    divisions: "all",
    priority: 164,
  },
  {
    id: "deal-risk-assessment",
    name: "Deal Risk Assessment",
    description: "Identify at-risk deals with action recommendations",
    icon: Target,
    status: "under-construction",
    category: "documents",
    divisions: "all",
    priority: 165,
  },
];

// ==========================================
// COMBINED REGISTRY
// ==========================================
export const generatorRegistry: GeneratorDefinition[] = [
  ...presentationGenerators,
  ...documentGenerators,
  ...flyerGenerators,
  ...socialMediaGenerators,
  ...emailGenerators,
  ...scriptGenerators,
  ...underConstructionGenerators,
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function getGeneratorsForDivision(division: Division): GeneratorDefinition[] {
  return generatorRegistry
    .filter((g) => g.divisions === "all" || g.divisions.includes(division))
    .sort((a, b) => a.priority - b.priority);
}

export function getGeneratorsByCategory(category: GeneratorCategory): GeneratorDefinition[] {
  return generatorRegistry.filter((g) => g.category === category);
}

export function getGeneratorsByStatus(status: GeneratorStatus): GeneratorDefinition[] {
  return generatorRegistry.filter((g) => g.status === status);
}

export function getLiveGenerators(): GeneratorDefinition[] {
  return generatorRegistry.filter((g) => g.status === "live");
}

export function getUnderConstructionGenerators(): GeneratorDefinition[] {
  return generatorRegistry.filter((g) => g.status === "under-construction");
}

export function getAllCategories(): GeneratorCategory[] {
  return ["presentations", "documents", "flyers", "social-media", "emails", "scripts"];
}

export function getCategoryLabel(category: GeneratorCategory): string {
  const labels: Record<GeneratorCategory, string> = {
    presentations: "Presentations",
    documents: "Documents",
    flyers: "Flyers",
    "social-media": "Social Media",
    emails: "Emails",
    scripts: "Scripts",
  };
  return labels[category];
}
