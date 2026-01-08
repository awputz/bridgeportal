import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Plus, Search, Pencil, Trash2, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "@/components/admin/DataTablePagination";
import { SortableTableHead, useSorting } from "@/components/admin/SortableTableHead";
import { PoachabilityScore } from "@/components/hr/PoachabilityScore";
import { AgentFormDialog } from "@/components/hr/AgentFormDialog";
import { LogInteractionDialog } from "@/components/hr/LogInteractionDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  useHRAgents, 
  useDeleteHRAgent,
  HRAgent,
  Division,
  RecruitmentStatus,
  formatProduction,
  statusColors,
  divisionColors,
  divisionLabels,
  statusLabels
} from "@/hooks/hr/useHRAgents";
import { cn } from "@/lib/utils";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function AgentDatabase() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<Division | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<RecruitmentStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Dialogs
  const [formOpen, setFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<HRAgent | null>(null);
  const [interactionOpen, setInteractionOpen] = useState(false);
  const [interactionAgent, setInteractionAgent] = useState<HRAgent | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingAgent, setDeletingAgent] = useState<HRAgent | null>(null);

  const { data: agents = [], isLoading } = useHRAgents({
    division: divisionFilter === 'all' ? undefined : divisionFilter,
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: search || undefined,
  });

  const deleteAgent = useDeleteHRAgent();

  const { sortedData, sortKey, sortDirection, handleSort } = useSorting(agents, 'updated_at', 'desc');

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleEdit = (agent: HRAgent, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAgent(agent);
    setFormOpen(true);
  };

  const handleDelete = (agent: HRAgent, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingAgent(agent);
    setDeleteOpen(true);
  };

  const handleLogInteraction = (agent: HRAgent, e: React.MouseEvent) => {
    e.stopPropagation();
    setInteractionAgent(agent);
    setInteractionOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingAgent) {
      await deleteAgent.mutateAsync(deletingAgent.id);
      setDeleteOpen(false);
      setDeletingAgent(null);
    }
  };

  const handleAddNew = () => {
    setEditingAgent(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extralight">Agent Database</h1>
          <p className="text-muted-foreground text-sm">
            {sortedData.length} recruitment targets
          </p>
        </div>
        <Button onClick={handleAddNew} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Agent
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or brokerage..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select value={divisionFilter} onValueChange={(v) => { setDivisionFilter(v as Division | 'all'); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Division" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Divisions</SelectItem>
            {Object.entries(divisionLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as RecruitmentStatus | 'all'); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[50px]"></TableHead>
              <SortableTableHead 
                sortKey="full_name" 
                currentSortKey={sortKey} 
                currentSortDirection={sortDirection} 
                onSort={handleSort}
              >
                Name
              </SortableTableHead>
              <SortableTableHead 
                sortKey="current_brokerage" 
                currentSortKey={sortKey} 
                currentSortDirection={sortDirection} 
                onSort={handleSort}
              >
                Brokerage
              </SortableTableHead>
              <TableHead>Division</TableHead>
              <SortableTableHead 
                sortKey="annual_production" 
                currentSortKey={sortKey} 
                currentSortDirection={sortDirection} 
                onSort={handleSort}
              >
                Production
              </SortableTableHead>
              <SortableTableHead 
                sortKey="poachability_score" 
                currentSortKey={sortKey} 
                currentSortDirection={sortDirection} 
                onSort={handleSort}
              >
                Score
              </SortableTableHead>
              <TableHead>Status</TableHead>
              <SortableTableHead 
                sortKey="last_contacted_at" 
                currentSortKey={sortKey} 
                currentSortDirection={sortDirection} 
                onSort={handleSort}
              >
                Last Contact
              </SortableTableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                  Loading agents...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12">
                  <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No agents found</p>
                  <Button variant="link" onClick={handleAddNew} className="text-emerald-400 mt-2">
                    Add your first agent
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((agent) => (
                <TableRow 
                  key={agent.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/hr/agents/${agent.id}`)}
                >
                  <TableCell>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={agent.photo_url || undefined} />
                      <AvatarFallback className="bg-emerald-500/10 text-emerald-400 text-xs">
                        {agent.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{agent.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {agent.current_brokerage || '-'}
                  </TableCell>
                  <TableCell>
                    {agent.division ? (
                      <Badge variant="outline" className={cn("text-xs", divisionColors[agent.division as Division])}>
                        {divisionLabels[agent.division as Division]}
                      </Badge>
                    ) : '-'}
                  </TableCell>
                  <TableCell>{formatProduction(agent.annual_production ? Number(agent.annual_production) : null)}</TableCell>
                  <TableCell>
                    <PoachabilityScore score={agent.poachability_score} compact />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", statusColors[agent.recruitment_status as RecruitmentStatus])}>
                      {statusLabels[agent.recruitment_status as RecruitmentStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {agent.last_contacted_at 
                      ? formatDistanceToNow(new Date(agent.last_contacted_at), { addSuffix: true })
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => handleLogInteraction(agent, e)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => handleEdit(agent, e)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        onClick={(e) => handleDelete(agent, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {sortedData.length > 0 && (
        <DataTablePagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={sortedData.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        />
      )}

      {/* Dialogs */}
      <AgentFormDialog 
        open={formOpen} 
        onOpenChange={setFormOpen}
        agent={editingAgent}
      />

      {interactionAgent && (
        <LogInteractionDialog
          open={interactionOpen}
          onOpenChange={setInteractionOpen}
          agentId={interactionAgent.id}
          agentName={interactionAgent.full_name}
        />
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Agent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingAgent?.full_name}? This will also delete all their interactions and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
