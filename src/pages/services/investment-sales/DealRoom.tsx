import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Download, 
  Lock, 
  FileText, 
  Building2, 
  Scale, 
  FileCheck, 
  AlertCircle,
  Mail,
  Phone,
  ArrowLeft,
  Layers,
  Calendar,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SEOHelmet } from "@/components/SEOHelmet";
import { useInvestmentListing } from "@/hooks/useInvestmentListings";
import { useDealRoomDocuments, groupDocumentsByCategory } from "@/hooks/useDealRoomDocuments";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";

const categoryConfig: Record<string, { icon: React.ElementType; color: string }> = {
  Financials: { icon: TrendingUp, color: "text-emerald-400" },
  "Due Diligence": { icon: FileCheck, color: "text-blue-400" },
  Legal: { icon: Scale, color: "text-amber-400" },
};

const formatPrice = (price: number | null) => {
  if (!price) return "Price Upon Request";
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  }
  return `$${price.toLocaleString()}`;
};

const DealRoom = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const { data: listing, isLoading: listingLoading } = useInvestmentListing(listingId || "");
  const { data: documents = [] } = useDealRoomDocuments(listingId || "");
  const { data: teamMembers } = useTeamMembers();

  const groupedDocs = groupDocumentsByCategory(documents);
  const listingAgent = teamMembers?.find(m => m.id === listing?.listing_agent_id);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (listing && password === listing.deal_room_password) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please contact us for access credentials.");
    }
  };

  if (listingLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">Listing Not Found</h2>
          <p className="text-muted-foreground mb-6">This deal room does not exist or is no longer active.</p>
          <Button asChild>
            <Link to="/services/investment-sales/listings">View All Listings</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Password Gate
  if (!isAuthenticated) {
    return (
      <>
        <SEOHelmet
          title={`Deal Room | ${listing.property_address}`}
          description="Access the secure deal room for this investment opportunity."
        />
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          
          <div className="relative w-full max-w-md">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                  Secure Deal Room
                </Badge>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {listing.property_address}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {[listing.neighborhood, listing.borough].filter(Boolean).join(", ")}
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="Enter access password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-center text-lg tracking-widest"
                  />
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg">
                  <Lock className="w-4 h-4 mr-2" />
                  Access Deal Room
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-6">
                Don't have access? <Link to="/contact" className="text-primary hover:underline">Contact us</Link> for credentials.
              </p>
            </div>

            <div className="text-center mt-6">
              <Link 
                to="/services/investment-sales/listings" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Listings
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Authenticated Deal Room Content
  return (
    <>
      <SEOHelmet
        title={`Deal Room | ${listing.property_address}`}
        description="Access due diligence documents and property information."
      />
      
      <main className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-white/10 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <Link 
              to="/services/investment-sales/listings" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Listings
            </Link>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <Badge variant="outline" className="mb-3 border-primary/30 text-primary">
                  {listing.asset_class}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {listing.property_address}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {[listing.neighborhood, listing.borough].filter(Boolean).join(", ")}
                </p>
              </div>

              {listing.om_url && (
                <Button size="lg" asChild className="shrink-0">
                  <a href={listing.om_url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download Offering Memorandum
                  </a>
                </Button>
              )}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {listing.units && (
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <Layers className="w-5 h-5 text-primary mb-2" />
                  <p className="text-2xl font-bold text-foreground">{listing.units}</p>
                  <p className="text-sm text-muted-foreground">Units</p>
                </div>
              )}
              {listing.gross_sf && (
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <Building2 className="w-5 h-5 text-primary mb-2" />
                  <p className="text-2xl font-bold text-foreground">{listing.gross_sf.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Gross SF</p>
                </div>
              )}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                <TrendingUp className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-bold text-foreground">{formatPrice(listing.asking_price)}</p>
                <p className="text-sm text-muted-foreground">Asking Price</p>
              </div>
              {listing.cap_rate && (
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <TrendingUp className="w-5 h-5 text-primary mb-2" />
                  <p className="text-2xl font-bold text-foreground">{listing.cap_rate.toFixed(2)}%</p>
                  <p className="text-sm text-muted-foreground">Cap Rate</p>
                </div>
              )}
              {listing.year_built && (
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <Calendar className="w-5 h-5 text-primary mb-2" />
                  <p className="text-2xl font-bold text-foreground">{listing.year_built}</p>
                  <p className="text-sm text-muted-foreground">Year Built</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Document Repository */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-foreground mb-8">Document Repository</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Financials", "Due Diligence", "Legal"].map((category) => {
              const config = categoryConfig[category] || { icon: FileText, color: "text-primary" };
              const Icon = config.icon;
              const docs = groupedDocs[category] || [];

              return (
                <div 
                  key={category}
                  className="bg-white/[0.02] border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{category}</h3>
                  </div>

                  <div className="space-y-3">
                    {docs.length > 0 ? (
                      docs.map((doc) => (
                        <div 
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{doc.document_name}</span>
                          </div>
                          {doc.document_url ? (
                            <Button size="sm" variant="ghost" asChild>
                              <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4" />
                              </a>
                            </Button>
                          ) : (
                            <Badge variant="outline" className="text-xs border-white/20">
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        No documents available
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Listing Team */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Listing Team</h2>
            
            <div className="flex flex-col md:flex-row gap-8">
              {listingAgent ? (
                <div className="flex items-center gap-4">
                  <img 
                    src={listingAgent.image_url || PLACEHOLDER_IMAGES.team.professional1}
                    alt={listingAgent.name || "Agent"}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">{listingAgent.name}</h3>
                    <p className="text-sm text-muted-foreground">{listingAgent.title}</p>
                    <div className="flex items-center gap-4 mt-2">
                      {listingAgent.email && (
                        <a 
                          href={`mailto:${listingAgent.email}`}
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          Email
                        </a>
                      )}
                      {listingAgent.phone && (
                        <a 
                          href={`tel:${listingAgent.phone}`}
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Bridge Investment Sales Team</h3>
                    <p className="text-sm text-muted-foreground">Investment Sales Division</p>
                    <div className="flex items-center gap-4 mt-2">
                      <a 
                        href="mailto:sales@bridge.nyc"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        sales@bridge.nyc
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="md:ml-auto">
                <Button size="lg" asChild>
                  <Link to="/contact">Schedule a Call</Link>
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
