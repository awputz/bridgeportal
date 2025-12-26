import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Phone,
  Mail,
  Building2,
  User,
  Grid3X3,
  List,
  MoreHorizontal,
  Upload,
  Home,
  Store,
  Tag,
  X,
  ArrowUpDown,
  Loader2,
  Users,
  RefreshCw,
  Check,
  Cloud,
  CloudOff
} from "lucide-react";
import { useCRMContacts, useCreateContact, useDeleteContact } from "@/hooks/useCRM";
import { useCRMRealtime } from "@/hooks/useCRMRealtime";
import { useDivision, Division } from "@/contexts/DivisionContext";
import { useAutoSyncContacts } from "@/hooks/useAutoSyncContacts";
import { useContactsConnection, useConnectContacts, useDisconnectContacts } from "@/hooks/useGoogleContacts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CSVContactUploader } from "@/components/portal/CSVContactUploader";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const contactTypes = [
  { value: "owner", label: "Owner" },
  { value: "buyer", label: "Buyer" },
  { value: "tenant", label: "Tenant" },
  { value: "landlord", label: "Landlord" },
  { value: "investor", label: "Investor" },
  { value: "attorney", label: "Attorney" },
  { value: "lender", label: "Lender" },
  { value: "broker", label: "Broker" },
  { value: "prospect", label: "Prospect" },
  { value: "other", label: "Other" },
];

const sourceOptions = [
  { value: "referral", label: "Referral" },
  { value: "cold-call", label: "Cold Call" },
  { value: "website", label: "Website" },
  { value: "open-house", label: "Open House" },
  { value: "networking", label: "Networking" },
  { value: "repeat-client", label: "Repeat Client" },
  { value: "marketing", label: "Marketing" },
  { value: "csv-import", label: "CSV Import" },
  { value: "google-contacts", label: "Google Contacts" },
  { value: "other", label: "Other" },
];

const divisionOptions = [
  { key: "investment-sales" as Division, label: "Investment Sales", icon: Building2 },
  { key: "commercial-leasing" as Division, label: "Commercial Leasing", icon: Store },
  { key: "residential" as Division, label: "Residential", icon: Home },
];

type SortField = "name" | "created_at" | "updated_at";
type SortOrder = "asc" | "desc";

// Google Sync Status Badge Component
const GoogleSyncStatus = () => {
  const { data: connectionData, isLoading: isCheckingConnection, refetch } = useContactsConnection();
  const connectContacts = useConnectContacts();
  const disconnectContacts = useDisconnectContacts();
  const { isLoading: isSyncing, googleContactsCount } = useAutoSyncContacts();

  if (isCheckingConnection) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Checking sync...</span>
      </div>
    );
  }

  if (!connectionData?.connected) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => connectContacts.mutate()}
              disabled={connectContacts.isPending}
              className="gap-2 border-dashed"
            >
              {connectContacts.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CloudOff className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="hidden sm:inline">Connect Google</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connect Google Contacts to auto-sync</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 bg-green-500/10 text-green-400 border-green-500/30">
              {isSyncing ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <Cloud className="h-3 w-3" />
                  <span>Google Connected</span>
                </>
              )}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Sync
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => disconnectContacts.mutate()}
                  className="text-destructive"
                >
                  <CloudOff className="h-4 w-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Contacts auto-sync with Google</p>
          {googleContactsCount > 0 && (
            <p className="text-muted-foreground">{googleContactsCount} Google contacts</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Contacts = () => {
  const { division } = useDivision();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showCSVUploader, setShowCSVUploader] = useState(false);
  const [deleteContactId, setDeleteContactId] = useState<string | null>(null);
  
  // Filters
  const [contactTypeFilter, setContactTypeFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Fetch contacts without division filter to get all contacts
  const { data: allContacts, isLoading, refetch: refetchContacts } = useCRMContacts();
  const createContact = useCreateContact();
  const deleteContact = useDeleteContact();

  // Subscribe to real-time CRM updates
  useCRMRealtime();
  
  // Auto-sync Google Contacts
  useAutoSyncContacts();

  // Get unique tags from all contacts
  const allTags = useMemo(() => {
    if (!allContacts) return [];
    const tags = new Set<string>();
    allContacts.forEach(c => {
      c.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [allContacts]);

  // Filter and sort contacts
  const filteredContacts = useMemo(() => {
    if (!allContacts) return [];
    
    let result = allContacts.filter((c) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
          c.full_name.toLowerCase().includes(searchLower) ||
          c.email?.toLowerCase().includes(searchLower) ||
          c.company?.toLowerCase().includes(searchLower) ||
          c.phone?.includes(search) ||
          c.notes?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      // Contact type filter
      if (contactTypeFilter !== "all" && c.contact_type !== contactTypeFilter) {
        return false;
      }
      // Source filter
      if (sourceFilter !== "all" && c.source !== sourceFilter) {
        return false;
      }
      // Division filter
      if (divisionFilter !== "all" && c.division !== divisionFilter) {
        return false;
      }
      // Tag filter
      if (tagFilter !== "all" && !c.tags?.includes(tagFilter)) {
        return false;
      }
      return true;
    });
    
    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.full_name.localeCompare(b.full_name);
      } else if (sortField === "created_at") {
        comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      } else if (sortField === "updated_at") {
        comparison = new Date(a.updated_at || 0).getTime() - new Date(b.updated_at || 0).getTime();
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
    
    return result;
  }, [allContacts, search, contactTypeFilter, sourceFilter, divisionFilter, tagFilter, sortField, sortOrder]);

  const hasActiveFilters = contactTypeFilter !== "all" || sourceFilter !== "all" || divisionFilter !== "all" || tagFilter !== "all";

  const clearAllFilters = () => {
    setContactTypeFilter("all");
    setSourceFilter("all");
    setDivisionFilter("all");
    setTagFilter("all");
  };

  const handleDeleteContact = (contactId: string) => {
    setDeleteContactId(contactId);
  };

  const confirmDeleteContact = () => {
    if (deleteContactId) {
      deleteContact.mutate(deleteContactId);
      setDeleteContactId(null);
    }
  };

  const handleCreateContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to create contacts");
      return;
    }

    createContact.mutate({
      agent_id: user.id,
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string || null,
      phone: formData.get("phone") as string || null,
      company: formData.get("company") as string || null,
      contact_type: formData.get("contact_type") as string || "prospect",
      source: formData.get("source") as string || null,
      division: formData.get("division") as Division || division,
      tags: [],
      notes: formData.get("notes") as string || null,
      address: formData.get("address") as string || null,
    }, {
      onSuccess: () => {
        setShowContactDialog(false);
        form.reset();
      },
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      owner: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      buyer: "bg-green-500/20 text-green-400 border-green-500/30",
      tenant: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      landlord: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      investor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      attorney: "bg-red-500/20 text-red-400 border-red-500/30",
      lender: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      broker: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      prospect: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
    return colors[type] || colors.prospect;
  };

  const getDivisionIcon = (div: string) => {
    const opt = divisionOptions.find(d => d.key === div);
    return opt ? opt.icon : Building2;
  };

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-start justify-between md:block">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground">
                  Contacts
                </h1>
              </div>
              <p className="text-muted-foreground font-light">
                Manage your network of clients, prospects, and partners
              </p>
            </div>
            <div className="md:hidden">
              <GoogleSyncStatus />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Google Sync Status - Desktop */}
            <div className="hidden md:block">
              <GoogleSyncStatus />
            </div>
            
            {/* Import Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Import CSV
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowCSVUploader(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV File
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-panel-strong max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-light">New Contact</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateContact} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input id="full_name" name="full_name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" type="tel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" name="company" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_type">Type</Label>
                      <Select name="contact_type" defaultValue="prospect">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {contactTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="source">Source</Label>
                      <Select name="source">
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          {sourceOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="division">Division</Label>
                      <Select name="division" defaultValue={division}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {divisionOptions.map((opt) => (
                            <SelectItem key={opt.key} value={opt.key}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" name="address" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" name="notes" rows={3} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={() => setShowContactDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createContact.isPending}>
                      {createContact.isPending ? "Creating..." : "Create Contact"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, company, or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Type Filter */}
              <Select value={contactTypeFilter} onValueChange={setContactTypeFilter}>
                <SelectTrigger className="w-[130px] bg-white/5 border-white/10">
                  <User className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {contactTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Source Filter */}
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[130px] bg-white/5 border-white/10">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sourceOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Division Filter */}
              <Select value={divisionFilter} onValueChange={setDivisionFilter}>
                <SelectTrigger className="w-[160px] bg-white/5 border-white/10">
                  <Building2 className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Divisions</SelectItem>
                  {divisionOptions.map((opt) => (
                    <SelectItem key={opt.key} value={opt.key}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Tag Filter */}
              {allTags.length > 0 && (
                <Select value={tagFilter} onValueChange={setTagFilter}>
                  <SelectTrigger className="w-[130px] bg-white/5 border-white/10">
                    <Tag className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-white/5 border-white/10">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => { setSortField("name"); setSortOrder("asc"); }}>
                    Name (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortField("name"); setSortOrder("desc"); }}>
                    Name (Z-A)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { setSortField("created_at"); setSortOrder("desc"); }}>
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortField("created_at"); setSortOrder("asc"); }}>
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { setSortField("updated_at"); setSortOrder("desc"); }}>
                    Recently Updated
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Mode */}
              <div className="flex border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "grid" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "list" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="gap-1 text-muted-foreground">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>

        {/* Contacts Grid/List */}
        {isLoading ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className={viewMode === "grid" ? "h-48" : "h-16"} />
            ))}
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No contacts found</h3>
            <p className="text-muted-foreground mb-6">
              {hasActiveFilters 
                ? "Try adjusting your filters or search query" 
                : "Add your first contact to get started"}
            </p>
            {!hasActiveFilters && (
              <div className="flex gap-3 justify-center">
                <Button onClick={() => setShowContactDialog(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Contact
                </Button>
              </div>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => {
              const DivIcon = getDivisionIcon(contact.division);
              return (
                <Link
                  key={contact.id}
                  to={`/portal/contacts/${contact.id}`}
                  className="glass-card p-5 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                        {getInitials(contact.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button 
                          className="p-1.5 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.preventDefault()}
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/portal/contacts/${contact.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteContact(contact.id);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3 className="font-medium text-foreground mb-1 truncate">{contact.full_name}</h3>
                  {contact.company && (
                    <p className="text-sm text-muted-foreground mb-3 truncate">{contact.company}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className={cn("text-xs", getTypeColor(contact.contact_type))}>
                      {contact.contact_type}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-white/5">
                      <DivIcon className="h-3 w-3 mr-1" />
                      {divisionOptions.find(d => d.key === contact.division)?.label?.split(' ')[0] || contact.division}
                    </Badge>
                    {contact.source === "google-contacts" && (
                      <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                        <Cloud className="h-3 w-3 mr-1" />
                        Google
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1.5 text-sm">
                    {contact.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Company</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Source</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id} className="group">
                    <TableCell>
                      <Link to={`/portal/contacts/${contact.id}`} className="flex items-center gap-3 hover:text-primary">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">
                            {getInitials(contact.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{contact.full_name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {contact.company || "-"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {contact.email || "-"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {contact.phone || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", getTypeColor(contact.contact_type))}>
                        {contact.contact_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {contact.source === "google-contacts" ? (
                        <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                          <Cloud className="h-3 w-3 mr-1" />
                          Google
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">{contact.source || "-"}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/portal/contacts/${contact.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* CSV Upload Dialog */}
      <Dialog open={showCSVUploader} onOpenChange={setShowCSVUploader}>
        <DialogContent className="glass-panel-strong max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-light">Import from CSV</DialogTitle>
          </DialogHeader>
          <CSVContactUploader onSuccess={() => {
            setShowCSVUploader(false);
            refetchContacts();
          }} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteContactId} onOpenChange={(open) => !open && setDeleteContactId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this contact? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteContact} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Contacts;
