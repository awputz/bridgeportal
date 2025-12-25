import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  Phone,
  Mail,
  User,
  Briefcase,
  Upload,
  Info
} from "lucide-react";
import { useCRMContacts, useCRMDeals, useDealStages, useCreateContact, useDeleteContact, useUpdateDeal, useDeleteDeal } from "@/hooks/useCRM";
import { useCRMRealtime } from "@/hooks/useCRMRealtime";
import { useDivision } from "@/contexts/DivisionContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import { CRMTable } from "@/components/portal/CRMTable";
import { CSVContactUploader } from "@/components/portal/CSVContactUploader";

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
  { value: "other", label: "Other" },
];

const CRM = () => {
  const { division, divisionConfig } = useDivision();
  const [activeTab, setActiveTab] = useState<"pipeline" | "contacts">("pipeline");
  const [search, setSearch] = useState("");
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showCSVUploader, setShowCSVUploader] = useState(false);
  const [deleteContactId, setDeleteContactId] = useState<string | null>(null);
  const [deleteDealId, setDeleteDealId] = useState<string | null>(null);

  const { data: contacts, isLoading: contactsLoading, refetch: refetchContacts } = useCRMContacts(division);
  const { data: deals, isLoading: dealsLoading } = useCRMDeals(division);
  const { data: stages, isLoading: stagesLoading } = useDealStages(division);
  const createContact = useCreateContact();
  const deleteContact = useDeleteContact();
  const updateDeal = useUpdateDeal();
  const deleteDeal = useDeleteDeal();

  // Subscribe to real-time CRM updates
  useCRMRealtime(division);

  // Filter contacts by search
  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    if (!search) return contacts;
    return contacts.filter(
      (c) =>
        c.full_name.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.company?.toLowerCase().includes(search.toLowerCase())
    );
  }, [contacts, search]);

  const isLoading = contactsLoading || dealsLoading || stagesLoading;

  const handleStageChange = (dealId: string, newStageId: string) => {
    updateDeal.mutate({ id: dealId, stage_id: newStageId });
  };

  const handleDeleteDeal = (dealId: string) => {
    setDeleteDealId(dealId);
  };

  const confirmDeleteDeal = () => {
    if (deleteDealId) {
      deleteDeal.mutate(deleteDealId);
      setDeleteDealId(null);
    }
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
      division,
      tags: [],
      notes: formData.get("notes") as string || null,
      address: null,
    }, {
      onSuccess: () => {
        setShowContactDialog(false);
        form.reset();
      },
    });
  };

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
              CRM
            </h1>
            <p className="text-muted-foreground font-light">
              Track your {divisionConfig.name.toLowerCase()} deals from lead to close
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* CSV Import Button */}
            <Dialog open={showCSVUploader} onOpenChange={setShowCSVUploader}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Import CSV
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-panel-strong max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-light">Import Contacts from CSV</DialogTitle>
                </DialogHeader>
                <CSVContactUploader 
                  onSuccess={() => {
                    setShowCSVUploader(false);
                    refetchContacts();
                  }} 
                />
              </DialogContent>
            </Dialog>

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
                    <div className="col-span-2 space-y-2">
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

        {/* Contextual Instructions */}
        <div className="glass-card p-4 mb-6 flex items-start gap-3 border-white/10">
          <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground font-light">
            <strong className="text-foreground font-normal">How to use:</strong> Use the Pipeline tab to track your active deals from lead to close. 
            Change deal status using the dropdown in the Status column. 
            Use the Contacts tab to manage your network and add new prospects.
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pipeline" | "contacts")}>
          <TabsList className="bg-transparent border-b border-white/10 rounded-none h-auto p-0 mb-6">
            <TabsTrigger
              value="pipeline"
              className="flex items-center gap-2 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground text-muted-foreground data-[state=active]:text-foreground bg-transparent data-[state=active]:bg-transparent cursor-pointer"
            >
              <Briefcase className="h-4 w-4" />
              Pipeline
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="flex items-center gap-2 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground text-muted-foreground data-[state=active]:text-foreground bg-transparent data-[state=active]:bg-transparent cursor-pointer"
            >
              <User className="h-4 w-4" />
              Contacts
            </TabsTrigger>
          </TabsList>

          {/* Pipeline View - Table Based */}
          <TabsContent value="pipeline" className="mt-0">
            <div className="flex items-center justify-between mb-4">
              <Link to="/portal/crm/deals/new">
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Deal
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <Skeleton className="h-96 w-full rounded-xl" />
            ) : stages && deals ? (
              <CRMTable
                deals={deals}
                stages={stages}
                onStageChange={handleStageChange}
                onDeleteDeal={handleDeleteDeal}
                division={division}
              />
            ) : null}

            {/* Empty state for pipeline */}
            {!isLoading && (!deals || deals.length === 0) && (
              <div className="text-center py-16 glass-card">
                <Briefcase className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-light text-foreground mb-2">No deals in your pipeline</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Create your first deal to start tracking your {divisionConfig.name.toLowerCase()} transactions from lead to close.
                </p>
                <Link to="/portal/crm/deals/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Deal
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Contacts View */}
          <TabsContent value="contacts" className="mt-0">
            {/* Search */}
            <div className="relative max-w-md mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts by name, email, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>

            {/* Contacts Grid */}
            {contactsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-xl" />
                ))}
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-16 glass-card">
                <User className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-light text-foreground mb-2">
                  {search ? "No contacts found" : "No contacts yet"}
                </h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  {search 
                    ? "Try a different search term" 
                    : "Build your network by adding contacts manually or importing from a CSV file."}
                </p>
                {!search && (
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => setShowCSVUploader(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Import CSV
                    </Button>
                    <Button onClick={() => setShowContactDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContacts.map((contact) => (
                  <div key={contact.id} className="glass-card p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0">
                        <h3 className="text-base font-light text-foreground truncate">
                          {contact.full_name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {contact.company || contact.contact_type}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/portal/crm/contacts/${contact.id}`}>
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteContact(contact.id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          className="p-2 rounded-full bg-white/5 hover:bg-white/10 cursor-pointer"
                        >
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </a>
                      )}
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          className="p-2 rounded-full bg-white/5 hover:bg-white/10 cursor-pointer"
                        >
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </a>
                      )}
                      <span className="ml-auto text-xs px-2 py-1 bg-white/10 rounded-full text-muted-foreground">
                        {contactTypes.find((t) => t.value === contact.contact_type)?.label || contact.contact_type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Contact Confirmation */}
      <AlertDialog open={!!deleteContactId} onOpenChange={() => setDeleteContactId(null)}>
        <AlertDialogContent className="glass-panel-strong">
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

      {/* Delete Deal Confirmation */}
      <AlertDialog open={!!deleteDealId} onOpenChange={() => setDeleteDealId(null)}>
        <AlertDialogContent className="glass-panel-strong">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Deal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this deal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDeal} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CRM;
