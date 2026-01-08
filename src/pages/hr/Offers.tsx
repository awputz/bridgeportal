import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import { FileText, Eye, Trash2, Copy, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { CreateOfferDialog } from "@/components/hr/CreateOfferDialog";
import {
  useHROffers,
  useDeleteHROffer,
  useCreateHROffer,
  getOfferStatus,
  offerStatusColors,
  offerStatusLabels,
  OfferStatus,
} from "@/hooks/hr/useHROffers";
import { divisionLabels, Division } from "@/hooks/hr/useHRAgents";
import { toast } from "sonner";

export default function Offers() {
  const [tab, setTab] = useState<'all' | OfferStatus>('all');
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState<string>("");

  const { data: offers, isLoading } = useHROffers();
  const deleteOffer = useDeleteHROffer();
  const createOffer = useCreateHROffer();

  const filteredOffers = useMemo(() => {
    if (!offers) return [];

    return offers.filter(offer => {
      const status = getOfferStatus(offer);

      // Tab filter
      if (tab !== 'all' && status !== tab) return false;

      // Division filter
      if (divisionFilter && offer.division !== divisionFilter) return false;

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const agentName = offer.hr_agents?.full_name?.toLowerCase() || '';
        if (!agentName.includes(searchLower)) return false;
      }

      return true;
    });
  }, [offers, tab, search, divisionFilter]);

  // Metrics calculations
  const metrics = useMemo(() => {
    if (!offers) return { pending: 0, sentThisMonth: 0, acceptanceRate: 0, avgBonus: 0 };

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const pending = offers.filter(o => {
      const status = getOfferStatus(o);
      return status === 'draft' || status === 'sent';
    }).length;

    const sentThisMonth = offers.filter(o => 
      o.sent_at && new Date(o.sent_at) >= thisMonth
    ).length;

    const signed = offers.filter(o => getOfferStatus(o) === 'signed').length;
    const declined = offers.filter(o => getOfferStatus(o) === 'declined').length;
    const acceptanceRate = signed + declined > 0 
      ? Math.round((signed / (signed + declined)) * 100)
      : 0;

    const signedWithBonus = offers.filter(o => 
      getOfferStatus(o) === 'signed' && o.signing_bonus
    );
    const avgBonus = signedWithBonus.length > 0
      ? Math.round(signedWithBonus.reduce((sum, o) => sum + (o.signing_bonus || 0), 0) / signedWithBonus.length)
      : 0;

    return { pending, sentThisMonth, acceptanceRate, avgBonus };
  }, [offers]);

  const handleDelete = async (id: string) => {
    try {
      await deleteOffer.mutateAsync(id);
      toast.success("Offer deleted");
    } catch (error) {
      toast.error("Failed to delete offer");
    }
  };

  const handleDuplicate = async (offer: typeof offers[0]) => {
    try {
      await createOffer.mutateAsync({
        agent_id: offer.agent_id,
        division: offer.division,
        commission_split: offer.commission_split,
        signing_bonus: offer.signing_bonus,
        start_date: offer.start_date,
        special_terms: offer.special_terms,
      });
      toast.success("Offer duplicated");
    } catch (error) {
      toast.error("Failed to duplicate offer");
    }
  };

  const getDaysIndicator = (offer: typeof offers[0]) => {
    const status = getOfferStatus(offer);
    if (status !== 'sent' || !offer.sent_at) return null;
    
    const days = differenceInDays(new Date(), new Date(offer.sent_at));
    return (
      <span className="text-xs text-muted-foreground ml-2">
        ({days}d waiting)
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Offers</h1>
          <p className="text-muted-foreground">Manage recruitment offers and compensation packages</p>
        </div>
        <CreateOfferDialog />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Clock className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{metrics.pending}</p>
              <p className="text-sm text-muted-foreground">Pending Offers</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <FileText className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{metrics.sentThisMonth}</p>
              <p className="text-sm text-muted-foreground">Sent This Month</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{metrics.acceptanceRate}%</p>
              <p className="text-sm text-muted-foreground">Acceptance Rate</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <DollarSign className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">${metrics.avgBonus.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Avg Signing Bonus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="signed">Signed</TabsTrigger>
            <TabsTrigger value="declined">Declined</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Input
              placeholder="Search by agent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
            <Select value={divisionFilter} onValueChange={setDivisionFilter}>
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
          </div>
        </div>

        <TabsContent value={tab} className="mt-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading offers...</div>
          ) : filteredOffers.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No offers found</h3>
              <p className="text-muted-foreground mb-4">
                {tab === 'all' 
                  ? "Create your first offer to get started."
                  : `No ${tab} offers found.`}
              </p>
              <CreateOfferDialog />
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Division</TableHead>
                    <TableHead>Commission Split</TableHead>
                    <TableHead>Signing Bonus</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.map((offer) => {
                    const status = getOfferStatus(offer);
                    return (
                      <TableRow key={offer.id}>
                        <TableCell>
                          <Link 
                            to={`/hr/agents/${offer.agent_id}`}
                            className="font-medium hover:text-primary"
                          >
                            {offer.hr_agents?.full_name || 'Unknown'}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {offer.hr_agents?.current_brokerage}
                          </p>
                        </TableCell>
                        <TableCell>
                          {offer.division ? divisionLabels[offer.division as Division] : '-'}
                        </TableCell>
                        <TableCell className="font-mono">
                          {offer.commission_split || '-'}
                        </TableCell>
                        <TableCell>
                          {offer.signing_bonus 
                            ? `$${offer.signing_bonus.toLocaleString()}`
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {offer.start_date 
                            ? format(new Date(offer.start_date), 'MMM d, yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={offerStatusColors[status]}>
                            {offerStatusLabels[status]}
                          </Badge>
                          {getDaysIndicator(offer)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(offer.created_at!), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                            >
                              <Link to={`/hr/offers/${offer.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDuplicate(offer)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-red-400" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Offer</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this offer? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(offer.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
    </div>
  );
}
