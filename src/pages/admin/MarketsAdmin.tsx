import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, MapPin, Building2, Loader2 } from "lucide-react";

interface BridgeMarket {
  id: string;
  type: string;
  name: string;
  slug: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  display_order: number | null;
  is_active: boolean | null;
}

const MarketsAdmin = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("borough");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState<BridgeMarket | null>(null);
  const [formData, setFormData] = useState({
    type: "borough",
    name: "",
    slug: "",
    description: "",
    metadata: "{}",
    is_active: true,
  });

  const { data: markets, isLoading } = useQuery({
    queryKey: ["admin-bridge-markets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bridge_markets")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as BridgeMarket[];
    },
  });

  const boroughs = markets?.filter((m) => m.type === "borough") || [];
  const assetTypes = markets?.filter((m) => m.type === "asset_type") || [];

  const createMutation = useMutation({
    mutationFn: async (data: { type: string; name: string; slug: string; description: string | null; metadata: Json; is_active: boolean }) => {
      const typeMarkets = markets?.filter((m) => m.type === data.type) || [];
      const maxOrder = typeMarkets.length ? Math.max(...typeMarkets.map(m => m.display_order || 0)) : 0;
      const { error } = await supabase
        .from("bridge_markets")
        .insert([{ ...data, display_order: maxOrder + 1 }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bridge-markets"] });
      queryClient.invalidateQueries({ queryKey: ["bridge-markets"] });
      toast({ title: "Market created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create market", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { type?: string; name?: string; slug?: string; description?: string | null; metadata?: Json; is_active?: boolean } }) => {
      const { error } = await supabase
        .from("bridge_markets")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bridge-markets"] });
      queryClient.invalidateQueries({ queryKey: ["bridge-markets"] });
      toast({ title: "Market updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update market", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bridge_markets")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bridge-markets"] });
      queryClient.invalidateQueries({ queryKey: ["bridge-markets"] });
      toast({ title: "Market deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete market", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      type: activeTab,
      name: "",
      slug: "",
      description: "",
      metadata: "{}",
      is_active: true,
    });
    setEditingMarket(null);
  };

  const handleEdit = (market: BridgeMarket) => {
    setEditingMarket(market);
    setFormData({
      type: market.type,
      name: market.name,
      slug: market.slug,
      description: market.description || "",
      metadata: JSON.stringify(market.metadata || {}, null, 2),
      is_active: market.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const metadata = JSON.parse(formData.metadata) as Json;
      const submitData = {
        ...formData,
        metadata,
      };
      if (editingMarket) {
        updateMutation.mutate({ id: editingMarket.id, data: submitData });
      } else {
        createMutation.mutate(submitData);
      }
    } catch {
      toast({ title: "Invalid JSON in metadata", variant: "destructive" });
    }
  };

  const handleAdd = () => {
    resetForm();
    setFormData((prev) => ({ ...prev, type: activeTab }));
    setIsDialogOpen(true);
  };

  const renderTable = (items: BridgeMarket[], type: "borough" | "asset_type") => (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="max-w-[300px]">Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                {type === "borough" ? (
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                ) : (
                  <Building2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                )}
                <p className="text-muted-foreground">
                  No {type === "borough" ? "boroughs" : "asset types"} found
                </p>
              </TableCell>
            </TableRow>
          ) : (
            items.map((market) => (
              <TableRow key={market.id}>
                <TableCell className="font-medium">{market.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{market.slug}</TableCell>
                <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">
                  {market.description}
                </TableCell>
                <TableCell>
                  <Badge variant={market.is_active ? "default" : "secondary"}>
                    {market.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(market)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this market?")) {
                          deleteMutation.mutate(market.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Markets</h1>
          <p className="text-muted-foreground">Manage boroughs and asset types</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add {activeTab === "borough" ? "Borough" : "Asset Type"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="borough">
            <MapPin className="h-4 w-4 mr-2" />
            Boroughs ({boroughs.length})
          </TabsTrigger>
          <TabsTrigger value="asset_type">
            <Building2 className="h-4 w-4 mr-2" />
            Asset Types ({assetTypes.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="borough" className="mt-6">
          {renderTable(boroughs, "borough")}
        </TabsContent>
        <TabsContent value="asset_type" className="mt-6">
          {renderTable(assetTypes, "asset_type")}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingMarket ? "Edit" : "Add"} {formData.type === "borough" ? "Borough" : "Asset Type"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Metadata (JSON)</Label>
              <Textarea
                className="font-mono text-sm min-h-[150px]"
                value={formData.metadata}
                onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
                placeholder={formData.type === "borough" 
                  ? '{\n  "neighborhoods": ["Area1", "Area2"],\n  "stats": {"avgPricePerUnit": "$500K", "capRate": "5%", "volume": "$100M"}\n}'
                  : '{\n  "icon": "Building2",\n  "subtitle": "Description",\n  "highlights": ["Point1", "Point2"],\n  "buyers": ["Buyer1", "Buyer2"]\n}'
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label>Active</Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingMarket ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketsAdmin;
