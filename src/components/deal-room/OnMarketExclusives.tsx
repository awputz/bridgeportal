import { useState, useMemo } from "react";
import { Building2, Store, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useInvestmentListings } from "@/hooks/useInvestmentListings";
import { useCommercialListings } from "@/hooks/useCommercialListings";
import { OnMarketListingCard } from "./OnMarketListingCard";
import { EmptyState } from "@/components/ui/EmptyState";

type DivisionFilter = "all" | "investment-sales" | "commercial";

export function OnMarketExclusives() {
  const [divisionFilter, setDivisionFilter] = useState<DivisionFilter>("all");
  const [openBoroughs, setOpenBoroughs] = useState<Record<string, boolean>>({});

  const { data: investmentListings, isLoading: loadingInvestment } = useInvestmentListings();
  const { data: commercialListings, isLoading: loadingCommercial } = useCommercialListings();

  const isLoading = loadingInvestment || loadingCommercial;

  // Combine and filter listings
  const allListings = useMemo(() => {
    const investment = (investmentListings || []).map((l) => ({
      ...l,
      division: "investment-sales" as const,
    }));
    const commercial = (commercialListings || []).map((l) => ({
      ...l,
      division: "commercial" as const,
    }));

    let combined = [...investment, ...commercial];

    if (divisionFilter !== "all") {
      combined = combined.filter((l) => l.division === divisionFilter);
    }

    return combined;
  }, [investmentListings, commercialListings, divisionFilter]);

  // Group by borough
  const groupedByBorough = useMemo(() => {
    const groups: Record<string, typeof allListings> = {};

    allListings.forEach((listing) => {
      const borough = listing.borough || "Other";
      if (!groups[borough]) {
        groups[borough] = [];
      }
      groups[borough].push(listing);
    });

    // Sort boroughs alphabetically, but put "Other" last
    return Object.entries(groups).sort(([a], [b]) => {
      if (a === "Other") return 1;
      if (b === "Other") return -1;
      return a.localeCompare(b);
    });
  }, [allListings]);

  const toggleBorough = (borough: string) => {
    setOpenBoroughs((prev) => ({
      ...prev,
      [borough]: prev[borough] === undefined ? false : !prev[borough],
    }));
  };

  const isBoroughOpen = (borough: string) => {
    return openBoroughs[borough] !== false; // Default to open
  };

  const investmentCount = investmentListings?.length || 0;
  const commercialCount = commercialListings?.length || 0;
  const totalCount = investmentCount + commercialCount;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-9 w-32 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border bg-card">
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Division Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setDivisionFilter("all")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            divisionFilter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          All
          <Badge variant="secondary" className="ml-1 bg-background/20">
            {totalCount}
          </Badge>
        </button>
        <button
          onClick={() => setDivisionFilter("investment-sales")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            divisionFilter === "investment-sales"
              ? "bg-purple-500 text-white"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          }`}
        >
          <Building2 className="h-4 w-4" />
          Investment Sales
          <Badge variant="secondary" className="ml-1 bg-background/20">
            {investmentCount}
          </Badge>
        </button>
        <button
          onClick={() => setDivisionFilter("commercial")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            divisionFilter === "commercial"
              ? "bg-blue-500 text-white"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          }`}
        >
          <Store className="h-4 w-4" />
          Commercial
          <Badge variant="secondary" className="ml-1 bg-background/20">
            {commercialCount}
          </Badge>
        </button>
      </div>

      {/* Listings by Borough */}
      {allListings.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No on-market listings"
          description="There are currently no active exclusives in this category"
        />
      ) : (
        <div className="space-y-4">
          {groupedByBorough.map(([borough, listings]) => (
            <Collapsible
              key={borough}
              open={isBoroughOpen(borough)}
              onOpenChange={() => toggleBorough(borough)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{borough}</span>
                  <Badge variant="secondary" className="text-xs">
                    {listings.length}
                  </Badge>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    isBoroughOpen(borough) ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {listings.map((listing) => (
                    <OnMarketListingCard
                      key={listing.id}
                      listing={listing}
                      division={listing.division}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
}
