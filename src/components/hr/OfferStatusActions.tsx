import { useState } from "react";
import { Send, Check, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import {
  HROffer,
  getOfferStatus,
  useSendOffer,
  useMarkOfferSigned,
  useMarkOfferDeclined,
} from "@/hooks/hr/useHROffers";
import { toast } from "sonner";

interface OfferStatusActionsProps {
  offer: HROffer;
}

export function OfferStatusActions({ offer }: OfferStatusActionsProps) {
  const status = getOfferStatus(offer);
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [showSignedDialog, setShowSignedDialog] = useState(false);
  const [showDeclinedDialog, setShowDeclinedDialog] = useState(false);
  const [signedDate, setSignedDate] = useState<Date | undefined>(new Date());
  const [declineReason, setDeclineReason] = useState("");

  const sendOffer = useSendOffer();
  const markSigned = useMarkOfferSigned();
  const markDeclined = useMarkOfferDeclined();

  const handleSend = async () => {
    try {
      await sendOffer.mutateAsync(offer.id);
      toast.success("Offer sent successfully");
      setShowSendConfirm(false);
    } catch (error) {
      toast.error("Failed to send offer");
    }
  };

  const handleMarkSigned = async () => {
    try {
      await markSigned.mutateAsync({
        id: offer.id,
        signedAt: signedDate?.toISOString(),
      });
      toast.success("Offer marked as signed - Agent moved to Hired!");
      setShowSignedDialog(false);
    } catch (error) {
      toast.error("Failed to mark offer as signed");
    }
  };

  const handleMarkDeclined = async () => {
    try {
      await markDeclined.mutateAsync({
        id: offer.id,
        reason: declineReason,
      });
      toast.success("Offer marked as declined");
      setShowDeclinedDialog(false);
    } catch (error) {
      toast.error("Failed to mark offer as declined");
    }
  };

  if (status === 'signed' || status === 'declined') {
    return null;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {status === 'draft' && (
          <Button
            onClick={() => setShowSendConfirm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Offer
          </Button>
        )}

        {status === 'sent' && (
          <>
            <Button
              onClick={() => setShowSignedDialog(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark as Signed
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeclinedDialog(true)}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <X className="h-4 w-4 mr-2" />
              Mark as Declined
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowSendConfirm(true)}
              className="text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Resend Offer
            </Button>
          </>
        )}
      </div>

      {/* Send Confirmation Dialog */}
      <Dialog open={showSendConfirm} onOpenChange={setShowSendConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Offer</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this offer as sent? This will update 
              the offer status and notify the candidate.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={sendOffer.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {sendOffer.isPending ? "Sending..." : "Send Offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Signed Dialog */}
      <Dialog open={showSignedDialog} onOpenChange={setShowSignedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Offer as Signed</DialogTitle>
            <DialogDescription>
              This will mark the offer as accepted and move the agent to "Hired" status.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Signature Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !signedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {signedDate ? format(signedDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={signedDate}
                  onSelect={setSignedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSignedDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleMarkSigned}
              disabled={markSigned.isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {markSigned.isPending ? "Saving..." : "Mark as Signed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Declined Dialog */}
      <Dialog open={showDeclinedDialog} onOpenChange={setShowDeclinedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Offer as Declined</DialogTitle>
            <DialogDescription>
              Record why the candidate declined this offer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Reason (optional)</label>
            <Textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Enter reason for declining..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeclinedDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleMarkDeclined}
              disabled={markDeclined.isPending}
              variant="destructive"
            >
              {markDeclined.isPending ? "Saving..." : "Mark as Declined"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
