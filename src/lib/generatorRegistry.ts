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
  MapPin,
  DollarSign,
  AlertTriangle,
  Users,
  Zap,
  Bot,
  FileSpreadsheet,
  Handshake,
  ClipboardCheck,
  Receipt,
  LineChart,
  Scale,
  Key,
  Briefcase,
  Home,
  Heart,
  Calendar,
  UserCheck,
  Shield,
  FileSearch,
  Megaphone,
  Phone,
  Linkedin,
  Lightbulb,
  ScrollText,
  ArrowRightLeft,
  Calculator,
  Building,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { Division } from "@/contexts/DivisionContext";

export type GeneratorCategory = 
  | "documents" 
  | "communication" 
  | "marketing" 
  | "crm" 
  | "analytics"
  | "negotiations";

export type GeneratorStatus = "live" | "shell" | "coming-soon";

export interface GeneratorDefinition {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  status: GeneratorStatus;
  category: GeneratorCategory;
  divisions: Division[] | "all"; // Which divisions this generator applies to
  priority: number; // For sorting within division (lower = higher priority)
}

// ==========================================
// UNIVERSAL GENERATORS (All Divisions)
// ==========================================
const universalGenerators: GeneratorDefinition[] = [
  {
    id: "email-generator",
    name: "Email Generator",
    description: "Draft professional emails for any situation",
    icon: Mail,
    status: "live",
    category: "communication",
    divisions: "all",
    priority: 1,
  },
  {
    id: "follow-up-email",
    name: "Follow-up Email Generator",
    description: "AI-crafted follow-up emails for leads and clients",
    icon: Mail,
    status: "live",
    category: "communication",
    divisions: "all",
    priority: 2,
  },
  {
    id: "cma-generator",
    name: "CMA Generator",
    description: "Generate Comparative Market Analysis reports",
    icon: BarChart3,
    status: "live",
    category: "documents",
    divisions: "all",
    priority: 3,
  },
  {
    id: "client-thank-you",
    name: "Client Thank You",
    description: "Personalized thank you notes for clients and partners",
    icon: Heart,
    status: "live",
    category: "communication",
    divisions: "all",
    priority: 10,
  },
  {
    id: "meeting-prep",
    name: "Meeting Prep Brief",
    description: "AI-generated meeting preparation and talking points",
    icon: Briefcase,
    status: "live",
    category: "documents",
    divisions: "all",
    priority: 11,
  },
  {
    id: "objection-handler",
    name: "Objection Handler",
    description: "Scripts for handling common client objections",
    icon: MessageSquare,
    status: "live",
    category: "negotiations",
    divisions: "all",
    priority: 12,
  },
  {
    id: "social-media-post",
    name: "Social Media Post",
    description: "LinkedIn and Instagram captions for listings and wins",
    icon: Linkedin,
    status: "live",
    category: "marketing",
    divisions: "all",
    priority: 13,
  },
  {
    id: "cold-call-script",
    name: "Cold Call Script",
    description: "Cold outreach scripts tailored to your prospect",
    icon: Phone,
    status: "live",
    category: "communication",
    divisions: "all",
    priority: 14,
  },
  {
    id: "agent-bio",
    name: "Agent Bio Writer",
    description: "Professional bio for websites and marketing materials",
    icon: UserCheck,
    status: "live",
    category: "marketing",
    divisions: "all",
    priority: 15,
  },
  {
    id: "market-update-email",
    name: "Market Update Email",
    description: "Market update newsletters for your client base",
    icon: TrendingUp,
    status: "live",
    category: "communication",
    divisions: "all",
    priority: 16,
  },
];

// ==========================================
// INVESTMENT SALES GENERATORS
// ==========================================
const investmentSalesGenerators: GeneratorDefinition[] = [
  {
    id: "om-generator",
    name: "OM Generator",
    description: "Create professional Offering Memorandums with AI-powered content",
    icon: FileText,
    status: "live",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 1,
  },
  {
    id: "deal-summary",
    name: "Deal Summary Generator",
    description: "Create one-page deal summaries for transactions",
    icon: FileText,
    status: "live",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 2,
  },
  {
    id: "investment-thesis",
    name: "Investment Thesis",
    description: "Generate compelling investment rationale for buyers",
    icon: Lightbulb,
    status: "live",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 3,
  },
  {
    id: "comp-narrative",
    name: "Comp Narrative",
    description: "Generate market analysis narratives from comparable sales",
    icon: PenTool,
    status: "live",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 4,
  },
  {
    id: "noi-pro-forma",
    name: "NOI Pro Forma",
    description: "AI-assisted NOI projections and pro forma narratives",
    icon: Calculator,
    status: "live",
    category: "analytics",
    divisions: ["investment-sales"],
    priority: 5,
  },
  {
    id: "rent-roll-analyzer",
    name: "Rent Roll Analyzer",
    description: "Summarize and analyze rent rolls with AI insights",
    icon: FileSpreadsheet,
    status: "live",
    category: "analytics",
    divisions: ["investment-sales"],
    priority: 6,
  },
  {
    id: "1031-exchange-brief",
    name: "1031 Exchange Brief",
    description: "Educational briefs for 1031 exchange clients",
    icon: ArrowRightLeft,
    status: "live",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 7,
  },
  {
    id: "buyer-match-letter",
    name: "Buyer Match Letter",
    description: "Match property to buyer criteria with personalized pitch",
    icon: Target,
    status: "live",
    category: "communication",
    divisions: ["investment-sales"],
    priority: 8,
  },
  {
    id: "seller-pitch-deck",
    name: "Seller Pitch Outline",
    description: "Presentation outlines for seller listing meetings",
    icon: Megaphone,
    status: "live",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 9,
  },
  {
    id: "due-diligence-checklist",
    name: "Due Diligence Checklist",
    description: "Property-specific due diligence checklists",
    icon: ClipboardCheck,
    status: "live",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 10,
  },
  {
    id: "investment-comparison",
    name: "Investment Comparison",
    description: "Compare multiple investment properties side-by-side",
    icon: Scale,
    status: "live",
    category: "analytics",
    divisions: ["investment-sales"],
    priority: 11,
  },
  {
    id: "cap-rate-justification",
    name: "Cap Rate Justification",
    description: "Explain and justify pricing to sellers",
    icon: DollarSign,
    status: "live",
    category: "negotiations",
    divisions: ["investment-sales"],
    priority: 12,
  },
  {
    id: "portfolio-analysis",
    name: "Portfolio Analysis",
    description: "Multi-property portfolio summaries and insights",
    icon: Layers,
    status: "live",
    category: "analytics",
    divisions: ["investment-sales"],
    priority: 13,
  },
  {
    id: "disposition-strategy",
    name: "Disposition Strategy",
    description: "Exit strategy recommendations for owners",
    icon: LineChart,
    status: "live",
    category: "documents",
    divisions: ["investment-sales"],
    priority: 14,
  },
];

// ==========================================
// COMMERCIAL LEASING GENERATORS
// ==========================================
const commercialLeasingGenerators: GeneratorDefinition[] = [
  {
    id: "lease-summary",
    name: "Lease Summary Generator",
    description: "Generate executive lease summaries from deal terms",
    icon: FileCheck,
    status: "live",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 1,
  },
  {
    id: "listing-teaser",
    name: "Listing Teaser Generator",
    description: "Create social media teasers for listings",
    icon: PenTool,
    status: "live",
    category: "marketing",
    divisions: ["commercial-leasing", "residential"],
    priority: 2,
  },
  {
    id: "loi-generator",
    name: "LOI Generator",
    description: "Draft Letter of Intent for lease negotiations",
    icon: ScrollText,
    status: "live",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 3,
  },
  {
    id: "tenant-proposal",
    name: "Tenant Proposal",
    description: "RFP responses and tenant requirement packages",
    icon: FileText,
    status: "live",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 4,
  },
  {
    id: "space-comparison",
    name: "Space Comparison",
    description: "Compare multiple spaces side-by-side for tenants",
    icon: Scale,
    status: "live",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 5,
  },
  {
    id: "lease-abstract",
    name: "Lease Abstract",
    description: "Summarize existing leases into digestible abstracts",
    icon: FileSearch,
    status: "live",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 6,
  },
  {
    id: "ti-scope",
    name: "TI Scope Generator",
    description: "Tenant improvement scope descriptions and budgets",
    icon: Settings,
    status: "live",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 7,
  },
  {
    id: "landlord-pitch",
    name: "Landlord Pitch Letter",
    description: "Pitch letters to acquire exclusive listings",
    icon: Megaphone,
    status: "live",
    category: "communication",
    divisions: ["commercial-leasing"],
    priority: 8,
  },
  {
    id: "tour-confirmation",
    name: "Tour Confirmation",
    description: "Professional tour scheduling and confirmation emails",
    icon: Calendar,
    status: "live",
    category: "communication",
    divisions: ["commercial-leasing"],
    priority: 9,
  },
  {
    id: "lease-renewal-proposal",
    name: "Lease Renewal Proposal",
    description: "Renewal negotiation documents and proposals",
    icon: Handshake,
    status: "live",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 10,
  },
  {
    id: "sublease-blurb",
    name: "Sublease Blurb",
    description: "Quick sublease marketing copy and descriptions",
    icon: Building,
    status: "live",
    category: "marketing",
    divisions: ["commercial-leasing"],
    priority: 11,
  },
  {
    id: "escalation-explainer",
    name: "Escalation Explainer",
    description: "Client education on rent escalations and increases",
    icon: TrendingUp,
    status: "live",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 12,
  },
  {
    id: "cam-summary",
    name: "CAM Summary",
    description: "Explain CAM charges to tenants in plain language",
    icon: Receipt,
    status: "live",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 13,
  },
  {
    id: "space-programming",
    name: "Space Programming",
    description: "Help tenants define their space needs and requirements",
    icon: Layers,
    status: "live",
    category: "documents",
    divisions: ["commercial-leasing"],
    priority: 14,
  },
];

// ==========================================
// RESIDENTIAL GENERATORS
// ==========================================
const residentialGenerators: GeneratorDefinition[] = [
  {
    id: "property-description",
    name: "Property Description",
    description: "Create compelling listing descriptions for properties",
    icon: Building2,
    status: "live",
    category: "marketing",
    divisions: ["residential"],
    priority: 1,
  },
  {
    id: "buyer-needs-analysis",
    name: "Buyer Needs Analysis",
    description: "Document and organize buyer requirements systematically",
    icon: ClipboardCheck,
    status: "live",
    category: "documents",
    divisions: ["residential"],
    priority: 3,
  },
  {
    id: "neighborhood-guide",
    name: "Neighborhood Guide",
    description: "AI-written area guides with local insights",
    icon: MapPin,
    status: "live",
    category: "marketing",
    divisions: ["residential"],
    priority: 4,
  },
  {
    id: "open-house-follow-up",
    name: "Open House Follow-up",
    description: "Post-showing follow-up emails for attendees",
    icon: Users,
    status: "live",
    category: "communication",
    divisions: ["residential"],
    priority: 5,
  },
  {
    id: "rental-application-summary",
    name: "Rental App Summary",
    description: "Summarize tenant applications for landlords",
    icon: FileSearch,
    status: "live",
    category: "documents",
    divisions: ["residential"],
    priority: 6,
  },
  {
    id: "seller-net-sheet",
    name: "Seller Net Sheet Narrative",
    description: "Explain net proceeds to sellers in plain language",
    icon: DollarSign,
    status: "live",
    category: "documents",
    divisions: ["residential"],
    priority: 7,
  },
  {
    id: "buyer-offer-letter",
    name: "Buyer Offer Letter",
    description: "Compelling cover letters to accompany offers",
    icon: Heart,
    status: "live",
    category: "communication",
    divisions: ["residential"],
    priority: 8,
  },
  {
    id: "rental-listing",
    name: "Rental Listing",
    description: "Rental-specific listing copy for apartments",
    icon: Key,
    status: "live",
    category: "marketing",
    divisions: ["residential"],
    priority: 9,
  },
  {
    id: "tenant-welcome-letter",
    name: "Tenant Welcome Letter",
    description: "New tenant welcome package and move-in guide",
    icon: Home,
    status: "live",
    category: "communication",
    divisions: ["residential"],
    priority: 10,
  },
  {
    id: "lease-violation-notice",
    name: "Lease Violation Notice",
    description: "Draft professional violation notices for landlords",
    icon: Shield,
    status: "live",
    category: "documents",
    divisions: ["residential"],
    priority: 11,
  },
  {
    id: "showing-feedback-summary",
    name: "Showing Feedback Summary",
    description: "Compile and summarize showing feedback for sellers",
    icon: MessageSquare,
    status: "live",
    category: "documents",
    divisions: ["residential"],
    priority: 12,
  },
  {
    id: "price-reduction-memo",
    name: "Price Reduction Memo",
    description: "Justify price adjustments to sellers with market data",
    icon: TrendingUp,
    status: "live",
    category: "documents",
    divisions: ["residential"],
    priority: 13,
  },
  {
    id: "building-amenity-guide",
    name: "Building Amenity Guide",
    description: "Highlight building features and amenities",
    icon: Building,
    status: "live",
    category: "marketing",
    divisions: ["residential"],
    priority: 14,
  },
];

// ==========================================
// AI ANALYTICS GENERATORS
// ==========================================
const analyticsGenerators: GeneratorDefinition[] = [
  {
    id: "pipeline-health",
    name: "Pipeline Health Report",
    description: "AI analysis of your deal pipeline with recommendations",
    icon: BarChart3,
    status: "live",
    category: "analytics",
    divisions: "all",
    priority: 20,
  },
  {
    id: "lead-scoring",
    name: "Lead Scoring Tool",
    description: "AI-analyzed lead prioritization based on activity",
    icon: Target,
    status: "live",
    category: "analytics",
    divisions: "all",
    priority: 21,
  },
  {
    id: "commission-forecast",
    name: "Commission Forecast",
    description: "Projected earnings based on your current pipeline",
    icon: DollarSign,
    status: "live",
    category: "analytics",
    divisions: "all",
    priority: 22,
  },
  {
    id: "weekly-activity-digest",
    name: "Weekly Activity Digest",
    description: "AI-summarized weekly activity report",
    icon: Calendar,
    status: "live",
    category: "analytics",
    divisions: "all",
    priority: 23,
  },
  {
    id: "performance-insights",
    name: "Performance Insights",
    description: "AI coaching based on your metrics and activity",
    icon: Zap,
    status: "live",
    category: "analytics",
    divisions: "all",
    priority: 24,
  },
  {
    id: "deal-risk-assessment",
    name: "Deal Risk Assessment",
    description: "Identify at-risk deals with action recommendations",
    icon: AlertTriangle,
    status: "live",
    category: "analytics",
    divisions: "all",
    priority: 25,
  },
];

// ==========================================
// COMBINED REGISTRY
// ==========================================
export const generatorRegistry: GeneratorDefinition[] = [
  ...universalGenerators,
  ...investmentSalesGenerators,
  ...commercialLeasingGenerators,
  ...residentialGenerators,
  ...analyticsGenerators,
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

export function getShellGenerators(): GeneratorDefinition[] {
  return generatorRegistry.filter((g) => g.status === "shell");
}

export function getAllCategories(): GeneratorCategory[] {
  return ["documents", "communication", "marketing", "negotiations", "analytics", "crm"];
}

export function getCategoryLabel(category: GeneratorCategory): string {
  const labels: Record<GeneratorCategory, string> = {
    documents: "Documents",
    communication: "Communication",
    marketing: "Marketing",
    negotiations: "Negotiations",
    analytics: "Analytics",
    crm: "CRM",
  };
  return labels[category];
}
