import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Link2, RefreshCw, Check } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { useManualTransactionMatch, useSyncAgentTransactions } from "@/hooks/hr/useAgentProduction";
import { formatFullCurrency } from "@/lib/formatters";
import { format } from "date-fns";

interface TransactionMatchDialogProps {
  activeAgentId: string;
  agentName: string;
  matchedTransactionIds?: string[];
}

export function TransactionMatchDialog({
  activeAgentId,
  agentName,
  matchedTransactionIds = [],
}: TransactionMatchDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  const { data: transactions, isLoading } = useTransactions(undefined, true);
  const manualMatch = useManualTransactionMatch();
  const autoSync = useSyncAgentTransactions();

  const filteredTransactions = transactions?.filter((tx) => {
    if (matchedTransactionIds.includes(tx.id)) return false;
    
    const searchLower = search.toLowerCase();
    return (
      tx.property_address?.toLowerCase().includes(searchLower) ||
      tx.agent_name?.toLowerCase().includes(searchLower) ||
      tx.borough?.toLowerCase().includes(searchLower)
    );
  });

  const handleMatch = async (transactionId: string) => {
    await manualMatch.mutateAsync({ activeAgentId, transactionId });
  };

  const handleAutoSync = async () => {
    await autoSync.mutateAsync(activeAgentId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Link2 className="h-4 w-4 mr-2" />
          Match Transactions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-light">
            Match Transactions to {agentName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by address, agent name, or borough..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="secondary"
              onClick={handleAutoSync}
              disabled={autoSync.isPending}
            >
              {autoSync.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Auto-Match
            </Button>
          </div>

          <ScrollArea className="h-[400px] border rounded-lg">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 bg-muted/50 rounded animate-pulse" />
                ))}
              </div>
            ) : !filteredTransactions?.length ? (
              <div className="p-8 text-center text-muted-foreground">
                {search ? "No matching transactions found" : "No unmatched transactions available"}
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {filteredTransactions.slice(0, 50).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{tx.property_address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {tx.deal_type}
                        </Badge>
                        {tx.closing_date && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(tx.closing_date), "MMM d, yyyy")}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {tx.agent_name} · {formatFullCurrency(tx.sale_price || tx.total_lease_value)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMatch(tx.id)}
                      disabled={manualMatch.isPending}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Match
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <p className="text-xs text-muted-foreground text-center">
            Showing up to 50 transactions. Use search to filter.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
