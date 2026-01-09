import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FileSignature, Eye, Trash2, Send, Ban, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ContractGenerator } from "@/components/hr/contracts/ContractGenerator";
import { ContractPreview } from "@/components/hr/contracts/ContractPreview";
import { useURLFilters, parseString } from "@/hooks/useURLFilters";
import {
  useContracts,
  useDeleteContract,
  useSendContract,
  useVoidContract,
  ContractStatus,
} from "@/hooks/hr/useContracts";
import { contractStatusConfig } from "@/lib/contract-utils";
import { divisionLabels, Division } from "@/hooks/hr/useHRAgents";
import { toast } from "sonner";

// Filter config for URL persistence
const filterConfigs = {
  tab: { key: 'tab', defaultValue: 'all' as 'all' | ContractStatus, parse: parseString('all') },
  search: { key: 'q', defaultValue: '', parse: parseString('') },
  division: { key: 'division', defaultValue: '', parse: parseString('') },
};

export default function Contracts() {
  const [filters, setFilters, clearFilters] = useURLFilters(filterConfigs);
  const { tab, search, division: divisionFilter } = filters;

  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [previewContractId, setPreviewContractId] = useState<string | null>(null);
  const [voidDialogId, setVoidDialogId] = useState<string | null>(null);

  const { data: contracts, isLoading } = useContracts({
    status: tab === 'all' ? undefined : (tab as ContractStatus),
    division: divisionFilter || undefined,
  });
  const deleteContract = useDeleteContract();
  const sendContract = useSendContract();
  const voidContract = useVoidContract();

  const filteredContracts = useMemo(() => {
    if (!contracts) return [];

    return contracts.filter(contract => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const agentName = contract.agent_name?.toLowerCase() || '';
        if (!agentName.includes(searchLower)) return false;
      }
      return true;
    });
  }, [contracts, search]);

  const hasActiveFilters = search || divisionFilter;

  // Metrics
  const metrics = useMemo(() => {
    if (!contracts) return { draft: 0, sent: 0, pending: 0, signed: 0 };

    return {
      draft: contracts.filter(c => c.status === 'draft').length,
      sent: contracts.filter(c => c.status === 'sent').length,
      pending: contracts.filter(c => c.status === 'pending_signature').length,
      signed: contracts.filter(c => c.status === 'signed').length,
    };
  }, [contracts]);

  const handleDelete = async (id: string) => {
    try {
      await deleteContract.mutateAsync(id);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleSend = async (id: string) => {
    try {
      await sendContract.mutateAsync(id);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleVoid = async (contractId: string, reason: string) => {
    try {
      await voidContract.mutateAsync({ contractId, reason });
      setVoidDialogId(null);
    } catch (error) {
      // Error handled by hook
    }
  };

  const previewContract = contracts?.find(c => c.id === previewContractId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contracts</h1>
          <p className="text-muted-foreground">Manage employment contracts and e-signatures</p>
        </div>
        <Button onClick={() => setGeneratorOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          Create Contract
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-500/10">
              <FileSignature className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{metrics.draft}</p>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Send className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{metrics.sent}</p>
              <p className="text-sm text-muted-foreground">Sent</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <FileSignature className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{metrics.pending}</p>
              <p className="text-sm text-muted-foreground">Pending Signature</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <FileSignature className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{metrics.signed}</p>
              <p className="text-sm text-muted-foreground">Signed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <Tabs value={tab} onValueChange={(v) => setFilters({ tab: v as typeof tab })}>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="pending_signature">Pending</TabsTrigger>
            <TabsTrigger value="signed">Signed</TabsTrigger>
            <TabsTrigger value="voided">Voided</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Input
              placeholder="Search by agent..."
              value={search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-48"
            />
            <Select value={divisionFilter} onValueChange={(v) => setFilters({ division: v })}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Divisions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Divisions</SelectItem>
                {Object.entries(divisionLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <TabsContent value={tab} className="mt-4">
          {isLoading ? (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Division</TableHead>
                    <TableHead>Contract Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="text-center py-12">
              <FileSignature className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No contracts found</h3>
              <p className="text-muted-foreground mb-4">
                {tab === 'all' 
                  ? "Create your first contract to get started."
                  : `No ${tab.replace('_', ' ')} contracts found.`}
              </p>
              <Button onClick={() => setGeneratorOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4" />
                Create Contract
              </Button>
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Division</TableHead>
                    <TableHead>Contract Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => {
                    const statusInfo = contractStatusConfig[contract.status as ContractStatus];
                    return (
                      <TableRow key={contract.id}>
                        <TableCell>
                          <Link 
                            to={`/hr/agents/${contract.agent_id}`}
                            className="font-medium hover:text-primary"
                          >
                            {contract.agent_name}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {contract.agent_email}
                          </p>
                        </TableCell>
                        <TableCell>
                          {contract.division ? divisionLabels[contract.division as Division] : '-'}
                        </TableCell>
                        <TableCell className="capitalize">
                          {contract.contract_type?.replace(/_/g, ' ') || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusInfo?.color}>
                            {statusInfo?.label || contract.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(contract.created_at!), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setPreviewContractId(contract.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {contract.status === 'draft' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleSend(contract.id)}
                                  disabled={sendContract.isPending}
                                >
                                  <Send className="h-4 w-4 text-blue-400" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4 text-red-400" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Contract</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this draft contract? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(contract.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                            
                            {(contract.status === 'sent' || contract.status === 'pending_signature') && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setVoidDialogId(contract.id)}
                              >
                                <Ban className="h-4 w-4 text-red-400" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Contract Generator Dialog */}
      <ContractGenerator 
        open={generatorOpen} 
        onOpenChange={setGeneratorOpen} 
      />

      {/* Contract Preview Dialog */}
      {previewContract && (
        <ContractPreview
          open={!!previewContractId}
          onOpenChange={(open) => !open && setPreviewContractId(null)}
          contract={previewContract}
          onSend={() => handleSend(previewContract.id)}
        />
      )}

      {/* Void Contract Dialog */}
      <AlertDialog open={!!voidDialogId} onOpenChange={(open) => !open && setVoidDialogId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Void Contract</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to void this contract? The agent will no longer be able to sign it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => voidDialogId && handleVoid(voidDialogId, 'Voided by HR')}
              className="bg-red-600 hover:bg-red-700"
            >
              Void Contract
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
