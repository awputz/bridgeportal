import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Briefcase,
  Info,
  Building2,
  Home,
  Store,
  Users
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
import { DIVISION_DISPLAY_NAMES } from "@/lib/formatters";
import { cn } from "@/lib/utils";

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

  const { data: deals, isLoading: dealsLoading } = useCRMDeals(division);
  const { data: stages, isLoading: stagesLoading } = useDealStages(division);
  const updateDeal = useUpdateDeal();
  const deleteDeal = useDeleteDeal();

  // Subscribe to real-time CRM updates
  useCRMRealtime(division);

  const isLoading = dealsLoading || stagesLoading;

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
            <Link to="/portal/contacts">
              <Button variant="outline" className="gap-2">
                <Users className="h-4 w-4" />
                Manage Contacts
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
          ) : stages && deals && deals.length > 0 ? (
            <CRMTable
              deals={deals}
              stages={stages}
              onStageChange={handleStageChange}
              onDeleteDeal={handleDeleteDeal}
              division={division}
            />
          ) : (
            <div className="text-center py-16 glass-card">
              <Briefcase className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-light text-foreground mb-2">No deals in your pipeline</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Create your first {DIVISION_DISPLAY_NAMES[division as keyof typeof DIVISION_DISPLAY_NAMES] || division} deal to start tracking from lead to close.
              </p>
              <Link to="/portal/crm/deals/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Deal
                </Button>
              </Link>
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