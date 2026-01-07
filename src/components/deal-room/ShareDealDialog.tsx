import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAgentShareableDeals, useShareDealToRoom } from "@/hooks/useDealRoom";
import { useCreateDeal } from "@/hooks/useCRM";
import { useDivision } from "@/contexts/DivisionContext";
import { toast } from "@/hooks/use-toast";
import { DealSelectList } from "./DealSelectList";
import { OMUploader } from "./OMUploader";
import { AddressAutocomplete, type AddressComponents } from "@/components/ui/AddressAutocomplete";
import { supabase } from "@/integrations/supabase/client";

interface ShareDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDealDialog({ open, onOpenChange }: ShareDealDialogProps) {
  // Mode: select existing or create new
  const [mode, setMode] = useState<"select" | "create">("select");
  
  // Select existing deal state
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Create new deal state
  const [newDealAddress, setNewDealAddress] = useState("");
  const [addressComponents, setAddressComponents] = useState<AddressComponents | null>(null);
  const [newDealType, setNewDealType] = useState("Sale");
  const [newDealValue, setNewDealValue] = useState("");
  
  // Shared state
  const [notes, setNotes] = useState("");
  const [omFile, setOmFile] = useState<File | null>(null);
  const [visibility, setVisibility] = useState<"team" | "public">("team");

  const { division } = useDivision();
  const { data: shareableDeals = [], isLoading: isLoadingDeals } = useAgentShareableDeals();
  const shareDealMutation = useShareDealToRoom();
  const createDealMutation = useCreateDeal();

  const resetForm = () => {
    setMode("select");
    setSelectedDealId(null);
    setSearchQuery("");
    setNewDealAddress("");
    setAddressComponents(null);
    setNewDealType("Sale");
    setNewDealValue("");
    setNotes("");
    setOmFile(null);
    setVisibility("team");
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = async () => {
    try {
      let dealIdToShare = selectedDealId;

      // If creating a new deal, create it first
      if (mode === "create" && addressComponents) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const newDeal = await createDealMutation.mutateAsync({
          property_address: addressComponents.fullAddress,
          deal_type: newDealType,
          division: division || "residential",
          value: newDealValue ? Number(newDealValue) : null,
          agent_id: user.id,
          neighborhood: addressComponents.neighborhood || null,
          borough: addressComponents.borough || null,
          latitude: addressComponents.latitude || null,
          longitude: addressComponents.longitude || null,
          // Required fields with defaults
          contact_id: null,
          stage_id: null,
          commission: null,
          expected_close: null,
          probability: 0,
          notes: null,
          priority: "medium",
          property_type: null,
          zoning: null,
          lot_size: null,
          gross_sf: null,
          last_activity_date: null,
          referral_source: null,
          due_date: null,
          is_lost: false,
          lost_reason: null,
          cap_rate: null,
          noi: null,
          building_class: null,
          unit_count: null,
          year_built: null,
          asking_price: null,
          offer_price: null,
          price_per_unit: null,
          price_per_sf: null,
          is_1031_exchange: false,
          financing_type: null,
          lender_name: null,
          loan_amount: null,
          co_broker_id: null,
          co_broker_name: null,
          co_broker_split: null,
          due_diligence_deadline: null,
          property_condition: null,
          ideal_close_date: null,
          tenant_legal_name: null,
          asking_rent_psf: null,
          negotiated_rent_psf: null,
          lease_type: null,
          lease_term_months: null,
          commencement_date: null,
          expiration_date: null,
          free_rent_months: null,
          escalation_rate: null,
          ti_allowance_psf: null,
          security_deposit_months: null,
          landlord_broker: null,
          use_clause: null,
          space_type: null,
          tenant_business_type: null,
          guarantor_required: null,
          bedrooms: null,
          bathrooms: null,
          monthly_rent: null,
          lease_length_months: null,
          move_in_date: null,
          move_in_urgency: null,
          pets_allowed: null,
          is_rental: null,
          listing_price: null,
          primary_contact_id: null,
          primary_image_url: null,
          is_off_market: false,
          deal_room_visibility: null,
          deal_room_notes: null,
          last_deal_room_update: null,
          om_file_url: null,
          om_file_name: null,
          co_broke_percent: null,
          deal_category: null,
          deleted_at: null,
        } as any);
        dealIdToShare = newDeal.id;
      }

      if (!dealIdToShare) return;

      await shareDealMutation.mutateAsync({
        dealId: dealIdToShare,
        notes: notes.trim() || undefined,
        visibility,
        omFile: omFile || undefined,
      });

      toast({
        title: mode === "create" ? "Deal created and shared" : "Deal shared successfully",
        description: "Your deal is now visible in the Deal Room.",
      });

      handleClose(false);
    } catch (error) {
      console.error("Failed to share deal:", error);
      toast({
        title: "Failed to share deal",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const isSubmitting = shareDealMutation.isPending || createDealMutation.isPending;
  const canSubmit = (
    (mode === "select" && selectedDealId) ||
    (mode === "create" && addressComponents?.fullAddress)
  ) && !isSubmitting;

  const showDetails = (mode === "select" && selectedDealId) || (mode === "create" && addressComponents?.fullAddress);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Deal to Room</DialogTitle>
          <DialogDescription>
            Share a deal with the team for co-broke opportunities.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mode Toggle */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as "select" | "create")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="select">Select Existing</TabsTrigger>
              <TabsTrigger value="create">Add New Deal</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Select Existing Deal */}
          {mode === "select" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select a Deal</Label>
              <DealSelectList
                deals={shareableDeals}
                selectedId={selectedDealId}
                onSelect={setSelectedDealId}
                isLoading={isLoadingDeals}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          )}

          {/* Create New Deal */}
          {mode === "create" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Property Address</Label>
                <AddressAutocomplete
                  value={newDealAddress}
                  onChange={setNewDealAddress}
                  onAddressSelect={(addr) => setAddressComponents(addr)}
                  placeholder="Start typing an address..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Deal Type</Label>
                  <Select value={newDealType} onValueChange={setNewDealType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sale">Sale</SelectItem>
                      <SelectItem value="Lease">Lease</SelectItem>
                      <SelectItem value="Listing">Listing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Value{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 2500000"
                    value={newDealValue}
                    onChange={(e) => setNewDealValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Add Details (only show when deal selected or address entered) */}
          {showDetails && (
            <>
              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notes for team{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add context, what you're looking for, co-broke terms..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                  className="resize-none min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground text-right">{notes.length}/500</p>
              </div>

              {/* OM Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Upload OM{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <OMUploader file={omFile} onFileChange={setOmFile} />
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Visibility</Label>
                <RadioGroup
                  value={visibility}
                  onValueChange={(v) => setVisibility(v as "team" | "public")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="team" id="visibility-team" />
                    <Label htmlFor="visibility-team" className="font-normal cursor-pointer">
                      Team Only
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="visibility-public" />
                    <Label htmlFor="visibility-public" className="font-normal cursor-pointer">
                      Everyone
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {mode === "create" ? "Create & Share" : "Share to Deal Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
