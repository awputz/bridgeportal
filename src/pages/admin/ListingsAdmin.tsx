import { useState } from "react";
import { Building2, Users, Trash2, Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatFullCurrency } from "@/lib/formatters";
import { 
  useInvestmentListingsAdmin, 
  useCommercialListingsAdmin 
} from "@/hooks/useListingsAdmin";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { supabase } from "@/integrations/supabase/client";
import { useMutation } from "@tanstack/react-query";

// Investment listing form type
type InvestmentFormData = {
  property_address: string;
  asset_class: string;
  borough: string;
  neighborhood: string;
  asking_price: string;
  units: string;
  gross_sf: string;
  cap_rate: string;
  year_built: string;
  description: string;
  image_url: string;
  om_url: string;
  deal_room_password: string;
  is_active: boolean;
};

// Commercial listing form type
type CommercialFormData = {
  property_address: string;
  listing_type: string;
  borough: string;
  neighborhood: string;
  building_name: string;
  square_footage: string;
  asking_rent: string;
  rent_per_sf: string;
  ceiling_height_ft: string;
  lease_term: string;
  possession: string;
  description: string;
  image_url: string;
  flyer_url: string;
  is_active: boolean;
};

const defaultInvestmentForm: InvestmentFormData = {
  property_address: "",
  asset_class: "Multifamily",
  borough: "",
  neighborhood: "",
  asking_price: "",
  units: "",
  gross_sf: "",
  cap_rate: "",
  year_built: "",
  description: "",
  image_url: "",
  om_url: "",
  deal_room_password: "bridgedeals",
  is_active: true,
};

const defaultCommercialForm: CommercialFormData = {
  property_address: "",
  listing_type: "Office",
  borough: "",
  neighborhood: "",
  building_name: "",
  square_footage: "",
  asking_rent: "",
  rent_per_sf: "",
  ceiling_height_ft: "",
  lease_term: "",
  possession: "",
  description: "",
  image_url: "",
  flyer_url: "",
  is_active: true,
};

const ASSET_CLASSES = ["Multifamily", "Mixed-Use", "Retail", "Office", "Development", "Land", "Industrial", "Hotel"];
const LISTING_TYPES = ["Office", "Retail", "Industrial", "Flex", "Medical", "Restaurant"];
const BOROUGHS = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];

const ListingsAdmin = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("investment");
  
  // Dialog states
  const [investmentDialogOpen, setInvestmentDialogOpen] = useState(false);
  const [commercialDialogOpen, setCommercialDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form states
  const [investmentForm, setInvestmentForm] = useState<InvestmentFormData>(defaultInvestmentForm);
  const [commercialForm, setCommercialForm] = useState<CommercialFormData>(defaultCommercialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ id: string; type: "investment" | "commercial" } | null>(null);
  
  // Agent assignment states
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("exclusive");

  const { listings: investmentListings, isLoading: investmentLoading } = useInvestmentListingsAdmin();
  const { listings: commercialListings, isLoading: commercialLoading } = useCommercialListingsAdmin();
  const { data: teamMembers } = useTeamMembers();

  // Investment CRUD mutations
  const createInvestmentListing = useMutation({
    mutationFn: async (data: Partial<InvestmentFormData>) => {
      const { error } = await supabase.from("investment_listings").insert({
        property_address: data.property_address,
        asset_class: data.asset_class,
        borough: data.borough || null,
        neighborhood: data.neighborhood || null,
        asking_price: data.asking_price ? Number(data.asking_price) : null,
        units: data.units ? Number(data.units) : null,
        gross_sf: data.gross_sf ? Number(data.gross_sf) : null,
        cap_rate: data.cap_rate ? Number(data.cap_rate) : null,
        year_built: data.year_built ? Number(data.year_built) : null,
        description: data.description || null,
        image_url: data.image_url || null,
        om_url: data.om_url || null,
        deal_room_password: data.deal_room_password || "bridgedeals",
        is_active: data.is_active ?? true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-investment-listings"] });
      toast.success("Investment listing created");
      setInvestmentDialogOpen(false);
      setInvestmentForm(defaultInvestmentForm);
    },
    onError: (error: any) => toast.error("Failed to create listing: " + error.message),
  });

  const updateInvestmentListing = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InvestmentFormData> }) => {
      const { error } = await supabase.from("investment_listings").update({
        property_address: data.property_address,
        asset_class: data.asset_class,
        borough: data.borough || null,
        neighborhood: data.neighborhood || null,
        asking_price: data.asking_price ? Number(data.asking_price) : null,
        units: data.units ? Number(data.units) : null,
        gross_sf: data.gross_sf ? Number(data.gross_sf) : null,
        cap_rate: data.cap_rate ? Number(data.cap_rate) : null,
        year_built: data.year_built ? Number(data.year_built) : null,
        description: data.description || null,
        image_url: data.image_url || null,
        om_url: data.om_url || null,
        deal_room_password: data.deal_room_password || "bridgedeals",
        is_active: data.is_active,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-investment-listings"] });
      toast.success("Investment listing updated");
      setInvestmentDialogOpen(false);
      setInvestmentForm(defaultInvestmentForm);
      setEditingId(null);
    },
    onError: (error: any) => toast.error("Failed to update listing: " + error.message),
  });

  const deleteInvestmentListing = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("investment_listings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-investment-listings"] });
      toast.success("Investment listing deleted");
      setDeleteDialogOpen(false);
      setDeletingItem(null);
    },
    onError: (error: any) => toast.error("Failed to delete listing: " + error.message),
  });

  const toggleInvestmentActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("investment_listings").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-investment-listings"] });
      toast.success("Listing status updated");
    },
    onError: (error: any) => toast.error("Failed to update status: " + error.message),
  });

  // Commercial CRUD mutations
  const createCommercialListing = useMutation({
    mutationFn: async (data: Partial<CommercialFormData>) => {
      const { error } = await supabase.from("commercial_listings").insert({
        property_address: data.property_address,
        listing_type: data.listing_type,
        borough: data.borough || null,
        neighborhood: data.neighborhood || null,
        building_name: data.building_name || null,
        square_footage: data.square_footage ? Number(data.square_footage) : 0,
        asking_rent: data.asking_rent ? Number(data.asking_rent) : null,
        rent_per_sf: data.rent_per_sf ? Number(data.rent_per_sf) : null,
        ceiling_height_ft: data.ceiling_height_ft ? Number(data.ceiling_height_ft) : null,
        lease_term: data.lease_term || null,
        possession: data.possession || null,
        description: data.description || null,
        image_url: data.image_url || null,
        flyer_url: data.flyer_url || null,
        is_active: data.is_active ?? true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commercial-listings"] });
      toast.success("Commercial listing created");
      setCommercialDialogOpen(false);
      setCommercialForm(defaultCommercialForm);
    },
    onError: (error: any) => toast.error("Failed to create listing: " + error.message),
  });

  const updateCommercialListing = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CommercialFormData> }) => {
      const { error } = await supabase.from("commercial_listings").update({
        property_address: data.property_address,
        listing_type: data.listing_type,
        borough: data.borough || null,
        neighborhood: data.neighborhood || null,
        building_name: data.building_name || null,
        square_footage: data.square_footage ? Number(data.square_footage) : 0,
        asking_rent: data.asking_rent ? Number(data.asking_rent) : null,
        rent_per_sf: data.rent_per_sf ? Number(data.rent_per_sf) : null,
        ceiling_height_ft: data.ceiling_height_ft ? Number(data.ceiling_height_ft) : null,
        lease_term: data.lease_term || null,
        possession: data.possession || null,
        description: data.description || null,
        image_url: data.image_url || null,
        flyer_url: data.flyer_url || null,
        is_active: data.is_active,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commercial-listings"] });
      toast.success("Commercial listing updated");
      setCommercialDialogOpen(false);
      setCommercialForm(defaultCommercialForm);
      setEditingId(null);
    },
    onError: (error: any) => toast.error("Failed to update listing: " + error.message),
  });

  const deleteCommercialListing = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("commercial_listings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commercial-listings"] });
      toast.success("Commercial listing deleted");
      setDeleteDialogOpen(false);
      setDeletingItem(null);
    },
    onError: (error: any) => toast.error("Failed to delete listing: " + error.message),
  });

  const toggleCommercialActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("commercial_listings").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commercial-listings"] });
      toast.success("Listing status updated");
    },
    onError: (error: any) => toast.error("Failed to update status: " + error.message),
  });

  // Agent assignment mutations
  const assignInvestmentAgent = useMutation({
    mutationFn: async ({ listingId, agentId, role }: { listingId: string; agentId: string; role: string }) => {
      const { error } = await supabase.from("investment_listing_agents").insert({
        listing_id: listingId,
        agent_id: agentId,
        role: role,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-investment-listings"] });
      toast.success("Agent assigned");
      setAssignDialogOpen(false);
      resetAssignForm();
    },
    onError: (error: any) => toast.error("Failed to assign agent: " + error.message),
  });

  const assignCommercialAgent = useMutation({
    mutationFn: async ({ listingId, agentId, role }: { listingId: string; agentId: string; role: string }) => {
      const { error } = await supabase.from("commercial_listing_agents").insert({
        listing_id: listingId,
        agent_id: agentId,
        role: role,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commercial-listings"] });
      toast.success("Agent assigned");
      setAssignDialogOpen(false);
      resetAssignForm();
    },
    onError: (error: any) => toast.error("Failed to assign agent: " + error.message),
  });

  const removeInvestmentAgent = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase.from("investment_listing_agents").delete().eq("id", assignmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-investment-listings"] });
      toast.success("Agent removed");
    },
    onError: (error: any) => toast.error("Failed to remove agent: " + error.message),
  });

  const removeCommercialAgent = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase.from("commercial_listing_agents").delete().eq("id", assignmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commercial-listings"] });
      toast.success("Agent removed");
    },
    onError: (error: any) => toast.error("Failed to remove agent: " + error.message),
  });

  const resetAssignForm = () => {
    setSelectedListing(null);
    setSelectedAgentId("");
    setSelectedRole("exclusive");
  };

  const handleAssignAgent = () => {
    if (!selectedListing || !selectedAgentId) return;
    if (activeTab === "investment") {
      assignInvestmentAgent.mutate({ listingId: selectedListing.id, agentId: selectedAgentId, role: selectedRole });
    } else {
      assignCommercialAgent.mutate({ listingId: selectedListing.id, agentId: selectedAgentId, role: selectedRole });
    }
  };

  const handleRemoveAgent = (assignmentId: string) => {
    if (activeTab === "investment") {
      removeInvestmentAgent.mutate(assignmentId);
    } else {
      removeCommercialAgent.mutate(assignmentId);
    }
  };

  const openEditInvestment = (listing: any) => {
    setEditingId(listing.id);
    setInvestmentForm({
      property_address: listing.property_address || "",
      asset_class: listing.asset_class || "Multifamily",
      borough: listing.borough || "",
      neighborhood: listing.neighborhood || "",
      asking_price: listing.asking_price?.toString() || "",
      units: listing.units?.toString() || "",
      gross_sf: listing.gross_sf?.toString() || "",
      cap_rate: listing.cap_rate?.toString() || "",
      year_built: listing.year_built?.toString() || "",
      description: listing.description || "",
      image_url: listing.image_url || "",
      om_url: listing.om_url || "",
      deal_room_password: listing.deal_room_password || "bridgedeals",
      is_active: listing.is_active ?? true,
    });
    setInvestmentDialogOpen(true);
  };

  const openEditCommercial = (listing: any) => {
    setEditingId(listing.id);
    setCommercialForm({
      property_address: listing.property_address || "",
      listing_type: listing.listing_type || "Office",
      borough: listing.borough || "",
      neighborhood: listing.neighborhood || "",
      building_name: listing.building_name || "",
      square_footage: listing.square_footage?.toString() || "",
      asking_rent: listing.asking_rent?.toString() || "",
      rent_per_sf: listing.rent_per_sf?.toString() || "",
      ceiling_height_ft: listing.ceiling_height_ft?.toString() || "",
      lease_term: listing.lease_term || "",
      possession: listing.possession || "",
      description: listing.description || "",
      image_url: listing.image_url || "",
      flyer_url: listing.flyer_url || "",
      is_active: listing.is_active ?? true,
    });
    setCommercialDialogOpen(true);
  };

  const handleInvestmentSubmit = () => {
    if (!investmentForm.property_address || !investmentForm.asset_class) {
      toast.error("Property address and asset class are required");
      return;
    }
    if (editingId) {
      updateInvestmentListing.mutate({ id: editingId, data: investmentForm });
    } else {
      createInvestmentListing.mutate(investmentForm);
    }
  };

  const handleCommercialSubmit = () => {
    if (!commercialForm.property_address || !commercialForm.listing_type) {
      toast.error("Property address and listing type are required");
      return;
    }
    if (editingId) {
      updateCommercialListing.mutate({ id: editingId, data: commercialForm });
    } else {
      createCommercialListing.mutate(commercialForm);
    }
  };

  const confirmDelete = () => {
    if (!deletingItem) return;
    if (deletingItem.type === "investment") {
      deleteInvestmentListing.mutate(deletingItem.id);
    } else {
      deleteCommercialListing.mutate(deletingItem.id);
    }
  };

  const renderInvestmentTable = () => {
    if (!investmentListings || investmentListings.length === 0) {
      return (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No investment listings found</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className="border-border/50">
            <TableHead>Property</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Agents</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investmentListings.map((listing) => (
            <TableRow key={listing.id} className="border-border/30">
              <TableCell>
                <div className="flex items-center gap-3">
                  {listing.image_url ? (
                    <img src={listing.image_url} alt={listing.property_address} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{listing.property_address}</p>
                    <p className="text-xs text-muted-foreground">{listing.asset_class}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {[listing.neighborhood, listing.borough].filter(Boolean).join(", ") || "—"}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-foreground">{formatFullCurrency(listing.asking_price)}</span>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {listing.investment_listing_agents && listing.investment_listing_agents.length > 0 ? (
                    listing.investment_listing_agents.map((assignment: any) => (
                      <Badge key={assignment.id} variant="secondary" className="text-xs flex items-center gap-1">
                        {assignment.team_members?.name || "Unknown"}
                        <button onClick={() => handleRemoveAgent(assignment.id)} className="ml-1 hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Switch
                  checked={listing.is_active ?? true}
                  onCheckedChange={(checked) => toggleInvestmentActive.mutate({ id: listing.id, is_active: checked })}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { setSelectedListing(listing); setAssignDialogOpen(true); }}>
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditInvestment(listing)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { setDeletingItem({ id: listing.id, type: "investment" }); setDeleteDialogOpen(true); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderCommercialTable = () => {
    if (!commercialListings || commercialListings.length === 0) {
      return (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No commercial listings found</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className="border-border/50">
            <TableHead>Property</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Rent</TableHead>
            <TableHead>Agents</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commercialListings.map((listing) => (
            <TableRow key={listing.id} className="border-border/30">
              <TableCell>
                <div className="flex items-center gap-3">
                  {listing.image_url ? (
                    <img src={listing.image_url} alt={listing.property_address} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{listing.property_address}</p>
                    <p className="text-xs text-muted-foreground">{listing.listing_type}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {[listing.neighborhood, listing.borough].filter(Boolean).join(", ") || "—"}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-foreground">
                  {listing.asking_rent ? formatFullCurrency(listing.asking_rent) + "/yr" : "—"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {listing.commercial_listing_agents && listing.commercial_listing_agents.length > 0 ? (
                    listing.commercial_listing_agents.map((assignment: any) => (
                      <Badge key={assignment.id} variant="secondary" className="text-xs flex items-center gap-1">
                        {assignment.team_members?.name || "Unknown"}
                        <button onClick={() => handleRemoveAgent(assignment.id)} className="ml-1 hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Switch
                  checked={listing.is_active ?? true}
                  onCheckedChange={(checked) => toggleCommercialActive.mutate({ id: listing.id, is_active: checked })}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { setSelectedListing(listing); setAssignDialogOpen(true); }}>
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditCommercial(listing)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { setDeletingItem({ id: listing.id, type: "commercial" }); setDeleteDialogOpen(true); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-foreground">Manage Listings</h1>
          <p className="text-muted-foreground">Create, edit, and manage property listings</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="investment" className="data-[state=active]:bg-background">
              Investment Sales ({investmentListings?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="commercial" className="data-[state=active]:bg-background">
              Commercial ({commercialListings?.length || 0})
            </TabsTrigger>
          </TabsList>
          <Button
            onClick={() => {
              setEditingId(null);
              if (activeTab === "investment") {
                setInvestmentForm(defaultInvestmentForm);
                setInvestmentDialogOpen(true);
              } else {
                setCommercialForm(defaultCommercialForm);
                setCommercialDialogOpen(true);
              }
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add {activeTab === "investment" ? "Investment" : "Commercial"} Listing
          </Button>
        </div>

        <TabsContent value="investment" className="mt-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              {investmentLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
              ) : (
                renderInvestmentTable()
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commercial" className="mt-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              {commercialLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
              ) : (
                renderCommercialTable()
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Investment Listing Dialog */}
      <Dialog open={investmentDialogOpen} onOpenChange={(open) => { setInvestmentDialogOpen(open); if (!open) { setEditingId(null); setInvestmentForm(defaultInvestmentForm); } }}>
        <DialogContent className="bg-background border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Add"} Investment Listing</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="col-span-2">
              <Label>Property Address *</Label>
              <Input value={investmentForm.property_address} onChange={(e) => setInvestmentForm({ ...investmentForm, property_address: e.target.value })} />
            </div>
            <div>
              <Label>Asset Class *</Label>
              <Select value={investmentForm.asset_class} onValueChange={(v) => setInvestmentForm({ ...investmentForm, asset_class: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ASSET_CLASSES.map((ac) => <SelectItem key={ac} value={ac}>{ac}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Borough</Label>
              <Select value={investmentForm.borough} onValueChange={(v) => setInvestmentForm({ ...investmentForm, borough: v })}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {BOROUGHS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Neighborhood</Label>
              <Input value={investmentForm.neighborhood} onChange={(e) => setInvestmentForm({ ...investmentForm, neighborhood: e.target.value })} />
            </div>
            <div>
              <Label>Asking Price</Label>
              <Input type="number" value={investmentForm.asking_price} onChange={(e) => setInvestmentForm({ ...investmentForm, asking_price: e.target.value })} />
            </div>
            <div>
              <Label>Units</Label>
              <Input type="number" value={investmentForm.units} onChange={(e) => setInvestmentForm({ ...investmentForm, units: e.target.value })} />
            </div>
            <div>
              <Label>Gross SF</Label>
              <Input type="number" value={investmentForm.gross_sf} onChange={(e) => setInvestmentForm({ ...investmentForm, gross_sf: e.target.value })} />
            </div>
            <div>
              <Label>Cap Rate (%)</Label>
              <Input type="number" step="0.01" value={investmentForm.cap_rate} onChange={(e) => setInvestmentForm({ ...investmentForm, cap_rate: e.target.value })} />
            </div>
            <div>
              <Label>Year Built</Label>
              <Input type="number" value={investmentForm.year_built} onChange={(e) => setInvestmentForm({ ...investmentForm, year_built: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>Image URL</Label>
              <Input value={investmentForm.image_url} onChange={(e) => setInvestmentForm({ ...investmentForm, image_url: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>OM URL</Label>
              <Input value={investmentForm.om_url} onChange={(e) => setInvestmentForm({ ...investmentForm, om_url: e.target.value })} />
            </div>
            <div>
              <Label>Deal Room Password</Label>
              <Input value={investmentForm.deal_room_password} onChange={(e) => setInvestmentForm({ ...investmentForm, deal_room_password: e.target.value })} />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch checked={investmentForm.is_active} onCheckedChange={(c) => setInvestmentForm({ ...investmentForm, is_active: c })} />
              <Label>Active</Label>
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea value={investmentForm.description} onChange={(e) => setInvestmentForm({ ...investmentForm, description: e.target.value })} rows={3} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setInvestmentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleInvestmentSubmit} disabled={createInvestmentListing.isPending || updateInvestmentListing.isPending}>
              {editingId ? "Save Changes" : "Create Listing"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Commercial Listing Dialog */}
      <Dialog open={commercialDialogOpen} onOpenChange={(open) => { setCommercialDialogOpen(open); if (!open) { setEditingId(null); setCommercialForm(defaultCommercialForm); } }}>
        <DialogContent className="bg-background border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Add"} Commercial Listing</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="col-span-2">
              <Label>Property Address *</Label>
              <Input value={commercialForm.property_address} onChange={(e) => setCommercialForm({ ...commercialForm, property_address: e.target.value })} />
            </div>
            <div>
              <Label>Listing Type *</Label>
              <Select value={commercialForm.listing_type} onValueChange={(v) => setCommercialForm({ ...commercialForm, listing_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LISTING_TYPES.map((lt) => <SelectItem key={lt} value={lt}>{lt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Borough</Label>
              <Select value={commercialForm.borough} onValueChange={(v) => setCommercialForm({ ...commercialForm, borough: v })}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {BOROUGHS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Neighborhood</Label>
              <Input value={commercialForm.neighborhood} onChange={(e) => setCommercialForm({ ...commercialForm, neighborhood: e.target.value })} />
            </div>
            <div>
              <Label>Building Name</Label>
              <Input value={commercialForm.building_name} onChange={(e) => setCommercialForm({ ...commercialForm, building_name: e.target.value })} />
            </div>
            <div>
              <Label>Square Footage</Label>
              <Input type="number" value={commercialForm.square_footage} onChange={(e) => setCommercialForm({ ...commercialForm, square_footage: e.target.value })} />
            </div>
            <div>
              <Label>Asking Rent (Annual)</Label>
              <Input type="number" value={commercialForm.asking_rent} onChange={(e) => setCommercialForm({ ...commercialForm, asking_rent: e.target.value })} />
            </div>
            <div>
              <Label>Rent Per SF</Label>
              <Input type="number" step="0.01" value={commercialForm.rent_per_sf} onChange={(e) => setCommercialForm({ ...commercialForm, rent_per_sf: e.target.value })} />
            </div>
            <div>
              <Label>Ceiling Height (ft)</Label>
              <Input type="number" step="0.1" value={commercialForm.ceiling_height_ft} onChange={(e) => setCommercialForm({ ...commercialForm, ceiling_height_ft: e.target.value })} />
            </div>
            <div>
              <Label>Lease Term</Label>
              <Input value={commercialForm.lease_term} onChange={(e) => setCommercialForm({ ...commercialForm, lease_term: e.target.value })} placeholder="e.g. 5-10 years" />
            </div>
            <div>
              <Label>Possession</Label>
              <Input value={commercialForm.possession} onChange={(e) => setCommercialForm({ ...commercialForm, possession: e.target.value })} placeholder="e.g. Immediate" />
            </div>
            <div className="col-span-2">
              <Label>Image URL</Label>
              <Input value={commercialForm.image_url} onChange={(e) => setCommercialForm({ ...commercialForm, image_url: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>Flyer URL</Label>
              <Input value={commercialForm.flyer_url} onChange={(e) => setCommercialForm({ ...commercialForm, flyer_url: e.target.value })} />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Switch checked={commercialForm.is_active} onCheckedChange={(c) => setCommercialForm({ ...commercialForm, is_active: c })} />
              <Label>Active</Label>
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea value={commercialForm.description} onChange={(e) => setCommercialForm({ ...commercialForm, description: e.target.value })} rows={3} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setCommercialDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCommercialSubmit} disabled={createCommercialListing.isPending || updateCommercialListing.isPending}>
              {editingId ? "Save Changes" : "Create Listing"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Agent Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle>Assign Agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {selectedListing && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-foreground">{selectedListing.property_address}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Select Agent</Label>
              <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                <SelectTrigger><SelectValue placeholder="Choose an agent..." /></SelectTrigger>
                <SelectContent>
                  {teamMembers?.filter(m => m.is_active).map((member) => (
                    <SelectItem key={member.id} value={member.id}>{member.name} - {member.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="exclusive">Exclusive Agent</SelectItem>
                  <SelectItem value="lead">Lead Agent</SelectItem>
                  <SelectItem value="co-list">Co-Listing Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAssignAgent} disabled={!selectedAgentId}>Assign Agent</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListingsAdmin;
