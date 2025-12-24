import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Download, 
  FileText, 
  Building2, 
  Scale, 
  FileCheck, 
  Mail,
  Phone,
  ArrowLeft,
  Layers,
  Calendar,
  TrendingUp,
  DollarSign,
  MapPin,
  ClipboardList,
  FileSpreadsheet,
  Receipt,
  FileSearch,
  Landmark,
  ScrollText,
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle2,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOHelmet } from "@/components/SEOHelmet";
import { useInvestmentListing } from "@/hooks/useInvestmentListings";
import { useDealRoomDocuments, groupDocumentsByCategory } from "@/hooks/useDealRoomDocuments";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useDealRoomAccess, type RegistrationFormData, setStoredAccess } from "@/hooks/useDealRoomRegistration";
import { DealRoomRegistrationForm } from "@/components/DealRoomRegistrationForm";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import { toast } from "sonner";

// Document categories with icons and descriptions for investment sales deal rooms
const documentCategories = [
  {
    name: "Financials",
    icon: TrendingUp,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/20",
    documents: [
      { name: "Rent Roll", icon: FileSpreadsheet },
      { name: "Operating Statement (T12)", icon: Receipt },
      { name: "Pro Forma Analysis", icon: TrendingUp },
      { name: "Tax Returns (Last 3 Years)", icon: FileText },
      { name: "Historical Financials", icon: ClipboardList },
    ],
  },
  {
    name: "Due Diligence",
    icon: FileCheck,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/20",
    documents: [
      { name: "Building Survey", icon: FileSearch },
      { name: "Environmental Reports", icon: AlertTriangle },
      { name: "Property Condition Report", icon: ClipboardList },
      { name: "Title Report", icon: ScrollText },
      { name: "Certificate of Occupancy", icon: FileCheck },
      { name: "Zoning Analysis", icon: MapPin },
    ],
  },
  {
    name: "Legal",
    icon: Scale,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/20",
    documents: [
      { name: "Offering Memorandum", icon: FileText },
      { name: "Purchase Agreement Template", icon: ScrollText },
      { name: "Lease Abstracts", icon: ClipboardList },
      { name: "Regulatory Agreements", icon: Landmark },
      { name: "Existing Violations", icon: AlertTriangle },
    ],
  },
];

const formatPrice = (price: number | null) => {
  if (!price) return "Price Upon Request";
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  }
  return `$${price.toLocaleString()}`;
};

const formatNumber = (num: number | null) => {
  if (!num) return "—";
  return num.toLocaleString();
};

const DealRoom = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: listing, isLoading: listingLoading } = useInvestmentListing(listingId || "");
  const { data: documents = [] } = useDealRoomDocuments(listingId || "");
  const { data: teamMembers } = useTeamMembers();
  
  const {
    hasAccess,
    isCheckingRegistration,
    register,
    isRegistering,
  } = useDealRoomAccess(listingId || "");

  const groupedDocs = groupDocumentsByCategory(documents);
  const listingAgent = teamMembers?.find(m => m.id === listing?.listing_agent_id);

  // Check for existing access when component mounts
  useEffect(() => {
    if (hasAccess) {
      setIsAuthenticated(true);
    }
  }, [hasAccess]);

  const handleRegistration = async (formData: RegistrationFormData) => {
    try {
      await register(formData);
      setStoredAccess(listingId || "", formData.email);
      setIsAuthenticated(true);
      toast.success("Welcome! You now have access to the deal room.");
    } catch (error) {
      // Error is handled in the hook
    }
  };

  // Loading state
  if (listingLoading || isCheckingRegistration) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading deal room...</p>
        </div>
      </div>
    );
  }

  // Listing not found
  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Listing Not Found</h2>
          <p className="text-muted-foreground mb-8">
            This deal room does not exist or is no longer active. Please contact us if you believe this is an error.
          </p>
          <Button asChild size="lg">
            <Link to="/services/investment-sales/listings">View All Listings</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Registration Gate
  if (!isAuthenticated) {
    return (
      <>
        <SEOHelmet
          title={`Deal Room Access | ${listing.property_address}`}
          description="Register to access the secure deal room for this exclusive investment opportunity."
        />
        
        <div className="min-h-screen bg-background">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative max-w-6xl mx-auto px-6 pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-12 lg:pb-20">
            {/* Back link */}
            <Link 
              to="/services/investment-sales/listings" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Listings
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left: Property Preview */}
              <div className="space-y-8">
                {/* Property Image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted/10">
                  <img
                    src={listing.image_url || PLACEHOLDER_IMAGES.building.exterior}
                    alt={listing.property_address}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Badge className="mb-3 bg-primary/90 hover:bg-primary border-0">
                      {listing.asset_class}
                    </Badge>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                      {listing.property_address}
                    </h1>
                    <p className="text-white/80 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {[listing.neighborhood, listing.borough].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>

                {/* Property Highlights */}
                <div className="grid grid-cols-2 gap-4">
                  {listing.asking_price && (
                    <div className="bg-card/50 border border-border/50 rounded-xl p-5">
                      <DollarSign className="w-5 h-5 text-primary mb-2" />
                      <p className="text-xl font-bold text-foreground">{formatPrice(listing.asking_price)}</p>
                      <p className="text-sm text-muted-foreground">Asking Price</p>
                    </div>
                  )}
                  {listing.units && (
                    <div className="bg-card/50 border border-border/50 rounded-xl p-5">
                      <Layers className="w-5 h-5 text-primary mb-2" />
                      <p className="text-xl font-bold text-foreground">{listing.units}</p>
                      <p className="text-sm text-muted-foreground">Units</p>
                    </div>
                  )}
                  {listing.gross_sf && (
                    <div className="bg-card/50 border border-border/50 rounded-xl p-5">
                      <Building2 className="w-5 h-5 text-primary mb-2" />
                      <p className="text-xl font-bold text-foreground">{formatNumber(listing.gross_sf)}</p>
                      <p className="text-sm text-muted-foreground">Gross SF</p>
                    </div>
                  )}
                  {listing.cap_rate && (
                    <div className="bg-card/50 border border-border/50 rounded-xl p-5">
                      <TrendingUp className="w-5 h-5 text-primary mb-2" />
                      <p className="text-xl font-bold text-foreground">{listing.cap_rate.toFixed(2)}%</p>
                      <p className="text-sm text-muted-foreground">Cap Rate</p>
                    </div>
                  )}
                </div>

                {/* What's Included */}
                <div className="bg-card/30 border border-border/30 rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Deal Room Includes
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Comprehensive Financial Documents</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Due Diligence Reports & Surveys</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Legal Documentation & Templates</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Direct Access to Listing Team</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right: Registration Form */}
              <div className="lg:sticky lg:top-8">
                <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Request Access
                    </h2>
                    <p className="text-muted-foreground">
                      Complete the form below to access the deal room materials.
                    </p>
                  </div>

                  <DealRoomRegistrationForm
                    propertyAddress={listing.property_address}
                    onSubmit={handleRegistration}
                    isSubmitting={isRegistering}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // AUTHENTICATED DEAL ROOM CONTENT
  // ============================================
  return (
    <>
      <SEOHelmet
        title={`Deal Room | ${listing.property_address}`}
        description="Access due diligence documents and property information."
      />
      
      <main className="min-h-screen bg-background">
        {/* Hero Header */}
        <header className="relative border-b border-border/50">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={listing.image_url || PLACEHOLDER_IMAGES.building.exterior}
              alt=""
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-8 lg:pb-12">
            {/* Back link */}
            <Link 
              to="/services/investment-sales/listings" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Listings
            </Link>
            
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  {listing.asset_class}
                </Badge>
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground tracking-tight">
                  {listing.property_address}
                </h1>
                <p className="text-lg text-muted-foreground mt-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {[listing.neighborhood, listing.borough].filter(Boolean).join(", ")}
                </p>
              </div>

              {listing.om_url && (
                <Button size="lg" className="shrink-0 shadow-lg" asChild>
                  <a href={listing.om_url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-5 h-5 mr-2" />
                    Download Offering Memorandum
                  </a>
                </Button>
              )}
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
              {listing.asking_price && (
                <div className="bg-card/80 backdrop-blur border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-colors">
                  <DollarSign className="w-5 h-5 text-primary mb-3" />
                  <p className="text-2xl font-bold text-foreground">{formatPrice(listing.asking_price)}</p>
                  <p className="text-sm text-muted-foreground mt-1">Asking Price</p>
                </div>
              )}
              {listing.units && (
                <div className="bg-card/80 backdrop-blur border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-colors">
                  <Layers className="w-5 h-5 text-primary mb-3" />
                  <p className="text-2xl font-bold text-foreground">{listing.units}</p>
                  <p className="text-sm text-muted-foreground mt-1">Units</p>
                </div>
              )}
              {listing.gross_sf && (
                <div className="bg-card/80 backdrop-blur border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-colors">
                  <Building2 className="w-5 h-5 text-primary mb-3" />
                  <p className="text-2xl font-bold text-foreground">{formatNumber(listing.gross_sf)}</p>
                  <p className="text-sm text-muted-foreground mt-1">Gross SF</p>
                </div>
              )}
              {listing.cap_rate && (
                <div className="bg-card/80 backdrop-blur border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-colors">
                  <TrendingUp className="w-5 h-5 text-primary mb-3" />
                  <p className="text-2xl font-bold text-foreground">{listing.cap_rate.toFixed(2)}%</p>
                  <p className="text-sm text-muted-foreground mt-1">Cap Rate</p>
                </div>
              )}
              {listing.year_built && (
                <div className="bg-card/80 backdrop-blur border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-colors">
                  <Calendar className="w-5 h-5 text-primary mb-3" />
                  <p className="text-2xl font-bold text-foreground">{listing.year_built}</p>
                  <p className="text-sm text-muted-foreground mt-1">Year Built</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Property Description */}
        {listing.description && (
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="bg-card/50 border border-border/50 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-primary" />
                Property Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>
          </section>
        )}

        {/* Document Repository */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Document Repository</h2>
              <p className="text-muted-foreground mt-1">
                Access all due diligence materials for this property
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {documentCategories.map((category) => {
              const docs = groupedDocs[category.name] || [];
              const Icon = category.icon;

              return (
                <div 
                  key={category.name}
                  className={`bg-card border ${category.borderColor} rounded-2xl overflow-hidden`}
                >
                  {/* Category Header */}
                  <div className={`${category.bgColor} px-6 py-5 border-b ${category.borderColor}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center ${category.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{category.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {docs.length} document{docs.length !== 1 ? "s" : ""} available
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Documents List */}
                  <div className="p-4 space-y-2">
                    {category.documents.map((docTemplate) => {
                      // Find matching uploaded document
                      const uploadedDoc = docs.find(
                        (d) => d.document_name.toLowerCase().includes(docTemplate.name.toLowerCase().split(" ")[0].toLowerCase())
                      );
                      const DocIcon = docTemplate.icon;

                      return (
                        <div 
                          key={docTemplate.name}
                          className="flex items-center justify-between p-4 bg-background/50 border border-border/30 rounded-xl hover:bg-background/80 hover:border-border/50 transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <DocIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-foreground truncate">
                              {uploadedDoc?.document_name || docTemplate.name}
                            </span>
                          </div>
                          {uploadedDoc?.document_url ? (
                            <Button size="sm" variant="ghost" className="shrink-0 opacity-70 group-hover:opacity-100" asChild>
                              <a href={uploadedDoc.document_url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4" />
                              </a>
                            </Button>
                          ) : (
                            <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground shrink-0">
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Property Photos (if available) */}
        {listing.image_url && (
          <section className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-primary" />
              Property Photos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted/10">
                <img
                  src={listing.image_url}
                  alt={listing.property_address}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </section>
        )}

        {/* Listing Team */}
        <section className="max-w-7xl mx-auto px-6 py-12 pb-24">
          <div className="bg-card border border-border/50 rounded-2xl p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-foreground mb-8">Listing Team</h2>
            
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
              {listingAgent ? (
                <div className="flex items-center gap-5">
                  <img 
                    src={listingAgent.image_url || PLACEHOLDER_IMAGES.team.professional1}
                    alt={listingAgent.name || "Agent"}
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{listingAgent.name}</h3>
                    <p className="text-muted-foreground">{listingAgent.title}</p>
                    <div className="flex items-center gap-4 mt-3">
                      {listingAgent.email && (
                        <a 
                          href={`mailto:${listingAgent.email}`}
                          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </a>
                      )}
                      {listingAgent.phone && (
                        <a 
                          href={`tel:${listingAgent.phone}`}
                          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Bridge Investment Sales Team</h3>
                    <p className="text-muted-foreground">Investment Sales Division</p>
                    <div className="flex items-center gap-4 mt-3">
                      <a 
                        href="mailto:sales@bridge.nyc"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        sales@bridge.nyc
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="lg:ml-auto flex flex-col sm:flex-row gap-4">
                <Button variant="outline" size="lg" asChild>
                  <a href="tel:+12125319295">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                </Button>
                <Button size="lg" asChild>
                  <Link to="/contact">Schedule a Meeting</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default DealRoom;
