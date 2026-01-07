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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAgentShareableDeals, useShareDealToRoom } from "@/hooks/useDealRoom";
import { toast } from "@/hooks/use-toast";
import { DealSelectList } from "./DealSelectList";
import { OMUploader } from "./OMUploader";

interface ShareDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDealDialog({ open, onOpenChange }: ShareDealDialogProps) {
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState("");
  const [omFile, setOmFile] = useState<File | null>(null);
  const [visibility, setVisibility] = useState<"team" | "public">("team");

  const { data: shareableDeals = [], isLoading: isLoadingDeals } = useAgentShareableDeals();
  const shareDealMutation = useShareDealToRoom();

  const resetForm = () => {
    setSelectedDealId(null);
    setSearchQuery("");
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
    if (!selectedDealId) return;

    try {
      await shareDealMutation.mutateAsync({
        dealId: selectedDealId,
        notes: notes.trim() || undefined,
        visibility,
        omFile: omFile || undefined,
      });

      toast({
        title: "Deal shared successfully",
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

  const isSubmitting = shareDealMutation.isPending;
  const canSubmit = selectedDealId && !isSubmitting;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Deal to Room</DialogTitle>
          <DialogDescription>
            Share one of your CRM deals with the team for co-broke opportunities.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Select Deal */}
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

          {/* Step 2: Add Details (only show when deal selected) */}
          {selectedDealId && (
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
            Share to Deal Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
