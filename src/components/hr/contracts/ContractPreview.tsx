import { FileSignature, Send, Printer, Download, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { contractStatusConfig, ContractStatus } from "@/lib/contract-utils";
import { format } from "date-fns";
import { toast } from "sonner";

interface Contract {
  id: string;
  agent_name: string;
  agent_email: string;
  division: string | null;
  contract_type: string | null;
  commission_split: string | null;
  start_date: string | null;
  signing_bonus: number | null;
  status: string;
  content_html: string | null;
  created_at: string | null;
  sent_at: string | null;
  signed_at: string | null;
  pdf_url: string | null;
}

interface ContractPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: Contract;
  onSend?: () => void;
}

export function ContractPreview({ 
  open, 
  onOpenChange, 
  contract,
  onSend 
}: ContractPreviewProps) {
  const statusInfo = contractStatusConfig[contract.status as ContractStatus];

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Contract - ${contract.agent_name}</title>
          <style>
            body { font-family: Georgia, serif; max-width: 8.5in; margin: 0 auto; padding: 1in; }
            h1, h2, h3 { font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          ${contract.content_html}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleCopyLink = () => {
    const signingUrl = `${window.location.origin}/contracts/sign/${contract.id}`;
    navigator.clipboard.writeText(signingUrl);
    toast.success("Signing link copied to clipboard");
  };

  const handleOpenSigningPage = () => {
    window.open(`/contracts/sign/${contract.id}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSignature className="h-5 w-5 text-emerald-400" />
              Contract for {contract.agent_name}
            </div>
            <Badge className={statusInfo?.color}>
              {statusInfo?.label || contract.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Contract Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-b pb-4">
          <span><strong>Type:</strong> {contract.contract_type?.replace(/_/g, ' ')}</span>
          <span><strong>Split:</strong> {contract.commission_split}</span>
          {contract.start_date && (
            <span><strong>Start:</strong> {format(new Date(contract.start_date), 'MMM d, yyyy')}</span>
          )}
          {contract.signing_bonus && (
            <span><strong>Bonus:</strong> ${contract.signing_bonus.toLocaleString()}</span>
          )}
          {contract.sent_at && (
            <span><strong>Sent:</strong> {format(new Date(contract.sent_at), 'MMM d, yyyy')}</span>
          )}
          {contract.signed_at && (
            <span><strong>Signed:</strong> {format(new Date(contract.signed_at), 'MMM d, yyyy')}</span>
          )}
        </div>

        {/* Contract Content */}
        <div className="flex-1 overflow-y-auto">
          <div 
            className="bg-white text-black p-8 rounded-lg prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: contract.content_html || '<p>No content</p>' }}
          />
        </div>

        <DialogFooter className="gap-2 flex-wrap">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          
          {contract.pdf_url && (
            <Button variant="outline" asChild>
              <a href={contract.pdf_url} download>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </a>
            </Button>
          )}

          {(contract.status === 'sent' || contract.status === 'pending_signature') && (
            <>
              <Button variant="outline" onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline" onClick={handleOpenSigningPage}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Signing Page
              </Button>
            </>
          )}

          {contract.status === 'draft' && onSend && (
            <Button onClick={onSend} className="bg-emerald-600 hover:bg-emerald-700">
              <Send className="h-4 w-4 mr-2" />
              Send for Signature
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
