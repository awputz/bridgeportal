import { useState } from "react";
import { Building2, Users, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { formatFullCurrency } from "@/lib/formatters";

// Fetch investment listings with agents
const useInvestmentListingsAdmin = () => {
  return useQuery({
    queryKey: ["admin-investment-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investment_listings")
        .select(`
          *,
          agents:investment_listing_agents (
            id,
            role,
            display_order,
            agent:team_members (id, name, title, email)
          )
        `)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

// Fetch commercial listings with agents
const useCommercialListingsAdmin = () => {
  return useQuery({
    queryKey: ["admin-commercial-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commercial_listings")
        .select(`
          *,
          agents:commercial_listing_agents (
            id,
            role,
            display_order,
            agent:team_members (id, name, title, email)
          )
        `)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

// Fetch all team members for assignment
const useTeamMembersForAssignment = () => {
  return useQuery({
    queryKey: ["team-members-assignment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("id, name, title, email, category")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data;
    },
  });
};

const ListingsAdmin = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("investment");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("exclusive");

  const { data: investmentListings, isLoading: investmentLoading } = useInvestmentListingsAdmin();
  const { data: commercialListings, isLoading: commercialLoading } = useCommercialListingsAdmin();
  const { data: teamMembers } = useTeamMembersForAssignment();

  // Mutation to assign agent to investment listing
  const assignInvestmentAgent = useMutation({
    mutationFn: async ({ listingId, agentId, role }: { listingId: string; agentId: string; role: string }) => {
      const { error } = await supabase
        .from("investment_listing_agents")
        .insert({
          listing_id: listingId,
          agent_id: agentId,
          role: role,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-investment-listings"] });
      toast.success("Agent assigned to listing");
      setAssignDialogOpen(false);
      resetAssignForm();
    },
    onError: (error: any) => {
      toast.error("Failed to assign agent: " + error.message);
    },
  });

  // Mutation to assign agent to commercial listing
  const assignCommercialAgent = useMutation({
    mutationFn: async ({ listingId, agentId, role }: { listingId: string; agentId: string; role: string }) => {
      const { error } = await supabase
        .from("commercial_listing_agents")
        .insert({
          listing_id: listingId,
          agent_id: agentId,
          role: role,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commercial-listings"] });
      toast.success("Agent assigned to listing");
      setAssignDialogOpen(false);
      resetAssignForm();
    },
    onError: (error: any) => {
      toast.error("Failed to assign agent: " + error.message);
    },
  });

  // Mutation to remove agent from investment listing
  const removeInvestmentAgent = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from("investment_listing_agents")
        .delete()
        .eq("id", assignmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-investment-listings"] });
      toast.success("Agent removed from listing");
    },
    onError: (error: any) => {
      toast.error("Failed to remove agent: " + error.message);
    },
  });

  // Mutation to remove agent from commercial listing
  const removeCommercialAgent = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from("commercial_listing_agents")
        .delete()
        .eq("id", assignmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commercial-listings"] });
      toast.success("Agent removed from listing");
    },
    onError: (error: any) => {
      toast.error("Failed to remove agent: " + error.message);
    },
  });

  const resetAssignForm = () => {
    setSelectedListing(null);
    setSelectedAgentId("");
    setSelectedRole("exclusive");
  };

  const handleAssignAgent = () => {
    if (!selectedListing || !selectedAgentId) return;

    if (activeTab === "investment") {
      assignInvestmentAgent.mutate({
        listingId: selectedListing.id,
        agentId: selectedAgentId,
        role: selectedRole,
      });
    } else {
      assignCommercialAgent.mutate({
        listingId: selectedListing.id,
        agentId: selectedAgentId,
        role: selectedRole,
      });
    }
  };

  const handleRemoveAgent = (assignmentId: string) => {
    if (activeTab === "investment") {
      removeInvestmentAgent.mutate(assignmentId);
    } else {
      removeCommercialAgent.mutate(assignmentId);
    }
  };

  const openAssignDialog = (listing: any) => {
    setSelectedListing(listing);
    setAssignDialogOpen(true);
  };

  const renderListingTable = (listings: any[], type: "investment" | "commercial") => {
    if (!listings || listings.length === 0) {
      return (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No {type} listings found</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className="border-border/50">
            <TableHead>Property</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>{type === "investment" ? "Price" : "Rent"}</TableHead>
            <TableHead>Assigned Agents</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id} className="border-border/30">
              <TableCell>
                <div className="flex items-center gap-3">
                  {listing.image_url ? (
                    <img
                      src={listing.image_url}
                      alt={listing.property_address}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{listing.property_address}</p>
                    <p className="text-xs text-muted-foreground">
                      {type === "investment" ? listing.asset_class : listing.listing_type}
                    </p>
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
                  {type === "investment"
                    ? formatFullCurrency(listing.asking_price)
                    : listing.asking_rent
                    ? formatFullCurrency(listing.asking_rent) + "/yr"
                    : "—"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {listing.agents && listing.agents.length > 0 ? (
                    listing.agents.map((assignment: any) => (
                      <Badge
                        key={assignment.id}
                        variant="secondary"
                        className="text-xs flex items-center gap-1"
                      >
                        {assignment.agent?.name || "Unknown"}
                        <button
                          onClick={() => handleRemoveAgent(assignment.id)}
                          className="ml-1 hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No agents assigned</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAssignDialog(listing)}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Assign
                </Button>
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
          <p className="text-muted-foreground">Assign agents to listings and manage documents</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5">
          <TabsTrigger value="investment" className="data-[state=active]:bg-white/10">
            Investment Sales ({investmentListings?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="commercial" className="data-[state=active]:bg-white/10">
            Commercial ({commercialListings?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="investment" className="mt-6">
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              {investmentLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
              ) : (
                renderListingTable(investmentListings || [], "investment")
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commercial" className="mt-6">
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              {commercialLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
              ) : (
                renderListingTable(commercialListings || [], "commercial")
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assign Agent Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle>Assign Agent to Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {selectedListing && (
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="font-medium text-foreground">{selectedListing.property_address}</p>
                <p className="text-sm text-muted-foreground">
                  {[selectedListing.neighborhood, selectedListing.borough].filter(Boolean).join(", ")}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Select Agent</label>
              <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an agent..." />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers?.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} - {member.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exclusive">Exclusive Agent</SelectItem>
                  <SelectItem value="lead">Lead Agent</SelectItem>
                  <SelectItem value="co-list">Co-Listing Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAssignAgent}
                disabled={!selectedAgentId || assignInvestmentAgent.isPending || assignCommercialAgent.isPending}
              >
                Assign Agent
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListingsAdmin;
