import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";
import { parseEmailTemplate } from "@/hooks/hr/useHRCampaigns";

interface EmailPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: string;
  template: string;
}

// Sample agent for preview
const sampleAgent = {
  full_name: "John Smith",
  current_brokerage: "CBRE",
  division: "investment-sales",
};

export function EmailPreviewDialog({ 
  open, 
  onOpenChange, 
  subject,
  template 
}: EmailPreviewDialogProps) {
  const parsedSubject = parseEmailTemplate(subject || "No subject", sampleAgent);
  const parsedBody = parseEmailTemplate(template || "No content", sampleAgent);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-sidebar border-border/40 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-light flex items-center gap-2">
            <Mail className="h-5 w-5 text-emerald-400" />
            Email Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Note */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <p className="text-sm text-amber-400">
              This is a preview with sample data. Actual emails will use recipient's information.
            </p>
          </div>

          {/* Email Preview */}
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            {/* Email Header */}
            <div className="border-b border-white/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground w-16">To:</span>
                <span>{sampleAgent.full_name} &lt;john.smith@{sampleAgent.current_brokerage.toLowerCase()}.com&gt;</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground w-16">Subject:</span>
                <span className="font-medium">{parsedSubject}</span>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-4">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {parsedBody}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              variant="outline"
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
              disabled
            >
              <Send className="h-4 w-4 mr-2" />
              Send Test Email
              <span className="ml-2 text-xs text-muted-foreground">(Coming Soon)</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
