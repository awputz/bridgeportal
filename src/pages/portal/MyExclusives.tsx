import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building2, Filter, ArrowLeft, ExternalLink, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExclusiveListingCard } from "@/components/portal/ExclusiveListingCard";
import {
  useAgentAllExclusives,
  useInvestmentListingDocuments,
  useCommercialListingDocuments,
  ExclusiveListing,
} from "@/hooks/useAgentExclusives";

const MyExclusives = () => {
  const [teamMemberId, setTeamMemberId] = useState<string | null>(null);
  const [isLoadingTeamMember, setIsLoadingTeamMember] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch current user's team member ID
  useEffect(() => {
    const fetchTeamMemberId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const { data: teamData } = await supabase
          .from("team_members")
          .select("id")
          .eq("email", user.email)
          .eq("is_active", true)
          .maybeSingle();
        
        setTeamMemberId(teamData?.id || null);
      }
      setIsLoadingTeamMember(false);
    };

    fetchTeamMemberId();
  }, []);

  const {
    data: allExclusives,
    investmentExclusives,
    commercialExclusives,
    isLoading: exclusivesLoading,
    investmentCount,
    commercialCount,
    totalCount,
  } = useAgentAllExclusives(teamMemberId || undefined);

  const isLoading = isLoadingTeamMember || exclusivesLoading;

  const getFilteredListings = (): ExclusiveListing[] => {
    switch (activeTab) {
      case "investment":
        return investmentExclusives;
      case "commercial":
        return commercialExclusives;
      default:
        return allExclusives;
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-6 w-64 mb-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!teamMemberId) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-2xl font-light text-foreground mb-2">
              No Team Profile Found
            </h2>
            <p className="text-muted-foreground mb-6">
              Your account is not linked to a team member profile. Contact admin to set up your profile.
            </p>
            <Link to="/portal/profile">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Link to="/portal/profile" className="hover:text-foreground transition-colors">
              Profile
            </Link>
            <span>/</span>
            <span className="text-foreground">My Exclusives</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extralight text-foreground mb-2">
                My Exclusives
              </h1>
              <p className="text-muted-foreground">
                Your assigned listings and document center
              </p>
            </div>
            <Link to="/portal/exclusives/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Submit Exclusive
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="glass-card border-white/10">
            <CardContent className="py-4 text-center">
              <p className="text-2xl md:text-3xl font-light text-foreground">{totalCount}</p>
              <p className="text-xs text-muted-foreground">Total Exclusives</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="py-4 text-center">
              <p className="text-2xl md:text-3xl font-light text-purple-400">{investmentCount}</p>
              <p className="text-xs text-muted-foreground">Investment Sales</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="py-4 text-center">
              <p className="text-2xl md:text-3xl font-light text-blue-400">{commercialCount}</p>
              <p className="text-xs text-muted-foreground">Commercial</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs & Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-white/5">
              <TabsTrigger value="all" className="data-[state=active]:bg-white/10">
                All ({totalCount})
              </TabsTrigger>
              <TabsTrigger value="investment" className="data-[state=active]:bg-white/10">
                Investment ({investmentCount})
              </TabsTrigger>
              <TabsTrigger value="commercial" className="data-[state=active]:bg-white/10">
                Commercial ({commercialCount})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content */}
          {["all", "investment", "commercial"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              {getFilteredListings().length === 0 ? (
                <div className="text-center py-16">
                  <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-light text-foreground mb-2">
                    No {tab === "all" ? "" : tab === "investment" ? "Investment " : "Commercial "}Exclusives
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Listings you're assigned to will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {getFilteredListings().map((listing) => (
                    <ExclusiveListingCardWithDocs
                      key={`${listing.division}-${listing.id}`}
                      listing={listing}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Residential Note */}
        <Card className="glass-card border-white/10 mt-8">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">Residential Listings</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Your residential exclusives are managed through StreetEasy. View and manage them on your StreetEasy agent profile.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://streeteasy.com/agent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Go to StreetEasy
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Wrapper component that fetches documents for each listing
const ExclusiveListingCardWithDocs = ({ listing }: { listing: ExclusiveListing }) => {
  const { data: investmentDocs, isLoading: investmentLoading } = useInvestmentListingDocuments(
    listing.division === "Investment Sales" ? listing.id : undefined
  );
  const { data: commercialDocs, isLoading: commercialLoading } = useCommercialListingDocuments(
    listing.division === "Commercial" ? listing.id : undefined
  );

  const documents = listing.division === "Investment Sales" 
    ? (investmentDocs || []) 
    : (commercialDocs || []);
  const isLoading = listing.division === "Investment Sales" ? investmentLoading : commercialLoading;

  return (
    <ExclusiveListingCard
      listing={listing}
      documents={documents}
      isLoadingDocuments={isLoading}
    />
  );
};

export default MyExclusives;
