import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Briefcase,
  Info,
  Building2,
  Home,
  Store,
  Users,
  BarChart3,
  List,
  Layers,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { useCRMDeals, useDealStages, useUpdateDeal, useDeleteDeal } from "@/hooks/useCRM";
import { useCRMRealtime } from "@/hooks/useCRMRealtime";
import { useDivision, Division } from "@/contexts/DivisionContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CRMTable } from "@/components/portal/CRMTable";
import { CRMGroupedView } from "@/components/portal/CRMGroupedView";
import { DealFiltersPanel, DealFilters } from "@/components/portal/DealFiltersPanel";
import { BulkActionsBar } from "@/components/portal/BulkActionsBar";
import { PipelineAnalytics } from "@/components/portal/PipelineAnalytics";
import { CRMTasksPanel } from "@/components/portal/CRMTasksPanel";
import { SectionErrorBoundary } from "@/components/portal/SectionErrorBoundary";
import { DIVISION_DISPLAY_NAMES } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Division configurations for CRM
const divisionTabs = [
  { 
    key: "investment-sales" as Division, 
    label: "Investment Sales", 
    icon: Building2,
    description: "Track multifamily, mixed-use, and commercial sales"
  },
  { 
    key: "commercial-leasing" as Division, 
    label: "Commercial Leasing", 
    icon: Store,
    description: "Manage office, retail, and specialty leases"
  },
  { 
    key: "residential" as Division, 
    label: "Residential", 
    icon: Home,
    description: "Track residential sales and rentals"
  },
];

type ViewMode = "table" | "grouped";

const divisionIcons: Record<Division, typeof TrendingUp> = {
  "investment-sales": TrendingUp,
  "commercial-leasing": Building2,
  "residential": Home,
};

const CRM = () => {
  const { division, setDivision, divisionConfig, isAdmin, isLoading: divisionLoading, hasDivisionAssigned } = useDivision();
  const [deleteDealId, setDeleteDealId] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedDeals, setSelectedDeals] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<DealFilters>({
    search: "",
    stageIds: [],
    priority: [],
    dealTypes: [],
    propertyTypes: [],
    minValue: null,
    maxValue: null,
    expectedCloseStart: null,
    expectedCloseEnd: null,
    minCapRate: null,
    maxCapRate: null,
  });

  const { data: deals, isLoading: dealsLoading } = useCRMDeals(division);
  const { data: stages, isLoading: stagesLoading } = useDealStages(division);
  const updateDeal = useUpdateDeal();
  const deleteDeal = useDeleteDeal();

  // Subscribe to real-time CRM updates
  useCRMRealtime(division);

  const isLoading = dealsLoading || stagesLoading;

  // Filter deals based on active filters
  const filteredDeals = useMemo(() => {
    if (!deals) return [];
    
    return deals.filter(deal => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          deal.property_address.toLowerCase().includes(searchLower) ||
          deal.contact?.full_name?.toLowerCase().includes(searchLower) ||
          deal.notes?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Stage filter
      if (filters.stageIds.length > 0 && deal.stage_id) {
        if (!filters.stageIds.includes(deal.stage_id)) return false;
      }

      // Priority filter
      if (filters.priority.length > 0) {
        if (!filters.priority.includes(deal.priority || '')) return false;
      }

      // Deal type filter
      if (filters.dealTypes.length > 0) {
        if (!filters.dealTypes.includes(deal.deal_type)) return false;
      }

      // Property type filter
      if (filters.propertyTypes.length > 0 && deal.property_type) {
        if (!filters.propertyTypes.includes(deal.property_type)) return false;
      }

      // Value range filter
      if (filters.minValue !== undefined && deal.value !== null) {
        if (deal.value < filters.minValue) return false;
      }
      if (filters.maxValue !== undefined && deal.value !== null) {
        if (deal.value > filters.maxValue) return false;
      }

      // Expected close date filter
      if (filters.expectedCloseStart && deal.expected_close) {
        if (new Date(deal.expected_close) < new Date(filters.expectedCloseStart)) return false;
      }
      if (filters.expectedCloseEnd && deal.expected_close) {
        if (new Date(deal.expected_close) > new Date(filters.expectedCloseEnd)) return false;
      }

      // Cap rate filter (investment sales only)
      if (division === "investment-sales" && deal.cap_rate !== null) {
        if (filters.minCapRate !== undefined && deal.cap_rate < filters.minCapRate) return false;
        if (filters.maxCapRate !== undefined && deal.cap_rate > filters.maxCapRate) return false;
      }

      return true;
    });
  }, [deals, filters, division]);

  const handleStageChange = (dealId: string, newStageId: string) => {
    updateDeal.mutate({ id: dealId, stage_id: newStageId });
  };

  const handleDeleteDeal = (dealId: string) => {
    setDeleteDealId(dealId);
  };

  const confirmDeleteDeal = () => {
    if (deleteDealId) {
      deleteDeal.mutate(deleteDealId);
      setDeleteDealId(null);
    }
  };

  const handleDivisionChange = (newDivision: Division) => {
    setDivision(newDivision);
    setSelectedDeals(new Set());
    setFilters({
      search: "",
      stageIds: [],
      priority: [],
      dealTypes: [],
      propertyTypes: [],
      minValue: null,
      maxValue: null,
      expectedCloseStart: null,
      expectedCloseEnd: null,
      minCapRate: null,
      maxCapRate: null,
    });
  };

  const handleSelectAll = () => {
    const allIds = new Set(filteredDeals.map(d => d.id));
    setSelectedDeals(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedDeals(new Set());
  };

  const handleSelectionChange = (dealId: string, selected: boolean) => {
    const newSelection = new Set(selectedDeals);
    if (selected) {
      newSelection.add(dealId);
    } else {
      newSelection.delete(dealId);
    }
    setSelectedDeals(newSelection);
  };

  const handleBulkStageChange = (stageId: string) => {
    const promises = Array.from(selectedDeals).map(dealId => 
      updateDeal.mutateAsync({ id: dealId, stage_id: stageId })
    );
    Promise.all(promises).then(() => {
      toast.success(`Updated ${selectedDeals.size} deals`);
      setSelectedDeals(new Set());
    });
  };

  const handleBulkDelete = () => {
    const promises = Array.from(selectedDeals).map(dealId => 
      deleteDeal.mutateAsync(dealId)
    );
    Promise.all(promises).then(() => {
      toast.success(`Deleted ${selectedDeals.size} deals`);
      setSelectedDeals(new Set());
    });
  };

  const handleBulkExport = () => {
    const selectedDealData = filteredDeals.filter(d => selectedDeals.has(d.id));
    const csv = [
      ["Property Address", "Contact", "Stage", "Value", "Expected Close", "Priority"].join(","),
      ...selectedDealData.map(d => [
        `"${d.property_address}"`,
        `"${d.contact?.full_name || ''}"`,
        `"${stages?.find(s => s.id === d.stage_id)?.name || ''}"`,
        d.value || '',
        d.expected_close || '',
        d.priority
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deals-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Deals exported");
  };

  const currentDivisionTab = divisionTabs.find(d => d.key === division) || divisionTabs[0];
  const CurrentDivisionIcon = divisionIcons[division];

  // Show error state for agents without division assignment
  if (!isAdmin && !hasDivisionAssigned && !divisionLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto page-content">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center glass-card p-8">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Division Assigned</h2>
            <p className="text-muted-foreground max-w-md">
              Your account hasn't been assigned to a division yet. 
              Please contact your administrator to get access to CRM features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto page-content">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 section-gap">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-1 md:mb-2">
              Deal Pipeline
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-light">
              Track your deals from lead to close
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                className="rounded-none h-9 px-3"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grouped" ? "default" : "ghost"}
                size="sm"
                className="rounded-none h-9 px-3"
                onClick={() => setViewMode("grouped")}
              >
                <Layers className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant={showAnalytics ? "default" : "outline"} 
              size="sm"
              className="gap-2"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
            <Link to="/portal/contacts">
              <Button variant="outline" size="sm" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Contacts</span>
              </Button>
            </Link>
            <Link to="/portal/crm/deals/new">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Deal</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Division Switcher - Admin Only OR Static Label for Agents */}
        <div className="section-gap">
          {isAdmin ? (
            <>
              <div className="filter-scroll">
                {divisionTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = division === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => handleDivisionChange(tab.key)}
                      className={cn(
                        "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm font-light transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0 touch-target",
                        isActive 
                          ? "bg-foreground text-background" 
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/10"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-1 hidden sm:block">
                {currentDivisionTab.description}
              </p>
            </>
          ) : (
            <div 
              className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10 w-fit"
              style={{ borderColor: `${divisionConfig.color}40` }}
            >
              <div 
                className="p-2 rounded-lg" 
                style={{ backgroundColor: `${divisionConfig.color}20` }}
              >
                <CurrentDivisionIcon className="h-5 w-5" style={{ color: divisionConfig.color }} />
              </div>
              <div>
                <span className="text-foreground font-medium">{divisionConfig.name}</span>
                <p className="text-xs text-muted-foreground">Your assigned division</p>
              </div>
            </div>
          )}
        </div>

        {/* Analytics Panel */}
        {showAnalytics && stages && filteredDeals && (
          <div className="section-gap">
            <PipelineAnalytics 
              deals={filteredDeals} 
              stages={stages} 
              division={division} 
            />
          </div>
        )}

        {/* Tasks Panel */}
        <div className="section-gap">
          <CRMTasksPanel division={division} />
        </div>

        {/* Filters */}
        {stages && (
          <DealFiltersPanel
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters({
              search: "",
              stageIds: [],
              priority: [],
              dealTypes: [],
              propertyTypes: [],
              minValue: null,
              maxValue: null,
              expectedCloseStart: null,
              expectedCloseEnd: null,
              minCapRate: null,
              maxCapRate: null,
            })}
            stages={stages}
            division={division}
          />
        )}

        {/* Bulk Actions Bar */}
        {selectedDeals.size > 0 && stages && (
          <BulkActionsBar
            selectedCount={selectedDeals.size}
            totalCount={filteredDeals.length}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onBulkStageChange={handleBulkStageChange}
            onBulkDelete={handleBulkDelete}
            onExport={handleBulkExport}
            stages={stages}
            isAllSelected={selectedDeals.size === filteredDeals.length}
          />
        )}

        {/* Contextual Instructions */}
        <div className="glass-card p-4 section-gap flex items-start gap-3 border-white/10">
          <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground font-light">
            <strong className="text-foreground font-normal">How to use:</strong> Track your active {DIVISION_DISPLAY_NAMES[division as keyof typeof DIVISION_DISPLAY_NAMES] || division} deals here. 
            Change deal status using the dropdown in the Status column. 
            <Link to="/portal/contacts" className="text-foreground hover:underline ml-1">
              Manage your contacts →
            </Link>
          </div>
        </div>

          {/* Pipeline View */}
          <div className="list-gap-md">
          <SectionErrorBoundary sectionName="Deal Pipeline">
            {isLoading ? (
              <Skeleton className="h-96 w-full rounded-xl" />
            ) : stages && filteredDeals && filteredDeals.length > 0 ? (
              viewMode === "grouped" ? (
                <CRMGroupedView
                  deals={filteredDeals}
                  stages={stages}
                  onStageChange={handleStageChange}
                  onDeleteDeal={handleDeleteDeal}
                  division={division}
                />
              ) : (
                <CRMTable
                  deals={filteredDeals}
                  stages={stages}
                  onStageChange={handleStageChange}
                  onDeleteDeal={handleDeleteDeal}
                  division={division}
                  selectedDeals={selectedDeals}
                  onSelectionChange={handleSelectionChange}
                />
              )
            ) : (
            <div className="text-center py-16 glass-card">
              <Briefcase className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-light text-foreground mb-2">
                {deals && deals.length > 0 ? "No deals match your filters" : "No deals in your pipeline"}
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                {deals && deals.length > 0 
                  ? "Try adjusting your filters to see more deals."
                  : `Create your first ${DIVISION_DISPLAY_NAMES[division as keyof typeof DIVISION_DISPLAY_NAMES] || division} deal to start tracking from lead to close.`
                }
              </p>
              <div className="flex items-center justify-center gap-3">
                {deals && deals.length > 0 ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({
                      search: "",
                      stageIds: [],
                      priority: [],
                      dealTypes: [],
                      propertyTypes: [],
                      minValue: null,
                      maxValue: null,
                      expectedCloseStart: null,
                      expectedCloseEnd: null,
                      minCapRate: null,
                      maxCapRate: null,
                    })}
                  >
                    Clear All Filters
                  </Button>
                ) : (
                  <Link to="/portal/crm/deals/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Deal
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
          </SectionErrorBoundary>
        </div>
      </div>

      {/* Delete Deal Confirmation */}
      <AlertDialog open={!!deleteDealId} onOpenChange={() => setDeleteDealId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Deal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this deal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDeal} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CRM;