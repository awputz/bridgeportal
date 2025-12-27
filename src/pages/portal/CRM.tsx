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
  Filter,
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
import { DealFiltersPanel, DealFilters } from "@/components/portal/DealFiltersPanel";
import { BulkActionsBar } from "@/components/portal/BulkActionsBar";
import { PipelineAnalytics } from "@/components/portal/PipelineAnalytics";
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

const CRM = () => {
  const { division, setDivision } = useDivision();
  const [deleteDealId, setDeleteDealId] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedDeals, setSelectedDeals] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<DealFilters>({
    search: "",
    stages: [],
    priorities: [],
    dealTypes: [],
    propertyTypes: [],
    minValue: undefined,
    maxValue: undefined,
    expectedCloseStart: undefined,
    expectedCloseEnd: undefined,
    minCapRate: undefined,
    maxCapRate: undefined,
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
      if (filters.stages.length > 0 && deal.stage_id) {
        if (!filters.stages.includes(deal.stage_id)) return false;
      }

      // Priority filter
      if (filters.priorities.length > 0) {
        if (!filters.priorities.includes(deal.priority)) return false;
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
      stages: [],
      priorities: [],
      dealTypes: [],
      propertyTypes: [],
      minValue: undefined,
      maxValue: undefined,
      expectedCloseStart: undefined,
      expectedCloseEnd: undefined,
      minCapRate: undefined,
      maxCapRate: undefined,
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

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
              Deal Pipeline
            </h1>
            <p className="text-muted-foreground font-light">
              Track your deals from lead to close
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant={showAnalytics ? "default" : "outline"} 
              className="gap-2"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Link to="/portal/contacts">
              <Button variant="outline" className="gap-2">
                <Users className="h-4 w-4" />
                Contacts
              </Button>
            </Link>
            <Link to="/portal/crm/deals/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Deal
              </Button>
            </Link>
          </div>
        </div>

        {/* Division Switcher */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {divisionTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = division === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleDivisionChange(tab.key)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-light transition-all duration-200 cursor-pointer",
                    isActive 
                      ? "bg-foreground text-background" 
                      : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/10"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2 ml-1">
            {currentDivisionTab.description}
          </p>
        </div>

        {/* Analytics Panel */}
        {showAnalytics && stages && filteredDeals && (
          <div className="mb-6">
            <PipelineAnalytics 
              deals={filteredDeals} 
              stages={stages} 
              division={division} 
            />
          </div>
        )}

        {/* Filters */}
        {stages && (
          <DealFiltersPanel
            filters={filters}
            onChange={setFilters}
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
            onBulkExport={handleBulkExport}
            stages={stages}
            allSelected={selectedDeals.size === filteredDeals.length}
          />
        )}

        {/* Contextual Instructions */}
        <div className="glass-card p-4 mb-6 flex items-start gap-3 border-white/10">
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
        <div className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-96 w-full rounded-xl" />
          ) : stages && filteredDeals && filteredDeals.length > 0 ? (
            <CRMTable
              deals={filteredDeals}
              stages={stages}
              onStageChange={handleStageChange}
              onDeleteDeal={handleDeleteDeal}
              division={division}
              selectedDeals={selectedDeals}
              onSelectionChange={handleSelectionChange}
            />
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
              {(!deals || deals.length === 0) && (
                <Link to="/portal/crm/deals/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Deal
                  </Button>
                </Link>
              )}
            </div>
          )}
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