import { useState, useMemo, useEffect, useRef, useCallback } from "react";
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
  Filter,
  ChevronDown,
  Check,
  Cloud,
  CloudOff,
  ExternalLink,
  GitMerge,
  AlertTriangle,
  Linkedin,
  Calendar,
  Globe,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { FAB } from "@/components/ui/fab";
import { useCRMContacts, useCreateContact, useDeleteContact, CRMContact } from "@/hooks/useCRM";
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
import { ContactProfileSlideOver } from "@/components/portal/ContactProfileSlideOver";
import { ContactAlphaScroll, groupContactsByLetter } from "@/components/portal/ContactAlphaScroll";
import { ContactMergeWizard, findDuplicateContacts } from "@/components/portal/ContactMergeWizard";
import { AddressAutocomplete, AddressComponents } from "@/components/ui/AddressAutocomplete";
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

// Google Sync Status Badge Component - Compact on mobile
const GoogleSyncStatus = ({ isMobile = false }: { isMobile?: boolean }) => {
  const { data: connectionData, isLoading: isCheckingConnection, refetch } = useContactsConnection();
  const connectContacts = useConnectContacts();
  const disconnectContacts = useDisconnectContacts();
  const { isLoading: isSyncing, googleContactsCount } = useAutoSyncContacts();

  if (isCheckingConnection) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        {!isMobile && <span>Checking sync...</span>}
      </div>
    );
  }

  if (!connectionData?.connected) {
    // Mobile: Just a small icon button
    if (isMobile) {
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => connectContacts.mutate()}
          disabled={connectContacts.isPending}
          className="h-8 w-8"
        >
          {connectContacts.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CloudOff className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      );
    }
    
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

  // Mobile: Compact connected indicator
  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 relative">
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin text-green-400" />
            ) : (
              <Cloud className="h-4 w-4 text-green-400" />
            )}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => window.open('https://contacts.google.com', '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Google Contacts
          </DropdownMenuItem>
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
    );
  }

  // Desktop: Full connected UI
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
                  <span>Connected</span>
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
                <DropdownMenuItem onClick={() => window.open('https://contacts.google.com', '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Google Contacts
                </DropdownMenuItem>
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
  const isMobile = useIsMobile();
  const { division } = useDivision();
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showCSVUploader, setShowCSVUploader] = useState(false);
  const [deleteContactId, setDeleteContactId] = useState<string | null>(null);
  
  // Slide-over state
  const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);
  const [showProfileSlideOver, setShowProfileSlideOver] = useState(false);
  
  // Merge wizard state
  const [showMergeWizard, setShowMergeWizard] = useState(false);
  const [duplicateGroups, setDuplicateGroups] = useState<CRMContact[][]>([]);
  const [currentMergeGroup, setCurrentMergeGroup] = useState<CRMContact[]>([]);
  
  // Alpha scroll state
  const [currentLetter, setCurrentLetter] = useState<string | undefined>();
  const letterRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // Filters
  const [contactTypeFilter, setContactTypeFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Fetch contacts without division filter to get all contacts
  const { data: allContacts, isLoading, refetch: refetchContacts } = useCRMContacts();
  const createContact = useCreateContact();
  const deleteContact = useDeleteContact();

  // Subscribe to real-time CRM updates
  useCRMRealtime();
  
  // Auto-sync Google Contacts
  useAutoSyncContacts();

  // Detect duplicates when contacts load
  useEffect(() => {
    if (allContacts && allContacts.length > 0) {
      const duplicates = findDuplicateContacts(allContacts);
      setDuplicateGroups(duplicates);
    }
  }, [allContacts]);

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

  // Group contacts by letter for alpha scroll
  const groupedContacts = useMemo(() => {
    if (sortField !== "name") return null;
    return groupContactsByLetter(filteredContacts);
  }, [filteredContacts, sortField]);

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

  const handleContactClick = (contact: CRMContact) => {
    setSelectedContact(contact);
    setShowProfileSlideOver(true);
  };

  const handleLetterClick = useCallback((letter: string) => {
    const ref = letterRefs.current.get(letter);
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentLetter(letter);
    }
  }, []);

  const handleStartMerge = (group: CRMContact[]) => {
    setCurrentMergeGroup(group);
    setShowMergeWizard(true);
  };

// State for new contact form
  const [newContactAddress, setNewContactAddress] = useState("");
  const [newContactAddressData, setNewContactAddressData] = useState<AddressComponents | null>(null);

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
      title: formData.get("title") as string || null,
      contact_type: formData.get("contact_type") as string || "prospect",
      source: formData.get("source") as string || null,
      division: formData.get("division") as Division || division,
      tags: [],
      notes: formData.get("notes") as string || null,
      address: newContactAddressData?.fullAddress || newContactAddress || null,
      street_address: newContactAddressData?.streetAddress || null,
      city: newContactAddressData?.city || null,
      state: newContactAddressData?.state || null,
      zip_code: newContactAddressData?.zipCode || null,
      country: newContactAddressData?.country || "USA",
      linkedin_url: formData.get("linkedin_url") as string || null,
      secondary_email: formData.get("secondary_email") as string || null,
      secondary_phone: formData.get("secondary_phone") as string || null,
      company_website: formData.get("company_website") as string || null,
      preferred_contact_method: formData.get("preferred_contact_method") as string || "email",
      birthday: formData.get("birthday") as string || null,
      portfolio_size: formData.get("portfolio_size") ? parseFloat(formData.get("portfolio_size") as string) : null,
      investor_profile: formData.get("investor_profile") as string || null,
    }, {
      onSuccess: () => {
        setShowContactDialog(false);
        setNewContactAddress("");
        setNewContactAddressData(null);
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

  // Render contact card (used in both grid and grouped views)
  const renderContactCard = (contact: CRMContact) => {
    const DivIcon = getDivisionIcon(contact.division);
    
    // Mobile-optimized card
    if (isMobile) {
      return (
        <button
          key={contact.id}
          onClick={() => handleContactClick(contact)}
          className="glass-card p-5 hover:bg-white/5 transition-colors group text-left w-full"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarFallback className="bg-primary/20 text-primary text-base font-medium">
                {getInitials(contact.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{contact.full_name}</h3>
              {contact.company && (
                <p className="text-sm text-muted-foreground truncate">{contact.company}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", getTypeColor(contact.contact_type))}>
                  {contact.contact_type}
                </Badge>
                {contact.source === "google-contacts" && (
                  <Cloud className="h-3 w-3 text-blue-400" />
                )}
              </div>
            </div>
            {/* Quick action buttons */}
            <div className="flex flex-col gap-1 shrink-0">
              {contact.phone && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `tel:${contact.phone}`;
                  }}
                  className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20"
                >
                  <Phone className="h-4 w-4" />
                </button>
              )}
              {contact.email && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `mailto:${contact.email}`;
                  }}
                  className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                >
                  <Mail className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </button>
      );
    }
    
    // Desktop card - cleaner, more spacious
    return (
      <button
        key={contact.id}
        onClick={() => handleContactClick(contact)}
        className="glass-card p-6 hover:bg-white/5 transition-colors group text-left w-full"
      >
        <div className="flex items-start justify-between mb-5">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary/20 text-primary text-base font-medium">
              {getInitials(contact.full_name)}
            </AvatarFallback>
          </Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="p-1.5 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleContactClick(contact); }}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteContact(contact.id);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="font-medium text-lg text-foreground mb-1 truncate">{contact.full_name}</h3>
        {contact.company && (
          <p className="text-sm text-muted-foreground mb-4 truncate">{contact.company}</p>
        )}

        <div className="flex items-center gap-2 mb-5">
          <Badge variant="outline" className={cn("text-xs", getTypeColor(contact.contact_type))}>
            {contact.contact_type}
          </Badge>
          {contact.source === "google-contacts" && (
            <Cloud className="h-4 w-4 text-blue-400" />
          )}
        </div>

        {/* Quick contact icons - subtle, appear on hover */}
        <div className="flex items-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
          {contact.email && (
            <Mail className="h-4 w-4 text-muted-foreground" />
          )}
          {contact.phone && (
            <Phone className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {/* Header - Clean, spacious layout */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div className="flex items-start justify-between md:block">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extralight text-foreground mb-2">
                Contacts
              </h1>
              {!isMobile && (
                <p className="text-muted-foreground font-light">
                  Manage your network of clients, prospects, and partners
                </p>
              )}
            </div>
            <div className="md:hidden">
              <GoogleSyncStatus isMobile />
            </div>
          </div>

          {/* Desktop action buttons */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            <GoogleSyncStatus />
            
            {/* Merge Duplicates Button */}
            {duplicateGroups.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                    <AlertTriangle className="h-4 w-4" />
                    {duplicateGroups.length} Duplicate{duplicateGroups.length > 1 ? "s" : ""}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  {duplicateGroups.slice(0, 5).map((group, idx) => (
                    <DropdownMenuItem 
                      key={idx} 
                      onClick={() => handleStartMerge(group)}
                      className="flex items-center gap-2"
                    >
                      <GitMerge className="h-4 w-4 text-yellow-400" />
                      <span className="truncate">
                        {group.map(c => c.full_name).join(" & ")}
                      </span>
                    </DropdownMenuItem>
                  ))}
                  {duplicateGroups.length > 5 && (
                    <DropdownMenuItem className="text-muted-foreground">
                      +{duplicateGroups.length - 5} more duplicates
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
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

        {/* Search & Filters Bar - Spacious layout */}
        <div className="glass-card px-5 py-4 mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isMobile ? "Search..." : "Search contacts..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 h-10"
              />
            </div>
            
            {/* Contact count - integrated into bar */}
            <span className="text-sm text-muted-foreground hidden lg:inline whitespace-nowrap">
              {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
            </span>
            
            {/* Unified Filters Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 h-10 bg-white/5 border-white/10 px-2 md:px-3">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="h-5 w-5 p-0 text-xs flex items-center justify-center bg-primary text-primary-foreground">
                      {(contactTypeFilter !== "all" ? 1 : 0) + 
                       (sourceFilter !== "all" ? 1 : 0) + 
                       (divisionFilter !== "all" ? 1 : 0) + 
                       (tagFilter !== "all" ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {/* Type Section */}
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Contact Type</p>
                </div>
                <DropdownMenuItem onClick={() => setContactTypeFilter("all")} className={cn(contactTypeFilter === "all" && "bg-muted")}>
                  <Check className={cn("h-4 w-4 mr-2", contactTypeFilter !== "all" && "opacity-0")} />
                  All Types
                </DropdownMenuItem>
                {contactTypes.slice(0, 5).map((type) => (
                  <DropdownMenuItem 
                    key={type.value} 
                    onClick={() => setContactTypeFilter(type.value)}
                    className={cn(contactTypeFilter === type.value && "bg-muted")}
                  >
                    <Check className={cn("h-4 w-4 mr-2", contactTypeFilter !== type.value && "opacity-0")} />
                    {type.label}
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator />
                
                {/* Division Section */}
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Division</p>
                </div>
                <DropdownMenuItem onClick={() => setDivisionFilter("all")} className={cn(divisionFilter === "all" && "bg-muted")}>
                  <Check className={cn("h-4 w-4 mr-2", divisionFilter !== "all" && "opacity-0")} />
                  All Divisions
                </DropdownMenuItem>
                {divisionOptions.map((opt) => (
                  <DropdownMenuItem 
                    key={opt.key} 
                    onClick={() => setDivisionFilter(opt.key)}
                    className={cn(divisionFilter === opt.key && "bg-muted")}
                  >
                    <Check className={cn("h-4 w-4 mr-2", divisionFilter !== opt.key && "opacity-0")} />
                    {opt.label}
                  </DropdownMenuItem>
                ))}
                
                {hasActiveFilters && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={clearAllFilters} className="text-muted-foreground">
                      <X className="h-4 w-4 mr-2" />
                      Clear all filters
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 h-10 bg-white/5 border-white/10 px-2 md:px-3">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="hidden sm:inline">Sort</span>
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
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode - hidden on mobile */}
            <div className="hidden md:flex border border-white/10 rounded-lg overflow-hidden">
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
          </div>
        </div>


        {/* Contacts Grid/List */}
        {isLoading ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className={viewMode === "grid" ? "h-48" : "h-16"} />
            ))}
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <Users className="h-14 w-14 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-medium mb-3">No contacts found</h3>
            <p className="text-muted-foreground mb-8">
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
        ) : viewMode === "grid" && sortField === "name" && groupedContacts ? (
          // Grouped alphabetical view
          <div className="space-y-10">
            {Array.from(groupedContacts.entries()).map(([letter, contacts]) => (
              <div 
                key={letter} 
                ref={(el) => { if (el) letterRefs.current.set(letter, el); }}
              >
                <div className="sticky top-0 bg-background/90 backdrop-blur-sm z-10 py-3 mb-4 border-b border-border/30">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{letter}</span>
                </div>
                <div className={cn(
                  "grid gap-4",
                  isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-5"
                )}>
                  {contacts.map(renderContactCard)}
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === "grid" ? (
          <div className={cn(
            "grid gap-4",
            isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-5"
          )}>
            {filteredContacts.map(renderContactCard)}
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
                  <TableRow 
                    key={contact.id} 
                    className="group cursor-pointer"
                    onClick={() => handleContactClick(contact)}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3 hover:text-primary">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">
                            {getInitials(contact.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{contact.full_name}</span>
                      </div>
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
                          <button 
                            className="p-1.5 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleContactClick(contact); }}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={(e) => { e.stopPropagation(); handleDeleteContact(contact.id); }}
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

      {/* Alpha Scroll - only show in grid view with name sorting on desktop */}
      {!isMobile && viewMode === "grid" && sortField === "name" && filteredContacts.length > 10 && (
        <ContactAlphaScroll
          contacts={filteredContacts}
          currentLetter={currentLetter}
          onLetterClick={handleLetterClick}
        />
      )}

      {/* Mobile FAB for Add Contact - positioned above bottom nav */}
      {isMobile && (
        <button
          onClick={() => setShowContactDialog(true)}
          className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* Contact Profile Slide-Over */}
      <ContactProfileSlideOver
        contact={selectedContact}
        open={showProfileSlideOver}
        onOpenChange={setShowProfileSlideOver}
        onContactDeleted={() => refetchContacts()}
      />

      {/* Merge Wizard */}
      <ContactMergeWizard
        contacts={currentMergeGroup}
        open={showMergeWizard}
        onOpenChange={setShowMergeWizard}
        onMergeComplete={() => refetchContacts()}
      />

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
            <AlertDialogAction 
              onClick={confirmDeleteContact}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Contacts;
