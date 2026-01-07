import { useState, useMemo } from "react";
import { Building2, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDealRoomDeals, useDealRoomStats, useMyDealRoomDeals, DealRoomFilters } from "@/hooks/useDealRoom";
import { useDealRoomRealtime } from "@/hooks/useDealRoomRealtime";
import { DealRoomFiltersComponent } from "@/components/deal-room/DealRoomFilters";
import { DealRoomList } from "@/components/deal-room/DealRoomList";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShareDealDialog } from "@/components/deal-room/ShareDealDialog";
import { DealDetailModal } from "@/components/deal-room/DealDetailModal";
import { MySharedDeals } from "@/components/deal-room/MySharedDeals";

export default function DealRoom() {
  const [filters, setFilters] = useState<DealRoomFilters>({});
  const [sortBy, setSortBy] = useState<"recent" | "value" | "comments">("recent");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");

  // Enable real-time updates
  useDealRoomRealtime();

  const { data: deals, isLoading } = useDealRoomDeals(filters);
  const { data: myDeals } = useMyDealRoomDeals();
  const { data: stats } = useDealRoomStats();

  // Sort deals based on selected option
  const sortedDeals = useMemo(() => {
    if (!deals) return [];
    const sorted = [...deals];
    switch (sortBy) {
      case "value":
        return sorted.sort((a, b) => (b.value || 0) - (a.value || 0));
      case "comments":
        // For now, sort by last update as proxy for activity
        return sorted.sort((a, b) => 
          new Date(b.last_deal_room_update || b.updated_at).getTime() - 
          new Date(a.last_deal_room_update || a.updated_at).getTime()
        );
      case "recent":
      default:
        return sorted.sort((a, b) => 
          new Date(b.last_deal_room_update || b.created_at).getTime() - 
          new Date(a.last_deal_room_update || a.created_at).getTime()
        );
    }
  }, [deals, sortBy]);

  const handleClearFilters = () => {
    setFilters({});
    setSortBy("recent");
  };

  const handleDealClick = (dealId: string) => {
    setSelectedDealId(dealId);
  };

  const myDealsCount = myDeals?.length || 0;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto page-content">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-1 md:mb-2">
              Agent Deal Room
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-light">
              Weekly team off-market deals & opportunities
            </p>
          </div>
        <div className="flex items-center gap-3">
          {stats && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>{stats.total} deals</span>
              {stats.newThisWeek > 0 && (
                <span className="text-xs opacity-70">
                  (+{stats.newThisWeek} this week)
                </span>
              )}
            </div>
          )}
          <Button size="sm" className="gap-2" onClick={() => setShareDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Share Deal</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "my")}>
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            All Deals
            {stats && <span className="text-xs opacity-70">({stats.total})</span>}
          </TabsTrigger>
          <TabsTrigger value="my" className="gap-2">
            My Deals
            {myDealsCount > 0 && <span className="text-xs opacity-70">({myDealsCount})</span>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-6">
          {/* Filters */}
          <DealRoomFiltersComponent
            filters={filters}
            sortBy={sortBy}
            onFiltersChange={setFilters}
            onSortChange={setSortBy}
            onClear={handleClearFilters}
            dealCount={sortedDeals.length}
          />

          {/* Content */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border bg-card p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedDeals.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No deals in the room yet"
              description={
                filters.search || filters.division || filters.propertyType
                  ? "Try adjusting your filters to see more deals"
                  : "Be the first to share an off-market opportunity with the team"
              }
              actionLabel={!filters.search && !filters.division && !filters.propertyType ? "Share Your First Deal" : undefined}
              onAction={!filters.search && !filters.division && !filters.propertyType ? () => setShareDialogOpen(true) : undefined}
            />
          ) : (
            <DealRoomList deals={sortedDeals} onDealClick={handleDealClick} />
          )}
        </TabsContent>

        <TabsContent value="my" className="mt-6">
          <MySharedDeals
            onDealClick={handleDealClick}
            onShareClick={() => setShareDialogOpen(true)}
          />
        </TabsContent>
      </Tabs>

        <ShareDealDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} />
        
        <DealDetailModal
          dealId={selectedDealId}
          open={!!selectedDealId}
          onOpenChange={(open) => !open && setSelectedDealId(null)}
        />
      </div>
    </div>
  );
}
